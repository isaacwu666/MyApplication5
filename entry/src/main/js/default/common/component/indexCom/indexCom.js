import fetch from '@system.fetch';
import prompt from '@system.prompt';

// abilityType: 0-Ability; 1-Internal Ability
const ABILITY_TYPE_EXTERNAL = 0;
const ABILITY_TYPE_INTERNAL = 1;
// syncOption(Optional, default sync): 0-Sync; 1-Async
const ACTION_SYNC = 0;
const ACTION_ASYNC = 1;
/**
 * 1001 将内容写入剪切板
 */
const ACTION_MESSAGE_CODE_PLUS = 1001;

export default {
    data: {
    /**
        *  sex 整形 性别 （1，男，2女），
            size 整形 每页数量（非必填，默认为10）
            page 整形 页码（非必填 从1开始）
            chatName 字符串 聊天名称（必填 如：“你好”）
         */
        queryObj: {
            sex: 1,
            size: 10,
            page: 1,
            chatName: "你好",
            loading: false,
            canNext: true
        },
    //对话信息
        concats: [[{
                       "id": 50,
                       "content": "你好像我的一个朋友",
                       "ansSex": 1,
                       "duihuaId": 11
                   }, {
                          "id": 51,
                          "content": "你咋那么老套？",
                          "ansSex": 2,
                          "duihuaId": 11
                      }, {
                             "id": 52,
                             "content": "这说明我撩妹技术不太高，没人实验啊",
                             "ansSex": 1,
                             "duihuaId": 11
                         }], [{
                                  "id": 273,
                                  "content": "hi 美女你好，我是来面试的",
                                  "ansSex": 1,
                                  "duihuaId": 74
                              }, {
                                     "id": 274,
                                     "content": "面什么试 ",
                                     "ansSex": 2,
                                     "duihuaId": 74
                                 }, {
                                        "id": 275,
                                        "content": "我就是来面试男朋友",
                                        "ansSex": 1,
                                        "duihuaId": 74
                                    }], [{
                                             "id": 1018,
                                             "content": "你好",
                                             "ansSex": 1,
                                             "duihuaId": 284
                                         }, {
                                                "id": 1019,
                                                "content": "你是？",
                                                "ansSex": 2,
                                                "duihuaId": 284
                                            }, {
                                                   "id": 1020,
                                                   "content": "附近最熟悉的陌生人",
                                                   "ansSex": 1,
                                                   "duihuaId": 284
                                               }, {
                                                      "id": 1021,
                                                      "content": "但是都不认识你",
                                                      "ansSex": 2,
                                                      "duihuaId": 284
                                                  }, {
                                                         "id": 1022,
                                                         "content": "很快我就会比八月的西瓜还要熟",
                                                         "ansSex": 1,
                                                         "duihuaId": 284
                                                     }, {
                                                            "id": 1023,
                                                            "content": "自来熟吗？",
                                                            "ansSex": 2,
                                                            "duihuaId": 284
                                                        }, {
                                                               "id": 1024,
                                                               "content": "你真是冰雪聪明",
                                                               "ansSex": 1,
                                                               "duihuaId": 284
                                                           }], [{
                                                                    "id": 5015,
                                                                    "content": "你好，请问外面的风景好看吗？",
                                                                    "ansSex": 1,
                                                                    "duihuaId": 1636
                                                                }, {
                                                                       "id": 5016,
                                                                       "content": "好看",
                                                                       "ansSex": 2,
                                                                       "duihuaId": 1636
                                                                   }, {
                                                                          "id": 5017,
                                                                          "content": "那麻烦你往边上挪点，让我也看看",
                                                                          "ansSex": 1,
                                                                          "duihuaId": 1636
                                                                      }], [{
                                                                               "id": 19602,
                                                                               "content": "你好，请问外面的风景好看吗？",
                                                                               "ansSex": 1,
                                                                               "duihuaId": 5087
                                                                           }, {
                                                                                  "id": 19603,
                                                                                  "content": "不好看",
                                                                                  "ansSex": 2,
                                                                                  "duihuaId": 5087
                                                                              }, {
                                                                                     "id": 19604,
                                                                                     "content": "我也觉得，我觉得看你比看外面好呢，要不你也拿个镜子看看",
                                                                                     "ansSex": 1,
                                                                                     "duihuaId": 5087
                                                                                 }]]
    },
    onInit() {

    },
/**
     * 获取input框的内容
     */
    getInput(e) {
        this.queryObj.chatName = e.value;
        console.log("获取input框的内容:" + this.queryObj.chatName);
    },
/**
     * 点击搜索按钮
     */
    query() {
        console.log("点击搜索按钮");
        this.queryObj.canNext=true;
        this.queryObj.page=1;

        this.getData();
    },
/**
     * 复制句子
     * @param e
     * @return
     */
    copy(e) {
        console.log("copy:复制句子：" + JSON.stringify(e));
        var val = e.target.attr.data || "";
        console.log("copy:复制句子:val:" + val);
        this.sendCopy(val);


    },
/**
     * 将内容发送到复制服务
     */
    sendCopy: async function(val) {


        var action = {};
        //Ability的包名称，需要与PA端匹配，区分大小写。
        action.bundleName = 'xyz.youtubeyunying.myapplication';
        //Ability名称，需要与PA端匹配，区分大小写。
        action.abilityName = 'xyz.youtubeyunying.myapplication.CopyServiceAbility';
        //Ability操作码（操作码定义PA的业务功能，需要与PA端约定，参见boolean IRemoteObject.onRemoteRequest(int code, MessageParcel data, MessageParcel reply, MessageOption option)）
        action.messageCode = ACTION_MESSAGE_CODE_PLUS;
        //发送到Ability的数据（根据不同的业务携带相应的业务数据，数据字段名称需要与PA端约定
        action.data = val;
        //Ability类型，对应PA端不同的实现方式：
        //
        //0：Ability，拥有独立的Ability生命周期，FA使用远端进程通信拉起并请求PA服务，适用于提供基本服务供多FA调用或者在后台独立运行的场景，具体Java侧接口定义见Ability模块接口(Java语言，Ability方式)。
        action.abilityType = ABILITY_TYPE_EXTERNAL;
        //PA侧请求消息处理同步/异步选项，非必填，默认使用同步方式。当前异步方式仅支持AbilityType为Internal Ability类型。
        action.syncOption = ACTION_SYNC;

        var result = await FeatureAbility.callAbility(action);
        var ret = JSON.parse(result);
        if (ret.code == 0) {
            console.info('copy:plus result is:' + JSON.stringify(ret.abilityResult));
        } else {
            console.error('copy:plus error code:' + JSON.stringify(ret.code));
        }
    },
    nextPage() {
        if (!this.queryObj.canNext) {
            return;
        }
        this.queryObj.page++;

        this.getData()
    },

    getData() {
        if (this.queryObj.loading) {
            return
        } else {
            this.queryObj.loading = true;
        }
        var that = this;
        var params = "";
        var queryObj = that.queryObj;
        var index = 0;
        //key = value
        for (var key in queryObj) {
            if (index == 0) {
                params = "?" + key + "=" + queryObj[key]
            } else {
                params = params + "&" + key + "=" + queryObj[key]
            }
            index++;
        }
        var url = "https://hairong.tomweb.xyz/api/hairong/duihua" + params;

        console.log("fetch url:" + url);

        fetch.fetch({
            url: url,
            success: function (response) {
                console.info("fetch success");
                console.info("fetch success" + response);
                console.info("fetch success" + JSON.stringify(response));
                var data = JSON.parse(response.data) || {};
                if (data.state != 1) {
                    //todo 请求失败，
                    prompt.showToast({
                        message:data.msg||"请求失败" ,
                        duration: 2000,
                    });
                    return;
                }
                var concats = data.data || [];
                if ((concats).length < 1) {
                    that.queryObj.canNext = false;
                }

                console.info("fetch success:concats:" + JSON.stringify(concats));
                if(that.queryObj.page==1){
                    that.concats = concats;
                }else{
                    //原来的数据
                    var _concats = that.concats || [];
                    _concats = _concats.concat(concats);
                    that.$set("concats", _concats)

                }


            },
            complete: function () {
                console.info("fetch complete");
                that.queryObj.loading = false;
            },
            fail: function () {
                console.info("fetch fail");
                prompt.showToast({
                    message: '请求失败，请查看网络连接',
                    duration: 2000,
                });
            }
        });


    }
}
