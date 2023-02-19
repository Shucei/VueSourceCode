import { initMixin } from "./init"

// 为了耦合采用function而不是Class
function Vue (options) { // options就是用户的选项
  this._init(options) //在原型上，用于初始化
}

// 初始化操作_init()绑定原型
initMixin(Vue)

export default Vue