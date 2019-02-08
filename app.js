//app.js
App({
  onLaunch: function() {
    // this.isLogin()
    this.getUserInfo()
  },
  // 判断登录是否过期
  // isLogin:function(){
  //   // wx.checkSession({
  //   //   success: function () {
  //   //     //session 未过期，并且在本生命周期一直有效
  //   //     console.log(0)
  //   //   },
  //     // fail: function () { //登录态过期
  //       wx.login({//重新登录
  //         success: function (res) {
  //           // console.log(res.code)
  //           if (res.code) {
  //             wx.request({
  //               url: "https://api.meidi.test.sszshow.com/wechatmeal/home/get_member",
  //               data: {
  //                 code:res.code,
  //                 shop_id:1,
  //                 desk_id:1
  //               },
  //               method: 'GET',
  //               success: function (res) {
  //                 var code = res.data.code
  //                 var rd_session = res.data.rd_session
  //                 console.log(code)
  //                 console.log(rd_session)
  //                 try {
  //                   wx.setStorageSync('rd_session', rd_session)
  //                 } catch (e) {}
  //                 try {
  //                   wx.setStorageSync('loginCode', code)
  //                 } catch (e) {}
  //               },
  //               fail: function (res) {

  //               }
  //             })
  //           } else {
  //             console.log('获取用户登录态失败！' + res.errMsg)
  //           }
  //         }
  //       }); 


  //   //   }
  //   // })
  // },
  // getUserInfo: function(cb) {
  //   var that = this
  //   if (this.globalData.userInfo) {
  //     typeof cb == "function" && cb(this.globalData.userInfo)
  //   } else {
  //     //调用登录接口
  //     wx.getUserInfo({
  //       withCredentials: false,
  //       success: function(res) {
  //         console.log(res);
  //         that.globalData.userInfo = res.userInfo
  //         typeof cb == "function" && cb(that.globalData.userInfo)
  //       }
  //     })
  //   }
  // },

  getUserInfo:function(){
    wx.login({
      success:function(res){
        wx.getUserInfo({
          withCredentials: false,
          lang: '',
          success: function (res) { 
            console.log(res)
          },
          fail: function (res) { 
            console.log("get userInfo failed")},
          complete: function (res) { },
        })
      }
    })
  },

  globalData: {
    userInfo: null
  },

})
