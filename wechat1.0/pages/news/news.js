import drawer from '../../pages/drawer/drawer.js'
import xapi from "../../utils/xapi"
import util from "../../utils/util"
import { wxapi } from "../../plugins/wxapi";
import { share } from '../../plugins/share';


var app = getApp();
var util1 = require('../../utils/lunfantu.js')
Page({
  data: {

    slider: [],

    swiperCurrent: 0,

    descriptions:'点击车辆查看更多资讯',

    brandData: {},
    toView: '',
    winHeight: '',
    winWidth: '',
    latitude: 0,
    longitude: 0,
    pixelRatio: '',
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

  },

  tapName: function (event) { },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    //网络访问，获取轮播图的图片
    util1.getRecommend(function (data) {
      that.setData({
        slider: data.data.slider
      })
    });

    var res = wx.getSystemInfoSync();
    that.setData({
      winHeight: res.windowHeight,
      winWidth: res.windowWidth,
      pixelRatio: res.pixelRatio,
      scrollYFlag: true,
      city: that.data.city,
    });

    //抽屉组件
    that.dw = new drawer(that);
    that.ul = new util(that);
    that.wxapi = new wxapi(that);

    //分享
    that.shareObj = new share(that);
    // 设置分享内容
    that.shareObj.setShare('车型天下，带您一起了解新能源汽车、用好新能源车、玩好新能源汽车！', '/pages/news/news');

    // 获取热门车型列表
    that.wxapi.getURLData('hotCar', [], 'cb_hotcar');

    // 设置加载状态(2秒过期)
    wx.showLoading({
      title: '加载中',
    });
    setTimeout(function () { wx.hideLoading(); }, 1000);
  },

  //轮播图的切换事件
  swiperChange: function (e) {
    //只要把切换后当前的index传给<swiper>组件的current属性即可
    this.setData({
      swiperCurrent: e.detail.current
    })
  },

  //点击指示点切换
  chuangEvent: function (e) {
    this.setData({
      swiperCurrent: e.currentTarget.id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    // 登录授权
    that.wxapi.wxlogin();
  },


  //热门车型数据回调
  cb_hotcar: function (res, opt) {
    var that = this;

    // 隐藏加载状态
    wx.hideLoading();

    if (res.code == 0) {
      that.setData({
        brandData: res.data
      });
    } else {
      console.log('hot car api error:' + res.message);
    }
  },
  mo: function (event) {
    console.log(event);
    event.preventDefault;
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

  /**
   * 抽屉数据回调
   */
  cb_serie: function (res) {
    this.setData({
      drawerSeriesData: res.list || res.data.list,
      showDrawerFlag: true,
    });
  },

  //进入车型详细界面
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
});
