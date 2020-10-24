// components/content/comment.js
const timeHan = require('../../utils/commonFunc.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        supports: {
            type: Array,
            default: []
        },
        comments: {
            type: Array,
            default: [],
            observer(newVal, oldVal) {
                this.handleCommentTime(newVal);
            }
        },
        articleId: {
            type: Int32Array,
            default: 0
        },
        showAll: {
            type: Boolean,
            default: false
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     *
     */
    methods: {
        /**
         * 单击
         * @param e
         */
        shortTap(e) {
            if (getApp().globalData.userId === '' || getApp().globalData.userId < 1) {
                wx.navigateTo({
                    url: '../login/login?from=../index/index',
                })
            }
            this.triggerEvent('commentTap', [e.type, e.currentTarget.dataset.articleid, e.currentTarget.dataset.replayid, e.currentTarget.dataset.replayname])
        },
        /**
         * 长按
         * @param e
         */
        longTap(e) {
            console.log(e.currentTarget.dataset)
            this.triggerEvent('commentTap', [
                e.type,
                e.currentTarget.dataset.articleid,
                e.currentTarget.dataset.replayid,
                e.currentTarget.dataset.replayname,
                e.currentTarget.dataset.index,
                e.currentTarget.dataset.commentid,
                e.currentTarget.dataset.content
            ])
        },
        /**
         * 时间美化
         * @param newVal
         */
        handleCommentTime(newVal) {
            let that = this
            if (newVal.length === 0){
                that.setData({
                    commentsHandle: []
                })
                return
            }
            const tem = [];
            newVal.forEach(item=>{
                const sd = new Date(item.commentTime.replace(/-/g, '/')).getTime();
                item.commentTime = timeHan.timeHandle(sd)
                tem.push(item)
            })
            that.setData({
                commentsHandle: tem,
                isSpreadComment: false
            })
        },
        /**
         * 查看user信息
         * @param e
         * @private
         */
        _viewUserInfo(e) {
            wx.navigateTo({
                url: '../user/user?userId=' + e.currentTarget.dataset.usreid,
            })
        },

        /**
         *展开
         */
        spreadComment(){
            let that = this
            that.setData({
                isSpreadComment: !that.data.isSpreadComment
            })
        },
        /**
         * 查看所有
         */
        viewAllSupport(){
            let that = this
            wx.navigateTo({
                url: '../one/one?articleId=' + that.data.articleId,
            })
        }

    },
})
