<template>
  <div class="search-panel">
    <div class="header">
      <div class="header__search">
        <qw-search-bar
                ref="search"
                v-model="currentKeyword"
                placeholder="请输入城市名">
        </qw-search-bar>
      </div>
    </div>
    <div class="gutter"></div>

      <div class="scroll-list-wrap">
        <div class="department" v-for="(item, index) in cityList" :key="index" @click="handleClickCity(item)">
          <span v-for="(wordItem, wordIndex) in item.words" :key="wordIndex" :class="{active: wordItem.heightLight}">{{wordItem.word}}</span>
        </div>
        <!-- <infinite-loading @infinite="infiniteHandler">
          <div slot="spinner"
               class="more">
            <p>查看更多</p><i class="more__icon"></i>
          </div>
          <div slot="no-more"
               class="more">
            <p>没有更多了</p>
          </div>
          <div slot="no-results">
            <p>暂无数据</p>
          </div>
        </infinite-loading> -->
        <noData :style="{paddingTop: '20vh'}" v-if="!cityList.length"></noData>
      </div>


  </div>
</template>

<script>

    import searchHeader from './search-header'
    import dealerItem from '@/module/channelManagement/components/ProfileItem'
    import noData from '@/module/channelManagement/components/noData'
    import {getdepartmentIdList, searchDepatmentList} from '@/module/channelManagement/api/getData'
    import debounce from "@/module/channelManagement/utils/debounce";

    const searchCites = debounce(function() {
        this.fetchCityList();
    }, 700)

    function filterNodes(list, keyword) {
        return list.reduce((regionOptions, regionItem)=>{
            const provinces = regionItem.infoVOS || [];
            const provinceOptionsResult = provinces.reduce((provinceOptions, provinceItem)=>{
                const cities = provinceItem.infoVOS || [];
                const cityOptionResult =  cities.reduce((cityOptions, cityItem)=>{
                    const includeKeyword = cityItem.departmentName.includes(keyword);
                    if(keyword === '' || includeKeyword){
                        cityOptions.push({
                            label: cityItem.departmentName,
                            value: cityItem.id,
                            leaf: 'leaf',
                            level: 2,
                        })
                    }
                    return cityOptions
                },[])
                if(cityOptionResult.length){
                    provinceOptions.push({
                        label: provinceItem.departmentName,
                        value: provinceItem.id,
                        children: cityOptionResult,
                        leaf: '',
                        level: 1,
                    })
                }
                return provinceOptions
            },[])

            if(provinceOptionsResult.length){
                regionOptions.push({
                    label: regionItem.departmentName,
                    value: regionItem.id,
                    children: provinceOptionsResult,
                    leaf: '',
                    level: 0,
                })
            }
            return regionOptions
        }, [])
    }

    export default {
        name: "search-panel",
        components: {
            searchHeader,
            dealerItem,
            noData,
        },
        data() {
            return {
                page: 1,
                pageSize: 10,
                currentKeyword: this.keyword,
                departmentName: this.department.name,
                departmentId: this.department.id,
                cityList: [],
                currentCity: '',
                value: [],
                citiesOptions: [],
                citiesOptionsCascadePanelProps: {

                },
                visible: true,
            }
        },
        props: {
            department:{
                type: Object,
                default(){
                    return {
                        id: '',
                        name: ''
                    };
                }
            },
            keyword:{
                type: String,
                default(){
                    return '';
                }
            }
        },
        watch:{
            department:{
              deep: true,
              handler(val){
                  if(typeof val === 'object'){
                      this.departmentId = val.id || '';
                      this.departmentName = val.name || '';
                  }
              }
            },
            currentKeyword(value){
                this.currentKeyword = value
                this.clearCityList()
                searchCites.call(this);
                this.$emit('change', value)
            }
        },
        methods: {

            handleClickCity(item){
                console.log(item)
                const [_, departmentName=''] = item.departmentName ? item.departmentName.split('·'): [];
                this.$emit('click', {
                    ...item,
                    departmentName: departmentName
                })
            },

            handleChangeCity(value){
                console.log(value)
            },

            handleExpandChange(value){


                if(value.length === 2){
                    let [regionValue='', provinceValue='', cityValue=''] = value;
                    const region = this.citiesOptions.find((item)=>item.value === regionValue);
                    const province = region.children.find(item=>item.value === provinceValue);
                    provinceValue = province.value;
                    cityValue =  province.children[0].value
                    this.$nextTick(()=>{
                        this.value = [regionValue, provinceValue, cityValue];
                    })
                }

                if(value.length === 1){
                    let [regionValue='', provinceValue='', cityValue=''] = value;
                    const region = this.citiesOptions.find(item=> item.value === regionValue);
                    console.log(region.label);
                    const province = region.children[0];
                    console.log(province.label);
                    provinceValue = province.value;
                    const city = province.children[0];
                    cityValue = city.value;
                    console.log(city.label);
                    this.$refs['city-cascade-panel'].handleClear();
                    this.$nextTick(()=>{
                        this.value = [regionValue, provinceValue, cityValue];
                    })
                }

            },

            handleFocusInput(){

            },

            focus(){
                this.$nextTick(()=>{
                    this.$refs['search'].focus();
                })
            },

            clearCityList() {
                this.cityList = []
            },

            handleChangeKeyword(value){

            },

            /**
             * 过滤节点
             */
            filterNodes(list, keyword){

                return list.filter()

            },

            fetchCityList() {
                this.value = [];
                this.citiesOptions = [];
                return getdepartmentIdList().then(data => {
                    const list = (data && data.map && data.map.list) ? data.map.list: [];
                    const filteredList = list.filter(item=> item.departmentName.includes(this.currentKeyword))
                    this.cityList = this.setHeightLight(filteredList, this.currentKeyword);
                })
            },


            setHeightLight(list, keyword){
                return list.map(item=>{
                    const name = item.departmentName
                    if(!keyword){
                        return {
                            ...item,
                            words:[{
                                word:name,
                                heightLight: false,
                            }]
                        }
                    }
                    const pattern = new RegExp(keyword,'g')
                    const splitword = name.split(pattern);
                    const words = splitword.reduce((result, word, index)=>{
                        const nonHighLightWord = {
                            heightLight: false,
                            word: word,
                        }
                        const highLightWord = {
                            heightLight: true,
                            word: keyword,
                        }
                        if(index === splitword.length-1){
                            result.push(nonHighLightWord)
                            return result
                        }
                        if(word){
                            result.push(nonHighLightWord, highLightWord)
                        }else{
                            result.push(highLightWord)
                        }
                        return  result
                    },[])
                    return {...item, words:words}
                })
            },

            setDefault(list){
                let regionValue = '';
                let provinceValue = '';
                let cityValue = '';
                if(list[0]){
                    regionValue = list[0].value;
                    if(list[0].children[0]){
                        provinceValue= list[0].children[0].value;
                        if(list[0].children[0].children[0]){
                            cityValue = list[0].children[0].children[0].value;
                        }
                    }
                }else{
                    this.value = [];
                }
                this.value = [regionValue, provinceValue, cityValue];
            },


            load({keyword = '', status ='', departmentId ='', page='1', pageSize, departmentName = '' }){
                this.departmentName = this.departmentName || departmentName
                this.currentKeyword = keyword || this.currentKeyword;
                this.status = status || this.status;
                this.departmentId = departmentId || this.departmentId;
                this.page = page || this.page;
                this.pageSize = pageSize || this.pageSize;
                return this.fetchCityList();
            },

            handleConfirm() {
                if(this.value.length === 3){
                    const [regionValue, provinceValue, cityValue] = this.value;
                    const region = this.citiesOptions.find((item)=>item.value === regionValue);
                    const province = region.children.find(item=>item.value === provinceValue);
                    const city =  province.children.find(item=>item.value === cityValue);
                    this.$emit('click', {
                        departmentName: city.label,
                        id: city.value
                    })
                }

            },

            handleReset() {
                this.currentKeyword = '';
            },
        },
        mounted() {
          this.fetchCityList();
        }
    }
</script>

<style scoped lang="scss">
  .search-panel{
    background: #ffffff;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    .gutter {
      height: 8px;
      background: rgba(245, 245, 245, 1);
    }

    .scroll-list-wrap {
      position: absolute;
      height: calc(100vh - 60px);
      left: 0;
      right: 0;
      overflow-y: auto;
      .department{
        &>span.active{
          color:#3d90e0;
        }
      }
    }


    .header{
      display: flex;
      padding: 12px;
      background: #fff;
    }

    .header__search{
      width: 100%;
      height: 28px;
      /deep/{
        .qw-search-bar{
          height: 28px;
        }
        .qw-search-bar__prefix,
        .qw-search-bar__input{
          height: 28px;
          line-height: 28px;
        }
        .qw-search-bar__icon.qw-icon-search{
          line-height: 28px;
        }
        .qw-search-bar__clear{
          padding: 5px 8px;
        }
      }
    }

    .department{
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      padding: 5px 20px;
      position: relative;
      &::after{
        content: '';
        position: absolute;
        bottom: 0;
        height: 1px;
        left: 20px;
        right: 0;
        transform: scaleY(0.5);
        background: #D0D0D0;
      }
    }

    .department-panel__footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding-top: 10px;
      padding-bottom: 10px;
      padding-left: 15px;
      padding-right: 15px;
      @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) {
        border-bottom: 34px solid #ffffff;
      }
      @media screen and (min-width: 1024px){
        width: 740px;
        margin: auto;
      }
      &::before {
        content: '';
        position: absolute;
        height: 1px;
        top: 0;
        left: 0;
        right: 0;
        background: rgba(230, 230, 230, 1);
        display: block;
        transform: scaleY(0.5);
        z-index: 10;
      }
    }


  }

</style>
