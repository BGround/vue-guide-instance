export default {
    props: {
        showArrow: {  // 是否显示后退箭头
            type: Boolean,
            default: false
        },
        id: {  // 请求数据的id
            type: String,
            default: ''
        }
    },
    filters: {
        isEmpty(val){            
            return val || '-'
        }
    },
    methods:{
        // 附件icon匹配
        iconSelect(fileExt){         
            let result = "all-file";
            if (fileExt == 'DOCX' || fileExt == 'DOC') {
                //word
                result = 'word-file';
            } else if (fileExt == 'XLS' || fileExt == 'XLSX') {
                //execl
                result = 'excel-file';
            } else if (fileExt == 'PDF') {	//pdf
                result = 'pdf-file';
            } else if (fileExt == 'PPT' || fileExt == 'PPTX') {
                //ppt
                result = 'ppt-file';
            } else if (fileExt == 'RAR' || fileExt == 'ZIP') {
                //rar
                result = 'zip-file';
            } else if (fileExt == 'TXT') {	//txt
                result = 'txt-file';
            }       
            return result;     
        },

        // 下载附件
        downloadMedia(url,fileName){
            window.location.href = `${_.fileDownURL + _.downFileURL}${encodeURIComponent(url)}&fileFileName=${encodeURIComponent(fileName)}`;                        
        },

        // 将长文本信息根据换行字段拆分成若干数组
        filterLongText(val){
            if( !val ){
                return ["-"]
            }else{                
                return val.split('\n')
            }
        },

        // 返回
        back() {
            this.$emit('back');
        },

        // 设置详情标题
        setTitle(clientName, clientId) {
            this.$emit('setTitle', clientName, clientId);
        }
    }
  }