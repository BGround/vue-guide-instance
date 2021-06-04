<template>
  <div>
        <!-- 商机分布 -->
        <div class="business-distribution">
            <p class="distribution-font">商机分布</p>
            <ul class="distributionUl">
              <li v-for="item in distributionData" :key="item.id" class="distributionLi">
                <span class="businessName">{{item.name}}</span>
                <span class="businessPercent">{{item.percentSum}}<span>（{{item.percent}}%）</span></span>
                <div class="businessBar"></div>
                <div class="businessBlueBar" :style="{width: `${item.percent}%`}"></div>
              </li>
            </ul>
        </div>
  </div>
</template>

<script>

export default {
    name: 'distributionList',
    components:{
    },
    props:{
        distributionData: {
            type:[Array,String],
        }, // 列表数据
    },
    data(){
        return {
        }
    },
    computed:{
    },
    created(){
    },
    mounted() {
    },
    methods:{
    }
}

</script>

<style lang="scss" scoped>
@import './distributionList.scss';
</style>
