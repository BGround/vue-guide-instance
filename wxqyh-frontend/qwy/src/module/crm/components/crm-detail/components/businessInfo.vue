<template>
    <div>
        <i class="back" @click="back" v-show="showArrow"></i>
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
                <div class="detail-value" v-if="item.key === 'content'" v-html="item.value || '-'"> </div>
                <div class="detail-value" v-else>
                    <span v-if="!item.dataList">{{item.value | isEmpty}}</span>
                    <p    
                        v-for="(item,idx) in item.dataList"
                        :key="idx"
                    >{{item.name}}</p>
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
import { getBusinessDetail } from "crm/api/business";
import personLabel from "@/module/crm/components/qw-person-label/qw-person-label";
import mixin from '../mixin/mixin.js';

export default {    
    name: 'BusinessInfo',  
    mixins: [mixin],
    components: {
        personLabel
    },
    data(){
        return {            
            detailData: {  // 详情数据
                area1: [
                    {
                        key: 'title',
                        optionName: '商机标题',
                        value: ''
                    },
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
                        key: 'updateTime',
                        optionName: '更新时间',
                        value: ''
                    }
                ],
                area2: [
                    {
                        key: 'clientName',
                        optionName: '所属客户',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'content',
                        optionName: '商机内容',
                        dataName: '内容',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'contactList',
                        optionName: '联系人',
                        dataName: '客户联系人',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'partnerList',
                        optionName: '商机合作伙伴',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'competitorList',
                        optionName: '竞争对手',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'stageName',
                        optionName: '目前阶段',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'businessTypeName',
                        optionName: '商机类别',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'estimatedSale',
                        optionName: '销售额',
                        dataName: '销售额(元)',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'estimatedDate',
                        optionName: '结单日期',
                        show: false,
                        value: ''
                    }
                ],
                area3: [],
                picList: [],
                mediaList: [],
                toPersons: [],
                ccPersons: [],
            }, 
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

        // 获取详情数据
        getDetail(){
            if(this.id === '') return;

            let obj = {
                id: this.id
            }
            getBusinessDetail(obj).then(res => {
                if(res.code == '0'){
                    let { basicList, itemList, tbCrmBusinessInfoPO, mediaList } = res.data;

                    // 区域一赋值
                    this.detailData.area1.map(detailItem => {
                        this.$set(detailItem, 'value', tbCrmBusinessInfoPO[detailItem.key]);        
                    })

                    // 区域二基础字段赋值
                    if(basicList && basicList.length > 0) {
                        this.detailData.area2.map(detailItem => {
                            if(detailItem.key === 'contactList'){  // 联系人列表
                                let arr = [];
                                tbCrmBusinessInfoPO[detailItem.key].map(item => {
                                    let obj = {
                                        name: item.contactName
                                    }
                                    arr.push(obj);
                                });
                                this.$set(detailItem, 'dataList', arr);
                            }
                            else if(detailItem.key === 'partnerList'){  // 合作伙伴列表
                                let arr = [];
                                tbCrmBusinessInfoPO[detailItem.key].map(item => {
                                    let obj = {
                                        name: item.clientName
                                    }
                                    arr.push(obj);
                                });
                                this.$set(detailItem, 'dataList', arr);
                            }
                            else if(detailItem.key === 'competitorList'){  // 竞争对手列表
                                let arr = [];
                                tbCrmBusinessInfoPO[detailItem.key].map(item => {
                                    let obj = {
                                        name: item.competitorName
                                    }
                                    arr.push(obj);
                                });
                                this.$set(detailItem, 'dataList', arr);
                            }
                            else if(detailItem.key === 'content'){
                                let txt = _.checkURL(tbCrmBusinessInfoPO[detailItem.key], true);
                                this.$set(detailItem, 'value', txt);
                            }
                            else{
                                this.$set(detailItem, 'value', tbCrmBusinessInfoPO[detailItem.key]);
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
                                value: _.checkURL(item.optionVal, true),
                                show: true
                            }
                            this.detailData.area3.push(obj);
                        })
                    }

                    // 图片列表
                    this.detailData.picList = tbCrmBusinessInfoPO.picList;

                    // 附件列表
                    this.detailData.mediaList = mediaList;

                    // 负责人
                    this.detailData.toPersons = tbCrmBusinessInfoPO.toPersons;
                    
                    // 相关人
                    this.detailData.ccPersons = tbCrmBusinessInfoPO.ccPersons;

                    this.setTitle(tbCrmBusinessInfoPO.clientName, tbCrmBusinessInfoPO.clientId);
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
