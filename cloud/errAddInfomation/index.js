// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()

const db = cloud.database()
const _ = db.command

// 云函数入口函数
exports.main = async (event, context) => {
    const title=event.title;
    const description=event.description;
    const answer=event.answer;
    const userSelected=event.userSelected;
    const openid=event.openid

    db.collection('error').where({
        openid:openid
    }).update({
        data:{
            wrongs:_.push({title,description,answer,userSelected})
        }
    })
}