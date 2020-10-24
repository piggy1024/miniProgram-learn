//editor.js
let regeneratorRuntime = require("../../utils/runtime");
let com = require("../../utils/common")
let baseUrl = getApp().globalData.URL;
import {$wuxToptips} from '../../components/lib/index.js'

Page({
    /**
     * 页面的初始数据
     */
    data: {
        toNickName: '',
        confession: false,
        userNickName: getApp().globalData.userName,
        userId: getApp().globalData.userId,
        imgList: [],
        modalName: null,
        textareaAValue: '',
        imgNum: 0,
        hide: false,
        hideName: '',
        pushList: '',
        local_choose: false,
        address: '',
        latitude: 0.0,
        longitude: 0.0,
        name: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (!(getApp().globalData.userId > 0)) {
            wx.navigateTo({
                url: '../login/login?from=../editor/editor',
            })
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        let that = this
        that.setData({
            userNickName: wx.getStorageSync("userName")
        })
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.setData({
            userId: getApp().globalData.userId,
            userNickName: wx.getStorageSync("userName")
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    /**
     * bar跳转
     * @param e
     * @constructor
     */
    NavChange(e) {
        wx.switchTab({
            url: '/pages/' + e.currentTarget.dataset.cur + '/' + e.currentTarget.dataset.cur
        })
    },

    /**
     * 选择照片
     * @constructor
     */
    ChooseImage() {
        let that = this
        wx.chooseImage({
            count: (that.data.confession ? 1 : 9) - that.data.imgNum, //默认9
            sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], //从相册选择
            success: (res) => {
                if (that.data.imgList.length !== 0) {
                    that.setData({
                        imgNum: that.data.imgNum + res.tempFilePaths.length,
                        imgList: that.data.imgList.concat(res.tempFilePaths)
                    })
                } else {
                    that.setData({
                        imgNum: that.data.imgNum + res.tempFilePaths.length,
                        imgList: res.tempFilePaths
                    })
                }
            },
            fail: res => {
                console.log(res)
                wx.showToast({
                    title: res
                })
            }
        });
    },
    /**
     * 查看照片
     * @param e
     * @constructor
     */
    ViewImage(e) {
        let that = this
        wx.previewImage({
            urls: that.data.imgList,
            current: e.currentTarget.dataset.url
        });
    },
    /**
     * 删除照片
     * @param e
     * @constructor
     */
    DelImg(e) {
        let that = this
        wx.showModal({
            title: '',
            content: '确定要删除吗？',
            cancelText: '再看看',
            confirmText: '再见',
            success: res => {
                if (res.confirm) {
                    that.data.imgList.splice(e.currentTarget.dataset.index, 1);
                    that.setData({
                        imgNum: that.data.imgNum - 1,
                        imgList: that.data.imgList
                    })
                }
            }
        })
    },
    /**
     * 输入框
     * @param e
     */
    textareaAInput(e) {
        this.setData({
            textareaAValue: e.detail.value
        })
    },

    /**
     * 匿名选择
     * @param e
     */
    switch1: function (e) {
        let that = this
        that.setData({
            hide: e.detail.value
        })
    },

    /**
     *
     * @param e
     */
    location_btn: function (e) {
        let that = this
        if (that.data.local_choose) {
            that.setData({
                local_choose: false
            })
        } else {
            wx.chooseLocation({
                success: result => {
                    that.setData({
                        address: result.address,
                        latitude: result.latitude,
                        longitude: result.longitude,
                        name: result.name,
                        local_choose: true
                    })
                },
                fail: res => {
                    that.setData({
                        local_choose: false
                    })
                }
            })
        }
    },
    /**
     * 发布
     */
    pullbulish: async function (e) {
        let that = this
        if (that.data.textareaAValue === '' && that.data.imgList.length === 0) {
            setTimeout(function () {
                wx.showToast({
                    title: "请输入内容哦！"
                }, 30)
            })
            return;
        }
        setTimeout(function () {
            wx.switchTab({
                url: '../index/index'
            })
        }, 2000)
        wx.showToast({
            duration: 1500,
            title: "发布ing",
            image: '/images/load' + Math.floor(Math.random() * 7).toString() + '.gif',
        })
        if (that.data.confession) {
            await that.pushConfession()
        } else {
            await that.pushFriend()
        }
    },

    /**
     * 发布表白
     * @returns {Promise<void>}
     */
    pushConfession: async function () {
        let that = this
        let url = '';
        for (const item of that.data.imgList) {
            await com.uploadImg(item).then(res => {
                url += res + ';';
            })
        }
        url = url.substr(0, url.length - 1)
        wx.request({
            url: baseUrl.concat('/confession/pushConfessions'),
            data: {
                contend: that.data.textareaAValue,
                userId: getApp().globalData.userId,
                From: that.data.hideName,
                To: that.data.toNickName,
                imgs: url
            },
            success: result => {
                that.setData({
                    imgList: [],
                    modalName: null,
                    textareaAValue: '',
                    imgNum: 0,
                    hide: false,
                })
                console.log(result)
            },
            fail: res => {
                console.log(res)
            }
        })
    },

    /**
     * 文章
     * @returns {Promise<void>}
     */
    pushFriend: async function () {
        let that = this
        const tem = [];
        let url = '';
        for (const item of that.data.imgList) {
            await com.uploadImg(item).then(res => {
                tem.push(res)
                url += res + ';';
            })
        }
        url = url.substr(0, url.length - 1)
        that.setData({
            imgList: tem,
            pushList: url
        })
        this.push()
    },
    /**
     * 上传
     */
    push() {
        let that = this
        const data = {
            userId: getApp().globalData.userId,
            hide: that.data.hide,
            hideName: that.data.hideName.length === 0 ? that.data.userNickName : that.data.hideName,
            photoList: that.data.pushList,
            content: that.data.textareaAValue,
            localChoose: that.data.local_choose,
            address: that.data.address,
            latitude: that.data.latitude,
            longitude: that.data.longitude,
            name: that.data.name,
        };
        console.log(data)
        wx.request({
            method: 'POST',
            url: baseUrl + '/friends/push',
            data: data,
            header: {
                "Content-Type": "application/json"
            },
            success: result => {
                that.setData({
                    imgList: [],
                    modalName: null,
                    textareaAValue: '',
                    imgNum: 0,
                    hide: false,
                    hideName: '',
                    pushList: '',
                })
            },
            fail: res => {
                console.log(res.errMsg)
            }
        })
    },
    /**
     * 匿名输入
     * @param e
     */
    nickInput(e) {
        let that = this
        that.setData({
            hideName: e.detail.value
        })
    },

//    表白功能
    confession_switch() {
        let that = this
        that.setData({
            imgList: [],
            imgNum: 0,
            confession: !that.data.confession
        })
    },

    ToNickInput(e) {
        let that = this
        that.setData({
            toNickName: e.detail.value
        })
    },
    /**
     * 用户授权
     */
    bindGetUserInfo: function (e) {
        if (e.detail.userInfo) {
            //插入登录的用户的相关信息到数据库
            this.userRegistry(e.detail.userInfo)
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
    /**
     * 获取用户信息接口
     * @param e
     */
    userRegistry: function (e) {
        let that = this
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
                        that.setData({
                            userId: res.data.userId,
                            userNickName: res.data.userName
                        })
                        that.showSuccessTop('欢迎:'.concat(res.data.userName))
                        wx.setStorageSync('userId', res.data.userId)
                        wx.setStorageSync('userName', res.data.userName)
                        getApp().globalData.userName = res.data.userName
                        getApp().globalData.userId = res.data.userId
                    },
                    fail: res => {
                        that.showErrorTop('网络错误！')
                    }
                });
            }
        })
    },

    /**
     * 顶部
     */
    showTop(Title) {
        $wuxToptips().show({
            icon: 'cancel',
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showSuccessTop(Title) {
        $wuxToptips().success({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showInfoTop(Title) {
        $wuxToptips().info({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showWarnTop(Title) {
        $wuxToptips().warn({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
    showErrorTop(Title) {
        $wuxToptips().error({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    },
})
