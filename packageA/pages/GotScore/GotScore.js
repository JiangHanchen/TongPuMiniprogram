// pages/answer/answer.js
var app=getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wrongs:[],
        result:[],
        score:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var openid=app.globalData.openid
        var that=this
        let answerSelected1=wx.getStorageSync('answerSelected')
        let questions1=wx.getStorageSync('questions')
        console.log('传递过来的用户选择',answerSelected1)
        console.log('传递过来的题库',questions1)
        that.setData({
            result:[],
            score:0,
            wrongs:[]
        })
        var list=[];
        for(var i=0;i<questions1.length;i++){
            if(questions1[i].answer==answerSelected1[i]){
                this.setData({
                    score:this.data.score+10
                })
                this.data.result.push(1)
            }else{
                this.data.result.push(0)
                wx.cloud.callFunction({
                    name:"errAddInfomation",
                    data:{
                        title:questions1[i].title,
                        description:questions1[i].description,
                        userSelected:answerSelected1[i],
                        answer:questions1[i].answer,
                        openid:openid
                    },
                    success: resss => {
                        console.log('[userlistadd云函数]新增信息成功！！ ',resss)
                      },
                      fail: err => {
                        console.error('[userlistadd云函数]调用失败', err)
                      }
                })
                var wrong={
                    title:questions1[i].title,
                    description:questions1[i].description,
                    id:i+1
                }
                list.push(wrong)
            }
        }
        var score=this.data.score
        wx.cloud.callFunction({
            name:"searchDate",
            data:{
                openid:openid
            },success: res=>{
                console.log('信息查询成功',res) 
                console.log('本次答题得分',score)
                wx.cloud.callFunction({
                    name:"integralUpdate",
                    data:{
                        openid:openid,
                        integral:res.result.data[0].integral+score/10
                    },success:ress=>{
                        console.log('信息更新成功',ress)
                    },fail:errr=>{
                        console.log('信息更新失败',errr)
                    }
                })
            },fail:err=>{
                console.log('信息查询失败',err)
            }
        })
        this.setData({
            result:this.data.result,
            wrongs:list
        })
    },
    jump(){
        wx.switchTab({
          url: '/pages/activity/activity',
        })
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
        if (wx.canIUse('hideHomeButton')) {
            wx.hideHomeButton()
        }
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
        this.setData({
            answerSelected:[]
        })
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