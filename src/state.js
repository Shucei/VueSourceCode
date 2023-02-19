import { observe } from "./observe/index"

export function initState (vm) {
  const opts = vm.$options //获取所有选项
  // 判断有没有data属性，有则进行初始化
  if (opts.data) {
    initData(vm)
  }
}

function proxy (vm, target, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[target][key]
    },
    set (newValue) {
      vm[target][key] = newValue
    }
  })
}

function initData (vm) {
  let data = vm.$options.data //data可能是函数可能是对象
  data = typeof data === 'function' ? data.call(vm) : data

  vm._data = data
  // 对数据进行劫持，vue2采用了一个api defineProperty
  observe(data)

  // 将vm._data 用vm来代理，这样就可以直接使用vm.name 不需要 vm._data.name
  for (let key in data) {
    proxy(vm, '_data', key)
  }

}