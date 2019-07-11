var app = getApp();
import { login } from '../../plugins/login';
import { wxapi } from '../../plugins/wxapi';
import { share } from '../../plugins/share';

import drawer from '../../pages/drawer/drawer.js'
import xapi from "../../utils/xapi"
import util from "../../utils/util"


Page({
  data: {
    brandData: {},
    toView: '',
    winHeight: '',
    winWidth: '',
    latitude: 0,
    longitude: 0,
    pixelRatio: '',
    brandList: [],
    bannerTab: 1,
    hidden: true,
    fromcache: false,
    city: getApp().city,

    cityIdData: '',
    cityIdName: '',
    // 字母表显示状态
    wordline: false,


    shareclientYstart: '',
    shareclientYmove: '',

    //背景内容滚动  false不可滚动 true可滚动
    scrollBoolean: true,
    showmask: false,

    winHeight: '',
    winWidth: '',
    winWidth: 0,
    winHeight: 0,

    verifyCodeTime: '验证',
    buttonDisable: '',
    hidden: true,
    phoneBorder: false,
    codeBorder: false,
    error: false,
    accredit: '',
    // 当前登录信息
    userInfo: {},
    //分享
    shareclientYstart: '',
    shareclientYmove: '',

  },
  tapName: function (event) {
    //console.log(event)
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;

    var res = wx.getSystemInfoSync();


    that.setData({
      winHeight: res.windowHeight,
      winWidth: res.windowWidth,
      pixelRatio: res.pixelRatio,
      scrollYFlag: true,
      city: that.data.city,
    });



    that.login = new login(that);
    that.wxapi = new wxapi(that);


    //抽屉组件
    that.dw = new drawer(that);
    that.ul = new util(that);
    that.wxapi = new wxapi(that);



    //初始化分享
    that.shareObj = new share(that);

    // 设置分享内容
    that.shareObj.setShare('车型天下，带您一起了解新能源汽车、用好新能源车、玩好新能源汽车！', '/pages/personal/personal');


    // 设置加载状态(2秒过期)
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () { wx.hideLoading(); }, 1000);

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 获取登录信息
    var userInfo = that.wxapi.getUserInfo();

    //品牌列表
    that.wxapi.getURLData('brandList', [], 'cb_brandlist');

    // 登录授权
    that.wxapi.wxlogin();


    // 重新授权
    if (!userInfo) {
      // that.wxapi.reLogin('setPageVars');
    } else {
      that.setPageVars(userInfo);

    }

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          that.data.accredit = res.authSetting['scope.userInfo'];

          // 获取登录授权
          that.wxapi.wxlogin();

          console.log(that.data.accredit);
          that.setData({
            accredit: that.data.accredit
          })

        } else {
          that.data.accredit = res.authSetting['scope.userInfo'];
          console.log(that.data.accredit);
          that.setData({
            accredit: that.data.accredit
          })
        }

      }
    })

  },

  mo: function (event) {
    console.log(event);
    event.preventDefault;
  },
  // 品牌列表
  cb_brandlist: function (res, opt) {
    var that = this;
    var myList = res.data;
    that.data.brandList = that.reCombine(myList);
    that.setData({//逻辑层到视图层
      // brandData: that.data.brandData,
      brandList: that.data.brandList,
      num: 1 + parseInt(Math.random() * 5)
    });

  },

  //添加车型到车库
  reCombine: function (arr) {
    var res = [], obj = {}, index = 0;
    arr.forEach(function (item) {
      if (obj.hasOwnProperty(item.letter)) {
        res[obj[item.letter]].items.push(item);
      }
      else {
        obj[item.letter] = index++;//记录索引 0 1 2
        res.push(
          {
            flag: item.letter,
            items: [item]
          }
        );
      }
    });
    return res;
  },

  //字母点击事件
  clickLetter: function (event) {
    var letter = event.target.dataset.letter;
    var that = this;

    if (that.data.currentLetter === event.target.dataset.current) {
      return false;
    }
    else {
      that.setData({
        currentLetter: event.target.dataset.current
      })
    }
    that.setData({
      toView: letter
    })
  },

  //滑屏
  scroll: function (e) {
    var that = this;
    var scrollTop = e.detail.scrollTop;

    if (e.detail.deltaY < 0) {
      //向上滑动
      console.log("向上")
      that.shareObj.showShare();

    } else {
      //向下滑动
      console.log("向下")
      that.shareObj.hideShare();
    }

    that.setData({
      scrollTop: scrollTop
    })

  },

  // 页面停止，静止3秒
  handletouchend: function () {
    var that = this;
    that.shareObj.handletouchend();
  },

  backdraw: function (res) {

    // 设置模板数据
    this.setData({
      drawerSeriesData: res.list || res.data.list,
    });
  },

  /**
   * 显示抽屉
   */
  showDrawer: function (e) {
    var that = this;

    var ppid = e.currentTarget.dataset.id;
    // 2. 请求数据，同时将页面绘制方法作为参数
    var data = { 'ppid': e.currentTarget.dataset.id };
    that.wxapi.serieByBrandId(data.ppid, 'cb_serie');


    that.dw.requestdata({
      "pbid": ppid,

    }, !1);


  },

  //回调函数
  cb_serie: function (res) {

    this.setData({
      drawerSeriesData: res.list || res.data.list,
      showDrawerFlag: true,
    });
  },

  /**
   * 选择车系
   */
  gotoSeries: function (e) {

    var that = this;

    setTimeout(function () {
      that.hideDrawer();
    }, 1000)


    var data = {
      pinyin: e.currentTarget.dataset.pinyin,
      cityId: that.data.cityIdData,
      cityIdName: that.data.cityIdName
    }
    //跳转到新页面，可返回
    wx.navigateTo({
      url: '../details/details?pinyin=' + data.pinyin + '&cityId=' + data.cityId + '&cityIdName=' + data.cityIdName
    })
  },



  /**
   * 点击用户头像再次授权
   * 
   */
  redelegation: function (e) {
    var that = this;
    that.wxapi.wxlogin('setPageVars');
  },

  // setTimeout(test, 1000);
  onShow: function () {
    var that = this;
    setTimeout(function () {

      console.log('onshow-------------------------------------------' + that.data.accredit);
      that.setData({
        accredit: that.data.accredit
      })

    }, 50);


  },

  // 统一设置模板变量
  setPageVars: function (res) {
    var that = this;
    console.log('setPageVar function data:');
    if (res) {
      // 设置全局变量用户信息
      that.data.userInfo = res;

      that.setData({
        userInfo: res,
        has_mobile: res.has_mobile
      });
    }

  },

  handletouchstart: function (event) {
    var that = this;
    that.data.shareclientYstart = event.touches[0].clientY;

  },
  // 触屏滑动
  handletouchmove: function (event) {
    var that = this;

    that.data.shareclientYmove = event.touches[0].clientY;


    if (that.data.shareclientYstart > that.data.shareclientYmove) {
      //向上滑动
      console.log("向上")
      that.shareObj.showShare();

    } else {
      //向下滑动
      console.log("向下")
      that.shareObj.hideShare();
    }
  },

  // 页面停止，静止3秒
  handletouchend: function () {
    var that = this;
    that.shareObj.handletouchend();
  },

  //分享
  onShareAppMessage: function (options) {
    var that = this;
    if (options.from === 'button') {
      console.log('按钮转发');
    } else {
      console.log('右上角转发');
    }
    return that.shareObj.getShare();
  },

  /**
   * 车型对比
   */
  carContrast: function (e) {
    var that = this;
    //跳转到新页面，可返回
    wx.navigateTo({
      url: '../contrast/contrast'
    })
  },




});