### 应用端截剪图片组件

#### 1、引入
  `import cutImage from '@/components/cutImage/cutImage.vue' `

#### 2、入参

    | 入参          | 功能                       |        默认值 (范围)          | 数据类型
    | -----------   | -----------                | -----------                  |
    | img           | 裁剪图片的地址              |   空 （base64 || blob）      | string
    | grid    | 显示九宫格                 |   false                      | Boolean
    | outputSize    | 裁剪生成图片的质量          |   1 （0.1 - 1）              |  Number
    | outputType    | 裁剪生成图片的格式          |   jpeg（jpeg || png || webp）| String
    | info          | 显示裁剪框的大小信息        |   false                      | Boolean
    | canScale      | 图片是否允许滚轮缩放        |   true                       | Boolean
    | autoCrop      | 是否默认生成截图框          |   false                      | Boolean
    | autoCropWidth | 默认生成截图框宽度          |   容器的80%                  | Number
    | autoCropHeight| 默认生成截图框高度          |   容器的80%                  | Number
    | fixed         | 是否开启截图框宽高固定比例   |   true                      | Boolean
    | fixedNumber   | 截图框的宽高比例            | [1 : 1]                      | Array
    | full          | 是否输出原图比例的截图      |   false                      | Boolean
    | fixedBox      | 固定截图框大小 不允许改变      |   false                   | Boolean
    | canMove       | 上传图片是否可以移动         |   true                      | Boolean
    | canMoveBox    | 截图框能否拖动               |   true                      | Boolean
    | original      | 上传图片按照原始比例渲染     |   false                      | Boolean
    | centerBox     | 截图框是否被限制在图片里面     |   false                    | Boolean
    | high          | 是否按照设备的dpr  输出等比例图片|   true                   | Boolean

#### 3、回调触发事件
  cutImageFinish

#### 4、调用方法

    <cutImage ref="cropper"
             :show.sync="showCutImageTool"
             :img="src"
             :autoCrop="true"
             :autoCropWidth="300"
             :autoCropHeight="300"
             :fixed="true"
              @cutImageFinish="cutImageFinish">
    </cutImage>
    
#### 5、使用方法 
 
    data(){
      return {
        showCutImageTool: false,
        src: '',
      }
    },
    methods:{
    //显示截剪组件
      changeImage(){
        this.showCutImageTool = true
      },
      //截剪完成，回调图片base64
      cutImageFinish(data){
        //接口上传图片
      }
    }
