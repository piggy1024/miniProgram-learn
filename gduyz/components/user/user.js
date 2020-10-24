// components/user/user.js


Component({
    /**
     * 组件的属性列表
     */
    properties: {
        username: {
            type: String,
            default: wx.getStorageSync("userName") || "点击头像登陆",
            observer(newV, oldV) {
            }
        },
        bgUrl: {
            type: String,
            default: '',
            observer(newV, oldV) {
            }
        },
        avatar: {
            type: String,
            default: wx.getStorageSync("avatar") || "/images/login/login.jpg"
        },
        signature: {
            type: String,
            default: ''
        }
    },

    /**
     * 组件的初始数据
     */
    data: {},

    /**
     * 组件的方法列表
     */
    methods: {
        lookAvatar(){
            let that = this
            wx.previewImage({
                urls: [that.data.avatar],
                current: that.data.avatar
            })
        }
    }
})
