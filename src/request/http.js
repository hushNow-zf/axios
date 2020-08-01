import axios from 'axios';

const service = axios.create({
  baseURL: process.env.NODE_ENV === 'production' ? '/' : '/api', // 请求地址前缀，自动加在url前面，不同环境切换不同的baseURL
  timeout: 2000, // 请求接口超时的设定时间
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  // 跨域请求时是否需要使用凭证
  withCredentials: true,
  validateStatus: () => true,
  // 在向服务器发送请求前，先序列化数据
  transformRequest: [function (data) {
    data = JSON.stringify(data);
    return data;
  }],
  // 在传递给then/catch前，修改响应数据
  transformResponse: [function (res) {
    if (typeof res === 'string' && res.startsWith('{')) {
      res = JSON.parse(res);
    }
    return res;
  }],
});

service.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.common.authorization = token
  }
  return config
}, (err) => {
  err.data = {};
  err.data.message = '服务器异常';
  return Promise.resolve(err);
});

const showStatus = (status) => {
  let message;
  switch (status) {
    case 400:
      message = '请求错误（404）';
      break;
    case 401:
      message = '未授权，请重新登录';
      break;
    case 403:
      message = '拒绝访问';
      break;
    case 404:
      message = '请求出错（404）';
      break;
    case 408:
      message = '请求超时';
      break;
    case 500:
      message = '服务器错误';
      break;
    case 501:
      message = '服务器未实现';
      break;
    case 502:
      message = '网络错误（502）';
      break;
    case 503:
      message = '服务不可用（503）';
      break;
    case 504:
      message = '网络超时（504）';
      break;
    case 505:
      message = 'http版本不受支持';
      break;
    default:
      message = `链接出错${status}`;
  }
  return message;
};

service.interceptors.response.use((responce) => {
  const { status } = responce;
  let message;
  if (status < 200 || status >= 300) {
    message = showStatus(status);
    if (typeof responce.data === 'string') {
      responce.data = { message };
    } else {
      responce.data.message = message;
    }
  }
  return responce
}, (err) => {
  err.data = {}
  err.data.message = '请求超时或者服务器异常，请联系管理员';
  return Promise.resolve(err)
});

service.$get = (url, params) => {
  return service.get(url, { params })
}

service.$post = (url, params) => {
  return service.post(url, { params })
}

export default service;
