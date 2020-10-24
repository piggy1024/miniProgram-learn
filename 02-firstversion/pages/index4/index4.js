
const regeneratorRuntime = require('../../utils/runtime.js');
Page({
 
  data: {
  
      posts: [],
      page: 1,
      filter: "",
      nodata: false,
      nomore: false,
      defaultSearchValue: "",
      navItems: [{ name: '综合', index: 1 }, { name: '热门', index: 2 }, { name: '最新', index: 3 }],
      tabCur: 1,
      scrollLeft: 0,
      showHots: false,
      showNew: false,
      showZonghe:true,
      hotItems: ["表白", "树洞", "学习", "二手", "其它"],
      hotCur: 0,
      labelList: [],
      labelCur: "全部",
      whereItem: ['', 'createTime', ''],//下拉查询条件
    

    open: false,
    open2: false,
    list: [],  
    num: 0, // 文章序号 
    time: "",// 文章时间
  },

  showitem: function() {
    this.setData({
      open: !this.data.open
    });
  },
  showitem2: function() {
    this.setData({
      open2: !this.data.open2
    });
  },

  onLoad: function(options) { 
    let that = this;
    // console.log()
    wx.request({
      url: "https://zq1024.cn:8443/wx/article/findByPageOrLabel",
      data: {
        page: 2
      },
      header: {
        "Content-Type": "application/json"
      },

      success: function(res) {
        // console.log(res)
        that.setData({
          list: res.data
        });
      }
    });
  },
  //综合排序下拉

  //实时热点下拉

  //选择综合排序
  tabSelect: async function (e) {
    let that = this;
    console.log(e);
    let tabCur = e.currentTarget.dataset.id
    switch (tabCur) {
      case 1: {
        that.setData({
          posts: [],
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHots: false,
          showZonghe: true,
          showNew: false,
          defaultSearchValue: "",
          page: 1,
          nomore: false,
          nodata: false,
          whereItem: ['', 'totalVisits', '']
        })

        // await that.getPostsList("", 'createTime')
        break
      }
      case 2: {
        that.setData({
          posts: [],
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHots: true,
          showNew: false,
          showZonghe:false,
          defaultSearchValue: "",
          page: 1,
          nomore: false,
          nodata: false,
          whereItem: ['', 'totalVisits', '']
        })
        // await that.getPostsList("", "totalVisits")
        break
      }
      case 3: {
        that.setData({
          posts: [],
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHots: false,
          showNew: true,
          showZonghe: false,
          defaultSearchValue: "",
          page: 1,
          nomore: false,
          nodata: false,
          whereItem: ['', 'totalVisits', '']
        })

        // let task = that.getPostsList("", 'createTime')
        // let labelList = await api.getLabelList()
        // that.setData({
        //   labelList: labelList.result.data
        // })
        // await task

        break
      }
    }
  },

  /**
 * 热门按钮切换
 * @param {*} e 
 */
  hotSelect: async function (e) {
    let that = this
    let hotCur = e.currentTarget.dataset.id
    let orderBy = "createTime"
    switch (hotCur) {
      //浏览最多
      case 0: {
        orderBy = "totalVisits"
        break
      }
      //评论最多
      case 1: {
        orderBy = "totalComments"
        break
      }
      //点赞最多
      case 2: {
        orderBy = "totalZans"
        break
      }
      //收藏最多
      case 3: {
        orderBy = "totalCollection"
        break
      }
    }
    that.setData({
      posts: [],
      hotCur: hotCur,
      defaultSearchValue: "",
      page: 1,
      nomore: false,
      nodata: false,
      whereItem: ['', orderBy, '']
    })
    await that.getPostsList("", orderBy)
  },
  

tabSelect: async function (e) {
    let that = this;
    console.log(e);
    let tabCur = e.currentTarget.dataset.id
    switch (tabCur) {
      case 1: {
        that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          nomore: false,
          nodata: false,
          showHot: false,
          showLabels: false,
          defaultSearchValue: "",
          posts: [],
          page: 1,
          whereItem: ['', 'createTime', '']
        })

        await that.getPostsList("", 'createTime')
        break
      }
      case 2: {
        that.setData({
          posts: [],
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHot: true,
          showLabels: false,
          defaultSearchValue: "",
          page: 1,
          nomore: false,
          nodata: false,
          whereItem: ['', 'totalVisits', '']
        })
        await that.getPostsList("", "totalVisits")
        break
      }
      case 3: {
        that.setData({
          tabCur: e.currentTarget.dataset.id,
          scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
          showHot: false,
          showLabels: true,
        })

        let task = that.getPostsList("", 'createTime')
        let labelList = await api.getLabelList()
        that.setData({
          labelList: labelList.result.data
        })
        await task

        break
      }
    }
  },
  

});
