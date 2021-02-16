<!--
 * @Author: your name
 * @Date: 2021-02-14 10:24:27
 * @LastEditTime: 2021-02-16 17:44:49
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \form-visual-editor\README.md
-->
# form-visual-editor
# 可视化拖拽表单编辑器

## 技术栈
 Vue3 + TypeScript + ElementPlus

## 项目说明

- 预览地址：

## 实现功能

- [x] 主页面结构：左侧可选组件列表、中间容器画布、右侧编辑组件定义好的属性
- [x] 从菜单拖拽组件到容器；
- [ ] Block的选中状态；
- [ ] 容器内的组件可以拖拽移动位置；
- [ ] 命令队列以及对应的快捷键；
- [ ] 单选、多选；
- [ ] 设计好操作栏按钮：
    - [ ] 撤销、重做；
    - [ ] 导入、导出；
    - [ ] 置顶、置底；
    - [ ] 删除、清空；
- [ ] 拖拽贴边；
- [ ] 组件可以设置预定义好的属性；
- [ ] 右键操作菜单；
- [ ] 拖拽调整宽高；
- [ ] 组件绑定值；
- [ ] 根据组件标识，通过作用域插槽自定义某个组件的行为
    - [ ] 输入框：双向绑定值、调整宽度；
    - [ ] 按钮：类型、文字、大小尺寸、拖拽调整宽高；
    - [ ] 图片：自定义图片地址，拖拽调整图片宽高；
    - [ ] 下拉框：预定义选项值，双向绑定字段；




## 相关资料

> 以下排名不分先后


- [Vue3.0官方文档（中文）](https://v3.cn.vuejs.org/guide/introduction.html)
- [Vue3.0文档（中文）](http://martsforever-snapshot.gitee.io/vue-docs-next-zh-cn/)：码云上同步过来的中文文档，不用翻墙，访问快很多；
- [渲染函数：官方文档](https://v3.vuejs.org/guide/render-function.html#jsx)
- [渲染函数：jsx-next github](https://github.com/vuejs/jsx-next#installation)
- [Composition API](http://martsforever-snapshot.gitee.io/vue-docs-next-zh-cn/guide/composition-api-introduction.html)：在Vue3.0文档中一样可以找到，这里给出直接访问地址。
- [Typescript Deep Dive](http://martsforever-snapshot.gitee.io/typescript-book-chinese/)：码云上同步过来的 `Typescript Deep Dive`一书的中文文档，不用翻墙访问很快；
- [@vue/cli Vue官方脚手架](https://cli.vuejs.org/zh/)：官方推荐的用于创建Vue工程脚手架工具
- [Vite](https://www.npmjs.com/package/vite)：尤雨溪大佬新出的，旨在替代webpack-dev的开发工具，本次的React版本就是用vite搭建的，在全引入antd的情况下可以秒速启动（第一次慢一点）并且自带React热更新的功能；Vue版本因为ElementPlus安装有问题，暂时无法使用；



## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
