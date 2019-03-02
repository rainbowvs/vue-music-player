import axios from 'axios';
import TopTip from 'coms/TopTip';

// axios实例配置
const axiosInstance = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  // transformRequest transformResponse 默认JS对象与JSON互转
});

axiosInstance.defaults.retry = 3; // 请求超时次数上限
axiosInstance.defaults.retryDelay = 1000; // 重新请求延时

// 请求拦截
axiosInstance.interceptors.request.use(config => {
  return config;
}, error => {
  return Promise.reject(error);
});

// 返回拦截
axiosInstance.interceptors.response.use(response => {
  return response;
}, error => {
  // 404等问题可以在这里处理
  if (error && error.response) {
    switch (error.response.status) {
      case 404:
        TopTip('请求地址为空');
        break;
    }
    return Promise.reject(error);
  } else if (error.code === 'ECONNABORTED') {
    // 请求时间超过timeout初始值
    let config = error.config;
    config.__retryCount = config.__retryCount || 0; // 设置变量以跟踪重试次数
    if (config.__retryCount >= config.retry) {
      // 判断请求是否已经达到重试上限
      TopTip('请检查网络后重试');
      return Promise.reject(error); // Reject with the error
    }
    config.__retryCount += 1; // 叠加重试次数
    let backoff = new Promise(resolve => {
      // 处理重新请求回调
      // `请求超时，${config.retryDelay / 1000}秒后进行第${config.__retryCount}次请求重试`
      setTimeout(() => {
        resolve();
      }, config.retryDelay || 1);
    });
    return backoff.then(() => {
      // 重新请求
      return axiosInstance(config);
    });
  }
});

export default axiosInstance;
