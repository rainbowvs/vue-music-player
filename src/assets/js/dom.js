/**
 * 判断是否含有指定类名
 * @param {Element} el DOM元素
 * @param {string} className 指定类名
 * @returns {boolean} true = 包含
 */
export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)');
  return reg.test(el.className);
}

/**
 * 添加指定类名
 * @param {Element} el DOM元素
 * @param {string} className 类名
 * @returns {void}
 */
export function addClass(el, className) {
  if (hasClass(el, className)) {
    return;
  }

  let newClass = el.className.split(' ');
  newClass.push(className);
  el.className = newClass.join(' ');
}

export function getData(el, name, val) {
  const prefix = 'data-';
  name = prefix + name;
  if (val) {
    return el.setAttribute(name, val);
  }
  return el.getAttribute(name);
}

/**
 * 检测样式并添加前缀
 * @param {string} style 样式名
 * @returns {boolean|string} false => 不支持该样式 string => 适配前缀+style
 */
export function prefix(style) {
  const validate = (() => {
    const eleStyle = document.createElement('div').style;
    const transformNames = {
      webkit: 'webkitTransform',
      Moz: 'MozTransform',
      O: 'OTransform',
      ms: 'msTransform',
      standard: 'transform'
    };

    for (let key in transformNames) {
      if (eleStyle[transformNames[key]] !== undefined) {
        return key;
      }
    }
    return false;
  })();
  if (validate === false) {
    return false;
  }
  if (validate === 'standard') {
    return style;
  }
  return validate + style.charAt(0).toUpperCase() + style.substring(1);
}
