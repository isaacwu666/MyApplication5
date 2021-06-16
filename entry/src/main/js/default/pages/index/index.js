export default {
    data: {
        mens: [
            {
                i: 0,
                src: '/common/images/liaotian.png',
                srcSelect: '/common/images/liaotian_select.png',
                name: '聊天',
                show: true
            },
            {
                i: 1,
                src: '/common/images/iconset.png',
                srcSelect: '/common/images/iconset_select.png',
                name: '彩虹',
                show: false
            }

        ]
    },
    change: function (e) {
        console.log("Tab index: " + e.index);
        var mens =  this.mens||[];
        for (let mensKey in mens) {
            mens[mensKey].show=false;
            if ( mens[mensKey].i==e.index) {
                mens[mensKey].show=true;
            }
        }
        this.$set("mens",mens)
    }
}