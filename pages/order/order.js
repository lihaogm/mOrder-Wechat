
Page({
  data: {
    motto: '欢迎来到香香美食',
    userInfo: {},
    orderlist:{},
    listLength:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../home/home'
    })
  },
  
  onLoad: function () {
    // 获取购物车缓存数据
    var arr = wx.getStorageSync('orderlist') || [];
    
    this.setData({
      orderlist: arr,
      listLength:arr.length
    })
    console.log(this.data.orderlist);
      
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    // 获取购物车缓存数据
    var arr = wx.getStorageSync('orderlist') || [];

    this.setData({
      orderlist: arr,
      listLength: arr.length
    })
    console.log(this.data.orderlist);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },
})
