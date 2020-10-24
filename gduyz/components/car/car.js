// components/car/car.js
const timeHan = require('../../utils/commonFunc.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        img: {
            type: String,
        },
        pushTime: {
            type: Date,
            observer(newOb, oldOb) {
                this.handleTime(newOb)
            }
        },
        title: {
            type: String
        },
      newsId:{
          type: Int32Array
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
        handleTime(newVal) {
            let that = this
            const sd = new Date(newVal.replace(/-/g, '/')).getTime();
            newVal = timeHan.timeHandle(sd)
            that.setData({
                pushTimeAF: newVal
            })
        },
        viewNews(){
            let that = this
            wx.navigateTo({
                url: '../news/news?newsId='+ that.data.newsId+'&img='+that.data.img,
            })
        }
    }
})
