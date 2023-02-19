(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function compileToFunction(template) {
    // 1、就是将templace 转化为ast语法树

    // 2、生成render方法(render方法执行后的返回结果就是虚拟DOM)
  }

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  // 重写数组中的部分方法
  var oldArrayproto = Array.prototype;
  var newArrayproto = Object.create(oldArrayproto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice'];
  methods.forEach(function (method) {
    newArrayproto[method] = function () {
      var _oldArrayproto$method;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      //重写数组的方法
      var result = (_oldArrayproto$method = oldArrayproto[method]).call.apply(_oldArrayproto$method, [this].concat(args)); //内部调用原来的方法，函数的劫持，切片编程
      var inserted;
      var ob = this.__ob__;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          inserted = args.slice(2);
      }
      if (inserted) {
        // this是调用方法者
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observe = /*#__PURE__*/function () {
    function Observe(data) {
      _classCallCheck(this, Observe);
      // object.defineProperty 只能劫持已经存在的属性
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false //将__ob__ 变成不可枚举，循环的时候无法获取到不可取值
      });
      // data.__ob__ = this //给数据加了一个标识
      if (Array.isArray(data)) {
        // 如果是数组需要重写数组的方法
        data.__proto__ = newArrayproto;
        this.observeArray(data); //如果数组中方的是对象 可以监控到对象的变化 arr  = ['1',{a:1}],  arr[1] = {} 这样监控不到 ， arr[1].a = 100 这样可以监控
      } else {
        this.walk(data);
      }
    }
    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        //循环对象，对属性依次劫持
        // "重新定义属性"
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        //观测数组
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);
    return Observe;
  }();
  function defineReactive(target, key, value) {
    // 此处存在闭包
    observe(value); //如果还是个对象就继续劫持
    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); //修改对象时要重新劫持 address = {}
        value = newValue;
      }
    });
  }
  function observe(data) {
    // 对对象进行劫持

    if (_typeof(data) !== 'object' || data == null) {
      return; // 只对对象进行劫持
    }

    if (data.__ob__ instanceof Observe) {
      return data.__ob__;
    }
    // 如果一个对象被劫持过了，那就不需要再被劫持了(要判断是否已经被劫持过了，可以增添一个实例，用实例来判断是否被劫持过)
    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options; //获取所有选项
    // 判断有没有data属性，有则进行初始化
    if (opts.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data; //data可能是函数可能是对象
    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;
    // 对数据进行劫持，vue2采用了一个api defineProperty
    observe(data);

    // 将vm._data 用vm来代理，这样就可以直接使用vm.name 不需要 vm._data.name
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      var vm = this; //调用者，this ==> Vue
      vm.$options = options; //将用户的选项挂载到实例上

      // 初始化状态，data，props等等
      initState(vm);
      // 解析模板 
      if (options.el) {
        vm.$mount(options.el); //实现数据的挂载
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;
      if (!ops.render) {
        //先查找有没有render函数
        var template; //没有render看一下是否写了tempalte，没写采用外部的template
        if (!ops.template && el) {
          //没写模板,但是写了el
          template = el.outerHTML; //得到#app标签及内标签所有内容类似于innerHTML
        } else {
          if (el) {
            template = ops.template;
          }
        }
        if (template) {
          var render = compileToFunction();
          ops.render = render;
        }
      }
    };
  }

  // 为了耦合采用function而不是Class
  function Vue(options) {
    // options就是用户的选项
    this._init(options); //在原型上，用于初始化
  }

  // 初始化操作_init()绑定原型
  initMixin(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
