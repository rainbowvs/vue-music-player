# vue-music-player
music player of vue

基于Vue.js构建音乐播放器-webApp

## 体验
> 真机请扫码预览

![真机扫我预览](http://rainbowvs.com/imgs/vue-music-player.png)
- [PC请用Chrome手机模拟器点我预览](http://120.79.84.141/music)

## 功能
> 以下功能均基于 **QQ Music** API（分析接口）实现

- [x] 首页
  - [x] Banner轮播
  - [x] 热门歌单
- [x] 歌手页
  - [x] 歌手列表
  - [x] 仿通信录式交互
- [x] 排行榜页
  - [x] 歌单排行榜
- [x] 搜索页
  - [x] 歌手、歌曲搜索
  - [x] 热门搜索关键字
  - [x] 搜索历史缓存
- [x] 用户页
  - [x] 搜索历史缓存
  - [x] 收藏历史缓存
- [x] 歌曲播放器
  - [x] 播放交互（切歌、播放进度单击、拖拽、播放模式切换）
  - [x] 对应歌词
  - [x] 歌曲收藏
  - [x] 播放列表

## 计划
> 功能已基本实现，后续维护如下

* 优化触摸反馈（锚伪类、`ripple`）
* BUG修复
* 优化（边界、测试）
* 采用`history`模式路由（`Nginx`配置）、重写`Node Server`（等旧服务器到期数据一起迁移后再处理）
* 引入UI框架重构
* `Vuejs`版本更新重构

## 总结
> 中型项目

* 借鉴`create-react-app`、`vue-cli`，自搭建`Webpack`、实现工程化开发
  * 开发调试热更新
  * 接口代理 + `jsonp` 解决跨域请求
* 组件化、模块化开发
  * 基于`better-scroll`封装 `Carousel轮播`、`Sroll滚动`组件
  * 功能组件封装（`SearchList`搜索列表、`SongList`歌曲列表、`ProgressBar`播放进度条...）
  * 通用组件封装（`TopTip`、`Loading`、`Confirm`）
  * 通用工具方法封装（`serialize`序列化、`pad`前补零、`getRandomInt`获取区间内随机整数、`debounce`防抖、`shuffle`洗牌）
  * 对象类封装（`Song`、`Singer`）
  * axios封装（配置实例，请求重试）
* 引入`Vuex`管理歌曲数据（播放状态、当前播放歌曲、播放列表、播放模式、歌曲收藏等等），根据功能需求封装`action`，跨组件共享状态
* 基于原生`touch`事件实现仿通讯录式交互、播放器进度交互、播放页歌词Tab切换（DOM操作较多）
* 优化
  * 尽可能减少`DOM`嵌套
  * 对`DOM`操作做缓存（某些功能需要`DOM`操作，如歌手页的通讯录交互、播放页动画）
  * 引入`vue-lazyload`实现图片懒加载，1px gif占位
  * `audio` 通过`playing`事件做边界处理，防止音频播放和切换抛异常
  * `localStorage`在`safari隐私模式`下的API操作会报错，考虑`try catch`捕获后可弹出提示在正常模式下使用
  * 搜索功能利用`debounce`做限制，减少不必要的请求
  * 通过`Vuejs`的`mixins`复用组件功能、事件、生命周期，解决迷你播放器遮挡列表问题
  * 引入矢量字体图标`iconfont`解决高清屏小图标模糊锯齿问题
  * 使用预处理器`SCSS`编写，封装`mixin`（`background背景图`、`flex弹性布局`、`ellipsis单行文本省略`、`border边框`）高效复用，使用`rem`适配（基于伪元素`transform: scale`实现`1px`边框）
  * 首屏渲染`SVG`，减少“空白”时间，提升用户体验，考虑过`prerender-spa-plugin`预渲染，但依赖`puppeteer`不小，暂时放下，后续再考虑
  * 构建
    * 静态资源压缩合并
    * 路由懒加载
    * `code-spliting`
    * `hash`缓存
* 项目部署
  * 新买的阿里云ECS
  * `CentOS 7`
  * `Nginx/1.10.2`
  * `pm2`管理Node服务
  * 鉴于旧服务器未到期，而且本项目接口和数据都取自`QQ Music`，所以临时写了一个简陋`Node Server`作体验预览用(其实是`Node`太菜:)，后续维护会重写
* 本项目基于`ustbhuangyi`的播放器项目学习后编写

## 交流
:hammer: 欢迎提`issue`互相交流学习
