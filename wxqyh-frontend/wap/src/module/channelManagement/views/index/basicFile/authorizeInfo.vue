<!-- 授权信息 -->
<template>
  <div class="authorize-info">
    <qw-tab-bar
      class="title_border"
      v-model="authorizeType"
      :data="tabs"
      :slider-width=58
      @change="handleChangeTabs">
    </qw-tab-bar>
    <div class="sales_authorize" v-show="authorizeType==1">
      <div class="sales_header">
        <div class="sales_icon">
          <img :src="iconSales" alt="icon_sale">
        </div>
        <div class="product_seq">产品序列  <span style="color:#C6001F;font-weight:bold">{{ productOrder }}</span></div>
      </div>
      <table class="product_table">
        <tr class="table_header">
          <th class="header_cell">车型</th>
          <th class="header_cell">经营权限</th>
          <th class="header_cell last_col">责任区域</th>
        </tr>
        <tr class="table_content title_border" v-for="(item, index) in tableData" :key="index">
          <td class="data_cell">{{ item.modelName }}</td>
          <td class="data_cell">
            <img v-if="item.managementState == 1" width="20px" height="20px" :src="iconGou" alt="">
          </td>
          <td class="last_col">
            {{ item.districtName||'-' }}
           </td>
        </tr>
        <div v-if="!tableData||tableData.length==0" class="no_data">
          <p>暂无数据</p>
        </div>
      </table>
    </div>
    <div class="service_authorize" v-show="authorizeType==2">
      <div class="service_car_type">
        <div class="service_label">服务车系</div>
        <div class="panel__select">
          <input class="panel__select__input"
          placeholder="请输入"
          @click="handleClickcarSeriesInput"
          type="text"
          readonly
          v-model="salesCarSeries" />
            <i class="panel__select__icon"></i>
        </div>
        <qw-picker
          v-model="isVisibleCarSeriesOptions"
          :data="carSeriesOptions"
          :selected-index="[1]"
          @select="handleSelectSeriesOptions">
        </qw-picker>
      </div>

      <div class="service_region">
        <div class="service_label">服务区域</div>
        <div class="pannel__conent">
          <p>
            {{serviceArea}}
          </p>
        </div>
      </div>
    </div>
  </div>

</template>
<script>
import iconSales from "@/module/channelManagement/static/images/icon_sale.png";
import reloadApp from '@/module/channelManagement/mixins/reloadApp.js'
import iconGou from '@/module/channelManagement/static/images/icon_gou.png'
import { getWarrantInfoList, searchDmsAfterSaleAreaByKey, searchDmsAfterCarTypeByKey  } from '@/module/channelManagement/api/basic/index'

export default {
  name:"authorizeInfo",
  mixins: [reloadApp],
  data(){
    return {
        iconGou:iconGou,
      dealerId: '',
      tabs: [
        {
          value: 1,
          label: '销售权限'
        },
        {
          value: 2,
          label: '服务权限'
        }
      ],
      productOrder: '',
      tableData: [],
      iconSales: iconSales,
      authorizeType: 1, // 1：销售权限，2：服务权限
      isVisibleCarSeriesOptions: false,
      salesCarSeries: '',
      carSeriesOptions: [],
      serviceArea:'',
      isLoading: false
    }
  },
  watch:{
    $route: {
      handler() {
        this.dealerId = this.$route.query.dealerId || '';
        // console.log(this.dealerId);
        if (this.dealerId) {
          this.init()
        } else {
          this.reloadApp()
        }
      }
    }
  },
  methods:{
    init() {
      this.serviceArea = ''
      this.salesCarSeries = ''
      this.isLoading = true;
      console.log(this.dealerId)
      const dealerId = this.dealerId
      const getWarrantInfoListPromise = getWarrantInfoList(this.dealerId).then(data => {
        if (data) {
          this.productOrder = data.productOrder || ''
          this.tableData = data.list || []
        } else {
          this.productOrder = ''
          this.tableData = []
        }
      })

      Promise.all([
        getWarrantInfoListPromise
      ]).finally(() => {
        this.isLoading = false;
      })

      searchDmsAfterCarTypeByKey({dealerId}).then((data)=>{
        if(data && Array.isArray(data.carTypeList)){
           const list = data.carTypeList.map((item)=>{
            return { text: item, value: item }
          });
          this.carSeriesOptions = [list];
        }
      })
    },
    handleChangeTabs(tableValue) {
      switch (tableValue) {
        case 1:
          this.authorizeType = 1;
          break;
        case 2:
          this.authorizeType = 2;
          break;
      }
    },

    handleClickcarSeriesInput(){
      this.isVisibleCarSeriesOptions = true;
    },

    handleSelectSeriesOptions([value], index, [label]){
      this.salesCarSeries = label;
      this.serviceArea = '';
      this.fetchDmsAfterSaleAreaByKey(value)
    },

    fetchDmsAfterSaleAreaByKey(categoryName){
      const params = {
        dealerId: this.dealerId,
        categoryName: categoryName
      }
      searchDmsAfterSaleAreaByKey(params).then((data)=>{
        if(data && Array.isArray(data.saleAreaList)){
          this.serviceArea = data.saleAreaList.join(',')
        }
      })
    }
  },
  created(){
    this.dealerId = this.$route.query.dealerId
    if (this.dealerId) {
      this.init()
    } else {
      this.reloadApp()
    }
  }
}
</script>
<style lang="scss" scoped>

/deep/{
  .qw-tab-bar__pane {
    .qw-badge.qw-tab-bar__without-icon{
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 400;
      line-height: 21px;
      color: rgba(128,128,128,1);
      opacity: 1;
    }
  }

  .qw-tab-bar__pane.is-active {
    .qw-badge.qw-tab-bar__without-icon{
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: 600;
      line-height: 21px;
      color: rgba(0,0,0,1);
      opacity: 1;
    }
  }
}

.authorize-info {
  padding-bottom: 50px;

  .title_border{
    border-bottom: 1px solid rgba(230,230,230,1);
  }

  .no_data {
    padding: 8px 15px;
    margin: 8px;
    background: #ffffff;
    height: 30px;
    line-height: 30px;
    font-size: 15px;
    font-family: PingFang SC;
    letter-spacing: 2px;
    text-align: center;
  }

  .sales_authorize {
    padding: 15px;
    background: #ffffff;

    .sales_header {
      display: flex;
      justify-content: flex-start;
      align-items: flex-end;
      margin-bottom: 15px;

      .sales_icon {
        margin: auto 21px auto 29.5px;
        img {
          height: 27.5px;
          width: 27.5px;
        }
      }

      .product_seq {
        width: 95px;
        height: 30px;
        font-size: 17px;
        font-family: Source Han Sans CN;
        line-height: 30px;
        color:  rgba(0,0,0,1);
        opacity: 1;
      }
    }

    .product_table {
      width: 100%;
      margin: 0;

      .table_header {
        height: 40px;
        background-color: rgba(39,129,219,1);
        display: flex;
        justify-content: flex-start;
        align-content: center;

        .header_cell {
          // margin: auto 18px;
          width: 25%;
          font-weight: 400;
          font-size: 15px;
          font-family: PingFang SC;
          text-align: center;
          line-height: 40px;
          height: 40px;
          opacity: 1;
          padding: 0;
          color: rgba(255,255,255,1);
        }
        .last_col {
          width: 50%;
          margin: 0;
        }
      }

      .table_content {
        // height: 40px;
        display: flex;
        justify-content: flex-start;
        align-content: center;

        .data_cell {
          // margin: auto 18px;
          width: 25%;
          font-size: 15px;
          font-family: PingFang SC;
          text-align: center;
          line-height: 20px;
          opacity: 1;
          color: rgba(51,51,51,1);
          padding: 10px 0;
        }

        .last_col {
          // margin: auto 18px;
          font-size: 15px;
          text-align: center;
          line-height: 20px;
          opacity: 1;
          color: rgba(51,51,51,1);
          width: 50%;
          margin: 0;
          overflow: hidden;
          // text-overflow: ellipsis;
          padding: 10px 0;
        }

        &:nth-child(2n + 1) {
          background: rgba(247, 247, 247, 1);
        }
      }
    }
  }

  .service_authorize {
    padding: 0 15px;
    background: #ffffff;

    .service_car_type{
      padding: 8px;
      .service_label {
        height: 40px;
        font-size: 15px;
        font-family: PingFang SC;
        line-height: 40px;
        color: rgba(51,51,51,1);
        opacity: 1;
      }
      .panel__select{
        border: 1px solid rgba(230,230,230,1);
        height: 36px;
        position: relative;
      }

      .panel__select__input{
        position: absolute;
        width: 100%;
        height: 100%;
        text-indent: 10px;
      }

      .panel__select__icon{
        background-image: url('~@/module/channelManagement/static/images/icon_arrow_down.png');
        width: 16px;
        height: 9px;
        position: absolute;
        top: 50%;
        right: 10px;
        transform: translate(0,-50%);
        background-size: 100%;
        background-repeat: no-repeat;
      }
    }

    .service_region{
      padding: 8px;

      .service_label {
        height: 40px;
        font-size: 15px;
        font-family: PingFang SC;
        line-height: 40px;
        color: rgba(51,51,51,1);
        opacity: 1;
      }

      .pannel__conent{
        border:1px solid rgba(230,230,230,1);
        min-height: 150px;
        padding: 10px;
      }
    }
  }
}
</style>
