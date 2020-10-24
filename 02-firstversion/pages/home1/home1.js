// // pages/home1/home1.js
// import request from '../service/network.js'
// Page({
//   /**
//    * 组件的初始数据
//    */
//   data: {},
//   onLoad: function(options) {
//     // ----1.原生方式发送网络请求
//     this.get_data_origin()

//     // ----2.使用封装的request发送网络请求
//     //promise最大的好处是防止出现回调地狱
//     request({
//       url: "http://123.207.32.32:8000/recommand"
//     }).then(res => {
//         console.log(re)
//     }).catch(err => {
//         console.log(err)
//     })
//   },
//   get_data_origin(){
//     //发送网络请求
//     //1.发送最简单的get请求
//     wx.request({
//       url: "http://123.207.32.32:8000/recommand",
//       method: "get",

//       data: {
//         type: "sell",
//         page: 1
//       },
//       success: function (res) {
//         console.log(res);
//       }
//     });
//     //2.get请求，并且携带参数
//     // wx.request({
//     //   url: "http://123.207.32.32:8000/recommand",
//     //   data: {
//     //     type: 'sell',
//     //     page: 1
//     //   },
//     //   success: function (res) {
//     //     console.log(res);
//     //   }
//     // });
//     //3.post请求，并且携带参数（）
//     // wx.request({
//     //   url: "http://httpbin.org/post",
//     //   method: "post",
//     //   data: {
//     //     name: "coderwhy",
//     //     age: 18,
//     //     height: 180
//     //   },
//     //   success: function(res) {
//     //     console.log(res);
//     //   }
//     // });
//   }
// });
