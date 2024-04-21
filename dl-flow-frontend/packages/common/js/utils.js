/**
 *
 * @description 合并默认值, 并返回一个新的对象. 但是不保证是深克隆
 * @template T
 * @param {T} obj
 * @param {T} defaultValue
 */
export const _default = (obj, defaultValue) => ({ ...defaultValue, ...obj })

/**
 * @description 深克隆一个对象
 * @param {T} obj
 * @returns {T}
 */
export const deepClone = (obj) => structuredClone(obj)

/**
 *
 * @param {T extends Function} fn
 * @param {number} delay
 * @returns {(...args:Parameters<T>)=>ReturnType<T>}
 */
export const Debounce = (fn, delay) => {
  let timer = null
  return () => {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

/**
 * 
 * @param {Record<string,any>[]} obja 
 * @param {Record<string,any>[]} objb 
 * @param {string} key
 * @returns { {type:'add'|'remove', value: any}[] }
 */
export const diff = (obja, objb) => {
  if (obja.length === objb.length){
    return [];
  }
  const objAStr = obja.map(JSON.stringify);
  const objBStr = objb.map(JSON.stringify);
  if (obja.length > objb.length){
    const res = [];
    for (let i=0;i<objAStr.length;i++){
      if (!objBStr.includes(objAStr[i])){
        res.push({
          type: 'add',
          value: obja[i]
        })
      }
    }
    return res;
  }
  if (obja.length < objb.length){
    const res = [];
    for (let i=0;i<objBStr.length;i++){
      if (!objAStr.includes(objBStr[i])){
        res.push({
          type: 'remove',
          value: i
        })
      }
    }
    return res;
  }
}