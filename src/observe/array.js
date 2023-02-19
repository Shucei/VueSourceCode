// 重写数组中的部分方法
let oldArrayproto = Array.prototype

export let newArrayproto = Object.create(oldArrayproto)

let methods = [
  'push',
  'pop',
  'shift', 'unshift', 'reverse', 'sort', 'splice'
]

methods.forEach(method => {
  newArrayproto[method] = function (...args) { //重写数组的方法
    const result = oldArrayproto[method].call(this, ...args)//内部调用原来的方法，函数的劫持，切片编程
    let inserted
    let ob = this.__ob__
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args
        break
      case 'splice':
        inserted = args.slice(2)
      default:
        break
    }
    if (inserted) {
      // this是调用方法者
      ob.observeArray(inserted)
    }
    return result
  }
})