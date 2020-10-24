// components/content/content.js
const util = require('../../utils/util.js');
const timeHan = require('../../utils/commonFunc.js')
let testUrl = 'http://localhost'
const app = getApp();
let com = require("../../utils/common")
let baseUrl = app.globalData.URL;
const tool = require('../../utils/tool.js');
Component({

    /**
     * 生命周期函数
     */
    lifetimes: {
        ready: function () {
            this._getHight()
        },
        moved: function () {
            this._getHight()
        },
    },
    /**
     * 组件的属性列表
     */
    properties: {
        isMime: {
            type: Boolean,
            default: false
        },
        conceal: {
            type: Boolean,
            default: false
        },
        mask: {
            type: Object,
            default: '',
            observer(newVal, oldVal) {
                if (newVal.handleId === this.data.articleId) {
                    this.setData({
                        commenting: newVal.commenting
                    })
                } else {
                    this.setData({
                        commenting: false
                    })
                }
            }
        }
        ,
        articleUser: {
            type: Int32Array,
            default: 1,
            observer(newVal, oldVal) {
                this.setData({
                    own: newVal === getApp().globalData.userId
                })
            }
        },
        comments: {
            type: Array,
            default: [],
            observer(newVal, oldVal) {
            },
        },
        supports: {
            type: Array,
            default: [],
            observer(newVal, oldVal) {
                this.checkSupport(newVal);
            },
        },
        local_name: {
            type: String,
            default: ''
        },
        longitude: {
            type: Float32Array,
            default: 0
        },
        latitude: {
            type: Float32Array,
            default: 0
        },
        hideName: {
            type: String,
            default: '神秘人'
        },
        articleId: {
            type: Number,
            default: '',
            observer(newVal, oldVal) {
            },
        },
        postTime: {
            type: Date,
            default: '',
            observer(newVal, oldVal) {
                this.timeHandler(newVal)
            }
        },
        user_icon: {
            type: Object,
            default: '',
            observer(newVal, oldVal) {
                this.hideHandle(newVal)
            }
        },
        nick_name: {
            type: String,
            default: '',
        },
        user_content: {
            type: String,
            default: '',
            observer(newVal, oldVal) {
                this._getHight(newVal)
            }
        },
        photo_list: {
            type: String,
            default: '',
            observer(newVal, oldVal) {
                this.photoHandler(newVal)
            }
        },
        showAll: {
            type: Boolean,
            default: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        own: false,
        supportIndex: -1,
        isSupport: false,
        user_icon_tem: '',
        hide: false,
        p_thumbnail_list: [],
        unfold: false,
        over: false,
        p_list: [],
        commentOut: false,
        choosing: false,
        commenting: false,
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         *
         * @param e
         */
        imageLoad: function (e) {
            let that = this;
            const width = e.detail.width,//图片宽度
                height = e.detail.height;
            let imgHeight = 'h';
            let imgWidth = 'w';
            if (width > height) {
                imgHeight = (40 * height) / width;//图片宽高比例
                if (imgHeight > 40) {
                    imgHeight = 40;
                }
            } else {
                imgWidth = (40 * width) / height;//图片宽高比例
                if (imgWidth > 80) {
                    imgWidth = 80;
                }
            }
            that.setData({
                imgWidth: imgWidth,
                imgHeight: imgHeight
            })
        },
        /**
         *
         * @param e
         */
        previewImg: function (e) {
            const src = e.currentTarget.dataset.src;
            const srcs = this.data.p_list
            wx.previewImage({
                current: srcs[src],
                urls: srcs,
            })
        },
        /**
         *点击展开
         */
        commenting: function () {
            let that = this
            if (this.data.commenting) {
                this.setData({
                    commentOut: true
                })
            }
            setTimeout(function () {
                that.triggerEvent('TDD', [that.data.articleId, !that.data.commenting])
                that.setData({
                    commentOut: false,
                })
            }, 90)
        },
        /**
         *点击赞
         */
        zan: function () {
            if (!(getApp().globalData.userId > 0)) {
                wx.navigateTo({
                    url: '../login/login?from=../index/index',
                })
            } else {
                let that = this
                const supports = that.data.supports;
                if (that.data.isSupport) {
                    supports.splice(that.data.supportIndex)
                    that.triggerEvent('supportHandle', supports)
                } else {
                    const index = supports.length
                    const add = [{
                        friendsId: that.data.articleId,
                        nickName: getApp().globalData.userName,
                        time: "",
                        userId: getApp().globalData.userId
                    }];
                    that.triggerEvent('supportHandle', supports.concat(add))
                }
                that.postSupport(getApp().globalData.userId, this.data.articleId, this.data.isSupport)
            }
        },
        /**
         *点击评论
         */
        comment: function () {
            if (!(getApp().globalData.userId > 0)) {
                wx.navigateTo({
                    url: '../login/login?from=../index/index',
                })
            } else {
                this.commenting()
                this.triggerEvent('comment')
            }
        },
        /**
         * 抛出反馈信息
         * @param e
         */
        feedback(e) {
            this.setData({
                commentOut: true,
                choosing: true,
                fade: true
            })
            this.triggerEvent('feedbackCapture')
            let that = this
            setTimeout(function () {
                that.setData({
                    commentOut: false,
                    commenting: false,
                    fade: false
                })
            }, 90)
        },
        /**
         * 显示压缩图片
         * @param list
         */
        photoHandler(list) {
            let that = this
            if (list.length === 0) {
                that.setData({
                    p_listLength: 0,
                    p_list: [],
                    p_thumbnail_list: []
                })
                return
            }
            const p_thumbnail_list = list.split(";");
            const tem = [];
            p_thumbnail_list.forEach(item => {
                tem.push(com.transform(item))
            })
            that.setData({
                p_listLength: tem.length,
                p_thumbnail_list: tem,
                p_list: p_thumbnail_list
            })
        },

        /**
         * 时间处理美化显示
         * @param time
         */
        timeHandler(time) {
            let sd = new Date(time.replace(/-/g, '/')).getTime();
            time = timeHan.timeHandle(sd)
            this.setData({
                time: time
            })
        },
        /**
         * 展开收起
         */
        unfold() {
            this.setData({
                over: !this.data.over
            })
        },
        /**
         * 匿名头像处理
         * @param newVal
         */
        hideHandle(newVal) {
            let that = this
            if (newVal[0]) {
                that.setData({
                    user_icon_tem: 'https://www.zq1024.cn:8443/upload/head/head' + Math.floor(Math.random() * 31).toString() + '.png',
                    hide: true
                })
            } else {
                if (newVal[1] === undefined) {
                    that.setData({
                        hide: false
                    })
                    return
                }
                that.setData({
                    user_icon_tem: newVal[1] || "",
                    hide: false
                })
            }
        },

        /**
         * 查看位置
         */
        view_location() {
            let that = this
            wx.openLocation({
                latitude: that.data.latitude,
                longitude: that.data.longitude
            })
        },
        /**
         *  是否点赞检查
         */
        checkSupport(newVal) {
            if (getApp().globalData.userId < 0) return;
            let that = this
            let isSupport = false;
            let supportIndex = -1;
            newVal.forEach(function (item, index) {
                if (item.userId === getApp().globalData.userId) {
                    isSupport = true
                    supportIndex = index
                }
            })
            that.setData({
                isSupport: isSupport,
                supportIndex: supportIndex
            })
        },
        /**
         * 提交点赞数据 限流
         * 2s
         */
        postSupport: tool.debounce(function (res) {
            wx.request({
                url: baseUrl + '/support/postSupport',
                data: {
                    isSupport: res[2],
                    friendsId: res[1],
                    userId: res[0]
                },
                success: result => {
                },
                fail: res => {
                }
            })
        }, 2000),
        /**
         * 删除文章
         */
        deleteArticle() {
            wx.request({
                url: baseUrl + '/friends/deleteFriend',
                data: {
                    contentId: this.data.articleId,
                    isdelete: true
                }
            })
            this.triggerEvent('deleteFriend', this.data.articleId)
        },
        /**
         * 把事件抛出
         * @param e
         */
        commentTapCapture(e) {
            this.triggerEvent('commentTap', e.detail)
        },
        /**
         *
         * @private
         */
        _getHight(newVal) {
            let that = this
            const query = this.createSelectorQuery();
            query.select("#content").boundingClientRect(data => {
                if (data.height > 120) {
                    that.setData({
                        over: true,
                        unfold: true
                    })
                } else {
                    that.setData({
                        over: false,
                        unfold: false
                    })
                }
            }).exec()
        },
        /**
         * 查看user信息
         * @param e
         * @private
         */
        _viewUserInfo2(e) {
            let that = this
            if (that.data.hide) {
                return
            }
            wx.navigateTo({
                url: '../user/user?userId=' + e.currentTarget.dataset.usreid,
            })
        },

        /**
         *
         */
        conceal() {
            let that = this
            that.setData({
                conceal: !that.data.conceal
            })
            that.postConceal()
        },
        /**
         * 自己可见 限流
         */
        postConceal: tool.debounce(function () {
            wx.request({
                url: baseUrl + '/friends/deleteFriend',
                data: {
                    contentId: this.data.articleId,
                    conceal: this.data.conceal
                }
            })
            this.triggerEvent('conceal', [this.data.articleId, this.data.conceal])
        })
    },
})
