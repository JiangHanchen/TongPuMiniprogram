const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async(event, context) => {
  return await db.collection('user').add({
    data: {
        appid: event.appid ,
        openid:event.openid,
        userInfo: event.userInfo,
        integral:event.integral,
        signTime:event.signTime
    }
  })
}