reqwest({
    url: '/purchase/share?purchase_id=1',
    method: 'get',
    type: "json",
    contentType: 'application/json',
    data: {
    },
    error: function (err) { 
        console.log(JSON.parse(err.response))
    },
    success: function(data) {
        var res  = JSON.parse(data.res);
        var config = {
            debug: false,
            // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: res.appid,
            // 必填，公众号的唯一标识
            timestamp: res.timestamp,
            // 必填，生成签名的时间戳
            nonceStr: res.noncestr,
            // 必填，生成签名的随机串
            signature: res.signature,
            // 必填，签名，见附录1
            jsApiList: res.js_api_list // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        }
        console.log(config);
        wx && wx.config(config);
        wx && wx.ready(function() {
            wx.onMenuShareAppMessage({
                title: 'WIB官方报名通道，赶紧的走起！！！',
                desc: '中国经典大赛强势回归，在线直接报名！！！',
                link: res.link,
                imgUrl: location.origin + '/static/img/logo.png',
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {
                    alert(JSON.stringify(res));
                }
            });
            wx.onMenuShareTimeline({
                title: 'WIB官方报名通道，赶紧的走起！！！',
                desc: '中国经典大赛强势回归，在线直接报名！！！',
                link: res.link,
                imgUrl: location.origin + '/static/img/logo.png',
                trigger: function(res) {},
                success: function(res) {},
                cancel: function(res) {},
                fail: function(res) {
                    alert(JSON.stringify(res));
                }
            });
        })
    }
})
