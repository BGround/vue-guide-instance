<template>
    <div>
        <div class="info-block">
            <div 
                class="item" 
                v-for="(item,idx) in detailData.area1" 
                :key="idx"
            >
                <div class="detail-label" >{{item.optionName}}</div>
                <div class="detail-value">
                    {{item.value | isEmpty}}
                </div>
            </div>
        </div>
        <div class="info-block" v-show="showArea2">
            <div 
                class="item"
                v-for="(item,idx) in detailData.area2" 
                :key="idx"
                v-if="item.show" 
            >
                <div class="detail-label" >{{item.optionName}}</div>
                <div class="detail-value" v-html="item.value || '-'">
                    {{item.value | isEmpty}}
                </div>
            </div>
        </div>
        <div class="info-block" v-show="detailData.area3.length > 0">
            <div 
                class="item"
                v-for="(item,idx) in detailData.area3" 
                :key="idx"
                v-if="item.show" 
            >
                <div class="detail-label" >{{item.optionName}}</div>
                <div class="detail-value" v-html="item.value || '-'">
                    {{item.value | isEmpty}}
                </div>
            </div>
        </div>
        <div class="info-block">
            <div class="item">
                <div class="detail-label">图片</div>
                <div class="detail-value" >
                    <div class="media-value" v-for="(item,idx) in detailData.picList" :key="idx" >
                        <img class="detail-image" :src="compressURL + item.picPath" alt="">                        
                    </div>         
                    <div v-if="detailData.picList ? detailData.picList.length == 0 : true">-</div>              
                </div>
            </div>
            <div class="item">
                <div class="detail-label">附件</div>
                <div class="detail-value" v-if="detailData.mediaList ? detailData.mediaList.length == 0 : true">-</div>                                                 
                <div class="media-value" v-else>                          
                    <div 
                        class="media-block" 
                        v-for="(item,index) in detailData.mediaList" 
                        :key="index" 
                        @click="downloadMedia(item.url,item.fileName)" 
                    >
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
                    <person-label class="person-label" v-for="(item,index) in detailData.toPersons" :key="index" :src="item.headPic" :name="item.personName" ></person-label>                      
                    <div v-if="detailData.toPersons ? detailData.toPersons.length == 0 : true">-</div>            
                </div>
            </div> 
            <div class="item">
                <div class="detail-label">
                    相关人
                </div>
                <div class="detail-value">       
                    <person-label class="person-label" v-for="(item,index) in detailData.ccPersons" :key="index" :src="item.headPic" :name="item.personName" ></person-label>                      
                    <div v-if="detailData.ccPersons ? detailData.ccPersons.length == 0 : true">-</div>            
                </div>
            </div> 
        </div>
    </div>
</template>

<script>
import { getPoolDetail } from "crm/api/territorialSea";
import personLabel from "@/module/crm/components/qw-person-label/qw-person-label";
import mixin from '../mixin/mixin.js';

export default {    
    name: 'TerritorialSeaInfo',  
    mixins: [mixin],
    components: {
        personLabel
    },
    data(){
        return {            
            detailData: {  // 详情数据
                area1: [
                    {
                        key: 'personName',
                        optionName: '创建人',
                        value: ''
                    },
                    {
                        key: 'createTime',
                        optionName: '创建时间',
                        value: ''
                    },
                    {
                        key: 'blockTime',
                        optionName: '更新时间',
                        value: ''
                    },
                    {
                        key: 'backTimes',
                        optionName: '退回次数',
                        value: ''
                    },
                ],
                area2: [
                    {
                        key: 'poolName',
                        optionName: '所属公海',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'clientCode',
                        optionName: '客户编码',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'area',
                        optionName: '区域',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'address',
                        optionName: '地址',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'industry',
                        optionName: '行业',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'phone',
                        optionName: '联系电话',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'email',
                        optionName: '邮箱',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'website',
                        optionName: '网址',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'remark',
                        optionName: '备注',
                        show: false,
                        value: ''
                    },
                ],
                area3: [],
                picList: [],
                mediaList: [],
                ccPersons: []
            }, 
            baseInformation: '',
            showArea2: false,  // 是否显示区域2
            compressURL: _.compressURL,  // 图片路径头
        }
    },
    created() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            this.getDetail();
        },

        // 获取公海数据
        getDetail(){
            let obj = {
                clientId: this.id
            }
            getPoolDetail(obj).then(res => {
                if(res.code == '0'){
                    let { basicList, itemList, tbCrmClientInfoPO, mediaList } = res.data;

                    // 区域一赋值
                    this.detailData.area1.map(detailItem => {
                        if(detailItem.key === 'backTimes'){
                            this.$set(detailItem, 'value', `${tbCrmClientInfoPO[detailItem.key]}次`);
                        }
                        else{
                            this.$set(detailItem, 'value', tbCrmClientInfoPO[detailItem.key]);
                        }         
                    })

                    // 区域二基础字段赋值
                    if(basicList && basicList.length > 0) {
                        this.detailData.area2.map(detailItem => {
                            if(detailItem.key === 'area'){  // 区域特殊处理
                                this.$set(detailItem, 'value', `${tbCrmClientInfoPO['provinceCode']} ${tbCrmClientInfoPO['cityCode']} ${tbCrmClientInfoPO['areaCode']}`);
                            }
                            else{
                                this.$set(detailItem, 'value', _.checkURL(tbCrmClientInfoPO[detailItem.key],true));
                            }
                            
                            basicList.map(baseItem => {
                                let name = detailItem.dataName || detailItem.optionName;

                                if(name === baseItem.optionName){
                                    detailItem.show = baseItem.status === '1'? true : false;

                                    // 有显示的字段则显示区域二
                                    if(detailItem.show){
                                        this.showArea2 = true;
                                    }
                                }
                            });
                        });
                    }

                    // 区域三自定义字段赋值
                    if(itemList && itemList.length > 0){
                        itemList.map(item => {
                            let obj = {
                                key: item.fieldId,
                                optionName: item.fieldName,
                                value: _.checkURL(item.optionVal,true),
                                show: true
                            }
                            this.detailData.area3.push(obj);
                        })
                    }

                    // 图片列表
                    this.detailData.picList = tbCrmClientInfoPO.picList;

                    // 附件列表
                    this.detailData.mediaList = mediaList;

                    // 负责人
                    this.detailData.toPersons = tbCrmClientInfoPO.toPersons;

                    // 相关人
                    this.detailData.ccPersons = tbCrmClientInfoPO.ccPersons;

                    this.setTitle(tbCrmClientInfoPO.clientName, tbCrmClientInfoPO.clientId);
                }
                else{
                    _.alert('提示', res.desc);
                }
            })
        },
    },  
}
</script>

<style lang="scss" scoped>
@import '../scss/detail.scss';
</style>
