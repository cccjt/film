import store from '@/store'

enum methodEnum {
  POST = 'POST',
  GET = 'GET'
}

// 统一请求方法
export default function fetch(uri: string, params?: AnyObject, method: methodEnum = methodEnum.POST): Promise<ResultInterface> {
  let showLoading = true
  if (params && params.notShowLoading) {
    showLoading = false
  }
  // if (showLoading) {
  //   uni.showLoading({
  //     mask: true,
  //     title: '加载中...'
  //   })
  // }

  if (!params) method = methodEnum.GET

  const header: any = {
    'content-type': 'application/x-www-form-urlencoded'
  }
  if (store.getters.getSecretkey !== '') {
    header.secret = store.getters.getSecretkey
  }

  return new Promise((resolve, reject) => {
    uni.request({
      url: process.env.VUE_APP_BASE_PHP_URL + uri,
      data: params,
      method: method,
      header,
      success: (res: AnyObject) => {
        // uni.hideLoading()
        resolve(res.data)
      },
      fail: err => {
        // uni.hideLoading()
        // uni.showToast({ title: '系统错误,请稍后再试!', icon: 'none', duration: 2000 })
        reject(err)
      }
    })
  })
}
