// pages/pageend/pageend.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    h1: '00',
    m1: '00',
    s1: '00',
    sum: 0
  },

  gotoPage: function (options) {
    wx.redirectTo({
      url: '../page3/page3', //要跳转到的页面路径
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      h1: options.h,
      m1: options.m,
      s1: options.s
    })
    if (this.data.h1 == 0 && this.data.m1 == 0 && this.data.s1 == 0) {
      this.setData({
        sum: 0
      })
    } else {
      this.setData({
        sum: (this.data.h1 * 60 + this.data.m1 + 1) * 0.15
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})