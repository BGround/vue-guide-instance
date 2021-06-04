<template>
    <div class="client-operate" @click="clickOperate">
        <div class="header">
            <div class="back_btn" @click="back"></div>
            <div><span class="title">客户 /</span> {{clientId? '编辑' : '新建'}}客户</div>
        </div>
        <div class="main">
            <div class="form-item" v-if="fileConfig[0].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[0].required">*</i>
                    <span>客户类别</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[0].warnTips}" @click.stop>
                    <select-area
                        @click="openType"
                        :labelList="selectType"
                        @del="delLabel"
                        type="clientType"
                    ></select-area>
                    <div class="area-tips" v-show="selectType.length > 0">
                        <span>已选择 {{selectType.length}} 类别</span>
                        <span class="edit-btn" @click="openType">修改</span>
                    </div>
                    <div class="error" v-show="fileConfig[0].warnTips">{{fileConfig[0].warnTips}}</div>
                    <div class="industry-wrap">
                        <client-type
                            v-if="showType"
                            :selectedArr="typeArr"
                            @confirm="confirmType"
                        ></client-type>
                    </div>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[1].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[1].required">*</i>
                    <span>客户名称</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[1].warnTips}">
                    <qw-input
                        inputTips="请输入"
                        v-model="fileConfig[1].data"
                        :isWarning="fileConfig[1].warnTips? true : false"
                        :isFocus="fileConfig[1].isFocus"
                        :warningTips="fileConfig[1].warnTips"
                        @blur="nameInput"
                    ></qw-input>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[2].show && !clientId">
                <div class="label">
                    <i class="red" v-if="fileConfig[2].required">*</i>
                    <span>所属公海</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[2].warnTips}">
                    <select-area
                        @click="openPoolSelect"
                        :labelList="selectPool"
                        @del="delLabel"
                        type="pool"
                    ></select-area>
                    <div class="area-tips" v-show="selectPool.length > 0">
                        <span>已选择 {{selectPool.length}} 公海</span>
                        <span class="edit-btn" @click="openPoolSelect">修改</span>
                    </div>
                    <div class="error" v-show="fileConfig[2].warnTips">{{fileConfig[2].warnTips}}</div>
                </div>
                <select-sea
                    :show="showPoolSelect"
                    :poolList="poolList"
                    :poolId="fileConfig[2].data['poolId']"
                    @closePool="closePool"
                    @on-confirm="confirmPool"
                ></select-sea>
            </div>
            <div class="form-item" v-if="fileConfig[3].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[3].required">*</i>
                    <span>客户编码</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[3].warnTips}">
                    <qw-input
                        inputTips="请输入"
                        v-model="fileConfig[3].data"
                        :isWarning="fileConfig[3].warnTips? true : false"
                        :isFocus="fileConfig[3].isFocus"
                        :warningTips="fileConfig[3].warnTips"
                        @blur="handleBlur(fileConfig[3])"
                    ></qw-input>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[4].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[4].required">*</i>
                    <span>区域</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[4].warnTips}">
                    <crm-area v-model="fileConfig[4].data"></crm-area>
                    <div class="error" v-show="fileConfig[4].warnTips">{{fileConfig[4].warnTips}}</div>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[5].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[5].required">*</i>
                    <span>地址</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[5].warnTips}">
                    <qw-input
                        inputTips="请输入"
                        inputType="base"
                        v-model="fileConfig[5].data['address']"
                        class="address-input"
                        :isWarning="fileConfig[5].warnTips? true : false"
                        :warningTips="fileConfig[5].warnTips"
                        @blur="handleBlur(fileConfig[5])"
                    ></qw-input>
                    <span class="map-icon" @click="openMap"></span>
                    <crm-map  v-model="isOpenMap" @on-confirm="confirmMap"></crm-map>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[6].show" >
                <div class="label">
                    <i class="red" v-if="fileConfig[6].required">*</i>
                    <span>行业</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[6].warnTips}" @click.stop>
                    <select-area
                        @click="openIndustry"
                        :labelList="selectIndustry"
                        @del="delLabel"
                        type="industry"
                    ></select-area>
                    <div class="area-tips" v-show="selectIndustry.length > 0">
                        <span>已选择 {{selectIndustry.length}} 行业</span>
                        <span class="edit-btn" @click="openIndustry">修改</span>
                    </div>
                    <div class="error" v-show="fileConfig[6].warnTips">{{fileConfig[6].warnTips}}</div>
                    <div class="industry-wrap">
                        <industry v-if="showIndusty" :selectedArr="industryArr" @confirm="confirmIndustry"></industry>
                    </div>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[7].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[7].required">*</i>
                    <span>联系电话</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[7].warnTips}">
                    <qw-input
                        inputTips="请输入"
                        inputType="base"
                        v-model="fileConfig[7].data"
                        :isWarning="fileConfig[7].warnTips? true : false"
                        :warningTips="fileConfig[7].warnTips"
                        :maxLength="20"
                        @blur="phoneInput"
                    ></qw-input>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[8].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[8].required">*</i>
                    <span>邮箱</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[8].warnTips}">
                    <qw-input
                        inputTips="请输入"
                        inputType="base"
                        v-model="fileConfig[8].data"
                        :isWarning="fileConfig[8].warnTips? true : false"
                        :warningTips="fileConfig[8].warnTips"
                        @blur="handleBlur(fileConfig[8])"
                    ></qw-input>
                </div>
            </div>
            <div class="form-item" v-if="fileConfig[9].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[9].required">*</i>
                    <span>网址</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[9].warnTips}">
                    <qw-input
                        inputTips="请输入"
                        inputType="base"
                        v-model="fileConfig[9].data"
                        :isWarning="fileConfig[9].warnTips? true : false"
                        :warningTips="fileConfig[9].warnTips"
                        @blur="handleBlur(fileConfig[9])"
                    ></qw-input>
                </div>
            </div>
            <div class="split-line"></div>

            <!-- 自定义字段 -->
            <div class="custom-wrap">
                <div class="form-item" v-for="(item,idx) in customConfig" :key="idx">
                    <div class="label">
                        <i class="red" v-if="item.required">*</i>
                        <span>{{item.optionName}}</span>
                    </div>
                    <div class="field" :class="{errorTips: item.warnTips}">
                        <div v-if="item.type === '1' || item.type === '5' || item.type === '2' || item.type === '3'">
                            <qw-input
                                v-model="item.data"
                                :inputType="item.type === '2'? 'textarea' : 'base'"
                                :maxLength="item.type === '2'? 2000 : 200"
                                :inputTips="item.placeholder"
                                @blur="handleBlur(item)"
                            ></qw-input><span v-if="item.ext === '3'" class="gray"> %</span>
                        </div>
                        <qw-select
                            v-model="item.data"
                            v-else-if="item.type === '0'"
                            :dataList="item.optionData"
                        ></qw-select>
                        <client-date v-else :item="item"></client-date>

                        <div class="error" v-show="item.warnTips">{{item.warnTips}}</div>
                    </div>
                </div>
            </div>
            <div class="custom-tips">可在设置中启用更多自定义字段</div>
            <div class="split-line"></div>

            <div class="form-item" v-if="fileConfig[10].show">
                <div class="label">
                    <i class="red" v-if="fileConfig[10].required">*</i>
                    <span>备注</span>
                </div>
                <div class="field" :class="{errorTips: fileConfig[10].warnTips}">
                    <qw-input
                        inputTips="请输入"
                        inputType="textarea"
                        :maxLength="200"
                        v-model="fileConfig[10].data"
                        :isWarning="fileConfig[10].warnTips? true : false"
                        :warningTips="fileConfig[10].warnTips"
                        @blur="handleBlur(fileConfig[10])"
                    ></qw-input>
                </div>
            </div>
            <div class="form-item">
                <div class="label">
                    <span>图片</span>
                </div>
                <div class="field">
                    <upload-img :uploadConfig="picOption" @moreImgUpload="dealUpload"></upload-img>
                    <span class="fileTip">支持jpg、jpeg、png</span>
                </div>
            </div>
            <div class="form-item">
                <div class="label">
                    <span>附件</span>
                </div>
                <div class="field">
                    <qw-upload-wrap
                            :fileList="fileList"
                            :limit="100"
                            :beforeUpload="beforeUploadFile"
                            :onSuccess="handleSuccessFile"
                            :onRemove="handleRemoveFile"
                    >
                        <qw-button>上传</qw-button>
                    </qw-upload-wrap>
                    <span class="fileTip">仅支持 .txt .xml .pdf .doc .docx .ppt .pptx .xls .xlsx .wma .amr .mp3 .mp4 .rar .zip</span>
                </div>
            </div>
            <div class="split-line"></div>
            <div class="form-item">
                <div class="label">
                    <i class="red">*</i>
                    <span>负责人</span>
                </div>
                <div class="field" :class="{errorTips: toWarnTips}">
                    <pick-exam
                        :useTab="defaultTags"
                        :useUsers="toPersonList"
                        :isShowRadios="false"
                        @chooseDone="chooseToPerson"
                        :maxUser="maxUser"
                    ></pick-exam>
                    <div class="error" v-show="toWarnTips">负责人不能为空</div>
                </div>
            </div>
            <div class="form-item">
                <div class="label">
                    <span>相关人</span>
                </div>
                <div class="field">
                    <pick-exam
                        :useTab="defaultTags"
                        :useUsers="ccPersonList"
                        :isShowRadios="false"
                        @chooseDone="chooseCcPerson"
                    ></pick-exam>
                </div>
            </div>
            <div class="form-item">
                <div class="label">
                    <span>通知</span>
                </div>
                <div class="field">
                    <qw-check-box v-model="notifyCCperson">相关人</qw-check-box>
                </div>
            </div>
            <div class="bottom" v-perm="'clientSave'">
                <qw-button type="primary" @click="submit">保存</qw-button>
            </div>
        </div>
    </div>
</template>
<script>
import selectArea from 'crm/components/selectArea/selectArea';
import QwInput from '@/components/qwuiBase/qwuiInput/qwuiInput';
import QwButton from '@/components/qwuiBase/qwuiButton/qwuiButton';
import QwSelect from '@/components/qwuiBase/qwuiSelect/QwSelect';
import UploadImg from '@/components/Add/uploadImg/QwUploadImg';
import QwUploadWrap from '@/components/Add/Upload/QwUploadWrap';
import PickExam from '@/components/pickPerson/pickExam';
import QwCheckBox from '@/components/qwuiBase/qwuiCheckbox/qwuiCheckbox';
import ClientDate from './components/date';
import SelectSea from 'crm/components/qw-selectSea/qw-selectSea';
import CrmArea from 'crm/components/qwAddress/index';
import CrmMap from 'crm/components/qwMap';
import Industry from 'crm/components/industry/industry';
import ClientType from 'crm/components/clientType/clientType';
import poolIcon from 'assets/images/crm/ic_orange_twoPeople.png';
import industryIcon from 'assets/images/crm/icon_industry_default.png';
import typeIcon from 'assets/images/crm/icon_client_type.png';
import { getClientItem, addClient, getEditDetail, editClient, validPhone, checkToPerson } from 'crm/api/client';
import { getPoolList } from 'crm/api/territorialSea';

export default {
    name: 'ClientOperate',
    components: {
        selectArea,
        QwInput,
        QwButton,
        QwSelect,
        UploadImg,
        QwUploadWrap,
        PickExam,
        QwCheckBox,
        ClientDate,
        SelectSea,
        CrmArea,
        CrmMap,
        Industry,
        ClientType
    },
    data() {
        return {
            picOption: {  // 上传图片配置
                agent: 'crm',
                uploadFileId: 'coverImg',
                showType: 'large',
                isMoreImg: true,
                imageObj: {
                    imageURL: '',
                    fileName: ''
                }
            },
            fileList:[],  // 上传的文件列表
            defaultTags:[  // 选人配置
                {text:'标签人员'},
                {text:'特定人员'},
                {text:'批量导入'},
                {text:'高级筛选'},
            ],
            toPersonList: [],  // 负责人数组
            ccPersonList: [],  // 相关人数组
            fileConfig: [  // 固定字段配置
                {
                    key: 'typeList',
                    optionName: '客户类别',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'clientName',
                    optionName: '客户名称',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'pool',
                    optionName: '所属公海',
                    show: false,
                    required: false,
                    data: {
                        poolId: '',
                        poolName: ''
                    }
                },
                {
                    key: 'clientCode',
                    optionName: '客户编码',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'area',
                    optionName: '区域',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'address',
                    optionName: '地址',
                    show: false,
                    required: false,
                    data: {
                        address: '',
                        latitude: '',
                        longitude: ''
                    }
                },
                {
                    key: 'industryList',
                    optionName: '行业',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'phone',
                    optionName: '联系电话',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'email',
                    optionName: '邮箱',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'website',
                    optionName: '网址',
                    show: false,
                    required: false,
                    data: ''
                },
                {
                    key: 'remark',
                    optionName: '备注',
                    show: false,
                    required: false,
                    data: ''
                }
            ],
            customConfig: [],  // 自定义字段配置
            notifyCCperson: false,  // 通知相关人
            showPoolSelect: false,  // 是否显示选择公海
            poolList: [],  // 公海列表
            isOpenMap: false,  // 是否打开地图
            showIndusty: false,  // 是否显示行业
            industryArr: [],  // 已选行业
            selectPool: [],  // 已经选择公海
            selectClientType: [],  // 已选择客户类别
            selectIndustry: [],  // 已选择行业
            toPerson: '',  // 负责人
            ccPerson: '',  // 相关人
            fileArr: [],  // 附件列表
            fileIds: '',  // 附件id
            imgUrls: '',  // 图片地址
            clientId: this.$route.query.id || '',  // 客户id
            nameRepeat: false,  // 名称是否重复
            phoneRepeat: false,  // 电话是否重复
            typeArr: [],  // 已选客户列表
            showType: false,  // 是否显示选择客户类型
            selectType: [],  // 已选择类别
            maxUser: 5000,  // 负责人是否多选
            toWarnTips: false  // 是否显示负责人提示
        }
    },
    created() {
        this.init();
    },
    methods: {
        // 初始化
        init() {
            if(this.clientId === ''){
                this.getClientCode();
            }
            this.checkToPerson();
            this.getClientItem();
        },

        // 获取客户字段信息
        getClientItem() {
            getClientItem().then(res => {
                if(res.code === '0'){
                    let { basicList, list } = res.data;

                    // 固定字段
                    if(basicList && basicList.length > 0){
                        basicList.map(baseItem => {
                            this.fileConfig.map(fileItem => {
                                if(fileItem.optionName === baseItem.optionName){
                                    this.$set(fileItem, 'show', baseItem.status === '1'? true : false);
                                    this.$set(fileItem, 'required', baseItem.isMust === '1'? true : false);
                                }
                            })
                        })
                    }

                    // 自定义字段
                    if(list && list.length > 0){
                        list.map(item => {
                            // 输入框placeholder
                            let placeholder = '';
                            if(item.type !== '0'){
                                if(item.list.length > 0){
                                    placeholder = item.list[0].name || '请输入';
                                }
                                else{
                                    placeholder = '请输入';
                                }
                            }

                            let obj = {
                                key: item.id,
                                optionName: item.optionName,
                                required: item.isMust === '1'? true : false,
                                type: item.type,
                                ext: item.ext1,  // 判断是否小数(1)、整数(2)或百分比(3)
                                placeholder: placeholder,
                                data: ''
                            }

                            // 下拉框
                            if(item.type === '0'){
                                let arr = [];
                                item.list.map(item => {
                                    let ItemObj = {
                                        optionName: item.name,
                                        val: item.id
                                    }
                                    arr.push(ItemObj);
                                });
                                obj.optionData = arr;
                            }
                            this.customConfig.push(obj);
                        })
                    }

                    // 插入字段后请求编辑数据
                    if(this.clientId){
                        this.getEditDetail();
                    }
                }
                else{
                    _.alert('提示', res.desc);
                }
            })
        },

        // 获取客户编码
        getClientCode() {
            let currentDate = new Date();
            let year = currentDate.getFullYear();
            let month = currentDate.getMonth() + 1;
            let day = currentDate.getDate();
            let hours = currentDate.getHours();
            let min = currentDate.getMinutes();
            let second = currentDate.getSeconds();

            this.fileConfig[3].data = `${year}${month}${day}${hours}${min}${second}`;
        },

        // 获取编辑详情
        getEditDetail() {
            getEditDetail({id: this.clientId}).then(res => {
                if(res.code === '0'){
                    // 固定字段赋值
                    let { tbCrmClientInfoPO, itemList, mediaList } = res.data;

                    // 客户类别
                    let typeNameArr = [];
                    if(tbCrmClientInfoPO.typeList){
                        let list = tbCrmClientInfoPO.typeList;
                        list.map(item => {
                            let obj = {
                                icon: typeIcon,
                                key: item.typeId,
                                val: item.typeName
                            }
                            this.typeArr.push(item.typeId);
                            typeNameArr.push(item.typeName);
                            this.selectType.push(obj);
                        });
                        this.fileConfig[0].data = typeNameArr.join('|');
                    }

                    this.fileConfig[1].data = tbCrmClientInfoPO.clientName;  // 客户名称
                    this.fileConfig[2].data = {  // 所属公海
                        poolId: tbCrmClientInfoPO.poolId,
                        poolName: tbCrmClientInfoPO.poolName
                    };
                    this.fileConfig[3].data = tbCrmClientInfoPO.clientCode;  // 客户编码
                    this.fileConfig[4].data = {  // 区域
                        city: {
                            name: tbCrmClientInfoPO.cityCode
                        },
                        county: {
                            name: tbCrmClientInfoPO.areaCode
                        },
                        province: {
                            name: tbCrmClientInfoPO.provinceCode
                        },
                        other: tbCrmClientInfoPO.country
                    };
                    this.fileConfig[5].data.address = tbCrmClientInfoPO.address;  // 地址

                    // 行业赋值
                    let nameArr = [];
                    if(tbCrmClientInfoPO.industryList){
                        let list = tbCrmClientInfoPO.industryList;
                        list.map(item => {
                            let obj = {
                                icon: industryIcon,
                                key: item.industryId,
                                val: item.industryName
                            }
                            this.industryArr.push(item.industryId);
                            nameArr.push(item.industryName);
                            this.selectIndustry.push(obj);
                        });
                        this.fileConfig[6].data = nameArr.join('|');
                    }

                    this.oldPhone = tbCrmClientInfoPO.phone;
                    this.fileConfig[7].data = tbCrmClientInfoPO.phone;  // 电话
                    this.fileConfig[8].data = tbCrmClientInfoPO.email;  // 邮箱
                    this.fileConfig[9].data = tbCrmClientInfoPO.website;  // 网址
                    this.fileConfig[10].data = tbCrmClientInfoPO.remark;  // 备注

                    // 自定义字段赋值
                    if(itemList && itemList.length > 0){
                        itemList.map(listItem => {
                            this.customConfig.map(customItem => {
                                if(listItem.fieldId === customItem.key){
                                    customItem.data = listItem.fieldValue;
                                    customItem.id = listItem.id;
                                }
                            })
                        });
                    };

                    // 图片
                    let imgArr = [];
                    let urls = [];
                    if(tbCrmClientInfoPO.picList){
                        let list = tbCrmClientInfoPO.picList;
                        list.map(item => {
                            let obj = {
                                imageURL: item.picPath,
                                fileName: '',
                            }
                            imgArr.push(obj);
                            urls.push(item.picPath);
                        });
                        this.$set(this.picOption, 'moreList', imgArr);
                        this.imgUrls = urls.join(',');
                    }

                    // 附件
                    let mediaRes = [];
                    mediaList.map(item => {
                        mediaRes.push(item.id);
                    });
                    this.fileList = mediaList;
                    this.fileIds = mediaRes.join(',');

                    // 负责人赋值
                    let toRes = [];
                    tbCrmClientInfoPO.toPersons.map(item => {
                        toRes.push(item.userId);
                    });
                    this.toPersonList = tbCrmClientInfoPO.toPersons;
                    this.toPerson = toRes.join('|');

                    // 相关人赋值
                    let ccRes = [];
                    tbCrmClientInfoPO.ccPersons.map(item => {
                        ccRes.push(item.userId);
                    });
                    this.ccPersonList = tbCrmClientInfoPO.ccPersons;
                    this.ccPerson = ccRes.join('|');
                }
                else{
                    _.alert('提示信息', res.desc);
                }
            })
        },

        //上传图片返回的数据
        dealUpload(imgArr) {
            let url = [];
            imgArr.map(item => {
                url.push(item.imageURL);
            })
            this.imgUrls = url.join(',');
        },

        //上传附件前处理
        beforeUploadFile(file) {
            let size = file.size;
            let fileName = file.name;
            let isExt = fileName.lastIndexOf(".");
            let fileExt = fileName.substr(isExt).toLowerCase();//获得文件后缀名
            if(!(".txt.xml.pdf.doc.ppt.xls.docx.pptx.xlsx.mp3.wma.amr.mp4.rar.zip".includes(fileExt))) {
                dataBase.top_alert('只能上传txt,xml,pdf,doc,ppt,xls,docx,pptx,xlsx,mp3,wma,amr,mp4,rar,zip；如需上传其它格式文件请先将其压缩后再上传',false,3000);
                return false;
            }
            if(_.is_vip && size > 50*1024000) {
                dataBase.top_alert('文件大小不超过50M',false,3000);
                return false;
            }
            else if(size>10*1024000) {
                dataBase.top_alert('文件大小不超过10M',false,3000);
                return false;
            }
            return true;
        },

        //处理上传附件删除
        handleRemoveFile(file, fileList) {
            this.getFileIds();
        },

        //处理上传附件成功
        handleSuccessFile(file) {
            this.fileArr.push.apply(this.fileArr,file);
            this.getFileIds(this.fileArr);
        },

        //上传附件
        getFileIds(){
            let ids = [];
            this.fileList.forEach((file) => {
                ids.push(file.id);
            });
            this.fileIds = ids.join(',');
        },

        // 负责人 选人组件回调
        chooseToPerson(dept, tag, user){
            let userResult = []
            user.map(item => {
                userResult.push(item.userId)
            })
            this.toPerson =  userResult.join('|');
        },

        // 相关人 选人组件回调
        chooseCcPerson(dept, tag, user){
            let userResult = []
            user.map(item => {
                userResult.push(item.userId)
            })
            this.ccPerson =  userResult.join('|');
        },

        // 电话名字验证
        vaildRepeate(type) {
            let name = type === 'client'? this.fileConfig[1].data : '';
            let phone = type === 'phone'? this.fileConfig[7].data : '';
            let obj = {
                'tbCrmClientInfoPO.clientName': name,
                'tbCrmClientInfoPO.phone': phone,
                'tbCrmClientInfoPO.id': this.clientId
            }

            if(type === 'client' && name === ''){
                return;
            }
            else if(type === 'phone' && phone === ''){
                return;
            }

            let idx = type === 'client'? 1 : 7;
            validPhone(obj).then(res => {
                if(res.code === '0'){
                    type === 'client'? this.nameRepeat = false : this.phoneRepeat = false;
                    this.$set(this.fileConfig[idx], 'warnTips', '');
                }
                else{
                    type === 'client'? this.nameRepeat = true : this.phoneRepeat = true;
                    this.$set(this.fileConfig[idx], 'warnTips', res.desc);
                }
                this.$set(this.fileConfig[idx], 'isFocus', false);
            })

        },

        // 提交数据
        submit() {
            let isPass = true;
            let baseList = this.fileConfig;
            let customList = this.customConfig;

            // 固定字段验证
            for(let i = 0; i < baseList.length; i++){
                // 必填验证
                if(baseList[i].key === 'pool'){
                    if(baseList[i].show && baseList[i].required && baseList[i].data['poolId'] === ''){
                        isPass = false;
                        this.$set(baseList[i], 'warnTips', `${baseList[i].optionName}不能为空`);
                        continue;
                    }
                    else{
                        this.$set(baseList[i], 'warnTips', '');
                    }
                }
                else if(baseList[i].key === 'area'){
                    if(baseList[i].show && baseList[i].required && !(baseList[i].data['province'] && baseList[i].data['city'] && baseList[i].data['county'])){
                        if(!baseList[i].data['other']){
                            isPass = false;
                            this.$set(baseList[i], 'warnTips', `${baseList[i].optionName}不能为空`);
                            continue;
                        }
                        else{
                            this.$set(baseList[i], 'warnTips', '');
                        } 
                    }
                    else{
                        this.$set(baseList[i], 'warnTips', '');
                    }
                }
                else if(baseList[i].key === 'address'){
                    if(baseList[i].show && baseList[i].required && baseList[i].data['address'] === ''){
                        isPass = false;
                        this.$set(baseList[i], 'warnTips', `${baseList[i].optionName}不能为空`);
                        continue;
                    }
                    else{
                        this.$set(baseList[i], 'warnTips', '');
                    }
                }
                else{
                    if(baseList[i].show && baseList[i].required && baseList[i].data === ''){
                        isPass = false;
                        this.$set(baseList[i], 'warnTips', `${baseList[i].optionName}不能为空`);
                        continue;
                    }
                    else{
                        this.$set(baseList[i], 'warnTips', '');
                    }
                }

                // 电话验证
                if(baseList[i].key === 'phone'){
                    let reg =  /^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g;
                    let isPhone = reg.test(baseList[i].data);

                    if(baseList[i].data !== '' && !isPhone){
                        isPass = false;
                        this.$set(baseList[i], 'warnTips', '请输入正确的联系电话');
                    }
                    else{
                        if(!this.phoneRepeat){
                            this.$set(baseList[i], 'warnTips', '');
                        }
                    }
                }

                // 邮箱验证
                if(baseList[i].key === 'email'){
                    let reg =  /^\w+([-+.]\w+)*@\w+([-.]\w+)*.\w+([-.]\w+)*$/g;
                    let isEmail = reg.test(baseList[i].data);

                    if(baseList[i].data !== '' && !isEmail){
                        isPass = false;
                        this.$set(baseList[i], 'warnTips', '请输入正确的邮箱');
                    }
                    else{
                        this.$set(baseList[i], 'warnTips', '');
                    }
                }
            }

            // 验证电话名字重复
            if(this.nameRepeat){
                this.$set(this.fileConfig[1], 'isFocus', true);
                return;
            }
            if(this.phoneRepeat){
                this.$set(this.fileConfig[7], 'isFocus', true);
                return;
            }

            // 自定义字段验证
            let customArr = [];
            for(let i = 0; i < customList.length; i++){
                // 必填验证
                if(customList[i].required && customList[i].data === ''){
                    isPass = false;
                    this.$set(customList[i], 'warnTips', `${customList[i].optionName}不能为空`);
                    continue;
                }
                else{
                    this.$set(customList[i], 'warnTips', ``);
                }

                // 电话验证
                if(customList[i].type === '3'){
                    let reg =  /^((\d{5,15})|(\d{4}|\d{3})-(\d{7,8})(-\d{3,6})?)$/g;
                    let isPhone = reg.test(customList[i].data);

                    if(customList[i].data !== '' && !isPhone){
                        isPass = false;
                        this.$set(customList[i], 'warnTips', '请输入正确的联系方式');
                    }
                    else{
                        this.$set(customList[i], 'warnTips', '');
                    }
                }

                // 整数验证
                if(customList[i].type === '5' && customList[i].ext){
                    let tips = this.errorWarning(customList[i].data, customList[i].ext);
                    if(tips){
                        isPass = false;
                        this.$set(customList[i], 'warnTips', `${customList[i].optionName}输入${tips}`);
                    }
                    else{
                        this.$set(customList[i], 'warnTips', '');
                    }
                }

                let fieldValue = customList[i].data;
                if(customList[i].type === '5' && customList[i].ext === '3'){
                    fieldValue = customList[i].data? `${customList[i].data}%` : '';
                }

                let obj = {
                    fieldId: customList[i].key,
                    fieldName: customList[i].optionName,
                    fieldValue: fieldValue,
                    id: customList[i].id || ''
                }
                customArr.push(obj);
            }

            // 滚动到相应位置
            this.$nextTick(() => {
                if(document.querySelector('.errorTips')){
                    document.querySelector('.errorTips').scrollIntoView();
                }
            })

            if(!isPass) return;

            // 负责人不能为空
            if(!this.toPerson){
                this.toWarnTips = true;
                return;
            }
            else{
                this.toWarnTips = false;
            }

            // 拼接自定义字段json
            let customObj = {
                list: customArr
            }
            let province = '';
            if(this.fileConfig[4].data){
                if(this.fileConfig[4].data.province.value){
                    province = this.fileConfig[4].data.province.value
                }
                else if(this.fileConfig[4].data.other){
                    province = '其他';
                }
            }

            // 传给后台的参数
            let params = {
                'typeId': this.typeArr.join(','),
                'tbCrmClientInfoPO.typeNames': this.fileConfig[0].data,
                'tbCrmClientInfoPO.clientName': this.fileConfig[1].data,
                'tbCrmClientInfoPO.clientCode': this.fileConfig[3].data,
                'tbCrmClientInfoPO.provinceCode': province,
                'tbCrmClientInfoPO.cityCode': this.fileConfig[4].data && this.fileConfig[4].data.city? this.fileConfig[4].data.city.value : '',
                'tbCrmClientInfoPO.areaCode': this.fileConfig[4].data && this.fileConfig[4].data.county? this.fileConfig[4].data.county.value : '',
                'tbCrmClientInfoPO.country': this.fileConfig[4].data? this.fileConfig[4].data.other : '',
                'tbCrmClientInfoPO.address': this.fileConfig[5].data.address,
                'tbCrmClientInfoPO.latitude': this.fileConfig[5].data.latitude,
                'tbCrmClientInfoPO.longitude': this.fileConfig[5].data.longitude,
                'industryId': this.industryArr.join(','),
                'tbCrmClientInfoPO.industry': this.fileConfig[6].data,
                'tbCrmClientInfoPO.phone': this.fileConfig[7].data,
                'tbCrmClientInfoPO.email': this.fileConfig[8].data,
                'tbCrmClientInfoPO.website': this.fileConfig[9].data,
                'tbCrmClientInfoPO.remark': this.fileConfig[10].data,
                'itemJson': JSON.stringify(customObj),
                'userIds': this.toPerson,
                'givenUserIds': this.ccPerson,
                'mediaIds': this.fileIds,
                'imgurl': this.imgUrls,
                'tbCrmClientInfoPO.clientStatus': '1',
                'submitType': this.notifyCCperson? '1' : '0'
            }

            if(this.clientId){
                params['tbCrmClientInfoPO.id'] = this.clientId;
            }
            else{
                params['tbCrmClientInfoPO.poolName'] = this.fileConfig[2].data.poolName;
                params['tbCrmClientInfoPO.poolId'] = this.fileConfig[2].data.poolId;
            }


            this.clientId? this.editClient(params) : this.addClient(params);
        },

        // 新增客户
        addClient(params) {
            addClient(params).then(res => {
                if(res.code === '0'){
                    dataBase.top_alert('新增成功', true, 1500);
                    this.$router.push({name: 'clientList'});
                }
                else{
                    _.alert('提示信息', res.desc);
                }
            })
        },

        // 编辑客户
        editClient(params) {
            editClient(params).then(res => {
                if(res.code === '0'){
                    dataBase.top_alert('更新成功', true, 1500);
                    this.$router.push({name: 'clientList'});
                }
                else{
                    _.alert('提示信息', res.desc);
                }
            })
        },

        // 自定义字段数值类型错误提示
        errorWarning(value, ext) {
            if (value) {
                let arr = [
                    {
                        key: '1',
                        reg: /^(\-)?[0-9]+$/,
                        label: '整数'
                    },{
                        key: '2',
                        reg: /^(\-)?\d+(\.\d{1,2})?$/,
                        label: '小数, 小数须精确到小数点后两位'
                    },{
                        key: '3',
                        reg: /^(\-)?\d+(\.\d{1,2})?$/,
                        label: '小数或整数, 小数须精确到小数点后两位'
                    },
                ];
                let text = '';
                for(let i = 0; i < arr.length ; i++) {
                    if (ext == arr[i].key) {
                        if(!arr[i].reg.test(value)) {
                            text = arr[i].label;
                            break;
                        }
                    }
                }
                return text;
            } else {
                return '';
            }
        },

        // 失焦函数
        handleBlur(item) {
            this.$set(item, 'isFocus', false);
        },

        // 打开选择公海
        openPoolSelect() {
            this.showPoolSelect = true;
            getPoolList().then(res => {
                if (res.code == '0') {
                    this.poolList = res.data.CrmClientPoolConfigList;
                }
                else {
                    _.alert('提示', res.desc)
                }
            })
        },

        // 关闭选择公海
        closePool() {
            this.showPoolSelect = false;
        },

        // 确定选择公海
        confirmPool(obj) {
            let poolObj = {
                icon: poolIcon,
                key: obj.val,
                val: obj.optionName
            }
            this.selectPool = [];
            this.closePool();

            this.$set(this.fileConfig[2].data, 'poolId', obj.val);
            this.$set(this.fileConfig[2].data, 'poolName', obj.optionName);
            this.selectPool.push(poolObj);
        },

        // 确认地址
        confirmMap(obj) {
            this.fileConfig[5].data = {
                address: obj.address,
                latitude: obj.lat,
                longitude: obj.lng
            }
        },

        // 打开地图
        openMap() {
            this.isOpenMap = true;
        },

        // 确定行业
        confirmIndustry(arr) {
            let nameArr = [];
            let labelArr = [];
            this.industryArr = [];

            arr.map(item => {
                let obj = {
                    icon: industryIcon,
                    key: item.key,
                    val: item.title
                }

                this.industryArr.push(item.key);
                nameArr.push(item.title);
                labelArr.push(obj);
            });
            this.fileConfig[6].data = nameArr.join('|');
            this.selectIndustry = labelArr;
            this.closeIndustry();
        },

        // 打开行业
        openIndustry() {
            this.showIndusty = true;
        },

        // 关闭行业
        closeIndustry() {
            this.showIndusty = false;
        },

        // 删除标签
        delLabel(key, type) {
            if(type === 'pool'){
                this.selectPool = [];
                this.fileConfig[2].data = {
                    poolId: '',
                    poolName: ''
                }
            }
            else if(type === 'industry'){
                let index = 0;
                let arr = [];
                this.selectIndustry.map((item,idx) => {
                    if(item.key === key){
                        this.industryArr.splice(idx, 1);
                        index = idx;
                    }
                    else{
                        arr.push(item.val);
                    }
                });
                this.$set(this.fileConfig[6], 'data', arr.join('|'));
                this.selectIndustry.splice(index, 1);
                this.closeIndustry();
            }
            else if(type === 'clientType'){
                let index = 0;
                let arr = [];
                this.selectType.map((item,idx) => {
                    if(item.key === key){
                        this.typeArr.splice(idx, 1);
                        index = idx;
                    }
                    else{
                        arr.push(item.val);
                    }
                });
                this.$set(this.fileConfig[0], 'data', arr.join('|'));
                this.selectType.splice(index, 1);
                this.closeType();
            }
        },

        // 输入名字
        nameInput() {
            this.vaildRepeate('client');
        },

        // 输入电话
        phoneInput() {
            this.vaildRepeate('phone');
        },

        // 打开客户类型
        openType() {
            this.showType = true;
        },

        // 关闭客户类型
        closeType() {
            this.showType = false;
        },

        // 确认客户类型
        confirmType(arr) {
            let nameArr = [];
            let labelArr = [];
            this.typeArr = [];

            arr.map(item => {
                let obj = {
                    icon: typeIcon,
                    key: item.key,
                    val: item.title
                }

                this.typeArr.push(item.key);
                nameArr.push(item.title);
                labelArr.push(obj);
            });
            this.fileConfig[0].data = nameArr.join('|');
            this.selectType = labelArr;
            this.closeType();
        },

        // 点击页面
        clickOperate() {
            this.closeIndustry();
            this.closeType();
        },

        // 是否多个负责人
        checkToPerson() {
            checkToPerson({agentCode: 'client'}).then(res => {
                if(res.code === '0'){
                    let { is_photograph } = res.data;
                    this.maxUser = is_photograph === '1'? 5000 : 1;
                }
                else{
                    _.alert('提示信息', res.desc);
                }
            });
        },

        // 返回
        back() {
            this.$router.go(-1);
        }
    }
}
</script>
<style lang='scss' scoped>
.client-operate{
    .header{
        display: flex;
        margin: 12px 0 20px 0;
        height: 40px;
        color: #808080;
        line-height: 40px;
        .title{
            color: #A6A6A6;
        }
        .back_btn{
            margin-right: 15px;
            width: 30px;
            height: 40px;
            background: url('~assets/images/back_icon.png') no-repeat center;
            cursor: pointer;
        }
    }
    .main{
        .form-item{
            display: flex;
            margin-bottom: 20px;
            .label{
                margin-right: 20px;
                width: 127px;
                line-height: 32px;
                text-align: right;
                .red{
                    color: red;
                }
            }
            .field{
                position: relative;
                .gray{
                    color: gray;
                }
                .fileTip{
                    position: absolute;
                    top: 5px;
                    left: 70px;
                    height: 20px;
                    font-size: 13px;
                    color: #A6A6A6;
                    white-space: nowrap;
                }
                .map-icon{
                    position: absolute;
                    display: inline-block;
                    top: 8px;
                    right: 10px;
                    width: 17px;
                    height: 17px;
                    background: url('~assets/images/crm/icon_map.png') no-repeat center;
                    background-size: 100%;
                    cursor: pointer;
                }
                /deep/ .address-input{
                    .qw_baseInput{
                        padding-right: 25px;
                    }
                }
                /deep/ .qwui-click_choose{
                    width: 340px;
                    box-sizing: border-box;
                }
                /deep/ .sure-btn{
                    top: 0;
                }
                /deep/ .qwui-upload{
                    margin-bottom: 8px;
                }
                /deep/ .qw-select,
                /deep/ .qw_textarea{
                    padding-left: 10px;
                }
                /deep/ .qw_textInput{
                    padding-right: 50px;
                }
                .industry-wrap{
                    position: absolute;
                    top: 48px;
                    z-index: 1;
                    width: 100%;
                }
                .area-tips{
                    margin-top: 8px;
                    font-size: 12px;
                    color: #A6A6A6;
                    .edit-btn{
                        margin-left: 5px;
                        color: #409EFF;
                        cursor: pointer;
                    }
                }
            }
            /deep/ .qw-address > div{
                margin-top: 0;
            }
            .errorTips{
                /deep/ .qwui-select_wrap,
                /deep/ .qw_input,
                /deep/ .qw_textarea,
                /deep/ .datepicker > input,
                /deep/ .select-area,
                /deep/ .qwui-click_choose{
                    border: 1px solid #F56262;
                }
            }
            .error{
                color: #F56262;
            }
        }
        .custom-wrap{
            .form-item:last-child{
                margin-bottom: 0;
            }
        }
        .split-line{
            margin: 40px 0;
            height: 1px;
            background: url('~assets/images/dashed.png') center;
        }
        .custom-tips{
            margin: 8px 0 0 145px;
            font-size: 13px;
            color: #A6A6A6;
        }
    }
    .bottom{
        margin-top: 50px;
        padding: 20px 0 40px;
        border-top: 1px solid #eee;
        text-align: center;
    }
}
</style>
