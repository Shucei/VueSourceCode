import { newArrayproto } from "./array"

class Observe {
  constructor(data) {
    // object.defineProperty 只能劫持已经存在的属性
    Object.defineProperty(data, '__ob__', {
      value: this,
      enumerable: false //将__ob__ 变成不可枚举，循环的时候无法获取到不可取值
    })
    // data.__ob__ = this //给数据加了一个标识
    if (Array.isArray(data)) {
      // 如果是数组需要重写数组的方法
      data.__proto__ = newArrayproto
      this.observeArray(data) //如果数组中方的是对象 可以监控到对象的变化 arr  = ['1',{a:1}],  arr[1] = {} 这样监控不到 ， arr[1].a = 100 这样可以监控
    } else {
      this.walk(data)
    }
  }
  walk (data) { //循环对象，对属性依次劫持
    // "重新定义属性"
    Object.keys(data).forEach(key => defineReactive(data, key, data[key]))
  }
  observeArray (data) {//观测数组
    data.forEach(item => observe(item))
  }
}

export function defineReactive (target, key, value) { // 此处存在闭包
  observe(value) //如果还是个对象就继续劫持
  Object.defineProperty(target, key, {
    get () {
      return value
    },
    set (newValue) {
      if (newValue === value) return
      observe(newValue) //修改对象时要重新劫持 address = {}
      value = newValue
    }
  })
}

export function observe (data) {
  // 对对象进行劫持

  if (typeof data !== 'object' || data == null) {
    return // 只对对象进行劫持
  }
  if (data.__ob__ instanceof Observe) {
    return data.__ob__
  }
  // 如果一个对象被劫持过了，那就不需要再被劫持了(要判断是否已经被劫持过了，可以增添一个实例，用实例来判断是否被劫持过)
  return new Observe(data)
}