// pages/one/one.js
const util = require('../../utils/util.js');
const app = getApp();
let baseUrl = app.globalData.URL;
let testUrl = 'http://localhost'
const tool = require('../../utils/tool.js');
let com = require("../../utils/common")
const ch = require('../data.js');
import {$wuxActionSheet, $wuxToptips} from '../../components/lib/index.js'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        friends: [],
        searchResTotal: 0,
        handleCommentIndex: -1,
        replayId: '',
        commentContent: '',
        commentPlaceholder: '评论',
        keyboardHeight: 0,
        wantComment: false,
        feedbackMsg: '色情',
        checkbox: ch.checkbox,
        feedback: false,
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
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
            }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            articleId: options.articleId,
        })
        this.getOneFriend(options.articleId)
    },
    /**
     *
     * @param articleId
     */
    getOneFriend(articleId) {
        let that = this
        wx.request({
            url: baseUrl.concat('/full-friends/getFriendsById'),
            data: {
                id: articleId
            },
            success: result => {
                if (result.data.length === 0) {
                    that.showInfoTop("内容已被删除")
                }
                that.setData({
                    friends: result.data
                })
            },
            fail: res => {
                that.showErrorTop('内容已被删除')
            }
        })
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function (option) {
        this.getOneFriend(this.data.articleId)
        wx.stopPullDownRefresh(option)
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let that = this
        return {
            title: that.data.friends[0].friends.content,
            path: '/pages/index/index?viewArticle=' + that.data.friends[0].friends.contentId,
            imageUrl: 'https://www.zq1024.cn:8443/upload/bg/836612.jpg'
        }
    },
    /**
     * 捕获点赞事件,渲染数据
     * @param e
     */
    supportCapture: function (e) {
        let that = this
        const friendsList = that.data.friends;
        const temp = [];
        friendsList.forEach(item => {
            if (item.friends.contentId === that.data.mask.handleId) {
                item.hashMap.supports = e.detail
            }
            temp.push(item)
        })
        that.setData({
            friends: temp
        })
    },
    /**
     * 捕获评论事件
     */
    commentCapture(e) {
        this.setData({
            wantComment: true
        })
    },

    /**
     * 删除文章
     * @param articleId
     */
    deleteFriend(articleId) {
        const deleteId = articleId.detail;
        let that = this
        const oldFriends = that.data.friends;
        const newFriends = [];
        oldFriends.forEach(function (item) {
            if (item.friends.contentId !== deleteId) {
                newFriends.push(item)
            }
        })
        that.setData({
            friends: newFriends
        })
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
    },
    /**
     * 捕获举报事件
     */
    feedbackCapture() {
        this.setData({
            feedback: true
        })
    },

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
    },

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
    },
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
    },
    /**
     * 监听评论输入框
     */
    commentTextarea: function (e) {
        this.setData({
            commentContent: e.detail.value,
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
                that.showSuccessTop('success')
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
        const friendsList = that.data.friends;
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
    },
    /**
     * 关闭举报窗口
     */
    hideModal2() {
        let that = this
        that.setData({
            feedback: false
        })
    },
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
    },
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
    },
    /**
     * 关闭评论框
     */
    hideCommentModal() {
        this.setData({
            wantComment: false
        })
    },
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
    }
})
