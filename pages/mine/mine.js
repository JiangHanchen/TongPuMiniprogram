// pages/mine/mine.js
var app = getApp()
var x = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
  },

  login() {
    wx.getUserProfile({
      desc: '获取用户授权',
      success: (res) => {
        app.globalData.isLogIn = true
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: app.globalData.isLogIn,
        })

        x = res.userInfo

        console.log(app.globalData.isLogIn)
        console.log(this.data.userInfo)
        this.judge()
      },
      fail(res) {
        console.log('获取失败', res)
      }
    })
  },
  judge() {
    console.log(x)
    const db = wx.cloud.database()
    wx.cloud.callFunction({
      name: "cloud",
      success(res) {
        // 授权用户的openid
        let openId = res.result.openid
        // 判断openid是否存在于数据库
        app.globalData.openid = openId
        console.log('全局openid:', app.globalData.openid)
        db.collection('user').where({
          openid: openId
        }).get().then(ress => {
          // 判断返回的data长度是否为0，如果为0的话就证明数据库中没有存在该数据，然后进行添加操作
          if (ress.data.length == 0) {
            // 云函数添加
            console.log('用户不存在')
            wx.cloud.callFunction({
              name: "useradd", //该名字是云函数名字
              data: {
                appid: res.result.appid, //_openid 等参数是要回传给云函数的入参
                openid: openId,
                userInfo: x,
                integral: 0,
                signTime: 'null'
              },
              success: resss => {
                console.log('[userlistadd云函数]新增信息成功！！ ')
              },
              fail: err => {
                console.error('[userlistadd云函数]调用失败', err)
              }
            })
            wx.cloud.callFunction({
              name: "erroradd",
              data: {
                openid:openId,
                wrongs:[]
              },
              success: resss => {
                console.log('[userlistadd云函数]新增信息成功！！ ')
              },
              fail: err => {
                console.error('[userlistadd云函数]调用失败', err)
              }
            })
            // 用户已经存在数据库中，可以直接跳转到主界面
          } else {
            console.log("用户已经存在")
            console.log('存在用户信息', ress.data[0])
            app.globalData.score = ress.data[0].score
            app.globalData.signTime = ress.data[0].signTime
            console.log('存在用户的score', app.globalData.score)
            console.log('存在用户的signTime', app.globalData.signTime)
          }
        })
      },
      fail(res) {
        console.log("云函数login调用失败")
      }
    })



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      userInfo: {},
      hasUserInfo: false
    })
    console.log('页面刚加载的初始化', this.data.hasUserInfo)
    console.log('页面刚加载的初始化', this.data.userInfo)
  },

  
  jumpToAbout() {
    wx.navigateTo({
      url: '/packageC/pages/about/about',
    })
  },
  jumpToIntegral() {
    if (app.globalData.isLogIn) {
      wx.navigateTo({
        url: '/packageC/pages/integral/integral',
      })
    }else{
      wx.showModal({
        title: '未登录',
        content: '请登录后查看',
        success: function (res) {
          if (res.confirm) {
            console.log('确定')
          } else {
            console.log('取消')
          }
        }
      })
    }
  },
  jumpToWrongs() {
    if (app.globalData.isLogIn) {
      wx.navigateTo({
        url: '/packageC/pages/wrongs/wrongs',
      })
    }else{
      wx.showModal({
        title: '未登录',
        content: '请登录后查看',
        success: function (res) {
          if (res.confirm) {
            console.log('确定')
          } else {
            console.log('取消')
          }
        }
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