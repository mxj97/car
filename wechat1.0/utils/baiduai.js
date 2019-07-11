/**
 * 调用百度EasyDL、OCR示例代码
 * 只提供了一个EasyDL、OCR接口的封装。可以根据自己的需求封装即可
 */
let accessToken = '24.9c78ff73331def090908a677140deddf.2592000.1564756112.282335-16707507'//自己的accessToken 根据实际情况可以进行封装 自动获取token
let easydlUrl = 'https://aip.baidubce.com/rpc/2.0/ai_custom/v1/classification/handwritenum';//替换自己训练且已经发布的接口地址
let carUrl = 'https://aip.baidubce.com/rest/2.0/image-classify/v1/car';//汽车车型识别接口
//EasyDL接口 图片数据 返回结果条数 根据物体 分类 文本 请修改第二个参数哦
let easyDLRequest = (base64Img, topNum, callback) => {
  //拼接接口body参数
  let params = {
    top_num: topNum,
    image: base64Img
  }
  //发送接口请求
  wx.request({
    url: easydlUrl + '?access_token=' + accessToken,
    data: params,
    header: {
      'content-type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      callback.success(res.data)
    },
    fail: function (res) {
      if (callback.fail)
        callback.fail()
    }
  })
}
//OCR通用识别接口 图片base64 只是简单示例 别的参数如何封装建议自己学习一下JavaScript
let carRequest = (base64Img, topNum, baikenum, callback) => {
  //拼接接口body参数
  let params = {

    image: base64Img,
    top_num: topNum,
    baike_num: baikenum
  }
  //发送接口请求
  wx.request({
    url: carUrl + '?access_token=' + accessToken,
    data: params,
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    method: 'POST',
    success: function (res) {
      callback.success(res.data)
    },
    fail: function (res) {
      if (callback.fail)
        callback.fail()
    }
  })
}
//暴露出去的接口
module.exports = {
  easyDLRequest: easyDLRequest,
  carRequest: carRequest
}