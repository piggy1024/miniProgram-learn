// pages/mime/mime.js
const util = require('../../utils/util.js');
const app = getApp();
let baseUrl = app.globalData.URL;
const tool = require('../../utils/tool.js');
import {$wuxActionSheet, $wuxToptips} from '../../components/lib/index.js'
const ch = require('../data.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        UseFriendsTotal: 0,
        pageError: false,
        showSkeleton: true,
        back_content: '<首页',
        buttons: [{
            openType: 'share',
            label: '分享一下',
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTEwVDE1OjU0OjI1KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xMFQxNTo1Njo0NiswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xMFQxNTo1Njo0NiswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDphYmMwMTA4MS02YjAy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'
        },
            {
                openType: 'contact',
                label: '联系作者',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJIAAACACAYAAADgZTAeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAFHGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTEwVDE1OjQyOjE4KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xMFQxNTo0NTowOSswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xMFQxNTo0NTowOSswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo3N2E4ZDBkYS02YmM0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',
            },
            {
                label: '返回',
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAYAAADDPmHLAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGymlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIwLTAyLTE4VDE3OjIxOjI2KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMC0wMi0xOFQxNzozNjoxNCswODowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMC0wMi0xOFQxNzozNjoxNCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDoxNzY1NTZlYS04ZGRhLTkwNDAtYTIzNS0xYzg1NDA2MDRiNWQiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiODhhMWZhYS02YTM2LWJlNDYtYTdlNS00OTNmMTJlNDIwYWEiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDoyY2ZhOTg0NS1jYjBhLTdiNDQtYjM4OC1iYzI1NGI0N2NlZWEiPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjJjZmE5ODQ1LWNiMGEtN2I0NC1iMzg4LWJjMjU0YjQ3Y2VlYSIgc3RFdnQ6d2hlbj0iMjAyMC0wMi0xOFQxNzoyMToyNiswODowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTkgKFdpbmRvd3MpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo1NDg4MDBlOC1lZjc3LTg2NGEtYmUzMi04N2U3NmYyYzZjNjIiIHN0RXZ0OndoZW49IjIwMjAtMDItMThUMTc6MzY6MTMrMDg6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE5IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTc2NTU2ZWEtOGRkYS05MDQwLWEyMzUtMWM4NTQwNjA0YjVkIiBzdEV2dDp3aGVuPSIyMDIwLTAyLTE4VDE3OjM2OjE0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiIHN0RXZ0OmNoYW5nZWQ9Ii8iLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+7KmpBgAAAlZJREFUeNrt3cFt20AQQNHtv5y0kFbcQY4+rA+52oAdiRF3/huABWj/IyFI5HLtvdfw47NZjr9HLTwAAQDfHQAGAvju/BJ/FoCfjviDAGwAmgD+df4IfzaAR0f4gwFsAJoAtvhdABuAJoAtfhPAVSP4AQDEjwK4esS+MQDxowD+1wh9MwBb/C6ADUATwBa/C2AD0ATwynkX93UA7jDivgjABqAJ4M4j9MUATh0AHgQwcQCIhs+CED8OQvg4BvHjGISPYxA/jkH8OAYA4hDEj0MAIA4BgDgEAOIQAIhDACCOAIA4BL8DxBEAEEfgv4A4BP8GxhG4FyCOwA0hcQRuCYsjcFNoHIHbwuMIPBQSR+DJoDiC6nOBAHg4FIJnAYDgYAQTN4cwLwJw9w2hIBi+R5Ar2E0ATNoXcDwCu4LGt8OxL3AHw/itYgs7nx8LoIBgnYjAyyFaEMa/L2BBcH8AtZdDAQDBfRFMXJgFwTkAim8IBeDiRQHgQAAQvAiB18Q3EYx/efSC4FwAz1gcAAYAgACAhxYIgCEA1nAAC4BrFgmAYQAgAODHCwXAQAALAADWQADvADwfwXIVmA1gAQDAV4u3AGgBmH41e9a8AdAGsAAAAAAAAMh/AQQgfvYDAAAAAFj4bHwAAACgHB8AAAAoxwcAAADK8QGI/ewLgPgAuPQD4OwHQHwAxAegHh+AeHwA4vEBiMcHYMgTvgCID4BLPgDOegCc9QA46wFw1gMgPADCAzDoxg0AhAfg8PC3/NzCB6MDcG34o9ahGP53OTgA8eAAhGN/dnwAGI28S0ui6j0AAAAASUVORK5CYII='
            }],
        CustomBar: app.globalData.CustomBar,
        scrollTop: 0,
        handleCommentIndex: -1,
        replayId: '',
        commentContent: '',
        commentPlaceholder: '评论',
        keyboardHeight: 0,
        wantComment: false,
        feedbackMsg: '',
        feedback: false,
        checkbox: ch.checkbox,
        friends: wx.getStorageSync("userContent") || [],
        page: 1,
        userIn: wx.getStorageSync("userIn") || '',
        share: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        if (options.userId > 0) {
            that.setData({
                userId: options.userId
            })
            that.getUserFriends(1, true, options.userId)
        } else {
            that.showErrorTop('数据出错')
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        let that = this
        setTimeout(() => {
            that.setData({
                page: 1
            })
            that.getUserFriends(1, true, that.data.userId)
            wx.stopPullDownRefresh()
        }, 3000)
    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        let that = this
        const page = that.data.page;
        that.setData({
            page: page + 1
        })
        this.getUserFriends(page + 1, false, that.data.userId);
    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {
        let that = this
        if (res.from === 'button') {
            // 来自页面内转发按钮
        }
        return {
            title: that.data.userIn.afterName,
            path: 'pages/mime/mime?userId=' + that.data.userId
        }
    },

    /**
     * 获取
     * @param page
     * @param refresh
     * @param userId
     */
    getUserFriends(page, refresh, userId) {
        let that = this
        const oldFriends = that.data.friends;
        if (that.data.UseFriendsTotal <= oldFriends.length && !refresh) {
            return;
        }
        wx.request({
            url: baseUrl.concat('/user/getUserInfo'),
            data: {
                userId: userId,
                others: true,
                currentPage: page
            },
            success: result => {
                var nodata = false
                if (result.data.userContent.friends.length < 10|| result.data.userContent.friends.length + oldFriends.length >= that.data.UseFriendsTotal) {
                    nodata = true
                }
                if (refresh) {
                    that.showSuccessTop('success')
                    that.setData({
                        noData: nodata,
                        UseFriendsTotal: result.data.userContent.total,
                        friends: result.data.userContent.friends,
                        userIn: result.data.userIn,
                        showSkeleton: false
                    })
                } else {
                    that.setData({
                        noData: nodata,
                        friends: oldFriends.concat(result.data.userContent.friends),
                        userIn: result.data.userIn
                    })
                }
            },
            fail: res => {
                that.showErrorTop('网络出错！')
                that.setData({
                    showSkeleton: false,
                    pageError: true
                })
            }
        })
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
     * 同步评论
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
    },


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
                that.showErrorTop('网络错误！')
            }
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
    },
    inputBlur() {
        this.setData({
            keyboardHeight: 0,
            isInput: false
        })
    },

    /**
     * 监听评论输入框
     */
    commentTextarea: tool.debounce(function (res) {
        this.setData({
            commentContent: res[0].detail.value,
        })
    }),

    /**
     * 提交评论
     */
    confirmComment() {
        let that = this
        if (that.data.commentContent === '') {
            that.showInfoTop('内容为空');
            return
        }
        this.setData({
            wantComment: false
        })
        setTimeout(function () {
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
                    that.showErrorTop('网络错误！')
                }
            })
        }, 1020)
    },

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
            this.showErrorTop('您未选择!')
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
     * 同步举报
     */
    feedback: function (e) {
        let that = this
        const db = wx.cloud.database();
        that.showInfoTop('正在处理...')
        db.collection('feedback').add({
            data: {
                articleId: that.data.mask.handleId,
                feedbackMsg: e,
                time: util.formatTime(new Date())
            },
            success: res => {
                that.showSuccessTop('谢谢您的举报！')
            },
            fail: res => {
                that.showErrorTop('网络错误！')
            },
        });
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
    onClick(e) {
        let that = this
        if (e.detail.index === 2) {
            that.BackPage()
        }
    },
    /**
     * 返回
     * @constructor
     */
    BackPage() {
        wx.navigateBack({
            delta: 1
        });
    },
})
