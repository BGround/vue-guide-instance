<template>
  <div class="crm-contact-add">
    <div class="contact-add-header">
      <setting-header :pages="headerPath"
                      @go-back="$router.go(-1)">
      </setting-header>
    </div>
    <div class="contact-add-body">
      <qw-form-group class="basic-list" v-if="basicList.some(item=>{return item.show})">
        <qw-form-item v-for="(item, index) in basicList"
                      v-if="item.show"
                      :key="index"
                      v-model="item.value"
                      :required="item.required"
                      :type="item.type"
                      :label="item.label"
                      :subType="item.subType"
                      :options="item.options"
                      :placeholder="item.placeholder"
                      @on-click-pick="onClickPick(item)"
                      ref="basicItem"></qw-form-item>
      </qw-form-group>
      <qw-form-group class="contact-list" v-if="contactList.some(item=>{return item.show})">
        <qw-form-item v-for="(item, index) in contactList"
                      v-if="item.show"
                      :key="index"
                      v-model="item.value"
                      :required="item.required"
                      :type="item.type"
                      :label="item.label"
                      :subType="item.subType"
                      :options="item.options"
                      :placeholder="item.placeholder"
                      ref="contactItem"
                      @on-blue="onBlue(item)"></qw-form-item>
      </qw-form-group>
      <qw-form-group class="custom-list">
        <qw-form-item v-for="(item, index) in customList"
                      :key="index"
                      v-model="item.value"
                      :required="item.required"
                      :type="item.type"
                      :label="item.label"
                      :subType="item.subType"
                      :options="item.options"
                      :placeholder="item.placeholder"
                      ref="customItem"></qw-form-item>
        <p>可在设置中启用更多自定义字段</p>
      </qw-form-group>
      <qw-form-group class="other-list">
        <qw-form-item v-for="(item, index) in otherList"
                      :key="index"
                      v-model="item.value"
                      :required="item.required"
                      :type="item.type"
                      :label="item.label"
                      :subType="item.subType"
                      :options="item.options"
                      :placeholder="item.placeholder"
                      :max="item.max"
                      ref="otherItem"></qw-form-item>
      </qw-form-group>
      <qw-form-group class="person-list">
        <qw-form-item v-for="(item, index) in personList"
                      :key="index"
                      v-model="item.value"
                      :required="item.required"
                      :type="item.type"
                      :label="item.label"
                      :subType="item.subType"
                      :options="item.options"
                      :placeholder="item.placeholder"
                      ref="personItem"></qw-form-item>
      </qw-form-group>
    </div>
    <div class="contact-add-fotter"
         v-perm="'contactSave'">
      <qw-button type="primary"
                 @click="save">保存</qw-button>
    </div>
    <qw-select-client v-model="showClientModal"
                      @on-confirm="onPickConfirm"
                      :defaultCheckedList="this.basicList[1].value"></qw-select-client>
  </div>
</template>
<script>
import { qwFormItem, qwFormGroup } from "crm/components/qwForm";
import settingHeader from "../setting/components/settingHeader";
import {
  getContactsItem,
  checkContactMobile,
  addContact,
  updateContact,
  getContactInfoByEdit
} from "crm/api/contact";
import { customTypeList, customNumber } from "crm/utils/common";
import QwButton from "@/components/qwuiBase/qwuiButton/qwuiButton";
import QwSelectClient from "crm/components/qw-selectClient";
import { formatDecamal, formatPercentage } from "crm/utils";
export default {
  name: "crmContactAdd",
  components: {
    qwFormItem,
    qwFormGroup,
    QwButton,
    QwSelectClient,
    settingHeader
  },
  data() {
    return {
      // 基本信息：姓名   所属客户  职位  生日  毕业院校  兴趣爱好
      // 联系方式：手机  邮箱
      // 其他：备注 自定义字段
      // 相关人员：负责人 相关人  创建人  负责人账号 相关人账号  创建人账号
      // 记录：创建时间  更新时间 评论信息
      basicList: [
        {
          type: "text",
          label: "姓名",
          key: "tbCrmContactsInfoPO.contactsName"
        },
        {
          type: "pickResult",
          label: "所属客户",
          key: "client",
          subType: "成员",
          value: []
        },
        {
          type: "text",
          label: "职位",
          key: "tbCrmContactsInfoPO.position"
        },
        {
          type: "date",
          label: "生日",
          key: "tbCrmContactsInfoPO.birthday"
        },
        {
          type: "text",
          label: "毕业院校",
          key: "tbCrmContactsInfoPO.schoolName"
        },
        {
          type: "text",
          label: "兴趣爱好",
          key: "tbCrmContactsInfoPO.hobby"
        }
      ],
      contactList: [
        {
          type: "phone",
          label: "手机",
          key: "tbCrmContactsInfoPO.mobile"
        },
        {
          type: "email",
          label: "邮箱",
          key: "tbCrmContactsInfoPO.email"
        }
      ],
      customList: [],
      otherList: [
        {
          type: "textarea",
          label: "备注",
          key: "tbCrmContactsInfoPO.remark"
        },
        {
          type: "pickImage",
          label: "图片",
          key: "imgurl",
          placeholder: "图片建议尺寸为300px*150px，最多可以上传5张",
          max: 5
        }
      ],
      personList: [
        {
          type: "pickPerson",
          label: "负责人",
          required: true,
          key: "userIds"
        },
        {
          type: "pickPerson",
          label: "相关人",
          key: "givenUserIds"
        },
        {
          type: "checklist",
          label: "通知",
          options: [{ label: "相关人", value: "relative", checked: false }],
          key: "notice"
        }
      ],
      showClientModal: false,
      id: this.$route.query.id || "",
      params: {
        "tbCrmContactsInfoPO.hasItem": 0,
        "tbCrmContactsInfoPO.id": this.$route.query.id || ""
      }
    };
  },
  computed: {
    headerPath() {
      return this.id ? ["联系人", "编辑联系人"] : ["联系人", "新建联系人"];
    }
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      dataBase.loading = true;
      Promise.all(
        (() => {
          let _arr = [getContactsItem()];

          this.id && _arr.push(getContactInfoByEdit(this.id));
          return _arr;
        })()
      )
        .then(res => {
          if (
            res.some(item => {
              if (item.code != "0") {
                dataBase.alert("提示", item.desc);
                return true;
              }
              return false;
            })
          ) {
            return;
          }
          // 固定字段
          res[0].data.basicList.forEach(item => {
            this.basicList.forEach(per => {
              if (per.label == item.optionName) {
                this.$set(per, "show", item.status == "1");
                this.$set(per, "required", item.isMust == "1");
              }
            });
            this.contactList.forEach(per => {
              if (per.label == item.optionName) {
                // per.show = item.status == "1";
                // per.required = item.isMust == "1";
                this.$set(per, "show", item.status == "1");
                this.$set(per, "required", item.isMust == "1");
              }
            });
          });
          //自定义字段
          res[0].data.list.forEach(item => {
            if (item.status == "1") {
              let _type =
                customTypeList.find(per => {
                  return Number.parseInt(item.type) === per.value;
                }) || {};

              let _subType;
              if (_type.key === "number") {
                _subType = customNumber.find(per => {
                  return item.ext1 == per.value;
                });
              }
              let _obj = {
                fieldId: item.id,
                type: _type.key || "",
                required: !!Number(item.isMust),
                label: item.optionName,
                subType: _subType ? _subType.key : undefined
              };
              if (_obj.type === "select") {
                _obj.options = [];
                item.list.forEach(per => {
                  if (per.isShow == "1") {
                    _obj.options.push({
                      label: per.name,
                      value: per.id
                    });
                  }
                });
              } else {
                _obj.placeholder =
                  item.list && item.list[0] && item.list[0].name;
              }
              this.customList.push(_obj);
            }
          });

          if (!res[1]) {
            return;
          }
          //自定义字段赋值
          let _itemList = res[1].data.itemList;
          if (_itemList && _itemList.length > 0) {
            this.customList.forEach(item => {
              let _data =
                _itemList.find(per => {
                  return item.fieldId === per.fieldId;
                }) || {};
              item.fieldId = _data.fieldId;
              item.id = _data.id;
              if (item.type === "select") {
                this.$set(item, "value", _data.fieldValue || "");
              } else {
                this.$set(item, "value", _data.optionVal || "");
              }
            });
          }
          // 固定字段赋值
          let _obj = res[1].data.tbCrmContactsInfoPO;
          Object.keys(_obj).forEach(key => {
            this.basicList.forEach(item => {
              if (item.key === "client" && _obj.clientName && _obj.clientId) {
                this.$set(item, "value", [
                  {
                    label: _obj.clientName,
                    value: _obj.clientId
                    // icon: _obj.headPic
                  }
                ]);
              } else if (item.key.includes(key)) {
                // console.log(key)
                this.$set(item, "value", _obj[key]);
              }
            });

            this.contactList.forEach(item => {
              if (item.key.includes(key)) {
                this.$set(item, "value", _obj[key]);
                if (key === "mobile") {
                  item.prevValue = _obj[key];
                }
              }
            });

            this.otherList.forEach(item => {
              if (item.type === "pickImage") {
                let _image = [];
                if (_obj.picList && _obj.picList.length > 0) {
                  _image = _obj.picList.map(item => {
                    return {
                      imageURL: item.picPath
                    };
                  });
                }
                this.$set(item, "value", _image);
              } else if (item.key.includes(key)) {
                this.$set(item, "value", _obj[key]);
              }
            });
          });

          this.$set(
            this.personList[0],
            "value",
            _obj.toPersons.map(item => {
              return Object.assign(item, {
                label: item.personName,
                value: item.userId,
                icon: item.headPic
              });
            })
          );
          this.$set(
            this.personList[1],
            "value",
            _obj.ccPersons.map(item => {
              return Object.assign(item, {
                label: item.personName,
                value: item.userId,
                icon: item.headPic
              });
            })
          );
        })
        .catch(err => {
          dataBase.alert("提示", "网络错误");
        })
        .finally(() => {
          dataBase.loading = false;
        });
    },
    save() {
      if (this.valid()) {
        this.basicList.forEach(item => {
          if (item.key === "client") {
            this.params["tbCrmContactsInfoPO.clientName"] =
              item.value && item.value[0] ? item.value[0].label : "";
            this.params["tbCrmContactsInfoPO.clientId"] =
              item.value && item.value[0] ? item.value[0].value : "";
          } else {
            this.params[item.key] = this.saveBeforeFormat(item);
          }
        });
        this.contactList.forEach(item => {
          this.params[item.key] = this.saveBeforeFormat(item);
        });
        this.otherList.forEach(item => {
          this.params[item.key] = this.saveBeforeFormat(item);
        });
        this.personList.forEach(item => {
          if (item.type === "checklist") {
          } else {
            this.params[item.key] = this.saveBeforeFormat(item);
          }
        });
        let _list = [];
        this.customList.forEach(item => {
          _list.push({
            id: item.id,
            fieldId: item.fieldId,
            fieldName: item.label,
            fieldValue: this.saveBeforeFormat(item)
          });
        });
        if (_list.length > 0) {
          this.params["tbCrmContactsInfoPO.hasItem"] = 1;
          this.params.itemJson = JSON.stringify({
            list: _list
          });
        }
        // console.log(this.params);

        //是否通知相关人
        let _notice = Number(this.personList[2].options[0].checked);
        dataBase.loading = true;
        (() => {
          if (this.id) {
            return updateContact(this.params, _notice);
          } else {
            return addContact(this.params, _notice);
          }
        })()
          .then(res => {
            if (res.code == "0") {
              dataBase.top_alert("保存成功", true, 1000);
              setTimeout(() => {
                this.$router.go(-1);
              }, 1000);
            } else {
              dataBase.alert("提示", res.desc);
            }
          })
          .catch(err => {
            dataBase.alert("提示", "网络错误");
          })
          .finally(() => {
            dataBase.loading = false;
          });
      }
    },
    valid() {
      let hasError = false;
      // 手机号码已存在
      if (this.contactList[0].isExist) {
        let errDom = document.querySelector(".item-right-warning");
        errDom && errDom.scrollIntoViewIfNeeded();
        return false;
      }
      this.$refs.basicItem &&
        this.$refs.basicItem.forEach(item => {
          let msg = item.valid();
          if (msg) {
            hasError = true;
          }
          item.showWarning(msg);
        });
      this.$refs.customItem &&
        this.$refs.customItem.forEach(item => {
          let msg = item.valid();
          if (msg) {
            hasError = true;
          }
          item.showWarning(msg);
        });
      this.$refs.contactItem &&
        this.$refs.contactItem.forEach(item => {
          let msg = item.valid();
          if (msg) {
            hasError = true;
          }
          item.showWarning(msg);
        });
      this.$refs.otherItem &&
        this.$refs.otherItem.forEach(item => {
          let msg = item.valid();
          if (msg) {
            hasError = true;
          }
          item.showWarning(msg);
        });
      this.$refs.personItem &&
        this.$refs.personItem.forEach(item => {
          let msg = item.valid();
          if (msg) {
            hasError = true;
          }
          item.showWarning(msg);
        });
      if (hasError) {
        this.$nextTick(() => {
          let errDom = document.querySelector(".item-right-warning");
          errDom && errDom.scrollIntoViewIfNeeded();
        });
        return false;
      }
      return true;
    },
    onClickPick(item) {
      this.showClientModal = true;
    },
    onPickConfirm(data) {
      this.$set(this.basicList[1], "value", data);
    },
    onBlue(item) {
      if (item.key === "tbCrmContactsInfoPO.mobile") {
        if (
          item.value &&
          !this.$refs.contactItem[0].valid() &&
          (!item.prevValue || item.prevValue != item.value)
        ) {
          checkContactMobile(item.value)
            .then(res => {
              if (res.code == "0") {
                item.isExist = res.data.isExist;
                if (res.data.isExist) {
                  this.$refs.contactItem[0].showWarning("号码已存在");
                }
              } else {
                dataBase.alert("提示", res.desc);
              }
            })
            .catch(err => {
              dataBase.alert("提示", "网络错误");
            });
        }
      }
    },
    saveBeforeFormat(item) {
      if (!item.value) {
        return "";
      }
      let _obj = {
        text: item.value,
        number: "",
        textarea: item.value,
        date: "",
        select: item.value,
        email: item.value,
        phone: item.value,
        pickImage: "",
        pickPerson: "",
        checklist: "",
        pickResult: ""
      };
      let _value = _obj[item.type] || "";
      if (_value) {
        return _value;
      }
      switch (item.type) {
        case "number":
          if (item.subType === "percent") {
            _value = formatPercentage(item.value);
          } else {
            // else if (item.subType === "decimals") {
            //   _value = formatDecamal(item.value);
            // }
            _value = item.value;
          }
          break;
        case "date":
          _value =
            typeof item.value === "object"
              ? item.value.Format("yyyy-MM-dd")
              : item.value;
          break;
        case "pickImage":
          let _url = "";
          item.value.forEach((per, index) => {
            if (index == 0) {
              _url = per.imageURL;
            } else {
              _url += "," + per.imageURL;
            }
          });
          _value = _url;
          break;
        case "pickPerson":
          let ids;
          item.value.forEach((per, index) => {
            if (index == 0) {
              ids = per.userId;
            } else {
              ids += "|" + per.userId;
            }
          });
          _value = ids;
          break;
      }
      return _value;
    }
  }
};
</script>
<style lang="scss" scoped>
.crm-contact-add {
  .contact-add-body {
    margin-top: 10px;
    .qw-form-group {
      padding-bottom: 20px;
      &:not(:first-child) {
        border-top: 1px dashed #ddd;
        padding: 40px 0 20px;
      }
    }
    .custom-list {
      p {
        margin-left: 160px;
        color: #999;
      }
    }
  }
  .contact-add-fotter {
    text-align: center;
    border-top: 1px solid #e5e5e5;
    padding: 20px 0 30px;
  }
}
</style>

