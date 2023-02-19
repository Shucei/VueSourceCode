import babel from 'rollup-plugin-babel'
import resolve from '@rollup/plugin-node-resolve' //控制不需要写index，安装node引入
export default {
  input: './src/index.js', //入口
  output: {
    file: './dist/vue.js', //出口
    name: 'Vue',  // 打包后在全局增加一个vue(global.Vue)
    format: 'umd', //esm es6模块 commonjs模块 iife自执行函数 umd
    sourcemap: true,//希望可以调试源代码
  },
  // 所有的插件都是函数
  plugins: [
    babel({
      exclude: 'node_modules/**' //排除node_modules所有文件(不用把里面的转化为es5)
    }),
    resolve()
  ]
}