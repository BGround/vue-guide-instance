<template>
	<div class="form-content form-bg">
		<div class="form-group" v-for="field in combineList" :key="field.id" v-show="field.show">
			<div class="form-label" v-if="field._type!='SectionBreak'">
				<label class="control-label">{{ field.label}}</label>
				<span v-show="field.validations&&field.validations.indexOf('presence')!=-1 && !field.disabled" class="colorRed"> *</span>
				<span class="form-label-icon fr icon-edit" v-if="field.fieldEdit && field._type != 'ImageCheckBox'" @click="setEdit" >
				</span>
				<span class="form-label-icon fr icon-history" v-if="field.history" @click="showHistory(field._id,field.label)"></span>
				<div class="field-notes" v-if="field.notes&&(field._type == 'ImageCheckBox'||!(field.disabled||field.readonly||field._type=='RatingField'||field._type=='GeoField'||field._type=='RadioButton'||field._type=='CheckBox'||field._type=='ImageField'||field._type=='DropDown'||field._type=='CascadeDropDown'||field._type=='CityField'||field._type=='AccessoryField'||field._type=='ImageRadioButton'||field._type=='SectionBreak'))" v-html="formatNotes(field.notes, field._type)"></div>
			</div>
			<component ref='formbase_component' v-bind:is="getFieldComponent(field)" :id="'field'+field._id" :field="field" @selectUser="handleSelectUser" @change="setValue"></component>
			<div class="help-block colorRed" :id="'msg'+field._id" v-if="field.help">{{ field.help }}</div>
		</div>
	</div>
</template>

<script>

	import TextField from './fields/textField'
	import TextAreaField from './fields/textAreaField'
	import RadioButtonField from './fields/radioButtonField'
	import CheckBoxField from './fields/checkBoxField'
	import CheckBoxDropField from './fields/CheckBoxDropField'
	import DropDownField from './fields/dropDownField'
	import NumberField from './fields/numberField'
	import EmailField from './fields/emailField'
	import TelephoneField from './fields/telephoneField'
	import CityField from './fields/cityField'
	import MobileField from './fields/mobileField'
	import EquationField from './fields/equationField'
	import ImageCheckBox from './fields/imageCheckBox'
	import SectionBreak from './fields/sectionBreak'
	import CascadeDropDown from './fields/cascadeDropDown'
	import RatingField from './fields/ratingField'
	import ImageField from './fields/imageField'
	import AccessoryField from './fields/accessoryField'
	import ImageRadioButton from './fields/imageRadioButton'
	import MEMBERCustomerField from './fields/MEMBERCustomerField'
	import DEPTCustomerField from './fields/DEPTCustomerField'
	import CRMCustomerField from './fields/CRMCustomerField'
	import DateField from './fields/DateField'
	import DateTimeField from './fields/DateTimeField'
	import TimeField from './fields/TimeField'
	import ChildField from './fields/childField'
	import FORMREFCustomerField from './fields/FORMREFCustomerField'
	import GeoField from './fields/geoField'
	import dataSourceField from './fields/dataSourceField'

	import fieldMap from './data/fieldMap'
	import {setReadonlyEdit} from '../js/getData'
	import {getHistory} from '../api/list'
	import {findPostChangeInformation} from '../api/postChange' // 岗位变更人员信息回写接口
	export default {
		name: 'formBase',
		components: {
			TextField,
			TextAreaField,
			RadioButtonField,
			CheckBoxField,
            CheckBoxDropField,
			DropDownField,
			NumberField,
			EmailField,
			TelephoneField,
			MobileField,
			CityField,
			EquationField,
			ImageCheckBox,
			SectionBreak,
			CascadeDropDown,
			RatingField,
			ImageField,
			AccessoryField,
			ImageRadioButton,
			MEMBERCustomerField,
			DEPTCustomerField,
			CRMCustomerField,
			DateField,
			DateTimeField,
			TimeField,
			ChildField,
			FORMREFCustomerField,
			GeoField,
      dataSourceField
		},
		data() {
			return {
        timer: 0,          //控制数据联动请求频率
        timerAdvmthd: 0,   //控制高级函数请求频率
      }
		},
		computed: {
			combineList() {
				return this.$store.state.formBase.schema
			},
			formData() {
				return this.$store.state.formBase.data
			},
		},


		methods: {
			setEdit(){
				this.$emit('showSaveBtn')
				this.$store.state.detail.isEditForm = true;
				setReadonlyEdit(this.$store,false);
			},
			getFieldComponent(field) {
			  //下拉复选
			  if (field._type == 'CheckBox' && field.line_row == 4) return 'CheckBoxDropField';
				var component = fieldMap[field._type] || 'textField';
				return component;
			},
      // type参数用于检测是否系统触发的填值，false:用户填写，
      // iswatch判断该emit是否为watch触发，watch触发不进行特殊联动判断
			setValue(val, type, isChildField, isWatch) {
				// console.log(val)
			  !isWatch && this.hasLinkAdvm(val,type);
        if(!isChildField){
          this.$store.commit('setValue', val);
          this.$emit('change',val);
        }
			},
      // 是否为数据联动字段或高级函数字段
      hasLinkAdvm(val, type){
        var _this = this;
        //检测用户填写动作，初始化editFieldList
        let editFieldList = type ? this.$store.state.formBase.editFieldList || [] : [];
        editFieldList.indexOf(val.key) == -1 && editFieldList.push(val.key);
        _this.$store.commit('setEditFieldList',editFieldList);
        //数据联动
        let ids = _this.$store.state.formBase.linkageIds;
        if(ids.indexOf(val.key) != -1){
          let fieldItem = _this.$store.state.formBase.schema.find(x=>{return x._id == val.key});
          //数字类及时间类字段不需要请求数量优化，本身失焦才触发
          if(['EquationField','NumberField','StatisticsField','DateField','TimeField','DateTimeField'].indexOf(fieldItem._type) != -1){
            _this.$emit('setLinkage',val);
          }else{
            if(_this.timer)clearTimeout(_this.timer);
            _this.timer = setTimeout(()=>{
              _this.$emit('setLinkage',val);
            },1000);
          }
        }
        //高级函数
        let advmthdMatch = this.$store.state.formBase.advmthdMatch;
        if (advmthdMatch.indexOf(val.key) != -1) {
          let curField = _this.$store.state.formBase.schema.find(x=>{return x._id == val.key});
          //数字类及时间类字段不需要请求数量优化，本身失焦才触发
          if(['EquationField','NumberField','StatisticsField','DateField','TimeField','DateTimeField'].indexOf(curField._type) != -1){
            _this.$emit('setAdvmthd', val);
          }else{
            if(_this.timerAdvmthd)clearTimeout(_this.timerAdvmthd);
            _this.timerAdvmthd = setTimeout(()=>{
              _this.$emit('setAdvmthd', val);
            },1000);
          }
        }
      },
			showHistory(id,title){
				this.$emit("historyTitle",id,title)
			},
      formatNotes(str, type) {
        return type == 'ImageCheckBox' ? _.checkURL(str, false) : str;
      },

      handleSelectUser(value){
        if (!value) return;
        const detailData = this.$store.state.detail ? this.$store.state.detail.detailData: null;
        const formName = detailData && detailData.detailsPO && detailData.detailsPO.formName ? detailData.detailsPO.formName: '';
        if(formName === '岗位变更申请'){
					_.showLoading("")
          findPostChangeInformation({userId: value.userId})
            .then(res=>{
							_.hideLoading("")
              if (res) {
                let userInfo = res.vo || {}
                this.setUserInfo(userInfo)
              }
						})
						.catch(error=>{
							_.hideLoading("")
						})
				}
				if(formName === '人员离职申请'){
					// console.log('离职',value)
					this.setUserInfoLeave(value)
				}
			},
			setUserInfoLeave(value) {
        const schema = this.$store.state.formBase.schema || [];
				const position = schema.find(item=>item.label === '岗位');
				/* 岗位 */
        let positionOption = {};
				positionOption = position.choices.find(item=>item.value === value.position);
				if (positionOption && positionOption._id) {
					position.value = positionOption._id
					this.$store.commit('setValue', {
						key: position._id,
						value: position.value,
					});

					this.setValue({
						key: position._id,
						value: position.value,
					})
				} else {
					this.$store.commit('setValue', {
						key: position._id,
						value: undefined,
					});

					this.setValue({
						key: position._id,
						value: undefined,
					})
				}
			},
      setUserInfo(value) {
        const schema = this.$store.state.formBase.schema || [];
        //性别、部门/岗位、奇瑞体系入职时间、上岗时间、服务ERP号、服务站名称、岗位、兼职岗位、入职时间、身份证、工作地址、阳历生日、是否已婚、学历、专业、证书编号、曾入职汽车品牌
        const gender = schema.find(item=>item.label === '性别');
        const department = schema.find(item=>item.label === '部门/岗位');
        const entryDate = schema.find(item=>item.label === '奇瑞体系入职时间');
        const workTime = schema.find(item=>item.label === '上岗时间');
        const erpSerNo = schema.find(item=>item.label === '服务ERP号'); // 表单缺少字段
        const serviceShortName = schema.find(item=>item.label === '服务站名称'); // 表单缺少字段
        const position = schema.find(item=>item.label === '岗位');
        const position2 = schema.find(item=>item.label === '兼职岗位');
        const entryTime = schema.find(item=>item.label === '入职时间');
        const identity = schema.find(item=>item.label === '身份证');
        const address = schema.find(item=>item.label === '工作地址');
        const chineseBirthday = schema.find(item=>item.label === '阳历生日');
        const maritalStatus = schema.find(item=>item.label === '是否已婚');
        const educationBackground = schema.find(item=>item.label === '学历');
        const professional = schema.find(item=>item.label === '专业');
        const certificateNumber = schema.find(item=>item.label === '证书编号');
        const oldCarBrand = schema.find(item=>item.label === '曾入职汽车品牌');

        /* 性别 */
        let genderOption = {};
        if(value.sex ==='1'){
          genderOption = gender.choices.find(item=>item.value === '男');
        }else{
          genderOption = gender.choices.find(item=>item.value === '女');
        }
        gender.value  = genderOption._id
        this.$store.commit('setValue', {
          key: gender._id,
          value: gender.value,
        });

        /* 岗位 */
        let positionOption = {};
        positionOption = position.choices.find(item=>item.value === value.position);
        position.value = positionOption._id
        this.$store.commit('setValue', {
          key: position._id,
          value: position.value,
        });

        /* 兼职岗位 */
        let position2Option = [];
        let position2Value = value.position2.split('##')
        position2.choices.forEach(item=>{
          if (position2Value.indexOf(item.value)!=-1) {
            position2Option.push(item._id)
          }
        });
        position2.value = position2Option
        this.$store.commit('setValue', {
          key: position2._id,
          value: position2.value,
        });

        /* 部门/岗位 */
        department.value = value.deptId.split(',')
        let dept_el = this.$refs.formbase_component.find(item=>{
          return ('setDeptFormValue' in item)
        })
        dept_el.setDeptFormValue(department.value)
        this.$store.commit('setValue', {
          key: department._id,
          value: department.value,
        });

        /* 奇瑞体系入职时间 */
        entryDate.value = this.formatTime(value.entryDate)
        this.$store.commit('setValue', {
          key: entryDate._id,
          value: entryDate.value,
        });

        /* 上岗时间 */
        workTime.value = this.formatTime(value.workTime)
        this.$store.commit('setValue', {
          key: workTime._id,
          value: workTime.value,
        });

        /* 服务ERP号 */
        if (erpSerNo) {
          erpSerNo.value = value.erpSerNo
          this.$store.commit('setValue', {
            key: erpSerNo._id,
            value: erpSerNo.value,
          });
        }

        /* 服务站名称 */
        if (serviceShortName) {
          serviceShortName.value = value.serviceShortName
          this.$store.commit('setValue', {
            key: serviceShortName._id,
            value: serviceShortName.value,
          });
        }
        

        /* 入职时间 */
        entryTime.value = this.formatTime(value.entryTime)
        this.$store.commit('setValue', {
          key: entryTime._id,
          value: entryTime.value,
        });

        /* 身份证 */
        identity.value = value.identity
        this.$store.commit('setValue', {
          key: identity._id,
          value: identity.value,
        });

        /* 工作地址 */
        address.value = value.address
        this.$store.commit('setValue', {
          key: address._id,
          value: address.value,
        });

        /* 阳历生日 */
        chineseBirthday.value = this.formatTime(value.birthday)
        this.$store.commit('setValue', {
          key: chineseBirthday._id,
          value: chineseBirthday.value,
        });

        /* 是否已婚 */
        let marriageOption = {};
        if(value.maritalStatus == '1'){
          marriageOption = maritalStatus.choices.find(item=>item.value === '已婚');
        }else{
          marriageOption = maritalStatus.choices.find(item=>item.value === '未婚');
        }
        maritalStatus.value  = marriageOption._id
        this.$store.commit('setValue', {
          key: maritalStatus._id,
          value: maritalStatus.value,
        });

        /* 学历 */
        let educationOption = {};
        educationOption = educationBackground.choices.find(item=>item.value === value.educationBackground);
        educationBackground.value = educationOption._id
        this.$store.commit('setValue', {
          key: educationBackground._id,
          value: educationBackground.value,
        });

        /* 专业 */
        professional.value = value.professional
        this.$store.commit('setValue', {
          key: professional._id,
          value: professional.value,
        });

        /* 证书编号 */
        certificateNumber.value = value.certificateNumber
        this.$store.commit('setValue', {
          key: certificateNumber._id,
          value: certificateNumber.value,
        });

        /* 曾入职汽车品牌 */
        oldCarBrand.value = value.oldCarBrand
        this.$store.commit('setValue', {
          key: oldCarBrand._id,
          value: oldCarBrand.value,
        });

        // 手动触发本地缓存
        this.setValue({
        	key: oldCarBrand._id,
          value: oldCarBrand.value,
        })
      },
      formatTime(time) {
        if (time.indexOf(' ')!=-1) {
          return time.split(' ')[0]
        } else {
          return time
        }
      }
		},

	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
	/*表单title*/
	.form_title_box {
		padding:18px 14px 0;
		box-sizing: border-box;
	}
	.form-title-read{
		font-size: 18px;
		line-height: 27px;
		word-break: break-all;
    color: #383838;
	}
  .form-title-msg {
    font-size: 14px;
    margin-top: 10px;
    line-height: 1;
  }
	.form-title-edit {
		padding-bottom:	2px;
		font-size: 18px;
		border-bottom:1px solid #e5e5e5;
		line-height: 27px;
    color: #383838;
  }

	.form-title-read span.icon-title-edit {
		display: inline-block;
		width: 16px;
		height: 16px;
		margin: 3px 5px;
    background: url("../../../assets/images/icon_form_edit.png");
    background-size: cover;
		vertical-align: text-bottom;
	}

	.form-title-edit textarea,.form-title-edit .title_edit_textarea {
		width: 100%;
		min-height: 27px;
		border: none;
		font-size: 18px;
		line-height:27px;
		outline: none;
    word-break: break-all;
	}

	.form-bg {
		background: #fff;
	}

	/*表单详细描述内容*/
	.form-detail-box {
		margin-bottom:10px;
	}
	.form-detail-content {
		position: relative;
		padding: 14px 14px 23px;
		font-size:15px;
		color:#383838;
		line-height:23px;
		overflow: hidden;
	}
	.form-detail-content p * {
		max-width: 100%;
		vertical-align: middle;
	}
	.form-detail-content-blur {
		position: absolute;
		width: 100%;
		height: 69px;
		background: linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,1));
		transform: translateY(-69px);
	}
	.form-detail-content-toggle{
		width:100%;
		height: 58px;
		font-size: 14px;
		text-align: center;
		color: #a6a6a6;
		line-height:58px ;
	}
	.form-detail-content-toggle span {
		display: inline-block;
		width: 12px;
		height: 12px;
		margin: 0px 5px;
		background-size: cover;
		vertical-align: text-bottom;
	}
	.form-detail-content-toggle span.toggle-up {
		background:-11px 0  url('../../../assets/images/icon_form_arrow_toggle.png') no-repeat;
	}
	.form-detail-content-toggle span.toggle-down {
		background:0 0  url('../../../assets/images/icon_form_arrow_toggle.png') no-repeat;

	}

	.form-detail-content-height {
		height:92px;
	}
	/*input,textarea {*/
	/*caret-color: #007aff;*/
	/*caret-width:2px;*/
	/*}*/

	.colorRed {
		color: #fa3d29 !important;
	}
	.colorblue{
		color: #586c94;
	}
	.colorGray {
		color: #a6a6a6;
	}

	.form-group {
		padding: 0 14px;
	}

	.form-group * {
		box-sizing: border-box;
	}

	.form-content {
		background: #fff;
		padding-bottom: 15px;
        font-weight: normal;
		font-size:15px;
		font-family:-apple-system-font, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
		color: #383838;
		line-height: 1.5;
	}

	.form-group .control-label {
		/*font-size:15px;*/
		/*font-family:PingFang-SC-Medium;*/
		/*color:rgba(56,56,56,1);*/
		/*line-height: 15px;*/
	}

	.form-content .form-label {
		padding: 24px 0 10px;
		line-height: 1.5;
	}
	.form-label-icon {
		position: relative;
		margin-left: 10px;
		width: 18px;
		height: 18px;
	}
	.icon-history{
		background: url(../../../assets/images/icon_form_record.png) no-repeat;
    background-size: contain;
		transform:translateY(-1px);

	}
  .icon-edit{
    background: url("../../../assets/images/icon_form_edit.png") no-repeat;
  }
	.field-content .icon-phone {
		display: inline-block;
		float: right;
		position: relative;
		top:-31px;
		right:12px;
		width: 22px;
		height: 22px;
		background: url(../../../assets/images/form_icon_phone.png) no-repeat center;
		background-size: 150%;
		vertical-align: text-bottom;
	}
	.field-content .text-field {
		position: relative;
		width: 100%;
		height: 40px;
		font-size:15px;
		line-height: 1;
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 4px ;
		padding: 0 10px;
		overflow: hidden;
		overflow-x: scroll;
	}
	.field-content .teleShow{
		padding-right: 55px;
	}
	.field-content .geo-field {
		position: relative;
		width: 100%;
		min-height: 40px;
		font-size:15px;
		line-height: 40px;
		background: #fff;
		border: 1px solid #e5e5e5;
		border-radius: 4px ;
		padding: 0 10px;
		overflow: hidden;
	}
	.field-content .textarea-field {
		width: 100%;
		font-size:15px;
		background:#fff;
		border-radius: 4px ;
		border: 1px solid #e5e5e5;
		padding: 11px 8px 8px 12px;
	}
	.field-content .textarea-field .textarea_div_edit {
		outline:none;
		min-height: 75px;
		word-break: break-all;
	}
	.field-content input{
		color: #383838;
		-webkit-appearance: none;
	}
  .field-content input:disabled,.field-content textarea:disabled{
		-webkit-text-fill-color: #636363;
		-webkit-opacity: 1;
		color: #636363;
	}
	.field-content .readOnly  {
		background:#f5f5f5;
		border:none;
		color: #636363;
	}
	input.text-field:focus ,.textarea-field.focus{
		border:1px solid #479de6;
	}
	.field-content .text-field-help,
	.field-content input.text-field-help,
	.field-content .textarea-field.text-field-help {
		border:1px solid #fa3d29;
	}
	/*提示字体样式*/
	.field-notes {
		color: #a6a6a6;
		font-size: 12px;
		padding: 6px 0 0;
		line-height: 14px;
    word-break: break-all;
	}
	/*单选多选样式*/
	.choice-field-item {
    position: relative;
		padding: 9px 12px 9px 36px;
		border-radius: 4px;
	}

	.choice-field-item.row1 {
		display: flex;
		align-items: center;
		width: 100%;
	}

	.choice-field-item.row2 {
		width: 50%;
	}

	.choice-field-item.row3 {
		width: 33%;
	}
	.choice-field-click:active {
		background: #F7F7F7;
	}
  /*单选多选*/
  .choice-field {
    /*ios8样式兼容*/
    display: flex;
    display: -webkit-flex;
    flex-wrap: wrap;
    -webkit-flex-wrap: wrap;
    border: 1px solid #E5E5E5;
    border-radius:4px;
  }
  .choice-field-item i {
    position: absolute;
    left: 12px;
    top: 12px;
    display: inline-block;
    width: 16px;
    height: 18px;
    background: 0 0 url(../../../assets/images/icon_form_single-unselected.png) no-repeat;
    background-size: 100%;
    margin-right: 10px;
    vertical-align: text-bottom;
  }
  .checkbox-field-item.choice-field-item i{
    background: url(../../../assets/images/icon_form_check-unselected.png) no-repeat;
    background-size: 100%;
  }
  .choice-field-item i.noClick {
    background: url(../../../assets/images/icon_form_single-disable.png) no-repeat;
    background-size: 100%;
  }
  .choice-field-item i.active {
    background: url(../../../assets/images/icon_form_single-checked.png) no-repeat;
    background-size: 100%;
  }
  .checkbox-field-item.choice-field-item i.noClick {
    background: url(../../../assets/images/icon_form_single-dis.png) no-repeat;
    background-size: 100%;
  }
  .checkbox-field-item.choice-field-item i.active {
    background: url(../../../assets/images/icon_form_check-checked.png) no-repeat;
    background-size: 100%;
  }
	/*下拉框样式*/
	.drop-down {
		position: relative;
		width: 100%;
		min-height: 42px;
		padding: 10px;
		font-size: 15px;
		color: #383838;
		border: 1px solid #e5e5e5;
		border-radius: 4px ;
	}
	.drop-down .drop-down-label {
		display: inline-block;
		margin-right:24px;
	}

	.drop-down .drop-down-icon {
		position: absolute;
		top: 50%;
		right: 0;
		width: 16px;
		height: 16px;
    margin-right: 12px;
    background:url(../../../assets/images/icon_form_subform-shrink.png) no-repeat center;
    background-size: 100%;
		transform: translateY(-50%);

	}
	/*分页线样式*/
	.section-field {
		margin-top: 24px;
		width: 100%;
		height: 1px;
		background: url(../../../assets/images/icon_form_line.png) repeat-x;
	}
	.section-field-label {
		padding: 10px 0;
		font-size:12px;
		line-height:14px;
		color: #a6a6a6;
	}
	/**/
	.relative-field {
    display: flex;
    flex-wrap: wrap;
    flex-direction:row;
		padding: 5px 7px 0;
		margin-bottom: 8px;
		min-height: 36px;
		color: #424549;
		font-size: 12px;
		background: #F5F5F5;
		border-radius: 4px;
		overflow-x: hidden;
	}

	.relative-list {
		display: inline-block;
		height:26px;
		overflow: hidden;
		padding: 0 10px ;
		margin: 0 5px 5px 0;
		line-height: 24px;
		border: 1px solid #ADD6F0;
		background: #E1EEFF;
		border-radius: 4px;
	}
	.relative-list-itemicon {
		display: inline-block;
		width: 9px;
		height: 10px;
		background:url(../../../assets/images/icon-form-related-customer.png) no-repeat;
		background-size: cover;
		margin-right: 5px;
	}

	.help-block {
		font-size: 12px;
		padding: 10px 0 0;
	}

	/*子表单*/
	.cf-cz {
		color: #586c94;
		line-height: 45px;
		text-align: center;
		height: 35px;
	}

	.fl {
		float: left;
		display: inline;
	}

	.fr {
		float: right;
		display: inline;
	}

	.inner-form-label {
		background: #f5f5f5;
		color: #999;
		padding: 13px 15px 6px 15px;
		border-bottom: 1px solid #479d16;
		position: relative;
	}

	.inner-form-v {
		padding: 12px 15px;
		position: relative;
		min-height: 19px;
	}

	.childForm-item {
		margin-bottom:7px;
		background-color: #ffffff;
		border: 1px solid #e5e5e5;
		border-radius: 4px;
	}
	.childForm-item-font {
		font-size: 13px;
	}
	.cf-tit-box {
		padding: 0 12px;
		background-color: #f5f5f5;
		line-height: 40px;
		overflow: hidden;
		color: #383838;
	}
	.childForm-item-icon {
		display: inline-block;
		width: 18px;
		height: 18px;
		background-size: cover;
		vertical-align: middle;
	}
	.childForm-item-icon.icon-copy{
		margin:0 24px;
    background: url(../../../assets/images/icon_form_subform_copy.png) no-repeat;
    background-size: 100%;
	}
	.childForm-item-icon.icon-delete{
		margin-right:3px;
    height: 20px;
    background: url(../../../assets/images/icon_form_subform_delete.png) no-repeat;
    background-size: 95%;
  }
  .childForm-item-icon.icon-open{
    background: url(../../../assets/images/icon_form_subform-open.png) no-repeat;
    background-size: 50%;
  }
  .childForm-item-icon.icon-shrink{
    height: 15px;
    background: url(../../../assets/images/icon_form_subform-shrink.png) no-repeat;
    background-size: 100%;
  }
	.childForm-item-add {
		height:36px;
		font-size: 14px;
		line-height: 36px;
		text-align: center;
		border:1px dashed #dcdcdc;
		border-radius:4px ;
		overflow: hidden;
		color: #586c94;
	}

	.form-databox-table {
		overflow-x: auto;
	}

	.form-databox table th, .form-databox table td {
		padding: 2px 20px;
		color: #666;
		text-align: left;
		position: relative;
	}

	.form-databox table {
		min-width: 100%;
		position: relative;
	}

	.form-databox table th .widget-title {
		height: 32px;
		line-height: 32px;
		font-weight: normal;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		display: inline-block;
		vertical-align: middle;
		position: relative;
		z-index: 2;
		color: #999;
	}
	/*字体统计样式*/
	.font-count {
		padding-top:3px;
		font-size: 12px;
		text-align: right;
		color: #a6a6a6;
		line-height: 12px;
	}
  .drop-field{
    position: relative;
  }
  .drop-field:after{
    content: '';
    width: 16px;
    height: 13px;
    position: absolute;
    right: 12px;
    top: 17px;
    background: url(../../../assets/images/icon_form_subform-shrink.png) no-repeat;
    background-size: 100%;
  }

	/*富文本样式*/
	#content em,#content i{
		font-style: italic;
	}
	#content ul li {
		list-style-type: none;
	}
	#content ul,
	#content ol {
		margin-top: 16px;
		margin-bottom: 16px;
		padding-left: 40px;
	}
	#content ul,#content ol,#content li{
		list-style-type: decimal;
	}
  #content {
    word-wrap: break-word;
  }
  .mbsc-android-holo .dwv{color:#f5f5f5}
  .mbsc-android-holo .dwbc div:nth-child(2){left:calc(50% - 25px)!important;}
  #content td,#content td{border:1px solid #ddd;}
	#content table{max-width:100%!important;width: 100%!important}
	p#content *{max-width:100%!important;}
</style>
