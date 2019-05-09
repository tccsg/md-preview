#### 效果图
![readme3.gif](https://upload-images.jianshu.io/upload_images/6080408-fa59ebf8a1c1801e.gif?imageMogr2/auto-orient/strip)


在编写readme过程中 只要保存修改 就会即使显示在浏览器中预览，不用手动点击浏览器刷新按钮。

#### 用法
因为已经发布到npm上面，所以可以通过```npm i dg-mp```或者```yarn add dg-mp```安装
然后在```package.json```中添加scripts
```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dg-mp": "dg-mp"
  }
```
最后在命令行中输入```npm run dg-mp```或者```yarn dg-mp```会自动打开浏览器。
默认监听 4000端口 可以通过 ```npm run dg-mp 40001```修改监听端口

#### 原理
通过检测文件的修改，通知浏览器自动刷新，之后将实现热更新实时预览。

### github地址
[md-preview](https://github.com/tccsg/md-preview)

