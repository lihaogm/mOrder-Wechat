//logs.js
var util = require('../../utils/util.js')
var sliderWidth = 190// 需要设置slider的宽度，用于计算中间位置
// 最大行数
var max_row_height = 5;
// 行高
var food_row_height = 50;
// 底部栏偏移量
var cart_offset = 90;


Page({
  data: {
    logs: [],
    tabs: ["今日菜单", "我的订单"],
    activeIndex: 0,
    sliderOffset: 0,
    sliderLeft: 0,
    sliderWidth: 0.5,
    // 右菜单
    menu_list: [],
    // 左菜单
    foodList: [],//展示菜品
    allFoodList: [],//所有获取到的菜品
    //我的订单列表
    orderList: [],
    // 购物车
    cartList: [],
    hasList: false,// 列表是否有数据
    totalPrice: 0,// 总价，初始为0
    totalNum: 0,  //总数，初始为0
    // 购物车动画
    animationData: {},
    animationMask: {},
    maskVisual: "hidden",
    maskFlag: true,
    // 左右两侧菜单的初始显示次序
    curNav: 0,

    //判断是否登录会员
    loginFlag: true,
    //判断是否已经发送验证码
    sendingF: false,
    // 倒计时时间
    second: 60,

  },
  onLoad: function (options) {
    var that = this
    // 获取购物车缓存数据
    var arr = wx.getStorageSync('cart') || [];
    // 左分类菜单
    var menu_list = this.data.menu_list;
    // 获取左侧分类菜单数据
    var categories = [
      {
        "id": 0,
        "name": "全部"
      },
      {
        "id": 9,
        "name": "活动品"
      },
      {
        "id": 1,
        "name": "汤·粥"
      },
      {
        "id": 2,
        "name": "热菜"
      },
      {
        "id": 5,
        "name": "面点"
      },
      {
        "id": 6,
        "name": "特色"
      },
      {
        "id": 7,
        "name": "小吃"
      },
      {
        "id": 8,
        "name": "水吧"
      }
    ]
    that.setData({
      menu_list: categories,
    })
    // 右菜品菜单
    var foodList = this.data.foodList;
    var allFoodList = this.data.allFoodList;
    // 购物车总量、总价
    var totalPrice = this.data.totalPrice
    var totalNum = this.data.totalNum
    // 获取右侧菜品列表数据
    var resFood = [
      {
        "id": 6,
        "name": "美地麻辣小龙虾",
        "thumb": "",
        "price": "98.00",
        "unit": "份",
        "catid": 6,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 7,
        "name": "水吧鸡尾酒",
        "thumb": "",
        "price": "39.00",
        "unit": "杯",
        "catid": 8,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 9,
        "name": "九塔香辣子鸡",
        "thumb": "",
        "price": "68.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 10,
        "name": "跳舞茄盒",
        "thumb": "",
        "price": "40.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 12,
        "name": "土匪猪肝",
        "thumb": "",
        "price": "40.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 13,
        "name": "小炒黄牛肉",
        "thumb": "",
        "price": "58.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 14,
        "name": "小酥肉",
        "thumb": "",
        "price": "19.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 15,
        "name": "橄榄油腊鲜有机花菜\t",
        "thumb": "",
        "price": "28.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 19,
        "name": "榴莲面包",
        "thumb": "",
        "price": "29.80",
        "unit": "份",
        "catid": 5,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 20,
        "name": "泡芙",
        "thumb": "",
        "price": "6.00",
        "unit": "斤",
        "catid": 5,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 21,
        "name": "手撕包菜",
        "thumb": "",
        "price": "19.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 22,
        "name": "糖醋里脊",
        "thumb": "",
        "price": "97.90",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 24,
        "name": "我是热菜区的new菜",
        "thumb": "",
        "price": "25.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 25,
        "name": "美地麻辣小龙虾",
        "thumb": "",
        "price": "125.00",
        "unit": "份",
        "catid": 6,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 26,
        "name": "美地甜点",
        "thumb": "",
        "price": "20.00",
        "unit": "15",
        "catid": 7,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 27,
        "name": "特色小龙虾",
        "thumb": "/uploads/20178/201708311002557FPpnEyE.jpg",
        "price": "89.90",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 28,
        "name": "雕黄醉蟹钳",
        "thumb": "/uploads/20178/20170831165625IyWlwdFM.jpg",
        "price": "48.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 29,
        "name": "雕黄醉蟹钳1",
        "thumb": "/uploads/20178/20170831165711bLN478bK.jpg",
        "price": "48.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 30,
        "name": "百合莲子红豆露",
        "thumb": "",
        "price": "32.00",
        "unit": "扎",
        "catid": 8,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 31,
        "name": "屈臣氏香草苏打水",
        "thumb": "",
        "price": "15.00",
        "unit": "瓶",
        "catid": 8,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 32,
        "name": "赫默父子夏瑟尼蒙哈榭干白",
        "thumb": "",
        "price": "1888.00",
        "unit": "瓶",
        "catid": 8,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 33,
        "name": "美地特殊热菜",
        "thumb": "",
        "price": "35.00",
        "unit": "20",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 34,
        "name": "醋溜白菜",
        "thumb": "",
        "price": "15.00",
        "unit": "12",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 35,
        "name": "东北乱炖",
        "thumb": "",
        "price": "38.00",
        "unit": "30",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 36,
        "name": "信用小炒",
        "thumb": "",
        "price": "28.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 37,
        "name": "清炒花菜",
        "thumb": "",
        "price": "23.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 38,
        "name": "炒苦瓜",
        "thumb": "",
        "price": "20.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 1,
        "name": "味增烤晴鱼",
        "thumb": "",
        "price": "158.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 2,
        "name": "铁板脆皮豆腐",
        "thumb": "",
        "price": "48.00",
        "unit": "份",
        "catid": 2,
        "sales": 0,
        "note": "",
        "quantity": 0
      },
      {
        "id": 3,
        "name": "石斛养生菌汤",
        "thumb": "",
        "price": "28.00",
        "unit": "份",
        "catid": 1,
        "sales": 0,
        "note": "",
        "quantity": 0
      }
    ]

    // 进入页面后判断购物车是否有数据，如果有，将菜单与购物车quantity数据统一
    if (arr.length > 0) {
      for (var i in arr) {
        for (var j in resFood) {
          if (resFood[j].id == arr[i].id) {
            resFood[j].quantity = arr[i].quantity;
          }
        }
      }
    }
    // that.setData({
    //   foodList: resFood,
    //   allFoodList: resFood,
    // })
    // 进入页面计算购物车总价、总数
    if (arr.length > 0) {
      for (var i in arr) {
        totalPrice += arr[i].price * arr[i].quantity;
        totalNum += Number(arr[i].quantity);
      }
    }
    // 赋值数据
    this.setData({
      hasList: true,
      cartList: arr,
      foodList: resFood,
      allFoodList: resFood,
      payFlag: this.data.payFlag,
      totalPrice: totalPrice.toFixed(2),
      totalNum: totalNum
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - res.windowWidth / 2) / 2,
          sliderOffset: res.windowWidth / that.data.tabs.length * that.data.activeIndex,
        });
      }
    });
  },
  // 点击切换tab
  tabClick: function (e) {
    this.setData({
      sliderOffset: e.currentTarget.offsetLeft,
      activeIndex: e.currentTarget.id
    });
  },
  // 点击切换右侧数据
  changeRightMenu: function (e) {
    var classify = e.target.dataset.id;// 获取点击项的id
    var foodList = this.data.foodList;
    var allFoodList = this.data.allFoodList;
    var newFoodList = [];
    if (classify == 0) {//选择了全部选项
      this.setData({
        curNav: classify,
        foodList: allFoodList
      })
    } else { //选择了其他选项
      for (var i in allFoodList) {
        if (allFoodList[i].catid == classify) {
          newFoodList.push(allFoodList[i])
        }
      }
      this.setData({
        // 右侧菜单当前显示第curNav项
        curNav: classify,
        foodList: newFoodList
      })
    }
  },
  // 购物车增加数量
  addCount: function (e) {
    var id = e.currentTarget.dataset.id;
    var arr = wx.getStorageSync('cart') || [];
    var f = false;
    for (var i in this.data.foodList) {// 遍历菜单找到被点击的菜品，数量加1
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity += 1;
        if (arr.length > 0) {
          for (var j in arr) {// 遍历购物车找到被点击的菜品，数量加1
            if (arr[j].id == id) {
              arr[j].quantity += 1;
              f = true;
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
              break;
            }
          }
          if (!f) {
            arr.push(this.data.foodList[i]);
          }
        } else {
          arr.push(this.data.foodList[i]);
        }
        try {
          wx.setStorageSync('cart', arr)
        } catch (e) {
          console.log(e)
        }
        break;
      }
    }

    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },
  // 定义根据id删除数组的方法
  removeByValue: function (array, val) {
    for (var i = 0; i < array.length; i++) {
      if (array[i].id == val) {
        array.splice(i, 1);
        break;
      }
    }
  },
  // 购物车减少数量
  minusCount: function (e) {
    var id = e.currentTarget.dataset.id;
    var arr = wx.getStorageSync('cart') || [];
    for (var i in this.data.foodList) {
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity -= 1;
        if (this.data.foodList[i].quantity <= 0) {
          this.data.foodList[i].quantity = 0;
        }
        if (arr.length > 0) {
          for (var j in arr) {
            if (arr[j].id == id) {
              arr[j].quantity -= 1;
              if (arr[j].quantity <= 0) {
                this.removeByValue(arr, id)
              }
              if (arr.length <= 0) {
                this.setData({
                  foodList: this.data.foodList,
                  cartList: [],
                  totalNum: 0,
                  totalPrice: 0,
                })
                this.cascadeDismiss()
              }
              try {
                wx.setStorageSync('cart', arr)
              } catch (e) {
                console.log(e)
              }
            }
          }
        }
      }
    }
    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice();
  },
  // 获取购物车总价、总数
  getTotalPrice: function () {
    var cartList = this.data.cartList;                  // 获取购物车列表
    var totalP = 0;
    var totalN = 0
    for (var i in cartList) {                           // 循环列表得到每个数据
      totalP += cartList[i].quantity * cartList[i].price;    // 所有价格加起来     
      totalN += cartList[i].quantity
    }
    this.setData({                                      // 最后赋值到data中渲染到页面
      cartList: cartList,
      totalNum: totalN,
      totalPrice: totalP.toFixed(2)
    });
  },
  // 清空购物车
  cleanList: function (e) {
    for (var i in this.data.foodList) {
      this.data.foodList[i].quantity = 0;
    }
    try {
      wx.setStorageSync('cart', "")
    } catch (e) {
      console.log(e)
    }
    this.setData({
      foodList: this.data.foodList,
      cartList: [],
      cartFlag: false,
      totalNum: 0,
      totalPrice: 0,
    })
    this.cascadeDismiss()
  },

  //删除购物车单项
  deleteOne: function (e) {
    var id = e.currentTarget.dataset.id;
    var index = e.currentTarget.dataset.index;
    var arr = wx.getStorageSync('cart')
    for (var i in this.data.foodList) {
      if (this.data.foodList[i].id == id) {
        this.data.foodList[i].quantity = 0;
      }
    }
    arr.splice(index, 1);
    if (arr.length <= 0) {
      this.setData({
        foodList: this.data.foodList,
        cartList: [],
        cartFlag: false,
        totalNum: 0,
        totalPrice: 0,
      })
      this.cascadeDismiss()
    }
    try {
      wx.setStorageSync('cart', arr)
    } catch (e) {
      console.log(e)
    }


    this.setData({
      cartList: arr,
      foodList: this.data.foodList
    })
    this.getTotalPrice()
  },
  //切换购物车开与关
  cascadeToggle: function () {
    var that = this;
    var arr = this.data.cartList
    if (arr.length > 0) {
      if (that.data.maskVisual == "hidden") {
        that.cascadePopup()
      } else {
        that.cascadeDismiss()
      }
    } else {
      that.cascadeDismiss()
    }

  },
  // 打开购物车方法
  cascadePopup: function () {
    var that = this;
    // 购物车打开动画
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
    // 遮罩渐变动画
    var animationMask = wx.createAnimation({
      duration: 200,
      timingFunction: 'linear',
    });
    that.animationMask = animationMask;
    animationMask.opacity(0.8).step();
    that.setData({
      animationMask: that.animationMask.export(),
      maskVisual: "show",
      maskFlag: false,
    });
  },
  // 关闭购物车方法
  cascadeDismiss: function () {
    var that = this
    // 购物车关闭动画
    that.animation.translate(0,285).step();
    that.setData({
      animationData: that.animation.export()
    });
    // 遮罩渐变动画
    that.animationMask.opacity(0).step();
    that.setData({
      animationMask: that.animationMask.export(),
    });
    // 隐藏遮罩层
    that.setData({
      maskVisual: "hidden",
      maskFlag: true
    });
  },
  // 跳转确认订单页面
  gotoOrder: function () {
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder'
    })
  },

  // 判断是否获取到会员信息
  // ifLogin: function () {
  //   // 获取登录状态码
  //   var loginCode = wx.getStorageSync('loginCode') || [];
  //   console.log(loginCode)
  //   var loginFlag = this.data.loginFlag;
  //   if (loginCode == 300) {
  //     loginFlag = false;
  //     this.setData({
  //       loginFlag: loginFlag
  //     })
  //   } else {
  //     loginFlag = true;
  //     this.setData({
  //       loginFlag: loginFlag
  //     })
  //   }

  // },
  // // 获取备填写的手机号码
  // getMobile: function (e) {
  //   var mobile = this.data.mobile;
  //   this.setData({
  //     mobile: e.detail.value
  //   })
  // },
  // //获取填入的验证码
  // getSmscode: function (e) {
  //   var smscode = this.data.smscode;
  //   this.setData({
  //     smscode: e.detail.value
  //   })
  // },
  // // 获取验证码倒计时
  // beginTimer: function () {
  //   var mobile = this.data.mobile
  //   if (mobile == '') {
  //     wx.showToast({
  //       title: '号码不能为空',
  //       duration: 2000
  //     })
  //   } else {
  //     wx.request({
  //       url: 'https://api.meidi.test.sszshow.com/wechatmeal/home/setmsg',
  //       method: "POST",
  //       data: {
  //         mobile: mobile
  //       },
  //       success: function (res) {
  //         console.log(res.data.code)
  //         if (res.data.code == 400) {
  //           that.setData({
  //             loginFlag: true,
  //           })
  //           wx.showModal({
  //             title: '提示',
  //             content: '您暂时不是我们的会员，请去前台或微信公众号办理',
  //             showCancel: false,
  //             success: function (res) {
  //               if (res.confirm) {
  //                 console.log('用户点击确定')
  //               } else if (res.cancel) {
  //                 console.log('用户点击取消')
  //               }
  //             }
  //           })
  //         } else {
  //           that.setData({
  //             loginFlag: false,
  //           })
  //         }
  //       }
  //     })
  //     this.setData({
  //       sendingF: true
  //     })
  //     var that = this
  //     var verifyTimer = setInterval(function () {
  //       var second = that.data.second - 1
  //       that.setData({
  //         second: second
  //       })
  //       if (second < 1) {
  //         clearInterval(verifyTimer)
  //         that.setData({
  //           second: 60,
  //           sendingF: false
  //         })
  //       }
  //     }, 1000)
  //   }

  // },
  // // 提交手机验证码
  // goSubmit: function (e) {
  //   var that = this;
  //   var loginFlag = this.data.loginFlag;
  //   var mobile = this.data.mobile;
  //   var smscode = this.data.smscode;
  //   var rd_session = wx.getStorageSync('rd_session') || [];
  //   var shop_id = wx.getStorageSync('shop_id') || [];
  //   var desk_id = wx.getStorageSync('desk_id') || [];
  //   // console.log(mobile)
  //   // console.log(smscode)
  //   // console.log(rd_session)
    
  //   wx.request({
  //     url: 'https://api.meidi.test.sszshow.com/wechatmeal/home/get_member',
  //     method: 'POST',
  //     data: {
  //       shop_id: shop_id,
  //       desk_id: desk_id,
  //       mobile: mobile,
  //       smscode: smscode,
  //       rd_session: rd_session
  //     },
  //     success: function (res) {
  //       that.setData({
  //         loginFlag: true,
  //       })
  //       if (res.data.code == 200) {
  //         try {
  //           wx.setStorageSync('loginCode', 200)
  //         } catch (e) { }
  //         wx.showToast({
  //           title: '登录成功',
  //           duration: 2000
  //         })

  //       } else {
  //         console.log("denglushibai")
  //       }
  //     }
  //   })
  // },
  GetQueryString:function (name){
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if(r!=null)return  unescape(r[2]); return null;
  }


})
