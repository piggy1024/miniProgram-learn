// components/confession/confession.js
const timeHan = require('../../utils/commonFunc.js')
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        confessions: {
            type: Array,
            default: [],
            observer(newO, Old){
                this.handleDay(newO)
            }
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
        handleDay(newO){
            let that = this
            const confessionsHan = [];
            newO.forEach(item=>{
                let sd = new Date(item.postTime.replace(/-/g, '/')).getTime()
                item.postTime = timeHan.timeHandleDay(sd)
                confessionsHan.push(item)
            })
            that.setData({
                confessionsHan: confessionsHan
            })
            console.log(that.data.confessionsHan)
        }
    }
})
