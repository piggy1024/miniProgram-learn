// pages/login/login.js
let baseUrl = getApp().globalData.URL;
Page({
    data: {
        from: '',
        //判断小程序的API，回调，参数，组件等是否在当前版本可用。
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function (from) {
        this.setData({
            from: from.from
        })
        const that = this;
        // 查看是否授权
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            //从数据库获取用户信息
                            that.userRegistry(res.userInfo);
                            //用户已经授权过
                            wx.switchTab({
                                url: from
                            })
                        }
                    });
                }
            }
        })
    },
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //用户按了允许授权按钮
            const that = this;
            //插入登录的用户的相关信息到数据库
            this.userRegistry(e.detail.userInfo)
            //授权成功后，跳转进入小程序首页
            wx.switchTab({
                url: that.data.from
            })
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进行其他操作!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function (res) {
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”')
                    }
                }
            })
        }
    },
    //获取用户信息接口
    userRegistry: function (e) {
        wx.login({
            success: result => {
                const data = {
                    nickName: e.nickName,
                    gender: e.gender,
                    avatarUrl: e.avatarUrl,
                    code: result.code
                };
                wx.request({
                    url: baseUrl + '/user/registry',
                    method: 'POST',
                    header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                    },
                    data: data,
                    success: function (res) {
                        wx.setStorageSync('userId', res.data.userId)
                        wx.setStorageSync('userName', res.data.userName)
                        getApp().globalData.userName = res.data.userName
                        getApp().globalData.userId = res.data.userId
                        console.log(getApp().globalData.userName)
                    },
                    fail: res => {
                        console.log(res.errMsg)
                    }
                });
            }
        })
    },

})
