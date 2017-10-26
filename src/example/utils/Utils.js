/**
 * Empty JS File be created by WebStorm
 * Author: suming
 * Date: 2017/10/26
 * Time: 下午12:03
 *
 */

/**
 * 生成唯一ID
 * @returns {string}
 */
export function generateUUID() {
  let d = new Date().getTime()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16)
  })
}

/**
 * copy 一个对象到另一个对象
 * @param obj
 * @param bean
 * @returns {*}
 */
export function copyBean (obj, bean) {
  for(let p in obj) {
    if(obj.hasOwnProperty(p) && typeof(obj[p])!=="function") {
      bean[p]=obj[p];
    }
  }
  return bean;
}