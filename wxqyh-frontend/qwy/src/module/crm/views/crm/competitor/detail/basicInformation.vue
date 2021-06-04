<template>
    <div>
        <div class="info-block">
            <div class="item">
                <div class="detail-label">
                    规模
                </div>
                <div class="detail-value">
                    {{baseInformation.scale | isEmpty | scale}}
                </div>
            </div>
        </div>
        <div class="info-block">
            <div class="item">
                <div class="detail-label">
                    竞争力
                </div>
                <div class="detail-value">
                    {{baseInformation.competitorPower | isEmpty | competitorPower}}
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    优势
                </div>
                <div class="detail-value">                    
                    <p v-for="(item,index) in filterLongText(baseInformation.advantage)" :key=index  >
                        {{item}}
                    </p>
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    劣势
                </div>
                <div class="detail-value">
                    <p v-for="(item,index) in filterLongText(baseInformation.disadvatage)" :key=index  >
                        {{item}}
                    </p>                    
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    策略
                </div>
                <div class="detail-value">
                    <p v-for="(item,index) in filterLongText(baseInformation.strategy)" :key=index  >
                        {{item}}
                    </p>                       
                </div>
            </div>
        </div>
        <div class="info-block">
            <div class="item">
                <div class="detail-label">
                    联系信息
                </div>
                <div class="detail-value">
                    <p v-for="(item,index) in filterLongText(baseInformation.contactInfo)" :key=index  >
                        {{item}}
                    </p>                       
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    描述
                </div>
                <div class="detail-value">
                    <p v-for="(item,index) in filterLongText(baseInformation.description)" :key=index  >
                        {{item}}
                    </p>                       
                </div>
            </div>          
        </div>
        <div class="info-block">
            <div class="item">
                <div class="detail-label">
                    负责人
                </div>
                <div class="" style="width:700px">
                    <person-label v-for="(item,index) in baseInformation.toPersons"  :key="index" :src="item.headPic" :name="item.personName" ></person-label>      
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    相关人
                </div>
                <div class="detail-value">       
                    <person-label class="person-label" v-for="(item,index) in baseInformation.ccPersons" :key="index" :src="item.headPic" :name="item.personName" ></person-label>                      
                    <div v-if="baseInformation.ccPersons ? baseInformation.ccPersons.length == 0 : true">-</div>            
                </div>
            </div> 
        </div>
        <div class="info-block">
            <div class="item">
                <div class="detail-label">
                    创建人
                </div>
                <div class="detail-value">
                    {{baseInformation.personName | isEmpty}}
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    创建时间
                </div>
                <div class="detail-value">
                    {{baseInformation.createTime | isEmpty}}
                </div>
            </div>
            <div class="item">
                <div class="detail-label">
                    更新时间
                </div>
                <div class="detail-value">
                    {{baseInformation.updateTime | isEmpty}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { detailCompetitor } from "@/module/crm/api/competitor";
import personLabel from "@/module/crm/components/qw-person-label/qw-person-label";
export default {      
    props: {
        id: {
            type: String,
            default: ""
        }
    },
    components: {
        personLabel
    },
    data(){
        return {            
            baseInformation: "",  // 基本信息 数据      
        }
    },
    methods: {
        init(){
            // 如果不存在基本信息的数据 =》加载基本信息
            if( !this.baseInformation ){
                this.getDetail()
            }
        },
        getDetail(){
            detailCompetitor({ competitorId: this.id })
            .then(res => {                
                if(res.code == '0'){
                    this.baseInformation = res.data.competitorDetail;                    
                    this.$emit("setTitle",this.baseInformation)
                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {                
                _alert('提示','网络错误');
            });
        },
        // 将 长文本信息根据换行字段拆分成若干数组
        filterLongText(val){
            if( !val ){
                return ["-"]
            }else{                
                return val.split('\n')
            }
        }
    },  
    filters: {
        isEmpty(val){            
            return val || '-'
        },
        scale(val){
           let result;
            if( val != '-' ){                
                switch(val){
                    case '0':
                        result = '-';
                        break;
                    case '1':
                        result = '0~20人';
                        break;
                    case '2':
                        result = '20~50人';
                        break;
                    case '3':
                        result = '50~100人';
                        break;
                    case '4':
                        result = '100~200人';
                        break;
                    case '5':
                        result = '200~500人';
                        break;
                    case '6':
                        result = '500~1000人';
                        break;
                    case '7':
                        result = '1000以上人';
                        break;
                }
            }else{
                result = '-';
            }
            return result; 
        },
        competitorPower(val){                        
            let result;
            if( val != '-' ){                
                switch(val){
                    case '0':
                        result = '-';
                        break;
                    case '1':
                        result = '弱竞争力';
                        break;
                    case '2':
                        result = '一般竞争力';
                        break;
                    case '3':
                        result = '潜在竞争力';
                        break;
                    case '4':
                        result = '强竞争力';
                        break;
                }
            }else{
                result = '-';
            }
            return result;
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/baseUI.scss';
@mixin detail-cut-line{
    border-bottom: 1px solid #E5E5E5; 
}
.info-block{
    @include detail-cut-line;
    position: relative;    
    padding-bottom: 33px;
    margin-bottom: 33px;
    .item{        
        display: flex;
        width: 100%;
        padding-left: 15px;  
        padding-bottom: 17px;              
        font-size: 14px;
        color: #333333;
        .person-label{
            margin-bottom: 5px;
        }
        .detail-label{
            @include ellipsis;
            display: flex;            
            width: 150px;
        }
        .detail-value{            
            width: 700px;
            height: auto;
            word-wrap:break-word
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
