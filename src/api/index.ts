import fetch from '@/common/utils/fetch'

// APP初始化数据
export function initAppData(params: AnyObject = {}) {
  return fetch('api/init', params)
}
// 获取用户信息
export function getUserInfo(params: AnyObject = {}) {
  return fetch('user/getUserInfo', params)
}

// 充值
export function WzRecharge(params) {
  return fetch('WzRecharge/doPay', params)
}

// 点击支付
export function payReady(params) {
  return fetch('WzPay/payReady', params)
}

// help
export function getHelp(params: AnyObject = {}) {
  return fetch('api/getHelp', params)
}

// help
export function sendSuggest(params) {
  return fetch('api/sendSuggest', params)
}

// getOrderList
export function getOrderList(params) {
  return fetch('user/getOrderList', params)
}

// help
export function declareHelp(params) {
  return fetch('user/declareHelp', params)
}

// hideOrder
export function hideOrder(params) {
  return fetch('user/hideOrder', params)
}

// 发送验证码
export function sendCode(params) {
  return fetch('User/sendMessage', params)
}

// 获取发送验证码时间
export function getSendTime() {
  return fetch('User/getSendTime')
}

export function bindPhone(params) {
  return fetch('User/loginIn', params)
}

// 退出
export function loginOut() {
  return fetch('User/loginOut')
}

// Api/getRunStatus
export function getRunStatus(params) {
  return fetch('Api/getRunStatus', params)
}

// vipBuyReady
export function vipBuyReady(params) {
  return fetch('WzRecharge/vipBuyReady', params)
}

// getVipList
export function getVipList(params) {
  return fetch('User/getVipList', params)
}

// 获取积分兑换
export function getCouponList() {
  return fetch('Api/getCouponList')
}

// 兑换积分
export function redeemPoints(params) {
  return fetch('User/redeemPoints', params)
}

export function WxJspInit(params) {
  return fetch('Api/WxJspInit', params)
}

// getOrderList
export function getOrder(params) {
  return fetch('user/getOrder', params)
}
