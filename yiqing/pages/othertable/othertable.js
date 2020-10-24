// pages/othertable/othertable.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

    array: ['男', '女'],
    objectArray: [
      {
        id: 0,
        name: '男'
      },
      {
        id: 1,
        name: '女'
      },

    ],
    index: 0,

    array1: ['广东', '其它地区'],
    objectArray1: [
      {
        id: 0,
        name: '广东'
      },
      {
        id: 1,
        name: '其它地区'
      },

    ],
    index1: 0,


    items: [
      { name: 'yes', value: '是，在广州居住了已有半年以上' },
      { name: 'no', value: '否，我是临时来广州' },

    ],




    name:"",
    phoneNumber:'',
    gender:'',
    homeTown:'',
    idNumber:'',

  },

bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindPickerChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index1: e.detail.value
    })
  },

  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },


// 获取名字
  getName:function(e){
      this.setData({
        name:e.detail.value
      })
      console.log(this.data.name)
  },

  // 获取电话
  getPhone: function (e) {
    this.setData({
      phoneNumber: e.detail.value
    })
    console.log(this.data.phoneNumber)
  },
  // 获取性别
  getGender: function (e) {
    this.setData({
      gender: e.detail.value
    })
    console.log(this.data.gender)
  },
  // 获取籍贯
  gerHometown: function (e) {
    this.setData({
      homeTown: e.detail.value
    })
    console.log(this.data.homeTown)
  },
  // 获取身份证号码
  getIdNumber: function (e) {
    this.setData({
      idNumber: e.detail.value
    })
    console.log(this.data.id)
  },

})