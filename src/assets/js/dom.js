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
