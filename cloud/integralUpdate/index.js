const cloud = require('wx-server-sdk'); //引入sdk
cloud.init(); //初始化
const db = cloud.database(); 
exports.main = async (event, context) => {
    try{
        return await db.collection('user').where({
            openid:event.openid
        }).update({
            data:{
                integral:event.integral
            }
        })
    } catch(e) {
        console.error(e)
    }    
}