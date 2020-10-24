
var imgArr = []; //这个数组用来临时存储图片数据
Page({
  data: {
    latitude: "",
    chooseImageUrl: [], //绑定到页面的数据
    imgCount: 0, //图片的张数
    type: [{ name: '表白', index: 1 }, { name: '二手交易', index: 2 }, { name: '树洞', index: 3 }, { name: '学习交流', index: 4 }, { name: '其它', index: 5 }],
    labalId:1,
  },


// 类型选择函数
typeSelect: function(e){
let that = this;
// typeid 是文章类型id
let typeid = e.currentTarget.dataset.id
that.setData({
  labalId:typeid
})


},


  paizhao: function() {
    var that = this;

    var attach = [];
    //wx.chooseImage 不多介绍看文档
    wx.chooseImage({
      sourceType: ["album", "camera"],
      sizeType: ["original"],
      count: 9,
      success: function(res) {
        var tempFilePaths = res.tempFilePaths;
        var len = that.data.imgCount + tempFilePaths.length;
        //len 是此时已有的张数和本次上传的张数的和，也就是本次操作完成页面应该有的张数，因为用户可能会多次选择图片，所以每一次的都要记录下来。

        if (len > 9) {
          wx.showToast({
            title: "最大数量为9",
            icon: "loading",
            duration: 1000
          });
          //超过结束
          return false;
        }
        for (var i = 0; i < tempFilePaths.length; i++) {
          //将api 返回的图片数组push进一开始的imgArr，一定要循环一个个添加，因为用户上传多张图直接push就会多个路径在imgArr的同一个元素里。报错
          imgArr.push(tempFilePaths[i]);
        }
        //将此时的图片长度和存放路径的数组加到要渲染的数据中
        that.setData({
          imgCount: len,
          chooseImageUrl: imgArr
        });
      }
    });
  },
  //点关闭按键
  Close: function(e) {
    var mylen = this.data.chooseImageUrl.length; //当前渲染的数组长度

    var myindex = e.currentTarget.dataset.index; //当前点击的是第几张图片 data-index
    imgArr.splice(myindex, 1); //将这张图充存放图片的数组中删除

    this.setData({
      imgCount: mylen - 1, //长度减一
      chooseImageUrl: imgArr //将删除图片后的数组赋给要渲染的数组
    });
  }
});
