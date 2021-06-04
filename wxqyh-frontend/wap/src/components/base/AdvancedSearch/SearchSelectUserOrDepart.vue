<template>
    <div class="selectUserOrDepartment arrow" @click="selectUserOrDepartment">
        <label class="label ellipsis">{{field.label}}</label>
        <span class="item ellipsis">
            <span class="default" v-show="!nameStr">请选择</span>
            {{nameStr}}
        </span>
    </div>
</template>

<script>
    export default {
        name: 'selectUserOrDepartmentField',
        props: ['field', 'searchValue', 'setting'],
        data() {
            return {
                key: this.field.key,
                depts: [], // 部门
                users: [], // 人员
                nameStr: '' // 选中的部门和选中的人的组合字符串
            }
        },
        created () {
            this.init();
        },
        methods: {
            init() {
                let searchValue = this.searchValue[this.key];
                if(searchValue) {
                    switch(this.field.selectType) {
                        case 'depts': this.depts = searchValue.depts || []; break;
                        case 'users': this.users = searchValue.users || []; break;
                        case 'usersOrDepts': this.depts = searchValue.depts || []; 
                                           this.users = searchValue.users || [];
                                           break;
                    }
                }
                this.setNameStr();
            },
            reset() {
                this.users = [];
                this.depts = [];
                this.setNameStr();
            },
            selectUserOrDepartment() {
                let _this = this,
                    selectConfig = this.field.selectConfig;
                selectConfig.signIndex = this.field.selectType;
                selectConfig.show = true;
                let selectList = selectConfig.selectList[selectConfig.signIndex];
                switch(this.field.selectType) {
                    case 'depts': selectList.deptSelected = this.depts;
                                  selectList.deptRestriction = this.field.deptRestriction || '500';
                                  break;
                    case 'users': selectList.userSelected = this.users;
                                  selectList.userRestriction = this.field.userRestriction || '1000';
                                  break;
                    case 'usersOrDepts': selectList.userSelected = this.users;
                                         selectList.deptSelected = this.depts;
                                         selectList.deptSelectedShow = true;
                                         selectList.deptRestriction = this.field.deptRestriction || '500';
                                         selectList.userRestriction = this.field.userRestriction || '1000';
                                         break;
                }
                selectList.callBack.confirm = function(id, data) {
                    switch(_this.field.selectType) {
                        case 'depts': _this.depts = data.dept.data;
                                      _this.searchValue[_this.key] = {
                                          depts: data.dept.data,
                                      }
                                      break;
                        case 'users': _this.users = data.user.data;
                                      _this.searchValue[_this.key] = {
                                          users: data.user.data
                                      }
                                      break;
                        case 'usersOrDepts': _this.depts = data.dept.data;
                                             _this.users = data.user.data;
                                             _this.searchValue[_this.key] = {
                                                 depts: data.dept.data,
                                                 users: data.user.data
                                             }
                                             break;
                    }
                    _this.setNameStr();
                }
            },
            setNameStr() {
                let deptName = '',
                    userName = '';
                if(this.depts.length != 0) {
                    this.depts.forEach((item, index) => {
                        deptName += item.deptFullName;
                        if(index != this.depts.length - 1) {
                            deptName += ' , ';
                        }
                    });
                }
                if(this.users.length != 0) {
                    this.users.forEach((item, index) => {
                        userName += item.personName;
                        if(index != this.users.length - 1) {
                            userName += ' , ';
                        }
                    })
                }
                this.nameStr = deptName + (deptName && userName ? ' , ' : '') + userName;
            }
        },
        watch: {
            searchValue:{
                handler(val) {
                    if(!val[this.key]) {
                        this.reset();
                    }
                    if(val[this.key]) {
                        this.init();
                    }
                },
                deep: true
            }
        }
    }
</script>

<style scoped>
.selectUserOrDepartment {
    position: relative;
    display: flex;
    border: 1px solid #E4E5E9;
    padding: 0 25px 0 10px;
}
.selectUserOrDepartment .label {
    flex: 4;
    line-height: 34px;
    color: #1B233A;
    overflow: hidden;
}
.selectUserOrDepartment .item {
    flex: 6;
    height: 34px;
    padding-left: 8px;
    box-sizing: border-box;
    line-height: 34px;
    border-radius: 2px;
    font-size: 13px;
    color: #666666;
    background-color: #fff;
    text-align: right;
}
.default {
    color: #bbb;
}
.arrow::after {
    content: "";
    position: absolute;
    color: #999999;
    right: 5px;
    top: 50%;
    width: 14px;
    height: 14px;
    transform: translateY(-50%);
    background: url(../../../assets/images/icon_down.png) no-repeat;
    background-size: contain;
}
.ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    word-wrap: normal;
    overflow:hidden;
}
</style>
