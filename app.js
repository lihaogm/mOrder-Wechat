//app.js
App({
  onLaunch: function() {
    this.isLogin()
    this.getUserInfo()
  },
  // 判断登录是否过期
  isLogin:function(){
    wx.checkSession({
      success: function () {
        //session 未过期，并且在本生命周期一直有效
        console.log("已登录")
      },
      fail: function () { //登录态过期
        wx.login({
          success: function(res) {
            if(res.code){
              wx.request({
                url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx8e7e71c7e20f769e&secret=7c8fc468943331cc50052d6368eaffd8&js_code='+res.code+'&grant_type=authorization_code',
                data: '',
                header: {},
                method: 'GET',
                dataType: 'json',
                responseType: 'text',
                success: function(res) {
                  // console.log(res)
                  // 获取到openid,微信用户的唯一标识
                  console.log(res.data.openid)
                  console.log(res.data.session_key)
                  var code = res.data.openid
                  var rd_session = res.data.session_key
                  // 将openID和session_key存入缓存
                  try {
                    wx.setStorageSync('rd_session', rd_session)
                  } catch (e) { }
                  try {
                    wx.setStorageSync('loginCode', code)
                  } catch (e) { }
                },
                fail: function(res) {},
                complete: function(res) {},
              })
            }else{
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          },
          fail: function(res) {
            console.log("登录失败！")
          },
          complete: function(res) {},
        }) 
      }
    })
  },

  getUserInfo:function(){
    wx.login({
      success:function(res){
        wx.getUserInfo({
          withCredentials: false,
          lang: '',
          success: function (res) { 
            // 获取到用户基本信息
            console.log(res)
            // 将基本信息放入缓存中
            try {
              wx.setStorageSync('userInfo', res)
            } catch (e) { }
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
