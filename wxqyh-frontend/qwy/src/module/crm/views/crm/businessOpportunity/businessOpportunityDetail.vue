<template>
    <div v-if="show">
        <i class="back" @click="showList" ></i>
        <div class="info-block">
            <div class="item" v-if="permObj['标题'] ? permObj['标题'].status == 1 : true" >
                <div class="detail-label">
                    商机标题
                </div>
                <div class="detail-value"  >
                    {{baseInformation.tbCrmBusinessInfoPO.title | isEmpty}}
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    创建人
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.personName | isEmpty}}
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    创建时间
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.createTime | isEmpty}}
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    更新时间
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.updateTime | isEmpty}}
                </div>
            </div>
        </div>
        <div class="info-block">
            <div class="item" v-if="permObj['所属客户'] ? permObj['所属客户'].status == 1 : true">
                <div class="detail-label">
                    所属客户
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.clientName | isEmpty}}
                </div>
            </div>
            <div class="item" v-if="permObj['内容'] ? permObj['内容'].status == 1 : true">
                <div class="detail-label">
                    商机内容
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.content | isEmpty}}
                </div>
            </div>
            <div class="item" v-if="permObj['客户联系人'] ? permObj['客户联系人'].status == 1 : true">
                <div class="detail-label">
                    联系人
                </div>
                <div class="detail-value">       
                    <div v-if="baseInformation.tbCrmBusinessInfoPO.contactList ? baseInformation.tbCrmBusinessInfoPO.contactList.length == 0 : true">-</div>                         
                    <p v-for="(item,index) in baseInformation.tbCrmBusinessInfoPO.contactList" :key="index" >
                        {{item.contactName}}                        
                    </p>                    
                </div>
            </div>
            <div class="item" v-if="permObj['商机合作伙伴'] ? permObj['商机合作伙伴'].status == 1 : true">
                <div class="detail-label">
                    商机合作伙伴
                </div>
                <div class="detail-value">
                    <p v-for="(item,index) in baseInformation.tbCrmBusinessInfoPO.partnerList" :key="index" >
                        {{item.clientName}}                        
                    </p>
                </div>
            </div>
            <div class="item" v-if="permObj['竞争对手'] ? permObj['竞争对手'].status == 1 : true">
                <div class="detail-label">
                    竞争对手
                </div>
                <div class="detail-value">                    
                    <p v-for="(item,index) in baseInformation.tbCrmBusinessInfoPO.competitorList" :key="index" >
                        {{item.competitorName}}                        
                    </p>
                </div>
            </div>
            <div class="item" v-if="permObj['目前阶段'] ? permObj['目前阶段'].status == 1 : true">
                <div class="detail-label">
                    目前阶段
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.stageName | isEmpty}}
                </div>
            </div>
            <div class="item" v-if="permObj['商机类别'] ? permObj['商机类别'].status == 1 : true">
                <div class="detail-label">
                    商机类别
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.businessTypeName | isEmpty}}
                </div>
            </div>
            <div class="item" v-if="permObj['销售额(元)'] ? permObj['销售额(元)'].status == 1 : true">
                <div class="detail-label">
                    销售额
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.estimatedSale | isEmpty}}
                </div>
            </div>
            <div class="item" v-if="permObj['结单日期'] ? permObj['结单日期'].status == 1 : true">
                <div class="detail-label">
                    结单日期
                </div>
                <div class="detail-value">
                    {{baseInformation.tbCrmBusinessInfoPO.estimatedDate | isEmpty}}
                </div>
            </div>
        </div>
        
        <!-- 自定义字段 -->
        <div class="info-block" v-if="baseInformation.itemList.length" >
            <div class="item" v-for="(item,index) in baseInformation.itemList" :key="index" >
                <div class="detail-label">
                    {{item.fieldName}}
                </div>
                <div class="detail-value">
                    {{item | initItem | isEmpty}}
                </div>
            </div>
        </div>

        <div class="info-block">
            <div class="item">
                <div class="detail-label">
                    图片
                </div>
                <div class="detail-value" >
                    <div class="media-value" v-for="(item,index) in baseInformation.tbCrmBusinessInfoPO.picList" :key="index" >
                        <img class="detail-image" :src="compressURL + item.picPath" alt="">                        
                    </div>         
                    <div v-if="baseInformation.tbCrmBusinessInfoPO.picList ? baseInformation.tbCrmBusinessInfoPO.picList.length == 0 : true">-</div>              
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    附件
                </div>
                <div class="detail-value" v-if="baseInformation.mediaList ? baseInformation.mediaList.length == 0 : true">-</div>                                                 
                <div class="media-value" v-else>                          
                    <div class="media-block" v-for="(item,index) in baseInformation.mediaList" :key="index" @click="downloadMedia(item.url,item.fileName)" >
                        <i v-if="item.type != 'image'" :class="`file-type ${iconSelect(item.fileExt)}`"></i>
                        <span v-if="item.type != 'image'">{{item.fileName}}</span>
                        <img v-if="item.type == 'image'" src="" alt="" class="file-type">
                    </div>                        
                </div>
            </div> 
        </div>
        <div class="info-block">
            <div class="item">
                <div class="detail-label">
                    负责人
                </div>
                <div class="detail-value">
                    <person-label class="person-label" v-for="(item,index) in baseInformation.tbCrmBusinessInfoPO.toPersons" :key="index" :src="item.headPic" :name="item.personName" ></person-label>                                                             
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    相关人
                </div>
                <div class="detail-value">
                    <person-label class="person-label" v-for="(item,index) in baseInformation.tbCrmBusinessInfoPO.ccPersons" :key="index" :src="item.headPic" :name="item.personName" ></person-label>                            
                    <div v-if="baseInformation.tbCrmBusinessInfoPO.ccPersons ? baseInformation.tbCrmBusinessInfoPO.ccPersons.length == 0 : true">-</div>            
                </div>
            </div>            
        </div>
    </div>
</template>

<script>
import { detailCompetitorChance,downLoadMedia } from "@/module/crm/api/businessOpportunity";
import personLabel from "@/module/crm/components/qw-person-label/qw-person-label";
export default {      
    props: {
        id: {
            type: String,
            default: ""
        }
    },
    components: {
        personLabel , // 负责人/相关人 详情标签 [|头像| 姓名]
    },
    data(){
        return {     
            dataBase,       
            // 用于数据回显的对象
            baseInformation: {
                tbCrmBusinessInfoPO: {},
                itemList: []
            },   
            // 将 基础字段是否显示维护于此
            permObj: {},               
            show: false,
            // 下载路径
            baseURL: _.baseURL,  
            // 图片显示路径
            compressURL: _.compressURL    
        }
    },
    methods: {
        // 打开详情页
        showDialog(id){
            this.getDetail(id)
            this.show = true;
        },
        // 返回
        showList(){
            this.show = false;
            this.$emit("show")
        },   
        // 获取详情
        getDetail(id){
            let { alert:_alert, top_alert } = this.dataBase;
            detailCompetitorChance({ id: id })
            .then(res => {                
                if(res.code == '0'){
                    this.baseInformation = res.data;     
                    this.baseInformation.basicList.map(item => {
                        this.permObj[item.optionName] = item;
                    })                                        
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {                
                _alert('提示','网络错误');
            });
        },
        // 下载附件
        downloadMedia(url,fileName){
            window.location.href = `${_.fileDownURL + _.downFileURL}${encodeURIComponent(url)}&fileFileName=${encodeURIComponent(fileName)}`;                        
        },
        // 根据不同的附件类型更换附件图标
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
        }
    },  
    filters: {
        // 判空
        isEmpty(val){                
            return val || '-'
        },     
        initItem(obj){            
            var result = obj.optionVal;
            if( obj.numberType == 3 ){
                result = result ? result + "%" : "-"
            }
            return result;
        }
    },
    
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/baseUI.scss';
@mixin detail-cut-line{
    border-bottom: 1px solid #E5E5E5; 
}
.back{
    display: inline-block;
    width: 30px;
    height: 30px;
    margin-bottom: 18px;
    background: url('~assets/images/back_icon.png') no-repeat;
    background-size: 100%;
    cursor: pointer;
}
.info-block{
    @include detail-cut-line;
    position: relative;    
    padding-bottom: 33px;
    margin-bottom: 33px;
    .person-label{
        margin-bottom: 5px;
    }
    .item{        
        display: flex;
        box-sizing: border-box;
        width: 100%;
        padding-left: 15px;  
        padding-bottom: 17px;              
        font-size: 14px;
        color: #333333;
        .detail-label{
            @include ellipsis;
            display: flex;            
            width: 150px;
        }
        .detail-value{            
            width: 700px;
        }    
        .media-value{
            width: 100%;
        }
        .detail-image{
            max-height: 150px;
        }
        .media-block{
            display: flex;
            flex-direction: row;       
            align-items: center;     
            border-top: 1px solid #E5E5E5;
            padding-top: 14px;
            padding-bottom: 14px;
            padding-left: 15px;
            background-color: #ffffff;
            cursor: pointer;
            transition-duration: .3s;
            &:hover{
                background-color: #eee;
            }
            .file-type{
                display: block;
                width: 48px;
                height: 48px;
                margin-right: 14px;
                background-size: 100%;            
            }
            .all-file{
                background-image: url('~assets/images/file.png');
            }
            .word-file{
                background-image: url('~assets/images/word.png');
            }
            .excel-file{
                background-image: url('~assets/images/excel.png');
            }
            .pdf-file{
                background-image: url('~assets/images/pdf.png');
            }
            .ppt-file{
                background-image: url('~assets/images/ppt.png');
            }
            .zip-file{
                background-image: url('~assets/images/rar.png');
            }
            .txt-file{
                background-image: url('~assets/images/txt.png');
            }    
        }
        
        &:last-child{
            padding-bottom: 0;
        }            
    }
    &:last-child{
        border-bottom-width: 0;
    }
}


</style>
