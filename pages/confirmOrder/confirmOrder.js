Page({
  //页面的初始数据
  data: {
    confirmOrder: [],
    // 输入框中的用餐人数
    diner_num: 0,
    // 用餐人数输入框获取焦点
    diner_numF: false,
    // 备注信息
    remarks: "",
    //支付方式列表
    payWayList: [],
    // 购物车数据
    cartList: {},
    totalPrice: 0,
    totalNum: 0,
    // 遮罩
    maskFlag: true,
    orderlist: []
  },
  // 生命周期函数--监听页面加载
  onLoad: function (Options) {
    var that = this;
    var shop_id = wx.getStorageSync('shop_id') || [];
    var desk_id = wx.getStorageSync('desk_id') || [];

    // wx.showToast({
    //   title: 'shop_id：' + shop_id + 'desk_id：' + desk_id,
    //   icon: 'success',
    //   duration: 5000
    // })

    var arr = wx.getStorageSync('cart') || [];
    // 购物车信息
    console.log('confirmOrder:', arr)
    for (var i in arr) {
      this.data.totalPrice += arr[i].quantity * arr[i].fshop_price;
      this.data.totalNum += arr[i].quantity
    }
    this.setData({
      cartList: arr,
      totalPrice: this.data.totalPrice.toFixed(2),
      totalNum: this.data.totalNum
    })

  },
  // 点击数字，输入框出现对应数字
  getDinnerNUM: function (e) {
    var dinnerNum = e.currentTarget.dataset.num;
    var diner_num = this.data.diner_num;
    // 点击“输”，获取焦点，
    if (dinnerNum == 0) {
      this.setData({
        diner_numF: true,
      })
      this.getDinerNum();
    } else {
      this.setData({
        diner_num: dinnerNum
      });
    }
  },
  //打开支付方式弹窗
  choosePayWay: function () {
    var payWayList = this.data.payWayList
    var that = this;
    var rd_session = wx.getStorageSync('rd_session') || [];
    // 调取支付方式接口    
    var payWay = [{
        "package": "支付宝支付",
        "money": "555"
      },
      {
        "package": "微信支付",
        "money": "555"
      }

    ]
    that.setData({
      payWayList: payWay
    });



    // 支付方式打开动画
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease-in-out',
      delay: 0
    });
    that.animation = animation;
    animation.translate(0, -285).step();
    that.setData({
      animationData: that.animation.export(),
    });
    that.setData({
      maskFlag: false,
    });
  },
  // 支付方式关闭方法
  closePayWay: function () {
    var that = this
    // 支付方式关闭动画
    that.animation.translate(0, 285).step();
    that.setData({
      animationData: that.animation.export()
    });
    that.setData({
      maskFlag: true
    });
  },
  // 获取输入的用餐人数
  getDinerNum: function (e) {
    var diner_num = this.data.diner_num;
    this.setData({
      diner_num: diner_num
    })
  },
  // 获取备注信息
  getRemark: function (e) {
    var remarks = this.data.remarks;
    this.setData({
      remarks: e.detail.value
    })
  },
  //提交订单
  submitOrder: function (e) {
    var that = this;
    var shop_id = wx.getStorageSync('shop_id') || [];
    var desk_id = wx.getStorageSync('desk_id') || [];
    var arr = wx.getStorageSync('cart') || [];
    var orderlist = wx.getStorageSync('orderlist') || [];
    //测试用弹出店铺和桌台id/////////////////////////////////////////////

    var order = new Object();
    var key, val, total = '';

    var diner_num = this.data.diner_num; //用餐人数
    var dinerNum;
    var remarks = this.data.remarks; //备注信息
    var payId = e.currentTarget.dataset.id;
    var rd_session = wx.getStorageSync('rd_session') || [];
    if (diner_num == 0) {
      that.setData({
        diner_num: 1
      })
    }
    var peoples = this.data.diner_num
    order["orderId"]="12345678"
    order["userName"] = "lihaogn"
    order["orderTime"] = new Date;
    order["orderContentList"] = arr;
    order["orderDeskId"] = "#5";
    order["orderRemarks"] = remarks;
    order["orderPeopleNum"] = peoples;
    order["orderTotalPrice"] = this.data.totalPrice;
    orderlist.push(order);
    var orderk = JSON.stringify(orderlist);
    // 所有order信息
    console.log(order)

    // 向后台发送订单数据
    wx.showLoading()
    wx.request({
      url: 'http://localhost:8080/mOrder/wxOrderAdd',
      method: 'get',
      data: {
        orderId:order.orderId,
        userName:order.userName,
        orderTime:order.orderTime,
        orderDeskId:order.orderDeskId,
        orderRemarks:order.orderRemarks,
        orderPeopleNum:order.orderPeopleNum,
        orderTotalPrice:order.orderTotalPrice
      },
      success: function (res) {
        if (res.statusCode === 200) {
          // console.log(res)
          // 支付方式关闭动画
          that.animation.translate(0, 285).step();
          console.log(orderlist)
          wx.setStorageSync('orderlist', orderlist)
          that.setData({
            animationData: that.animation.export()
          });
          that.setData({
            maskFlag: true
          });
          wx.showToast({
            title: '下单成功！',
          })
        } else if (rescode == 400) {
          // 支付方式关闭动画
          that.animation.translate(0, 285).step();
          that.setData({
            animationData: that.animation.export()
          });
          that.setData({
            maskFlag: true
          });
          wx.showToast({
            title: res.data.message,
          })
        }
      },
      fail: function (res) {
        wx.showToast({
          title: '系统错误'
        })
      },
      complete: function (res) {
        wx.hideLoading()
      }
    })

    // var rescode = 200
    // if (rescode == 200) {
    //   // 支付方式关闭动画
    //   that.animation.translate(0, 285).step();
    //   console.log(orderlist)
    //   wx.setStorageSync('orderlist', orderlist)
    //   that.setData({
    //     animationData: that.animation.export()
    //   });
    //   that.setData({
    //     maskFlag: true
    //   });
    //   wx.showToast({
    //     title: '下单成功！',
    //   })
    // } else if (rescode == 400) {
    //   // 支付方式关闭动画
    //   that.animation.translate(0, 285).step();
    //   that.setData({
    //     animationData: that.animation.export()
    //   });
    //   that.setData({
    //     maskFlag: true
    //   });
    //   wx.showToast({
    //     title: res.data.message,
    //   })
    // }


  },


})