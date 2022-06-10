// pages/home/home.js
var util=require('../../utils/util.js')
var app=getApp()
Page({

  gohelp: function(){
    wx.navigateToMiniProgram({
      appId: 'wx182be45f90ffbf3d',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
      console.log(err);
      }
    })
  },
  gosearch: function(){
    wx.navigateToMiniProgram({
      appId: 'wx30c77dc4d5740288',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
      console.log(err);
      }
    })
  },
  gocase: function(){
    wx.navigateToMiniProgram({
      appId: 'wxda9c5273012212f2',
      path: '',
      envVersion: 'release',// 打开正式版
      success(res) {
        // 打开成功
      },
      fail: function (err) {
      console.log(err);
      }
    })
  },
  
  gomore: function(){
    wx.navigateTo({
    url: '/packageD/pages/goto/fazhiyaowen/fazhiyaowen', 
    success: function() {
    }, //成功后的回调；
    fail: function() { }, //失败后的回调；
    complete: function() { } //结束后的回调(成功，失败都会执行)
    })
  },
  sign(){
    if(app.globalData.isLogIn==false){
      wx.showModal({
        title: '未登录',
        content: '请登录后签到',
        success: function (res) {
          if (res.confirm) {
            console.log('确定')
          } else {
            console.log('取消')
          }
        }
      })
      return
    }
    var  DATE=util.formatDate(new Date())
    console.log('获取的当前日期')
    var openid=app.globalData.openid
    var signTime=0
    var integral=0
    wx.cloud.callFunction({
      name:"searchDate",
      data:{
        openid:openid
      },success: ress => {
        console.log('[userlistadd云函数]查询信息成功！！ ',ress)
        signTime=ress.result.data[0].signTime
        integral=ress.result.data[0].integral
        console.log('数据库存储的日期',signTime)
        console.log('数据库存储的积分',integral)
        if(DATE!=signTime){
          console.log('判断日期不相等')
          wx.showToast({
            title: '签到成功',
          })
          wx.cloud.callFunction({
            name:"updateDate",
            data:{
              openid:openid,
              signTime:DATE ,
              integral:integral+1
            },success: resss => {
              console.log('[userlistadd云函数]新增信息成功！！ ',resss)
              
            },
            fail: err => {
              console.error('[userlistadd云函数]调用失败', err)
            }
          })
        }else{
          wx.showToast({
            icon:'none',
            title: '今天已经签过到了,请明天再来'
          })
        }
      },
      fail: err => {
        console.error('[userlistadd云函数]调用失败', err)
      }
    })
    
  
  },

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  gotoNO1:function () {
    wx.navigateTo({
      url: '/pages/article/NO.1/NO.1',
    })
  },
  gotoNO2:function () {
    wx.navigateTo({
      url: '/pages/article/NO.2/NO.2',
    })
  },
  gotoNO3:function () {
    wx.navigateTo({
      url: '/pages/article/NO.3/NO.3',
    })
  },
  gotoNO4:function () {
    wx.navigateTo({
      url: '/pages/article/NO.4/NO.4',
    })
  },
  gotoNO5:function () {
    wx.navigateTo({
      url: '/pages/article/NO.5/NO.5',
    })
  },
  gotoNO6:function () {
    wx.navigateTo({
      url: '/pages/article/NO.6/NO.6',
    })
  },
  gotoNO7:function () {
    wx.navigateTo({
      url: '/pages/article/NO.7/NO.7',
    })
  },
  gotoNO8:function () {
    wx.navigateTo({
      url: '/pages/article/NO.8/NO.8',
    })
  },
  gotoNO9:function () {
    wx.navigateTo({
      url: '/pages/article/NO.9/NO.9',
    })
  },
  gotoNO10:function () {
    wx.navigateTo({
      url: '/pages/article/NO.10/NO.10',
    })
  },
  gotoNO11:function () {
    wx.navigateTo({
      url: '/pages/article/NO.11/NO.11',
    })
  },
  gotoNO12:function () {
    wx.navigateTo({
      url: '/pages/article/NO.12/NO.12',
    })
  },
  gotoNO13:function () {
    wx.navigateTo({
      url: '/pages/article/NO.13/NO.13',
    })
  },
  gotoNO14:function () {
    wx.navigateTo({
      url: '/pages/article/NO.14/NO.14',
    })
  },
  gotoNO15:function () {
    wx.navigateTo({
      url: '/pages/article/NO.15/NO.15',
    })
  },
  gotoNO16:function () {
    wx.navigateTo({
      url: '/pages/article/NO.16/NO.16',
    })
  },
  gotomine:function () {
    wx.switchTab({
      url: '/pages/mine/mine',
    })
  },
  gotodati:function () {
    wx.switchTab({
      url: '/pages/activity/activity',
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