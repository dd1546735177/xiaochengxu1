// pages/page2/page2.js
const app = getApp();
const db = wx.cloud.database();
const St = db.collection('Student')
const _ = db.command;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputStudent: 0,
    inputPassword: 0,
  },
  formSubmit: function (e) {
    console.log(e.detail.value)
    this.setData({
      inputStudent: e.detail.value['inputStudent']
    });
    this.setData({
      inputPassword: e.detail.value['inputPassword']
    });
    var that=this
    St.doc(that.data.inputStudent).get({
      success:function(res){
        console.log(res)
        if(res.data.password==that.data.inputPassword){
          wx.redirectTo({
            url: '../page3/page3', //要跳转到的页面路径
          })
        }
        else{
          wx.showToast({
            title: '学号或密码错误，请修改后重试',
            icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
            duration: 2000     
          })
        }
      },
      fail(){
        wx.showToast({
        title: '学号或密码错误，请修改后重试',
        icon: 'none',    //如果要纯文本，不要icon，将值设为'none'
        duration: 2000     
      })
      }
      
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