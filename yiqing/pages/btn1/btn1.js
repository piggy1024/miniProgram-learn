// pages/btn1/btn1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  self: function () {
    wx.navigateTo({
      url: '../selftable/selftable'
    })
  },
  other: function () {
    wx.navigateTo({
      url: '../othertable/othertable'
    })
  },
})