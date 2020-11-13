// pages/pagetime/pagetime.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hours: '0' + 0, // 时
    minute: '0' + 0, // 分
    second: '0' + 0, // 秒 

  },

  setInterval: function () {
    const that = this
    var second = that.data.second
    var minute = that.data.minute
    var hours = that.data.hours
    setInterval(function () { // 设置定时器
      second++
      if (second >= 60) {
        second = 0 //  大于等于60秒归零
        minute++
        if (minute >= 60) {
          minute = 0 //  大于等于60分归零
          hours++
          if (hours < 10) { // 少于10补零
            that.setData({
              hours: '0' + hours
            })
          } else {
            that.setData({
              hours: hours
            })
          }
        }
        if (minute < 10) { // 少于10补零
          that.setData({
            minute: '0' + minute
          })
        } else {
          that.setData({
            minute: minute
          })
        }
      }
      if (second < 10) { // 少于10补零
        that.setData({
          second: '0' + second
        })
      } else {
        that.setData({
          second: second
        })
      }
    }, 1000)

  },

  gotoPage: function (options) {
    wx.redirectTo({
      url: '../pageend/pageend?h=' + this.data.hours + '&m=' + this.data.minute + '&s=' + this.data.second, //要跳转到的页面路径
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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