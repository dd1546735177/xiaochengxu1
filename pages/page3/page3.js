// pages/page3/page3.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    zaoTangLocation: '未选择',
    zaoTangNumber: 40,
    showZaoTangNumber: 'hideNumber',
    tip: '点击预约/排队按钮选择澡堂位置',
    actions: [{
        name: '楠苑澡堂 男生',
      },
      {
        name: '楠苑澡堂 女生',
      },
      {
        name: '梓苑澡堂 男生',
      },
      {
        name: '梓苑澡堂 女生',
      }
    ],
  },
  onShow1() {
    if (this.data.zaoTangLocation === '未选择') {
      this.setData({
        show: true
      });
    } else {
      switch (this.data.zaoTangLocation) {
        case '楠苑澡堂 男生':
          wx.navigateTo({
            url: '../seat-select/seat-select', //要跳转到的页面路径
          })
          break
        case '楠苑澡堂 女生':
          wx.navigateTo({
            url: '../seat-select-w/seat-select-w', //要跳转到的页面路径
          })
          break
        case '梓苑澡堂 男生':
          wx.navigateTo({
            url: '../seat-select-zi/seat-select-zi', //要跳转到的页面路径
          })
          break
        case '梓苑澡堂 女生':
          wx.navigateTo({
            url: '../seat-select-w-zi/seat-select-w-zi', //要跳转到的页面路径
          })
          break
      }

    }
  },
  onShow2() {
    this.setData({
      show: true
    });
  },
  onClose() {
    this.setData({
      show: false
    });
  },
  onSelect(event) {
    console.log(event.detail);
    this.setData({
      zaoTangLocation: event.detail['name']
    });
    this.setData({
      tip: '点击澡堂可以重新选择澡堂位置'
    });
    this.setData({
      showZaoTangNumber: 'showNumber'
    });
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