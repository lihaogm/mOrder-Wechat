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
    // console.log('confirmOrder:', arr)
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
    // 获取购物车信息
    var arr = wx.getStorageSync('cart') || [];
    // 获取所有订单
    var orderlist = wx.getStorageSync('orderlist') || [];
    // 测试用弹出店铺和桌台id/////////////////////////////////////////////

    var order = new Object();
    var key, val, total = '';
    // 顾客信息
    var openId=wx.getStorageSync('loginCode')
    var userInfo=wx.getStorageSync('userInfo').userInfo;
    console.log('userInfo: ',userInfo)
    var customerInfo={}
    // 用餐人数
    var diner_num = this.data.diner_num;
    var dinerNum;
    // 备注信息
    var remarks = this.data.remarks; 
    // 付款方式的id
    var payId = e.currentTarget.dataset.id;
    var rd_session = wx.getStorageSync('rd_session') || [];
    if (diner_num == 0) {
      that.setData({
        diner_num: 1
      })
    }
    // 用餐人数
    var peoples = this.data.diner_num

    // 给客户信息赋值
    // customerInfo["telphone"]='18260039708' // 手机号码
    // 微信号
    customerInfo["openId"]=openId
    // 昵称
    customerInfo["nickName"]=userInfo.nickName
    // 城市
    customerInfo["city"]=userInfo.city
    // 性别
    customerInfo["gender"]=userInfo.gender
    
    // 给订单赋值
    // order["order_id"] = new Date; 
    order["desk_id"] = "#5"; // 桌号
    order["remarks"] = remarks; // 备注信息
    order["peoples"] = peoples; // 用餐人数
    order["totalPrice"] = this.data.totalPrice; // 总价
    order["cartlist"] = arr; // 购物车菜品信息

    // test 输出本次order信息
    // console.log('confirmOrder.js submitOrder: 获取订单信息 ->',order)  
    // 将本次订单信息放入历史订单中
    orderlist.push(order);
    // 将对象变为字符串
    var orderk = JSON.stringify(order);
    // 将客户信息转为字符串
    var customerInfoStr=JSON.stringify(customerInfo)
    // test 输出orderk
    console.log('confirmOrder.js submitOrder: 获取orderk ->',orderk)
    console.log('confirmOrder.js submitOrder: 获取customerInfo ->',customerInfoStr)
    // -------------------------------------------------------------------------
    // 向后台发送订单数据
    wx.showLoading()
    wx.request({
      url: 'http://localhost:8080/mOrder/wxOrderAdd',
      // method: 'POST',
      // header:{'content-type':'application/json'},
      data: {
        orderInfo:orderk,
        customerInfo:customerInfoStr
      },
      success: function (res) {
        if (res.statusCode === 200) {
          // console.log(res)
          // 支付方式关闭动画
          that.animation.translate(0, 285).step();
          // console.log(orderlist)
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
        // wx.showToast({
        //   title: '系统错误'
        // })
        // 显示对话框
        wx.showModal({

          title: '支付失败',

          content: '网络连接失败',

          confirmText: '知道了',

          // cancelText: '次要操作',

          success: function (res) {

            if (res.confirm) {

              console.log('用户点击主操作')

            }
            // else if (res.cancel) {

            //   console.log('用户点击次要操作')

            // }

          }

        })
      },
      complete: function (res) {
        
      }
    })
    wx.hideLoading()

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