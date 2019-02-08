//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '欢迎来到香香美食',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  onLoad: function () {
    // console.log('onLoad')
    // var that = this
    // //调用应用实例的方法获取全局数据
    // app.getUserInfo(function(userInfo){
    //   //更新数据
    //   that.setData({
    //     userInfo:userInfo
    //   })
    // })
    // this.getUserInfo()
  },
  onGotUserInfo(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
  },
  getCode:function(){
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
              console.log(res)
              // 获取到openid,微信用户的唯一标识
              console.log(res.data.openid)
            },
            fail: function(res) {},
            complete: function(res) {},
          })
        }
      },
      fail: function(res) {
        console.log("登录失败！")
      },
      complete: function(res) {},
    })
  },
  getUserInfo: function () {
    wx.login({
      success: function (res) {
        wx.getUserInfo({
          withCredentials: false,
          lang: '',
          success: function (res) {
            console.log(res)
          },
          fail: function (res) {
            console.log("get userInfo failed")
          },
          complete: function (res) { },
        })
      }
    })
  },
})
