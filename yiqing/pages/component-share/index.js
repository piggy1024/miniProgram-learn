// pages/component-share/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shareOne: {
      avatar: '',
      nickname: '',
      showShareModel: false
    },
    shareTwo: {
      avatar: '',
      nickname: '',
      incomeMoney: '',
      joinNumber: '',
      joinAvatarList: '',
      adImageUrl: '',
      adName: '',
      adTime: '',
      showShareModel: false
    },

    shareThree: {
      avatar: '',
      nickname: '',
      awardMoney: '',
      showShareModel: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  handleTapOne: function(){
    this.setData({
      shareOne: {
        avatar: 'https://zq1024.cn:8443/wx/upload/20191024/33_20191024220242_91e9ebb3gw1eutt1h5rj3j20sg0iun09.jpg',
        nickname: '广财社区',
        showShareModel: true
      }
    })
  },

  handleTapTwo: function () {
    this.setData({
      shareTwo: {
        // 应改为用户的图像地址
        avatar: 'https://zq1024.cn:8443/wx/upload/20191024/33_20191024220242_91e9ebb3gw1eutt1h5rj3j20sg0iun09.jpg',
        nickname: '小猪',
        incomeMoney: '0',
        joinNumber: '2',
        joinAvatarList: ['https://zq1024.cn:8443/wx/upload/20191024/33_20191024220242_91e9ebb3gw1eutt1h5rj3j20sg0iun09.jpg', 'https://zq1024.cn:8443/wx/upload/20191024/33_20191024220242_91e9ebb3gw1eutt1h5rj3j20sg0iun09.jpg'],
        // 广告地址
        // adImageUrl: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2136187651,870864669&fm=27&gp=0.jpg',
        adImageUrl: 'https://zq1024.cn:8443/wx/upload/20191024/33_20191024220242_91e9ebb3gw1eutt1h5rj3j20sg0iun09.jpg',
        adName: '个性签名栏',
        adTime: '看看你最近改变',
        showShareModel: true
      },
    })
  },

  handleTapThree: function () {
    this.setData({
      shareThree: {
        avatar: 'https://wx.qlogo.cn/mmopen/vi_32/gcs9nfrPIjZSfZvMmVCK81MpPbWqDspNfc2lRLqllfrpYT61RQWNMHXCfzSia7OiapOfXTjYFR6EF7JQZib5MRCdA/132',
        nickname: '路人甲',
        awardMoney: '哈哈',
        showShareModel: true
      }
    })
  }
})