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
                <div class="detail-value">
                    <div class="media-value" v-for="(item,idx) in detailData.picList" :key="idx" >
                        <img class="detail-image" :src="compressURL + item.picPath" alt="">                        
                    </div>         
                    <div v-if="detailData.picList ? detailData.picList.length == 0 : true">-</div>              
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
import { getVisitDetail } from "crm/api/visit";
import personLabel from "@/module/crm/components/qw-person-label/qw-person-label";
import mixin from '../mixin/mixin.js';

export default {    
    name: 'VisitInfo',  
    mixins: [mixin],
    components: {
        personLabel
    },
    data(){
        return {            
            detailData: {  // 详情数据
                area1: [
                    {
                        key: 'outworkTitle',
                        optionName: '拜访标题',
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
                    },
                ],
                area2: [
                    {
                        key: 'outworkContent',
                        optionName: '拜访内容',
                        dataName: '内容',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'clientName',
                        optionName: '拜访客户',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'contactName',
                        optionName: '拜访联系人',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'businessName',
                        optionName: '拜访商机',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'outworkTime',
                        optionName: '拜访时间',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'oswgdTitle',
                        optionName: '外勤单',
                        dataName: '所属外勤单',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'clientAddress',
                        optionName: '客户地址',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'address',
                        optionName: '拜访地址',
                        show: false,
                        value: ''
                    },
                ],
                area3: [],
                picList: [],
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
            getVisitDetail(obj).then(res => {
                if(res.code == '0'){
                    let { basicList, itemList, outworkVO, mediaList } = res.data;

                    // 区域一赋值
                    this.detailData.area1.map(detailItem => {
                        this.$set(detailItem, 'value', outworkVO[detailItem.key]);        
                    })

                    // 区域二基础字段赋值
                    if(basicList && basicList.length > 0) {
                        this.detailData.area2.map(detailItem => {
                            this.$set(detailItem, 'value', _.checkURL(outworkVO[detailItem.key], true));
                            
                            basicList.map(baseItem => {
                                let name = detailItem.dataName || detailItem.optionName;

                                if(name === baseItem.optionName){
                                    detailItem.show = baseItem.status === '1'? true : false;

                                    // 存在客户地址才显示
                                    if(detailItem.key === 'clientAddress'){
                                        detailItem.show = outworkVO[detailItem.key]? true :false;
                                    }

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
                    this.detailData.picList = outworkVO.picList;

                    // 负责人
                    this.detailData.toPersons = outworkVO.toPersons;
                    
                    // 相关人
                    this.detailData.ccPersons = outworkVO.ccPersons;

                    this.setTitle(outworkVO.clientName, outworkVO.clientId);
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
