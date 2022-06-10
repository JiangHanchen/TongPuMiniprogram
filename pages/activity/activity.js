// pages/activity/activity.js
var app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
      currentDate:'2022-02-21'
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

    },
    jumpToChoose:function (){
        if(app.globalData.isLogIn){
          wx.redirectTo({
            url: '/packageA/pages/choose/choose',
          })
        }else{
          wx.showModal({
            title: '未登录',
            content: '请登录后答题',
            success: function (res) {
              if (res.confirm) {
                console.log('确定')
                wx.switchTab({
                  url: '/pages/mine/mine',
                })
              } else {
                console.log('取消')
              }
            }
          })
        }
    },
    jumpToPoplaw(){
        wx.navigateTo({
          url: '/packageB/pages/poplaw/poplaw',
        })
    }
})