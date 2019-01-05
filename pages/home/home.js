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
    // 菜品信息
    food_info_key: [],
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
  // 页面加载
  onLoad: function (options) {

    var that = this

    wx.showLoading({
      title: '正在加载...',
    })

    // 获取服务器数据
    wx.request({
      url: 'http://localhost:8080/mOrder/wxFoodList',
      method: 'get',
      data: {
        id: 1
      },
      success: function (res) {
        if (res.statusCode === 200) {
          // console.log(res.data["foodList"]) // 服务器回包内容

          var food_info_key = that.data.food_info_key
          // 设置页面数据
          that.setData({
            food_info_key: res.data
          })

          // 获取购物车缓存数据
          var arr = wx.getStorageSync('cart') || [];
          // 左分类菜单
          var menu_list = that.data.menu_list;
          // 获取左侧分类菜单数据
          var categories = res.data["foodCategoryList"]
          that.setData({
            menu_list: categories,
          })

          // 右菜品菜单
          var foodList = that.data.foodList;
          var allFoodList = that.data.allFoodList;
          // 购物车总量、总价
          var totalPrice = that.data.totalPrice
          var totalNum = that.data.totalNum
          // 获取右侧菜品列表数据
          var resFood = res.data["foodList"]
          // 初始化数量
          for (var i in resFood) {
            resFood[i].quantity = 0
          }
          console.log(resFood)

          // 进入页面后判断购物车是否有数据，如果有，将菜单与购物车quantity数据统一
          if (arr.length > 0) {
            for (var i in arr) {
              for (var j in resFood) {
                if (resFood[j].pk_fid == arr[i].pk_fid) {
                  resFood[j].quantity = arr[i].quantity;
                }
              }
            }
          }

          // 进入页面计算购物车总价、总数
          if (arr.length > 0) {
            for (var i in arr) {
              totalPrice += arr[i].fshop_price * arr[i].quantity;
              totalNum += Number(arr[i].quantity);
            }
          }
          // 赋值数据
          that.setData({
            hasList: true,
            cartList: arr,
            foodList: resFood,
            allFoodList: resFood,
            // payFlag: that.data.payFlag,
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

          // 写入数据到缓存
          wx.setStorage({
            key: 'food_key',
            data: res.data,
            success: function () {
              console.log('写入value成功')
            },
            fail: function () {
              console.log('写入value发生错误')
            }
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
  },
  // ------------
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
        if (allFoodList[i].fcwc_id == classify) {
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
    // 获取菜品的id
    var id = e.currentTarget.dataset.id;
    // 获取购物车缓存数据，加入数组中
    var arr = wx.getStorageSync('cart') || [];
    var f = false;
    for (var i in this.data.foodList) {// 遍历菜单找到被点击的菜品，数量加1
      if (this.data.foodList[i].pk_fid == id) {
        this.data.foodList[i].quantity += 1; // 菜品所选数量加1
        if (arr.length > 0) { // 购物车中原来有数据
          for (var j in arr) {// 遍历购物车找到被点击的菜品，数量加1
            if (arr[j].pk_fid == id) {
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
          if (!f) { // 如果购物车中没有选中的商品，则添加一个
            arr.push(this.data.foodList[i]);
          }
        } else { // 购物车原来没有数据，则添加选中的商品
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
    // 设置数据，给购物车列表赋值，给菜品列表重新赋值
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
      if (this.data.foodList[i].pk_fid == id) {
        this.data.foodList[i].quantity -= 1;
        if (this.data.foodList[i].quantity <= 0) {
          this.data.foodList[i].quantity = 0;
        }
        if (arr.length > 0) {
          for (var j in arr) {
            if (arr[j].pk_fid == id) {
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
      totalP += cartList[i].quantity * cartList[i].fshop_price;    // 所有价格加起来     
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
      if (this.data.foodList[i].pk_fid == id) {
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
    that.animation.translate(0, 285).step();
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
  GetQueryString: function (name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  }


})
