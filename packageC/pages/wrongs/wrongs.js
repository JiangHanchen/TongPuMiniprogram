// pages/wrongs/wrongs.js
var app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        
        wrongs:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var openid=app.globalData.openid
        
        wx.cloud.callFunction({
            name:"searchError",
            data:{
                openid:openid
            },success: resss => {
                console.log('[userlistadd云函数]新增信息成功！！ ',resss)
                this.setData({
                    wrongs:resss.result.data[0].wrongs
                })
              },
              fail: err => {
                console.error('[userlistadd云函数]调用失败', err)
              }
        })
        console.log(this.data.wrongs)
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