# CMA-WEB代码说明文档

### 文件组织结构
项目根目录组织如下:
```
.
+--_bin
+--_config
+--_public
+--_resources
+--_server
+--_src
|	...
|	+--_routes
|	...
+--_package.json
+--_package-lock.json
README.md
```
其中config为配置相关文件夹，可在其中的project.config.js中修改server_port为前端服务器运行的端口，src为网页源代码文件夹，server为前端服务器搭建相关文件夹，resource为资源文件夹。

src组织如下：
```
+--_src
|	...
|	+--_lib
|	+--_routes
|	+--_services
|	+--_store
|	...
```
src中较为重要和常用的四个文件夹，lib用于放置一些外部的js库，例如jQuery；routes用于放置前端页面代码；services用于放置一些api地址，可在此处修改baseAddress为后端服务器的地址；store放置redux相关代码。

routes的组织如下：
```
+--_routes
|	+--_Annual
|	+--_Equipment
|	+--_Login
|	...
|	+--_index.js
|	+--_tabsmap.js
```
本项目按照功能划分文件夹，例如设备管理相关源代码放在Equipment中，年度计划放在Annual中。其中tabsmap.js用于将网页侧边栏与具体页面建立映射。