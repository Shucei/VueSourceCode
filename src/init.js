import { compileToFunction } from "./compiler";
import { initState } from "./state";

export function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this //调用者，this ==> Vue
    vm.$options = options;//将用户的选项挂载到实例上

    // 初始化状态，data，props等等
    initState(vm)
    // 解析模板 
    if (options.el) {
      vm.$mount(options.el) //实现数据的挂载
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this
    el = document.querySelector(el)
    let ops = vm.$options
    if (!ops.render) { //先查找有没有render函数
      let template//没有render看一下是否写了tempalte，没写采用外部的template
      if (!ops.template && el) { //没写模板,但是写了el
        template = el.outerHTML //得到#app标签及内标签所有内容类似于innerHTML
      } else {
        if (el) {
          template = ops.template
        }
      }

      if (template) {
        const render = compileToFunction(template)
        ops.render = render
      }
    }
  }

}


