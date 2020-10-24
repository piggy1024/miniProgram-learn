//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
 
  },

 

  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  btn1: function () {
    wx.navigateTo({
      url: '../btn1/btn1'
    })
  },
  btn2: function () {
    wx.navigateTo({
      url: '../btn2/btn2'
    })
  },
  btn3: function () {
    wx.navigateTo({
      url: '../btn3/btn3'
    })
  },
  btn4: function () {
    wx.navigateTo({
      url: '../btn4/btn4'
    })
  },
  
  onLoad: function () {
   
  },


})
