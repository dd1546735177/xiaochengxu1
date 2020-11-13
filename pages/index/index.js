//index.js

Page({
  data: {

  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  gotoPage: function (options) {
    wx.navigateTo({
          url: '../page2/page2',//要跳转到的页面路径
    })  
  },
  onLoad: function () {

  }
})
