//index.js
//获取应用实例
const util = require('../../utils/util.js');
const app = getApp();
let baseUrl = app.globalData.URL;
let testUrl = 'http://localhost'
const tool = require('../../utils/tool.js');
import {$wuxActionSheet, $wuxToptips} from '../../components/lib/index.js'

const ch = require('../data.js');

Page({
    data: {
        schoolNewsShow: false,
        schoolNewsPage: 1,
        schoolNewsTotal: 0,
        schoolNews: wx.getStorageSync('schoolNews') || [],
        order: ['_score', 'postTime', 'commentNun', 'support'],
        searchOrderIndex: 0,
        noData: false,
        lastRequest: 0,
        SearchPlaceholderTem: '今天看看什么呢',
        SearchPlaceholder: '今天看看什么呢',
        friendsTotal: 0,
        confessionShow: false,
        confessionPage: 1,
        friends: wx.getStorageSync('friends') || [],
        confessions: wx.getStorageSync('confessions') || [],
        lastTapTime: 0,
        hotCur: 3,
        searchResTotal: 0,
        searchRes: [],
        searchShow: false,
        searPage: 1,
        handleCommentIndex: -1,
        replayId: '',
        commentContent: '',
        commentPlaceholder: '评论',
        keyboardHeight: 0,
        wantComment: false,
        feedbackMsg: '色情',
        checkbox: ch.checkbox,
        feedback: false,
        page: 1,
        pageReady: false,
        scrollTop: 0,
        labelName: '全部',
        searching: false,
        hotItems: ["评论最多", "点赞最多",],
        TabCur: 0,
        navItems: [{name: '最新', index: 0}, {name: '最评', index: 1}, {name: '最赞', index: 2}, {
            name: '表白墙',
            index: 3
        }, {name: '学校新闻', index: 4}],
        xindex: 0,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        defaultSearchValue: '',
        searchPlaceholder: '',
        banners: [{
            url: '',
            bannerId: 0,
            title: '人经历风浪是会变得更强，可是船不同，日积月累的只有伤痛。'
        },
            {
                url: '',
                bannerId: 1,
                title: '如果还有来生 ，我无论如何都要来到你身边，我已经没有了其他想要追求的东西，因为没有比你更重要的了。'
            },
            {
                url: '',
                bannerId: 2,
                title: '比任何人都要了解自己，比任何人都要关爱自己。喜欢上这样的人，并没有什么奇怪的呢'
            },
            {
                url: '',
                bannerId: 3, title: '我没有梦想，但是我能保护！'
            }],
        showSkeleton: false
    },
    /**
     * 事件处理函数
     */
    onLoad: function (options) {
        if (options.newsId > 0) {
            wx.navigateTo({
                url: '../news/news?newsId=' + options.newsId + '&img=' + options.img,
            })
        }
        if (options.viewArticle > 0) {
            wx.navigateTo({
                url: '../one/one?articleId=' + options.viewArticle,
            })
        }
        wx.showLoading({
            title: '加载中...'
        })
        this.getBanner()
        this.setData({
            menuButtonLeft: wx.getMenuButtonBoundingClientRect().left,
            menuButtonRight: wx.getSystemInfoSync().windowWidth - wx.getMenuButtonBoundingClientRect().left,
            menuButtonTop: wx.getMenuButtonBoundingClientRect().top
        });
        this.getViewTop();
        this.getFriend(1, true)
        this.handleYiYan()
    },

    onHide: function () {
        clearInterval(this.data.timer)
    },
    /**
     * 输入框聚焦
     */
    searchFocus() {
        let that = this
        clearInterval(that.data.timer)
        that.setData({
            SearchPlaceholderTem: ''
        })
    },
    /**
     * 搜索框失去聚焦
     */
    searchBlur() {
        this.handleYiYan();
    },
    /**
     * 解决文字过长问题
     */
    handleYiYan() {
        let that = this
        that.setData({
            timer: setInterval(function () {
                if (that.data.SearchPlaceholderTem.length < 14) {
                    if ((new Date().getTime() - that.data.lastRequest) / 1000 < 60) {
                        that.setData({
                            SearchPlaceholderTem: that.data.SearchPlaceholder
                        })
                    }
                    that.requestYiYan()
                } else {
                    that.setData({
                        SearchPlaceholderTem: that.data.SearchPlaceholderTem.substr(1, that.data.SearchPlaceholderTem.length)
                    })
                }
            }, 800)
        })
    },

    /**
     * 获取一言
     */
    requestYiYan() {
        let that = this
        try {
            wx.vrequest({
                url: 'https://international.v1.hitokoto.cn/',
                data: {},
                header: {
                    "Content-Type": "application/xml",
                    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36",
                    Accept: "text/html,application/xhtml+xml,application/xml; q=0.9,image/webp,*/*;q=0.8"
                },
                success: function (e) {
                    e = JSON.parse(e.body)
                    that.setData({
                        lastRequest: new Date().getTime(),
                        SearchPlaceholder: e.hitokoto.concat(' —').concat(e.from),
                        SearchPlaceholderTem: e.hitokoto.concat(' —').concat(e.from)
                    })
                }
            });
        } catch (e) {
            that.setData({
                SearchPlaceholderTem: that.data.SearchPlaceholder
            })
        }
    },
    /**
     *
     */
    onReady(option) {
        wx.hideLoading({
            complete: res => {
                wx.showToast({
                    title: 'success'
                })
            }
        })
    },

    /**
     * 分享信息
     * @returns {{path: string, imageUrl: string, title: string}}
     */
    onShareAppMessage(e) {
        if (e.from === 'button') {
            return {
                title: e.target.dataset.content,
                path: '/pages/index/index?viewArticle=' + e.target.dataset.articleid,
                imageUrl: 'https://www.zq1024.cn:8443/upload/bg/836612.jpg'
            }
        } else {
            return {
                title: '广财社区欢迎您！',
                path: '/pages/index/index',
                imageUrl: 'https://www.zq1024.cn:8443/upload/bg/836612.jpg'
            }
        }
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
     * 获取banner内容
     */
    getBanner: function () {
        let that = this;
        wx.request({
            url: baseUrl + "/banner/getBanner",
            success(res) {
                that.setData({
                    banners: res.data
                })
            },
            fail(res) {
                that.setData({
                    banners: res.data
                })
            }
        })
    },
    /**
     * banner切换时候替换角标
     * @param e
     */
    onChange: function (e) {
        this.setData({
            xindex: e.detail.current
        });
    },
    /**
     *表单提交
     */
    formSubmit: function (e) {
        this.setData({
            searching: true,
            searchValue: e.detail.value.searchInput,
        })
        let that = this
        const searchMsg = e.detail.value.searchInput;
        wx.request({
            url: baseUrl.concat('/full-friends/search'),
            data: {
                order: that.data.order[that.data.searchOrderIndex],
                currentPage: 1,
                searchMsg: searchMsg.toString()
            },
            success: result => {
                wx.pageScrollTo({scrollTop: 0, duration: 600});
                var nodata = false
                if (result.data.total < 10) {
                    nodata = true
                }
                that.showSuccessTop('总共有'.concat(result.data.total).concat('条数据'))
                that.setData({
                    noData: nodata,
                    confessionShow: false,
                    TabCur: 4,
                    searchShow: true,
                    searching: false,
                    searchRes: result.data.content,
                    searchResTotal: result.data.total,
                    defaultSearchValue: ''
                })
            },
            fail: res => {
                that.setData({
                    searching: false,
                })
                that.showInfoTop('似乎没有结果')
            }
        })
    },

    /**
     * 键盘确认
     */
    searchSubmit: function (e) {
        const k = {
            detail: {
                value: {
                    searchInput: e.detail.value
                }
            }
        };
        this.formSubmit(k)
    },
    /**
     * 标签切换
     */
    tabSelect(e) {
        let that = this
        if (e.currentTarget.dataset.id === 4) {
            that.setData({
                confessionShow: false,
                schoolNewsShow: true,
                schoolNewsPage: 1,
                showTabCur: e.currentTarget.dataset.id,
                TabCur: e.currentTarget.dataset.id,

            })
            that.getSchoolNews(1, true)
            return;
        }
        if (e.currentTarget.dataset.id === 3) {
            that.setData({
                schoolNewsShow: false,
                confessionShow: true,
                showTabCur: e.currentTarget.dataset.id,
                TabCur: e.currentTarget.dataset.id,
                confessionPage: 1
            })
            that.getConfession(1, true)
            return
        }
        if (e.currentTarget.dataset.id === 0) {
            if (that.data.searchShow) {
                that.setData({
                    schoolNewsShow: false,
                    confessionShow: false,
                    searPage: 1,
                    showTabCur: e.currentTarget.dataset.id,
                    TabCur: e.currentTarget.dataset.id,
                    searchOrderIndex: 1,
                })
                that.searchFriend(1, true)
            } else {
                that.setData({
                    schoolNewsShow: false,
                    confessionShow: false,
                    showTabCur: e.currentTarget.dataset.id,
                    TabCur: e.currentTarget.dataset.id,
                    page: 1,
                    hotCur: 3
                })
                that.getFriend(1, true)
            }
            return;
        }
        if (e.currentTarget.dataset.id === 1 || e.currentTarget.dataset.id === 2) {
            that.setData({
                schoolNewsShow: false,
                confessionShow: false,
                showTabCur: e.currentTarget.dataset.id,
                TabCur: e.currentTarget.dataset.id,
                tempHotCur: e.currentTarget.dataset.id - 1
            })
            that.formSubmitHotItems();
        }
    },
    /**
     * 获取标签
     */
    getLabels: function () {
        let that = this;
        wx.request({
            url: baseUrl + "/getLabels",
            success(res) {
                that.setData({
                    labelList: res.data
                })
            }
        })
    },
    /**
     * 点击显示
     * @param e
     */
    showModal(e) {
        this.setData({
            modalName: e.currentTarget.dataset.target
        })
    },
    /**
     * 点击隐藏
     * @param e
     */
    hideModal(e) {
        this.setData({
            showTabCur: null
        })
    },

    /**
     * formSubmitHotItems
     * @param e
     */
    formSubmitHotItems: function (e) {
        let that = this
        if (that.data.searchShow) {
            that.setData({
                showTabCur: null,
                hotItemsName: that.data.hotItems[that.data.tempHotCur],
                hotCur: this.data.tempHotCur,
                searPage: 1,
                searchOrderIndex: parseInt(that.data.tempHotCur) + 2
            })
            that.searchFriend(1, true)
        } else {
            that.setData({
                showTabCur: null,
                hotItemsName: that.data.hotItems[that.data.tempHotCur],
                hotCur: this.data.tempHotCur,
                page: 1
            })
            that.getFriend(1, true)
        }
    },

    /**
     * formSubmitLabelItems
     * @param e
     */
    formSubmitLabelItems: function (e) {
        this.setData({
            labelCur: this.data.tempLabel,
            labelName: this.data.labelList[this.data.tempLabel - 1].labelName,
            showTabCur: null
        })
    },
    /**
     * 选择
     * @param e
     */
    radioChangeHot: function (e) {
        const hotCur = e.detail.value;
        this.setData({
            tempHotCur: hotCur,
            selecting: true
        })
    },
    /**
     * radioChangeLabel
     * @param e
     */
    radioChangeLabel: function (e) {
        this.setData({
            tempLabel: e.detail.value,
            selecting: true
        })
    },

    /**
     * 页面滑动
     * @param e
     */
    onPageScroll: tool.debounce(function (res) {
        const that = this;
        that.setData({
            scrollTop: res[0].scrollTop
        })
    }, 30),
    /**
     * 获取高度
     */
    getViewTop: function () {
        let that = this
        const query = wx.createSelectorQuery();
        query.select('#search').boundingClientRect(function (res) {
            that.setData({
                searchButtonWidth: res.width
            })
        }).exec();
        query.select('#bannerSwiper').boundingClientRect(function (res) {
            that.setData({
                bannerSwiperHeight: res.height
            })
        }).exec();
        query.select('#menu').boundingClientRect(function (res) {
            that.setData({
                menuHeight: res.height
            })
        }).exec();
    },
    /**
     *点击banner
     */
    intoView(e) {
        if (e.currentTarget.dataset.item.isArticle) {
            wx.navigateTo({
                url: '../news/news?newsId=' + e.currentTarget.dataset.item.content + '&img=' + e.currentTarget.dataset.item.url,
            })
        } else {
            wx.navigateTo({
                url: '../view/view?url' + e.currentTarget.dataset.item.content,
            })
        }
    },
    /**
     * 获取文章
     */
    getFriend(page, refresh) {
        let that = this
        const oldFriends = that.data.friends;
        if (that.data.friendsTotal <= oldFriends.length && !refresh) {
            return
        }
        wx.request({
            url: baseUrl.concat('/full-friends/pull'),
            data: {
                currentPage: page,
                flag: that.data.hotCur
            },
            success: result => {
                let nodata = false
                if (result.data.friends.length < 10 || result.data.friends.length + oldFriends.length >= that.data.friendsTotal) {
                    nodata = true
                }
                if (refresh) {
                    wx.pageScrollTo({scrollTop: 0, duration: 600});
                    wx.setStorageSync('friends', result.data.friends)
                    that.setData({
                        noData: nodata,
                        showSkeleton: false,
                        friends: result.data.friends,
                        friendsTotal: result.data.total
                    })
                } else {
                    that.setData({
                        noData: nodata,
                        friends: oldFriends.concat(result.data.friends)
                    })
                }
            },
            fail: res => {
                that.setData({
                    showSkeleton: false
                })
                that.showErrorTop('fail')
            }
        })
    },

    /**
     * 搜索朋友圈
     * @param page
     * @param refresh
     */
    searchFriend(page, refresh) {
        let that = this
        const oldSearchFriends = that.data.searchRes;
        const searchMsg = that.data.searchValue;
        if (that.data.searchResTotal === oldSearchFriends.length && !refresh) {
            return
        }
        wx.request({
            url: baseUrl.concat('/full-friends/search'),
            data: {
                order: that.data.order[that.data.searchOrderIndex],
                currentPage: page,
                searchMsg: searchMsg.toString()
            },
            success: result => {
                let nodata = false
                if (result.data.content.length < 10 || result.data.content.length + oldSearchFriends.length >= that.data.searchResTotal) {
                    nodata = true
                }
                if (refresh) {
                    wx.pageScrollTo({scrollTop: 0, duration: 600});
                    that.setData({
                        noData: nodata,
                        searchRes: result.data.content,
                        searchResTotal: result.data.total
                    })
                } else {
                    that.setData({
                        noData: nodata,
                        searchRes: oldSearchFriends.concat(result.data.content)
                    })
                }
            },
            fail: res => {
                that.showErrorTop('网络错误！')
            }
        })

    },
    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (option) {
        let that = this
        that.getBanner()
        if (that.data.schoolNewsShow) {
            that.setData({
                schoolNewsPage: 1
            })
            that.getSchoolNews(1, true)
            return
        }
        if (that.data.searchShow) {
            that.refreshSearch()
        } else {
            if (that.data.confessionShow) {
                that.refreshConfession()
            } else {
                that.refreshFriends()
            }
        }
        setTimeout(function () {
            that.setData({
                Refresh: false
            })
            wx.stopPullDownRefresh(option)
        }, 500)
    },
    /**
     * 刷新表白
     */
    refreshConfession() {
        let that = this
        that.setData({
            confessionPage: 1,
        })
        that.getConfession(1, true)
    },
    /**
     * 刷新搜索
     */
    refreshSearch() {
        let that = this
        if (that.data.confessionShow) {
            that.setData({
                confessionPage: 1
            })
            that.getConfession(1, true)
            return
        }
        that.setData({
            searPage: 1,
        })
        that.searchFriend(1, true)
    },
    /**
     * 刷新文章
     */
    refreshFriends() {
        let that = this
        that.setData({
            page: 1,
            Refresh: true
        })
        that.getFriend(1, true)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this
        if (that.data.schoolNewsShow) {
            that.setData({
                schoolNewsPage: that.data.schoolNewsPage + 1
            })
            that.getSchoolNews(that.data.schoolNewsPage, false)
            return
        }
        if (that.data.searchShow && !that.data.confessionShow) {
            that.setData({
                searPage: that.data.searPage + 1
            })
            that.searchFriend(that.data.searPage, false);
        } else {
            if (that.data.confessionShow) {
                that.setData({
                    confessionPage: that.data.confessionPage + 1
                })
                that.getConfession(that.data.confessionPage, false)
            } else {
                that.setData({
                    page: that.data.page + 1
                })
                that.getFriend(that.data.page, false)
            }
        }
    }
    ,
    /**
     * 删除文章
     * @param articleId
     */
    deleteFriend(articleId) {
        const deleteId = articleId.detail;
        let that = this
        let oldFriends = [];
        if (that.data.searchShow) {
            oldFriends = that.data.searchRes
        } else {
            oldFriends = that.data.friends;
        }
        const newFriends = [];
        oldFriends.forEach(function (item) {
            if (item.friends.contentId !== deleteId) {
                newFriends.push(item)
            }
        })
        if (that.data.searchShow) {
            that.setData({
                searchRes: newFriends
            })
        } else {
            wx.setStorageSync('friends', newFriends)
            that.setData({
                friends: newFriends
            })
        }
    }
    ,

    /**
     * 选择举报
     */
    ChooseCheckbox(e) {
        let items = this.data.checkbox;
        let values = e.currentTarget.dataset.value;
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            if (items[i].value === values) {
                items[i].checked = !items[i].checked;
                break
            }
        }
        this.setData({
            checkbox: items
        })
    }
    ,
    /**
     * 提交举报
     */
    affirm(e) {
        let that = this;
        let msg = '';
        let items = that.data.checkbox;
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            if (items[i].checked === true) {
                msg += items[i].name + ';'
            }
        }
        if (msg.length === 0) {
            that.showErrorTop('您未选择!')
        } else {
            if (that.data.isFeedbackComment) {
                that.feedbackComment(msg)
            } else {
                that.feedback(msg)
            }
            that.hideModal2()
        }
    }
    ,
    /**
     * 关闭举报窗口
     */
    hideModal2() {
        let that = this
        that.setData({
            feedback: false
        })
    }
    ,
    /**
     * 同步举报
     */
    feedback: function (e) {
        let that = this
        that.showInfoTop('正在处理')
        const db = wx.cloud.database();
        db.collection('feedback').add({
            data: {
                articleId: that.data.mask.handleId,
                feedbackMsg: e,
                time: util.formatTime(new Date())
            },
            success: res => {
                that.showSuccessTop('success')
            },
            fail: res => {
                that.showErrorTop('网络出错！')
            },
        });
    },

    /**
     * 捕获子事件
     */
    TDD(e) {
        this.setData({
            mask: {
                handleId: e.detail[0],
                commenting: e.detail[1]
            }
        })
    }
    ,
    /**
     * 捕获举报事件
     */
    feedbackCapture() {
        this.setData({
            feedback: true
        })
    }
    ,
    /**
     * 捕获评论事件
     */
    commentCapture(e) {
        this.setData({
            wantComment: true
        })
    }
    ,
    /**
     * 关闭评论框
     */
    hideCommentModal() {
        this.setData({
            wantComment: false
        })
    },
    /**
     * 提交评论
     */
    confirmComment() {
        let that = this
        if (that.data.commentContent === '') {
            that.showInfoTop('内容为空');
            return
        }
        that.setData({
            wantComment: false
        })
        wx.request({
            url: baseUrl + '/comment/postComment',
            data: {
                contentId: that.data.mask.handleId,
                comment: that.data.commentContent,
                userId: getApp().globalData.userId,
                replayUserId: that.data.replayId
            },
            success: result => {
                that.applyComment(result.data)
            },
            fail: res => {
                that.showErrorTop('fail')
            }
        })
    }
    ,
    /**
     * 把评论渲染到页面
     */
    applyComment(commentId) {
        let that = this
        let friendsList = []
        if (that.data.searchShow) {
            friendsList = that.data.searchRes
        } else {
            friendsList = that.data.friends;
        }
        const newComment = [{
            commentId: commentId,
            contentId: that.data.mask.handleId,
            comment: that.data.commentContent,
            commentUserId: getApp().globalData.userId,
            commentName: getApp().globalData.userName,
            replayUserId: that.data.replayId,
            replayName: that.data.replayName,
            commentTime: util.formatTime(new Date())
        },];
        const temList = [];
        friendsList.forEach(item => {
            if (item.friends.contentId === that.data.mask.handleId) {
                item.hashMap.comments = newComment.concat(item.hashMap.comments)
            }
            temList.push(item)
        })
        if (that.data.searchShow) {
            that.setData({
                searchRes: temList,
                mask: {
                    handleId: '',
                },
                replayId: '',
                commentPlaceholder: '评论',
                commentContent: '',
                replayName: '',
            })
        } else {
            wx.setStorageSync('friends', temList)
            that.setData({
                friends: temList,
                mask: {
                    handleId: '',
                },
                replayId: '',
                commentPlaceholder: '评论',
                commentContent: '',
                replayName: '',
            })
        }
    }
    ,
    /**
     * 监听评论输入框
     */
    commentTextarea: function (e) {
        this.setData({
            commentContent: e.detail.value,
        })
    },
    /**
     * 解决键盘遮掩问题
     * 获取高度 设置高度
     */
    inputFocus(e) {
        this.setData({
            keyboardHeight: e.detail.height,
            isInput: true
        })
    }
    ,
    inputBlur() {
        this.setData({
            keyboardHeight: 0,
            isInput: false
        })
    }
    ,
    /**
     * 捕获
     * @param e
     */
    commentTapCapture(e) {
        if (e.detail[0] === 'tap') {
            if (getApp().globalData.userId === e.detail[2]) {
                this.setData({
                    commentContent: '',
                    mask: {
                        handleId: e.detail[1],
                        commenting: false
                    },
                    replayId: '',
                    commentPlaceholder: '评论',
                    wantComment: true
                })
            } else {
                this.setData({
                    commentContent: '',
                    mask: {
                        handleId: e.detail[1],
                        commenting: false
                    },
                    replayId: e.detail[2],
                    replayName: e.detail[3],
                    commentPlaceholder: '回复:'.concat(e.detail[3]),
                    wantComment: true
                })
            }
        } else {
            this.showActionSheet(getApp().globalData.userId === e.detail[2])
            this.setData({
                copyContent: e.detail[6],
                feedbackCommentId: e.detail[5],
                handleCommentIndex: e.detail[4],
                mask: {
                    handleId: e.detail[1],
                    commenting: false
                },
                replayId: '',
                commentPlaceholder: '评论',
                commentContent: '',
                replayName: '',
            })
        }
    }
    ,
    /**
     * 捕获点赞事件,渲染数据
     * @param e
     */
    supportCapture: function (e) {
        let that = this
        let friendsList = []
        if (that.data.searchShow) {
            friendsList = that.data.searchRes
        } else {
            friendsList = that.data.friends;
        }
        const temp = [];
        friendsList.forEach(item => {
            if (item.friends.contentId === that.data.mask.handleId) {
                item.hashMap.supports = e.detail
            }
            temp.push(item)
        })
        if (that.data.searchShow) {
            that.setData({
                searchRes: temp
            })
        } else {
            that.setData({
                friends: temp
            })
        }
    },

    /**
     *
     * @returns {boolean}
     */
    showActionSheet(own) {
        let that = this
        $wuxActionSheet().showSheet({
            buttons: [{
                text: '举报'
            }, {
                text: '复制'
            },
            ],
            buttonClicked(index, item) {
                if (index === 0) {
                    that.setData({
                        isFeedbackComment: true,
                        feedback: true
                    })
                    this.cancel()
                }
                if (index === 1) {
                    that.copyComment();
                    this.cancel()
                }
                return true
            },
            cancelText: '取消',
            cancel() {

            },
            destructiveText: own ? '删除' : '',
            destructiveButtonClicked() {
                that.deleteComment()
                this.cancel()
            },
        })
    }
    ,

    /**
     * 复制
     */
    copyComment() {
        let that = this
        wx.setClipboardData({
            data: that.data.copyContent,
            success: res => {
                that.showSuccessTop('copy success')
            },
            fail: res => {
                that.showErrorTop('copy fail')
            }
        })
    }
    ,
    /**
     * 删除评论,渲染数据
     */
    deleteComment() {
        let that = this
        const friends = that.data.friends;
        const tem = [];
        friends.forEach(item => {
            if (item.friends.contentId === that.data.mask.handleId) {
                that.deleteCommentPush(item.hashMap.comments[that.data.handleCommentIndex].commentId)
                item.hashMap.comments.splice(that.data.handleCommentIndex, 1)
            }
            tem.push(item)
        })
        wx.setStorageSync('friends', tem)
        that.setData({
            friends: tem
        })
    }
    ,
    /**
     *  推送数据
     * @param commentId
     */
    deleteCommentPush(commentId) {
        let that = this
        wx.request({
            url: baseUrl.concat('/comment/deleteComment'),
            data: {
                contentId: that.data.mask.handleId,
                commentId: commentId,
                isDelete: true
            },
            success: result => {
                that.showSuccessTop('success')
            },
            fail: res => {
                that.showErrorTop('网络出错')
            }
        })
    }
    ,

    /**
     * 举报评论
     */
    feedbackComment(e) {
        let that = this
        that.setData({
            isFeedbackComment: false
        })
        const db = wx.cloud.database();
        that.showInfoTop('正在加急处理...')
        db.collection('feedbackComment').add({
            data: {
                commentId: that.data.feedbackCommentId,
                feedbackMsg: e,
                time: util.formatTime(new Date())
            },
            success: res => {
                that.showSuccessTop('谢谢您的举报！')
            },
            fail: res => {
                that.showErrorTop('网络错误！')
            },
        })
    }
    ,

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
    }
    ,
    showSuccessTop(Title) {
        $wuxToptips().success({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    }
    ,
    showInfoTop(Title) {
        $wuxToptips().info({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    }
    ,
    showWarnTop(Title) {
        $wuxToptips().warn({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    }
    ,
    showErrorTop(Title) {
        $wuxToptips().error({
            hidden: false,
            text: Title,
            duration: 3000,
            success() {
            },
        })
    }
    ,

    /**
     * 双击回顶
     * @param e
     */
    doubleClick: function (e) {
        let that = this
        const curTime = e.timeStamp;
        const lastTime = that.data.lastTapTime;
        if (curTime - lastTime > 0) {
            if (curTime - lastTime < 300) {//是双击事件
                wx.pageScrollTo({scrollTop: 0, duration: 600});
            }

        }
        this.setData({
            lastTapTime: curTime
        })
    }
    ,

    /**
     * 获取表白
     */
    getConfession(confessionPage, refresh) {
        let that = this
        const oldConfessions = that.data.confessions;
        const searchMsg = that.data.searchValue;
        if (that.data.confessionTotal <= oldConfessions.length && !refresh) {
            return
        }
        wx.request({
            url: baseUrl.concat(that.data.searchShow ? '/confession/searchConfessions' : '/confession/getConfessions'),
            data: {
                currentPage: confessionPage,
                searchMsg: searchMsg
            },
            success: result => {
                let nodata = false
                if (result.data.confession.length < 10 || result.data.confession.length + oldConfessions.length >= that.data.confessionTotal) {
                    nodata = true
                }
                if (refresh) {
                    wx.pageScrollTo({scrollTop: 0, duration: 600});
                    wx.setStorageSync('confessions', result.data.confession)
                    that.setData({
                        noData: nodata,
                        confessions: result.data.confession,
                        confessionTotal: result.data.total
                    })
                } else {
                    that.setData({
                        noData: nodata,
                        confessions: oldConfessions.concat(result.data.confession),
                        confessionTotal: result.data.total
                    })
                }
            },
            fail: res => {
                that.showErrorTop('fail')
            }
        })
    },

    /**
     * 取消搜索
     */
    cancelSearch() {
        let that = this
        that.setData({
            searchShow: false,
            searchOrderIndex: 0,
        })
        const data = {
            currentTarget: {
                dataset: {
                    id: 0
                }
            }
        };
        that.tabSelect(data)
    },

    /**
     * 获取新闻
     * @param page
     * @param refresh
     */
    getSchoolNews(page, refresh) {
        let that = this
        const oldSchoolNews = that.data.schoolNews;
        if (that.data.schoolNewsTotal <= oldSchoolNews.length && !refresh) {
            return
        }
        wx.request({
            url: baseUrl.concat('/schoolNews/pullSchoolNews'),
            data: {
                currentPage: page
            },
            success: result => {
                let nodata = false
                if (result.data.schoolnews.length < 10||result.data.schoolnews.length+oldSchoolNews.length>=that.data.schoolNewsTotal) {
                    nodata = true
                }
                if (refresh) {
                    wx.pageScrollTo({scrollTop: 0, duration: 600});
                    wx.setStorageSync('schoolNews', result.data.schoolnews)
                    that.setData({
                        noData: nodata,
                        schoolNews: result.data.schoolnews,
                        schoolNewsTotal: result.data.total
                    })
                } else {
                    that.setData({
                        noData: nodata,
                        schoolNews: oldSchoolNews.concat(result.data.schoolnews)
                    })
                }
            },
            fail: res => {
                that.showErrorTop('fail')
            }
        })
    },
    onShow() {
        this.handleYiYan()
    }
})



