package xyz.youtubeyunying.myapplication;

import ohos.aafwk.ability.Ability;
import ohos.aafwk.content.Intent;
import ohos.hiviewdfx.HiLog;
import ohos.hiviewdfx.HiLogLabel;
import ohos.miscservices.pasteboard.PasteData;
import ohos.miscservices.pasteboard.SystemPasteboard;
import ohos.rpc.*;
import ohos.utils.zson.ZSONObject;
;import java.util.HashMap;
import java.util.Map;

import static ohos.miscservices.pasteboard.SystemPasteboard.getSystemPasteboard;

/**
 * 复制服务
 */
public class CopyServiceAbility extends Ability {
    // 定义日志标签
    private static final HiLogLabel LABEL = new HiLogLabel(HiLog.LOG_APP, 0, "MY_TAG");
    private MyRemote remote = new MyRemote();
    private SystemPasteboard pasteboard = null;


    public CopyServiceAbility() {
        super();
        pasteboard = SystemPasteboard.getSystemPasteboard(getContext());

    }

    public void setPasteData(String val) {
        if (val == null) {
            return;
        }

        if (pasteboard == null) {
            synchronized (this) {
                if (pasteboard == null) {
                    pasteboard = SystemPasteboard.getSystemPasteboard(getContext());
                }
            }
        }
        pasteboard.setPasteData(PasteData.creatPlainTextData(val));

    }

    // FA在请求PA服务时会调用Ability.connectAbility连接PA，连接成功后，需要在onConnect返回一个remote对象，供FA向PA发送消息
    @Override
    protected IRemoteObject onConnect(Intent intent) {
        super.onConnect(intent);
        return remote.asObject();
    }

    class MyRemote extends RemoteObject implements IRemoteBroker {
        private static final int SUCCESS = 0;
        private static final int ERROR = 1;

        /**
         * 1001 将内容写入剪切板
         */
        private static final int COPY = 1001;

        MyRemote() {
            super("MyService_MyRemote");
        }

        @Override
        public boolean onRemoteRequest(int code, MessageParcel data, MessageParcel reply, MessageOption option) {
            switch (code) {
                case COPY: {
                    String dataStr = data.readString();

                    HiLog.info(LABEL, "copy:onRemoteRequest:" + dataStr);
                    setPasteData(dataStr);

                    // 返回结果当前仅支持String，对于复杂结构可以序列化为ZSON字符串上报
                    Map<String, Object> result = new HashMap<String, Object>();
                    result.put("code", SUCCESS);
                    result.put("abilityResult", 1);
                    reply.writeString(ZSONObject.toZSONString(result));
                    break;
                }
                default: {
                    Map<String, Object> result = new HashMap<String, Object>();
                    result.put("abilityError", ERROR);
                    reply.writeString(ZSONObject.toZSONString(result));
                    return false;
                }
            }
            return true;
        }


        @Override
        public IRemoteObject asObject() {
            return this;
        }
    }
}
