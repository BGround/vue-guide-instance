## 图片附件 上传展示

### 使用指南
``` javascript

```

### 代码演示

#### 基础用法

``` javascript

```

#### 自定义图标

```
```

#### 红点、信息提示
```

```


###  API

| 参数 | 说明 | 类型 | 默认值 |
|-----------|-----------|-----------|-------------|
| fileType	 | 文件上传类型，可选值为: 图片: image|| ['png','jpg'...]，附件：file || ['txt','ppt'...] | 	`String|| Array` | 	 `—`  |
| showUpload	| 	显示上传	| `Boolean`	| `true`	|
| accept	 | 接受的文件类型,原生 | 	`String` '| `—`	|
| disabled	| 是否禁用图片上传	| `Boolean` |  `false` |
| fileList	| 	默认已经上传的文件列表	| `Arrag[]`	| `—`	|
| listType	| 	上传列表的内建样式，支持四种基本样式 picture-list 列表\picture-card卡片\picture-gallery 缩略图\picture-grid	九宫格| `string`	| `-`	|
| multiple	| 	是否支持多选文件，ie10+ 支持。开启后按住 ctrl 可选择多个文件。	| `Boolean`	| `	false`	|
| drag	| 	是否	| `Boolean`	| `	false`	|
| limit	| 	最大允许上传个数	| `number`	| `	—`	|

| headers	| 设置上传的请求头部，IE10 以上有效 | `object`|	`—` |
| url	| 上传的地址	| `string|(file) => Promise`  | 	`—` 	|
| data	| 上传所需参数或返回上传参数的方法	| `object|(file) => object`  | `-`	|

| auto-upload	| 	是否在选取文件后立即进行上传	| `Boolean`  | `true`	|
| before-click	 | 	点击上传之前的钩子 | 	`Function`	 | `—`  |
| before-upload	 | 	上传文件之前的钩子，参数为上传的文件，若返回 false 则停止上传 | 	`Function`	 | 	`function(file)`  |
| before-remove	 | 	删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止请求。 | 	`Function`	 | 	`function(file, fileList)`  |
| before-preview	| 	点击文件预览前时的回调	| `function(file, fileList)`	| `—`	|


###  Event

| 事件名 | 说明 | 参数 |
|-----------|-----------|-----------|
|  change | 文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用	 | {  file当前操作的文件对象: { /* ... */ },fileList当前的文件列表。: [ /* ... */ ]}  |
|  download | 下载文件时的回调	 | file  |
|  overlimit | 	文件张数超过限制时触发	 | -  |
|  oversize | 	文件大小超过限制时触发	 | -  |
|  progress	| 	当前文件上传进度的钩子	| `(event, file, fileList)`	|

###  Slot

| 名称 | 说明 |
|-----------|-----------|
|  `-` | 中间自定义插槽 |



