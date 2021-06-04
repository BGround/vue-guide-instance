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
import { getContactDetail } from "crm/api/contact";
import personLabel from "@/module/crm/components/qw-person-label/qw-person-label";
import mixin from '../mixin/mixin.js';

export default {    
    name: 'ContactInfo',  
    mixins: [mixin],
    components: {
        personLabel
    },
    data(){
        return {            
            detailData: {  // 详情数据
                area1: [
                    {
                        key: 'contactsName',
                        optionName: '联系人',
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
                        key: 'position',
                        optionName: '职位',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'mobile',
                        optionName: '手机',
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
                        key: 'birthday',
                        optionName: '生日',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'schoolName',
                        optionName: '毕业院校',
                        show: false,
                        value: ''
                    },
                    {
                        key: 'hobby',
                        optionName: '兴趣爱好',
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
            getContactDetail(obj).then(res => {
                if(res.code == '0'){
                    let { basicList, itemList, tbCrmContactsInfoPO, mediaList } = res.data;

                    // 区域一赋值
                    this.detailData.area1.map(detailItem => {
                        this.$set(detailItem, 'value', tbCrmContactsInfoPO[detailItem.key]);        
                    })

                    // 区域二基础字段赋值
                    if(basicList && basicList.length > 0) {
                        this.detailData.area2.map(detailItem => {
                            this.$set(detailItem, 'value', _.checkURL(tbCrmContactsInfoPO[detailItem.key], true));
                            
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
                    this.detailData.picList = tbCrmContactsInfoPO.picList;

                    // 负责人
                    this.detailData.toPersons = tbCrmContactsInfoPO.toPersons;
                    
                    // 相关人
                    this.detailData.ccPersons = tbCrmContactsInfoPO.ccPersons;

                    this.setTitle(tbCrmContactsInfoPO.clientName, tbCrmContactsInfoPO.clientId);
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
