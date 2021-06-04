<template>
    <div class="goal_wrap">
        <div class="dashed">
            <div class="form_item">
                <div class="form_title">对应年份</div>
                <div class="form_field">
                    <select class="commonSelect" v-if="goalBoxType == 'add'" v-model="goalYear" @change="changeGoalName">
                        <option v-for="(year,idx) in yearArr" :key="idx" :value="year">{{year}}年</option>
                    </select>
                    <div class="disabled_item" v-if="goalBoxType == 'edit'">
                        {{goalYear}}年
                    </div>
                </div>
            </div>
            <div class="form_item">
                <div class="form_title">销售团队</div>
                <div class="form_field">
                    <select class="commonSelect" v-if="goalBoxType == 'add'" v-model="teamId" ref="teamName" @change="changeGoalName">
                        <option :value="item.id" v-for="(item, idx) in teamList" :key="idx">{{item.teamName}}</option>
                    </select>
                    <div class="disabled_item" v-if="goalBoxType == 'edit'">
                        {{teamName}}
                    </div>
                </div>
            </div>
            <div class="form_item">
                <div class="form_title">目标类型</div>
                <div class="form_field">
                    <select class="commonSelect" v-if="goalBoxType == 'add'" v-model="goalType" ref="goalType" @change="changeGoalName">
                        <option value="0">商机赢单金额</option>
                        <option value="1">合同签约金额</option>
                    </select>
                    <div class="disabled_item" v-if="goalBoxType == 'edit'">
                        {{goalTypeName}}
                    </div>
                </div>
            </div>
            <div class="form_item">
                <div class="form_title">目标名称</div>
                <div class="form_field">
                    <input type="text" :class="{form_text:true, warnBorder:goalNameWarn}" v-model="goalName" maxlength="30">
                </div>
            </div>
            <div class="form_item">
                <div class="form_title">统计方式</div>
                <div class="form_field radio_wrap">
                    <label class="mr60" @click="changeWay('month')">
                        <input type="radio" name="statsType" :checked="isMonth">
                        月度目标
                    </label>
                    <label @click="changeWay('quarter')">
                        <input type="radio" name="statsType" :checked="!isMonth">
                        季度目标
                    </label>
                </div>
            </div>
        </div>
        <div v-if="isMonth">
            <div class="dashed mt30">
                <div>单位：万元</div>
                <div class="month_goal">
                    <div class="form_item">
                        <div class="form_title">1月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M1"
                            @input="changeGoal('M1','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">2月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M2"
                            @input="changeGoal('M2','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">3月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M3"
                            @input="changeGoal('M3','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">4月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M4"
                            @input="changeGoal('M4','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">5月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M5"
                            @input="changeGoal('M5','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">6月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M6"
                            @input="changeGoal('M6','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">7月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M7"
                            @input="changeGoal('M7','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">8月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M8"
                            @input="changeGoal('M8','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">9月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M9"
                            @input="changeGoal('M9','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">10月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M10"
                            @input="changeGoal('M10','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">11月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M11"
                            @input="changeGoal('M11','month',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">12月</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="M12"
                            @input="changeGoal('M12','month',$event)">
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt30">
                <div>
                    <p>
                        <span class="c878787 mr5">年目标金额</span>
                        <span class="cff9600">{{goalAmount}}</span>
                        万元
                    </p>
                </div>
            </div>
        </div>

        <div v-if="!isMonth">
            <div class="dashed mt30">
                <div>单位：万元</div>
                <div class="quarter_goal">
                    <div class="form_item">
                        <div class="form_title">第一季度</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="Q1"
                            @input="changeGoal('Q1','quarter',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">第二季度</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="Q2"
                            @input="changeGoal('Q2','quarter',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">第三季度</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="Q3"
                            @input="changeGoal('Q3','quarter',$event)">
                        </div>
                    </div>
                    <div class="form_item">
                        <div class="form_title">第四季度</div>
                        <div class="form_field">
                            <input type="text" class="form_text" placeholder="0" maxlength="7" v-model="Q4"
                            @input="changeGoal('Q4','quarter',$event)">
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt30">
                <div>
                    <p>
                        <span class="c878787 mr5">年目标金额</span>
                        <span class="cff9600">{{goalAmount}}</span>
                        万元
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { getTeamList, addGoal, editGoal } from "@/module/crm/api/goal";
import { mapActions,mapGetters } from 'vuex';
export default {
    data() {
        return {
            dataBase,
            yearArr:[],  //对应年份数组
            isMonth: true,  // 是否按月度统计
            M1: '',  //月度金额
            M2: '',
            M3: '',
            M4: '',
            M5: '',
            M6: '',
            M7: '',
            M8: '',
            M9: '',
            M10: '',
            M11: '',
            M12: '',
            Q1: '',  // 季度金额
            Q2: '',
            Q3: '',
            Q4: '',
            teamList: [],  // 团队列表
            goalYear: 2018,  // 对应年份
            goalType: 0,  // 目标类型
            goalTypeName: '',  // 目标类型名称
            goalAmount: 0,  // 目标总额
            teamId: '',  // 被选中团队
            teamName: '',  // 团队名称
            goalName: '', // 目标名称
            countType: 1,  //统计方式 1:月度 0:季度
            goalId: '',  // 目标id
            goalNameWarn: false,  //目标名字警告
            monthSumGoal: 0,  // 月度总目标金额
            quarterSumGoal: 0,  // 季度总目标金额
            isSubmit: false  // 是否正在提交
        }
    },
    computed: {
        ...mapGetters('goal',[
            'goalBoxType',
            'goalDetail'
        ])
    },
    created() {
        let { alert:_alert } = this.dataBase;

        if(this.goalBoxType == 'add'){
            // 初始化年份
            this.getYears();

            getTeamList()
            .then(res => {
                if(res.code == '0'){
                    this.teamList = res.data.teamList;
                    this.teamId = this.teamList[0].id;
                    this.goalName = `${this.goalYear}年${this.teamList[0].teamName}商机赢单金额`

                }
                else{
                    _alert('提示',res.desc);
                }
            })
            .catch(err => {
                _alert('提示','网络错误');
            });
        }
        else{
            let { goalYear, teamName, goalTypeName, goalName, countType, stageList, goalAmount, id } = this.goalDetail;
            this.goalYear = goalYear;
            this.teamName = teamName;
            this.goalTypeName = goalTypeName;
            this.goalName = goalName;
            this.countType = countType;
            this.goalAmount = goalAmount;
            this.goalId = id;
            this.countType == 1? this.monthSumGoal = goalAmount : this.quarterSumGoal = goalAmount;

            if(countType == '1'){
                this.isMonth = true;
                stageList.map((item,idx) => {
                    this[`M${idx + 1}`] = item.stageAmount;
                });
            }
            else{
                this.isMonth = false;
                stageList.map((item,idx) => {
                    this[`Q${idx + 1}`] = item.stageAmount;
                });
            }

        }
    },
    methods: {
        ...mapActions('goal',[
            'setshowGoalBox',
            'setGoalBoxOperate'
        ]),
        // 获取2018-2050的年份
        getYears() {
            for(let i=2018;i<=2030;i++){
                this.yearArr.push(i);
            }
        },

        // 改变统计方式
        changeWay(type) {
            if(type == 'month'){
                this.countType = 1;
                this.isMonth = true;
                this.goalAmount = this.monthSumGoal;
            }
            else{
                this.countType = 0;
                this.isMonth = false;
                this.goalAmount = this.quarterSumGoal;
            }
        },

        // 改变月度目标金额
        changeGoal(data,type,e) {
            // 只允许输入数字
            let val = e.target.value.replace(/[^\d.]/g,'');
            let sum = 0;

            // 只能为一个小数点
            val = val.replace('.','$#$').replace(/\./g,'').replace('$#$','.');
            if(val[0] == '.'){
                val = val.replace('.','');
            }
            this[data] = !val || val.indexOf('.') > -1? val : Number(val);


            // 计算月度和季度的合计金额
            if(type === 'month'){
                for(let i=1;i<13;i++){
                    sum += Number(this[`M${i}`]);
                }
                this.monthSumGoal = sum.toFixed(2);
            }
            else{
                for(let i=1;i<5;i++){
                    sum += Number(this[`Q${i}`]);
                }
                this.quarterSumGoal = sum.toFixed(2);
            }

            this.goalAmount = sum.toFixed(2);
        },

        // 清空目标
        clearGoal() {
            // 只清空当前统计方式的数据
            if(this.isMonth){
                for(let i=0;i<=12;i++){
                    this[`M${i}`] = '';
                }
                this.monthSumGoal = 0;
            }
            else{
                for(let i=0;i<=4;i++){
                    this[`Q${i}`] = '';
                }
                this.quarterSumGoal = 0;
            }
            this.goalAmount = 0;
        },

        // 改变目标名称
        changeGoalName(){
            let currentTeam = this.$refs.teamName;
            let currentType = this.$refs.goalType;
            let teamIdx = currentTeam.selectedIndex;
            let typeIdx = currentType.selectedIndex;
            this.goalName = `${this.goalYear}年${currentTeam.options[teamIdx].text}${currentType.options[typeIdx].text}`;
        },

        // 保存目标
        saveGoal(){
            this.toggleLoading()
            let arr = [];
            let listObj = {};
            let { alert:_alert, top_alert } = this.dataBase;

            this.goalNameWarn = !this.goalName?  true : false;

            // 拼接json
            if(this.countType == 1){
                for(let i=1;i<13;i++){
                    let obj = {
                        stage: i,
                        stageAmount: this[`M${i}`]
                    }
                    arr.push(obj);
                }
            }
            else{
                for(let i=1;i<5;i++){
                    let obj = {
                        stage: i,
                        stageAmount: this[`Q${i}`]
                    }
                    arr.push(obj);
                }
            }

            if(this.goalNameWarn){
                return;
            }
            listObj.list = arr;


            if(!this.isSubmit){
                if(this.goalBoxType == 'add'){
                    let goalObj = {
                        goalName: this.goalName,
                        goalYear: this.goalYear,
                        teamId: this.teamId,
                        goalType: this.goalType,
                        countType: this.countType,
                        goalAmount: this.goalAmount,
                        dataJson: JSON.stringify(listObj)
                    }

                    addGoal(goalObj)
                    .then(res => {
                        this.toggleLoading()
                        if(res.code == '0'){
                            this.setshowGoalBox(false);
                            this.setGoalBoxOperate('save');
                            top_alert('保存成功',true,2000);
                        }
                        else{
                            top_alert(res.desc,false,2000);
                        }
                        this.isSubmit = false;
                    })
                    .catch(err => {
                        this.toggleLoading()
                        console.log(err);
                        this.isSubmit = false;
                        _alert('提示','网络错误');
                    });
                }
                else{
                    let goalObj = {
                        goalName: this.goalName,
                        id: this.goalId,
                        countType: this.countType,
                        goalAmount: this.goalAmount,
                        dataJson: JSON.stringify(listObj)
                    }

                    editGoal(goalObj)
                    .then(res => {
                        this.toggleLoading()
                        if(res.code == '0'){
                            this.setshowGoalBox(false);
                            this.setGoalBoxOperate('saveUpdate');
                            top_alert('保存成功',true,2000);
                        }
                        else{
                            top_alert(res.desc,false,2000);
                        }
                        this.isSubmit = false;
                    })
                    .catch(err => {
                        this.toggleLoading()
                        console.log(err);
                        this.isSubmit = false;
                        _alert('提示','网络错误');
                    });
                }
            }

            this.isSubmit = true;
        },

        // 打开/关闭 带遮罩loading
        toggleLoading(){
            this.dataBase.loading = !this.dataBase.loading;
        }
    }
}
</script>
<style scoped>
.mr5{
    margin-right: 5px;
}
.mr60{
    margin-right: 60px;
}
.mt30{
    margin-top: 30px;
}
.mb20{
    margin-bottom: 20px;
}
.goal_wrap{
    padding: 40px 38px 0 40px;
    height: 600px;
}
.form_title{
    margin-right: 20px;
    color: #878787;
    font-size: 14px;
    line-height: 30px;
}
.form_item{
    display: flex;
    margin-bottom: 20px;
}
.form_text{
    padding: 6px 10px;
    margin: 0;
    width: 445px;
    height: 30px;
    border: 1px solid #ccc;
    box-sizing: border-box;
}
.form_field .commonSelect{
    padding: 0 5px;
    width: 445px;
    height: 30px;
}
.radio_wrap{
    line-height: 30px;
}
.form_field input[type=radio]{
    appearance: none;
    margin: 0;
    vertical-align: middle;
}
.dashed{
    border-bottom: 1px dashed #ccc;
}
.month_goal, .quarter_goal{
    display: flex;
    flex-wrap: wrap;
    margin-top: 20px;
}
.month_goal .form_title{
    margin-right: 7px;
    width: 27px;
    font-size: 12px;
    text-align: right;
}
.month_goal .form_text{
    width: 80px;
}
.month_goal .form_item{
    margin-right: 20px;
}
.month_goal .form_item:nth-of-type(4n){
    margin-right: 0;
}
.quarter_goal .form_title{
    margin-right: 20px;
    text-align: right;
}
.quarter_goal .form_text{
    width: 150px;
}
.quarter_goal .form_item{
    margin-right: 45px;
}
.quarter_goal .form_item:nth-of-type(2n){
    margin-right: 0;
}
.c878787{
    color: #878787;
}
.cff9600{
    color: #C31725;
}
.disabled_item{
    line-height: 30px;
    color: #666;
}
.warnBorder{
    border: 1px solid red !important;
}
</style>


