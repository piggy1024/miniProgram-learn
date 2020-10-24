// pages/index1/index1.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    open: false,
    open2: false,
    list: [],
    num: 0, // 文章序号 
    time: "",// 文章时间
    type: 111
  },

    onClick(event) {
      console.log(event);
      if(event.detail.index == 0){
        wx.showToast({
          title: `标签 ${event.detail.name}`,
          icon: 'none'
        });
      };
      // if(list.)
   
  },
  onLoad: function (options) {
    let that = this;
    // console.log()
    wx.request({
      url: "https://zq1024.cn:8443/wx/article/findByPageOrLabel",
      data: {
        page: 1,
        labelId:1
      },
      header: {
        "Content-Type": "application/json"
      },

      success: function (res) {
        console.log(res);
        that.setData({
          list: res.data,
          type: 222
        });
        
      }
    });
  },


})