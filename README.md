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
其中config为配置相关文件夹，可在其中的project.config.js中修改server_port为前端服务器运行的端口；src为网页源代码文件夹；server为前端服务器搭建相关文件夹；resource为资源文件夹；bin为react编译器相关文件夹。

src组织如下：
```
+--_src
|	+--_common
|	+--_components
|	+--_containers
|	+--_errors
|	+--_layouts
|	+--_lib
|	+--_plugins
|	+--_routes
|	+--_services
|	+--_store
|	+--_styles
|	+--_test
|	+--_utils
|	+--_index.html
|	+--_main.js
```
src中较为常用的四个文件夹为lib、routes、services、store。lib用于放置一些外部的js库，例如jQuery；routes用于放置前端页面代码；services用于放置一些api地址，可在此处修改baseAddress为后端服务器的地址；store放置redux相关代码。common是原项目已写好的一些可重用的组件，但由于封装性过高导致在本项目中并没有什么用。test为早期尝试react时留下的组件，无用。layouts为整个页面相关布局的文件。

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
本项目按照功能划分文件夹，Annual为年度计划，Equipment为设备管理，ExternalReview为外部评审与上报管理，IntermediateChecks/PeriodCheck为期间核查（两人完成），InternalAudit为内审，ManagementReview为管理评审，PeopleManagement为人员管理，SampleManagement为样品管理，StandardManagement为标准管理，Supervise为监督，TestCapacity为检测检验管理，TrainingManagement/TrainingRecord为培训管理（两人完成）。其中tabsmap.js用于将网页侧边栏与具体页面建立映射。