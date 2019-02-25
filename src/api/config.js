// 请求公共参数
export const commonParams = {
  g_tk: 5381,
  inCharset: 'utf-8',
  outCharset: 'utf-8',
  notice: 0,
  format: 'jsonp'
};

// jsonp请求配置
export const options = {
  param: 'jsonpCallback'
};

// 请求状态
export const REQ_STATE = {
  OK: 0
};

// 请求环境
export const IS_DEV = process.env.NODE_ENV === 'development';
