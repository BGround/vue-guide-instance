<template>
<div class="index">
    <div class="demo-slide-container" style="background: #ffffff;">
        <qw-slide :data="banners"></qw-slide>
    </div>

    <div class="search">

        <qw-tabs v-model="searchType">
            <qw-tab-pane value="city" label="搜索城市"></qw-tab-pane>
            <qw-tab-pane value="dealer" label="搜索经销商"></qw-tab-pane>
            <qw-tab-pane value="erp" label="搜索ERP号"></qw-tab-pane>
        </qw-tabs>
        <cherySearch :departmentName="departmentName" @select="handleSelectDealer" @pick="handlePickDepartment" :placeholder="searchType==='city'?'搜索城市':'搜索经销商名称、ERP号'" :type="searchType" v-model="city">
        </cherySearch>
    </div>

    <news :content="newsContent"></news>

    <div class="title">
        <div class="title__icon"></div>
        <div class="title__text">全国网点覆盖情况一览</div>
    </div>

    <div class="message">
        <div class="message__item">全国网点规模<span>{{networkCounts}}</span>家</div>
        <div class="message__item">覆盖城市<span>{{cityCounts}}</span>个</div>
    </div>

    <div class="chart">
        <!--      <div class="chart__header">-->
        <!--        近12个月净利润趋势分析-->
        <!--      </div>-->
        <div id="home_chart">

        </div>
    </div>
</div>
</template>

<script>
import SearchHeader from "@/module/channelManagement/components/SearchHeader";
import iconPortfolio from "@/module/channelManagement/static/images/icon_portfolio.png";
import iconPranscript from "@/module/channelManagement/static/images/icon_transcript.png";
import iconBusinessBoard from "@/module/channelManagement/static/images/icon_business_board.png";
import iconArrowDown from "@/module/channelManagement/static/images/icon_arrow_down.png";
import {
    mapGetters
} from 'vuex'
import echarts from "echarts";
import bmap from "echarts/extension/bmap/bmap";
import * as homeApi from '@/module/channelManagement/api/home';
import slide1 from "@/module/channelManagement/static/images/slide/1.jpg";
import slide2 from "@/module/channelManagement/static/images/slide/2.jpg";
import slide3 from "@/module/channelManagement/static/images/slide/3.jpg";
import slide4 from "@/module/channelManagement/static/images/slide/4.jpg";
import slide5 from "@/module/channelManagement/static/images/slide/5.jpg";
import slide6 from "@/module/channelManagement/static/images/slide/6.jpg";
import news from '@/module/channelManagement/components/news'
import cherySearch from '@/module/channelManagement/components/chery-search'
import * as utils from '@/module/channelManagement/js/utils'
import {
    getDealerMapByCity
} from "@/module/channelManagement/api/getData";

const geoCoordMap = {
    '海门': [121.15, 31.89],
    '鄂尔多斯': [109.781327, 39.608266],
    '招远': [120.38, 37.35],
    '舟山': [122.207216, 29.985295],
    '齐齐哈尔': [123.97, 47.33],
    '盐城': [120.13, 33.38],
    '赤峰': [118.87, 42.28],
    '青岛': [120.33, 36.07],
    '乳山': [121.52, 36.89],
    '金昌': [102.188043, 38.520089],
    '泉州': [118.58, 24.93],
    '莱西': [120.53, 36.86],
    '日照': [119.46, 35.42],
    '胶南': [119.97, 35.88],
    '南通': [121.05, 32.08],
    '拉萨': [91.11, 29.97],
    '云浮': [112.02, 22.93],
    '梅州': [116.1, 24.55],
    '文登': [122.05, 37.2],
    '上海': [121.48, 31.22],
    '攀枝花': [101.718637, 26.582347],
    '威海': [122.1, 37.5],
    '承德': [117.93, 40.97],
    '厦门': [118.1, 24.46],
    '汕尾': [115.375279, 22.786211],
    '潮州': [116.63, 23.68],
    '丹东': [124.37, 40.13],
    '太仓': [121.1, 31.45],
    '曲靖': [103.79, 25.51],
    '烟台': [121.39, 37.52],
    '福州': [119.3, 26.08],
    '瓦房店': [121.979603, 39.627114],
    '即墨': [120.45, 36.38],
    '抚顺': [123.97, 41.97],
    '玉溪': [102.52, 24.35],
    '张家口': [114.87, 40.82],
    '阳泉': [113.57, 37.85],
    '莱州': [119.942327, 37.177017],
    '湖州': [120.1, 30.86],
    '汕头': [116.69, 23.39],
    '昆山': [120.95, 31.39],
    '宁波': [121.56, 29.86],
    '湛江': [110.359377, 21.270708],
    '揭阳': [116.35, 23.55],
    '荣成': [122.41, 37.16],
    '连云港': [119.16, 34.59],
    '葫芦岛': [120.836932, 40.711052],
    '常熟': [120.74, 31.64],
    '东莞': [113.75, 23.04],
    '河源': [114.68, 23.73],
    '淮安': [119.15, 33.5],
    '泰州': [119.9, 32.49],
    '南宁': [108.33, 22.84],
    '营口': [122.18, 40.65],
    '惠州': [114.4, 23.09],
    '江阴': [120.26, 31.91],
    '蓬莱': [120.75, 37.8],
    '韶关': [113.62, 24.84],
    '嘉峪关': [98.289152, 39.77313],
    '广州': [113.23, 23.16],
    '延安': [109.47, 36.6],
    '太原': [112.53, 37.87],
    '清远': [113.01, 23.7],
    '中山': [113.38, 22.52],
    '昆明': [102.73, 25.04],
    '寿光': [118.73, 36.86],
    '盘锦': [122.070714, 41.119997],
    '长治': [113.08, 36.18],
    '深圳': [114.07, 22.62],
    '珠海': [113.52, 22.3],
    '宿迁': [118.3, 33.96],
    '咸阳': [108.72, 34.36],
    '铜川': [109.11, 35.09],
    '平度': [119.97, 36.77],
    '佛山': [113.11, 23.05],
    '海口': [110.35, 20.02],
    '江门': [113.06, 22.61],
    '章丘': [117.53, 36.72],
    '肇庆': [112.44, 23.05],
    '大连': [121.62, 38.92],
    '临汾': [111.5, 36.08],
    '吴江': [120.63, 31.16],
    '石嘴山': [106.39, 39.04],
    '沈阳': [123.38, 41.8],
    '苏州': [120.62, 31.32],
    '茂名': [110.88, 21.68],
    '嘉兴': [120.76, 30.77],
    '长春': [125.35, 43.88],
    '胶州': [120.03336, 36.264622],
    '银川': [106.27, 38.47],
    '张家港': [120.555821, 31.875428],
    '三门峡': [111.19, 34.76],
    '锦州': [121.15, 41.13],
    '南昌': [115.89, 28.68],
    '柳州': [109.4, 24.33],
    '三亚': [109.511909, 18.252847],
    '自贡': [104.778442, 29.33903],
    '吉林': [126.57, 43.87],
    '阳江': [111.95, 21.85],
    '泸州': [105.39, 28.91],
    '西宁': [101.74, 36.56],
    '宜宾': [104.56, 29.77],
    '呼和浩特': [111.65, 40.82],
    '成都': [104.06, 30.67],
    '大同': [113.3, 40.12],
    '镇江': [119.44, 32.2],
    '桂林': [110.28, 25.29],
    '张家界': [110.479191, 29.117096],
    '宜兴': [119.82, 31.36],
    '北海': [109.12, 21.49],
    '西安': [108.95, 34.27],
    '金坛': [119.56, 31.74],
    '东营': [118.49, 37.46],
    '牡丹江': [129.58, 44.6],
    '遵义': [106.9, 27.7],
    '绍兴': [120.58, 30.01],
    '扬州': [119.42, 32.39],
    '常州': [119.95, 31.79],
    '潍坊': [119.1, 36.62],
    '重庆': [106.54, 29.59],
    '台州': [121.420757, 28.656386],
    '南京': [118.78, 32.04],
    '滨州': [118.03, 37.36],
    '贵阳': [106.71, 26.57],
    '无锡': [120.29, 31.59],
    '本溪': [123.73, 41.3],
    '克拉玛依': [84.77, 45.59],
    '渭南': [109.5, 34.52],
    '马鞍山': [118.48, 31.56],
    '宝鸡': [107.15, 34.38],
    '焦作': [113.21, 35.24],
    '句容': [119.16, 31.95],
    '北京': [116.46, 39.92],
    '徐州': [117.2, 34.26],
    '衡水': [115.72, 37.72],
    '包头': [110, 40.58],
    '绵阳': [104.73, 31.48],
    '乌鲁木齐': [87.68, 43.77],
    '枣庄': [117.57, 34.86],
    '杭州': [120.19, 30.26],
    '淄博': [118.05, 36.78],
    '鞍山': [122.85, 41.12],
    '溧阳': [119.48, 31.43],
    '库尔勒': [86.06, 41.68],
    '安阳': [114.35, 36.1],
    '开封': [114.35, 34.79],
    '济南': [117, 36.65],
    '德阳': [104.37, 31.13],
    '温州': [120.65, 28.01],
    '九江': [115.97, 29.71],
    '邯郸': [114.47, 36.6],
    '临安': [119.72, 30.23],
    '兰州': [103.73, 36.03],
    '沧州': [116.83, 38.33],
    '临沂': [118.35, 35.05],
    '南充': [106.110698, 30.837793],
    '天津': [117.2, 39.13],
    '富阳': [119.95, 30.07],
    '泰安': [117.13, 36.18],
    '诸暨': [120.23, 29.71],
    '郑州': [113.65, 34.76],
    '哈尔滨': [126.63, 45.75],
    '聊城': [115.97, 36.45],
    '芜湖': [118.38, 31.33],
    '唐山': [118.02, 39.63],
    '平顶山': [113.29, 33.75],
    '邢台': [114.48, 37.05],
    '德州': [116.29, 37.45],
    '济宁': [116.59, 35.38],
    '荆州': [112.239741, 30.335165],
    '宜昌': [111.3, 30.7],
    '义乌': [120.06, 29.32],
    '丽水': [119.92, 28.45],
    '洛阳': [112.44, 34.7],
    '秦皇岛': [119.57, 39.95],
    '株洲': [113.16, 27.83],
    '石家庄': [114.48, 38.03],
    '莱芜': [117.67, 36.19],
    '常德': [111.69, 29.05],
    '保定': [115.48, 38.85],
    '湘潭': [112.91, 27.87],
    '金华': [119.64, 29.12],
    '岳阳': [113.09, 29.37],
    '长沙': [113, 28.21],
    '衢州': [118.88, 28.97],
    '廊坊': [116.7, 39.53],
    '菏泽': [115.480656, 35.23375],
    '合肥': [117.27, 31.86],
    '武汉': [114.31, 30.52],
    '大庆': [125.03, 46.58]
};

var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)
            });
        }
    }
    return res;
};

const chartOption = {
    tooltip: {
        trigger: 'item'
    },
    bmap: {
        center: [104.114129, 37.550339],
        zoom: 2.5,
        roam: false,
        mapStyle: {
            styleJson: [{
                'featureType': 'water',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'land',
                'elementType': 'all',
                'stylers': {
                    'color': '#E8FDFF'
                }
            }, {
                'featureType': 'railway',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'highway',
                'elementType': 'all',
                'stylers': {
                    'color': '#fdfdfd'
                }
            }, {
                'featureType': 'highway',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'geometry',
                'stylers': {
                    'color': '#fefefe'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'geometry.fill',
                'stylers': {
                    'color': '#fefefe'
                }
            }, {
                'featureType': 'poi',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'green',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'subway',
                'elementType': 'all',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'manmade',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'local',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'arterial',
                'elementType': 'labels',
                'stylers': {
                    'visibility': 'off'
                }
            }, {
                'featureType': 'boundary',
                'elementType': 'all',
                'stylers': {
                    'color': '#AED0FF'
                }
            }, {
                'featureType': 'building',
                'elementType': 'all',
                'stylers': {
                    'color': '#d1d1d1'
                }
            }, {
                'featureType': 'label',
                'elementType': 'labels.text.fill',
                'stylers': {
                    'color': '#999999'
                }
            }]
        }
    },
    series: [{
            name: '',
            type: 'scatter',
            coordinateSystem: 'bmap',
            data: [],
            symbolSize: function (val) {
                return parseInt(val[2]) || 0;
            },
            encode: {
                value: 2
            },
            label: {
                formatter: '{b}',
                position: 'right',
                show: false
            },
            itemStyle: {
                color: '#2781db'
            },
            emphasis: {
                label: {
                    show: true
                }
            },
        },

    ]
};

//  transcript
let id = 0;
export default {
    name: "index",
    components: {
        SearchHeader,
        news,
        cherySearch
    },
    data() {
        return {

            networkCounts: '0',
            cityCounts: '0',
            newsContent: {
                networkExitList: [],
                openNewNetworkList: []
            },
            departmentName: '全国',

            city: '',
            searchType: 'city',
            banners: [],

            selected: 'city',
            tabs: [{
                    value: 'city',
                    label: "搜索城市",
                },
                {
                    value: 'dealer',
                    label: "搜索经销商",
                },
                {
                    value: 'erp',
                    label: "搜索ERP号"
                }
            ],

            keyword: "", // 关键字
            regionName: "全国", // 区域
            iconArrowDown: iconArrowDown,
            slideList: [
                slide1,
                slide2,
                slide3,
                slide4,
                slide5,
                slide6,
            ],
            navList: [{
                    image: iconPortfolio,
                    name: "档案袋",
                    routeName: "dealerProfile"
                },
                {
                    image: iconBusinessBoard,
                    name: "业务看板",
                    routeName: ""
                }
            ],
            nationalNetworkCityGroupCountList: [],
            cityInViewpoint: '', // 当前视野城市
        };
    },
    computed: {
        ...mapGetters('home', {
            getRegionName: 'getRegionName',
        })
    },
    created() {
        // debugger;
        // this.fetchRegionData();

        this.getbannerImage()
        this.getchannelHeadlines()
        this.getnationalNetwork()
        this.initBMap();
    },
    methods: {

        getbannerImage() {
            homeApi.getbannerImage().then((data) => {
                if (data && data.map && data.map.list) {
                    this.banners = data.map.list.filter(item => !!item.imageUrl).map(item => _.fileDownURL + item.imageUrl);
                } else {
                    this.banners = []
                }
            })
        },

        getchannelHeadlines() {
            homeApi.getchannelHeadlines().then((data) => {
                //  debugger
                const map = data && data.map ? data.map : {}
                this.newsContent = map;

                //  const {networkExitList=[],openNewNetworkList=[] } = map;
                //   let text = '';

                //   const openList = openNewNetworkList.filter(item=>!!item);
                //   if(openList.length){
                //       text = text + `· 开通${openList.length}家新网（${openList.join('、')}）`;
                //   }else{
                //       text = text + `· 开通0家新网`;
                //   }

                //   const exitList = networkExitList.filter(item=>!!item);
                //   if(exitList.length){
                //       text = text + ` · 退出网点${exitList.length}家（${exitList.join('、')}）`;
                //   }else{
                //       text = text + ` · 退出网点0家`;
                //   }
                //   this.newsContent = text;

            })
        },

        getnationalNetwork() {
            homeApi.getnationalNetwork().then((data) => {
                if (data && data.map) {
                    this.networkCounts = data.map.nationalNetworkCount || 0; //	全国网点数量
                    this.cityCounts = data.map.nationalNetworkCityCount || 0; //覆盖城市网点
                    this.setChartOption(data.map.nationalNetworkCityGroupCountList); //获取全国地图城市
                    this.nationalNetworkCityGroupCountList = data.map.nationalNetworkCityGroupCountList || []
                } else {
                    this.networkCounts = 0;
                    this.cityCounts = 0;
                    this.setChartOption([]);
                }
            })
        },

        convertData(data) {
            var res = [];
            for (var i = 0; i < data.length; i++) {
                var geoCoord = geoCoordMap[data[i].cityName];
                if (geoCoord) {
                    res.push({
                        name: data[i].cityName,
                        value: geoCoord.concat(data[i].count)
                    });
                }
            }
            return res;
        },

        setChartOption(list = []) {
            const data = this.convertData(list.sort(function (a, b) {
                return b.count - a.count;
            }))
            chartOption.series[0].data = data;
            this.chart.setOption(chartOption, true);
        },

        handleChangeSearch(form) {
            console.log(form);
        },
        handleClickNavItem(routeName) {
            routeName && this.$router.push(routeName);
        },
        resetChartSize() {
            this.chart.resize();
        },

        handleFocusSearch() {
            this.$router.push({
                name: 'dealerProfile',
                params: {
                    type: 'focus'
                }
            });
        },

        handlePickRegion() {
            this.$router.push({
                name: 'dealerProfile',
                params: {
                    type: 'pick'
                }
            });
        },

        /**
         * 处理选择经销商
         */
        handleSelectDealer(dealer) {

            this.$router.push({
                name: 'dealerDetail',
                query: {
                    dealerFullName: dealer.dealerFullName || '',
                    dealerId: dealer.id || '',
                    storeImg: dealer.storeImg || '',
                    erpCarNo: dealer.erpCarNo || '',
                }
            })
        },

        handlePickDepartment(department) {
            this.$router.push({
                name: 'cityDetail',
                query: {
                    departmentName: department.departmentName,
                    departmentId: department.id
                }
            })
        },

        setCity() {
            _.showLoading('');
            utils.getCityByLocation().then((city) => {
                this.departmentName = city;
            }).catch(() => {
                this.departmentName = '全国';
            }).finally(() => {
                _.hideLoading();
            })
        },

        initCity() {
            if (!utils.isOpenH5) {
                wx.ready((e) => {
                    this.setCity();
                });
                wx.error(() => {
                    this.departmentName = '全国';
                })
            } else {
                this.setCity();
            }

        },

        initBMap() {
            // this.map = new BMap.Map("allmap");

            // 创建地址解析器实例
            // this.geo = new BMap.Geocoder();

            // var point = new BMap.Point(116.331398,39.897445);
            // map.centerAndZoom(point,12);
            // // 创建地址解析器实例
            // var myGeo = new BMap.Geocoder();
            // // 将地址解析结果显示在地图上,并调整地图视野
            // myGeo.getPoint("北京市海淀区上地10街", function(point){
            //     if (point) {
            //         map.centerAndZoom(point, 16);
            //         map.addOverlay(new BMap.Marker(point));
            //     }else{
            //         alert("您选择地址没有解析到结果!");
            //     }
            // }, "北京市");
        },

        getCityNameByLnglat(point) {
            return new Promise((resolve, reject) => {
                if (!point.lng || !point.lat) {
                    reject(new Error('无法获取地理位置'))
                }
                const geo = new BMap.Geocoder();
                // var pt = e.point;
                geo.getLocation(point, function (rs) {
                    resolve(rs.addressComponents)
                });
            })
        },

        setViewport(bmap, districtName) {
            const bdary = new BMap.Boundary();
            return new Promise((resolve, reject) => {
                bdary.get(districtName, rs => {
                    //获取行政区域
                    bmap.clearOverlays() //清除地图覆盖物
                    var count = rs.boundaries.length //行政区域的点有多少个
                    if (count === 0) {
                        reject(new Error('未能获取当前输入行政区域'))
                    }
                    const points = rs.boundaries.reduce((points, boundary) => {
                        const ply = new BMap.Polygon(boundary, {
                            strokeWeight: 1,
                            // strokeColor: '#7D0000',
                            fillColor: 'rgba(255,255,255,0)'
                        })
                        bmap.addOverlay(ply)
                        return [...points, ...ply.getPath()]
                    }, [])
                    bmap.setViewport(points) //调整视野
                    resolve();
                })
            })
        },

        getDealerList(city) {
            return getDealerMapByCity({
                cityName: city
            }).then((data) => {
                return data && data.map && data.map.list ? data.map.list : [];
            })
        },

        addMarker(bmap, point, dealer, callback) {
            // const point = new BMap.Point(point.lng,point.lat);
            const marker = new BMap.Marker(point);
            bmap.addOverlay(marker);
            marker.addEventListener("click", callback.bind(this, dealer));
            if (dealer.dealerShortName) {
                const label = new BMap.Label(dealer.dealerShortName, {
                    offset: new BMap.Size(20, -10)
                });
                marker.setLabel(label);
            }

        },

        getPoint(geocoder, address) {
            return new Promise((resolve, reject) => {
                geocoder.getPoint(address, (point) => {
                    resolve(point)
                })
            })
        },

        async getPointByAddressBatch(dealers) {
            var geocoder = new BMap.Geocoder();
            const dealerList = [];
            for (const dealer of dealers) {
                if (dealer.companyAddress) {
                    const point = await this.getPoint(geocoder, dealer.companyAddress);
                    dealerList.push({
                        point: point,
                        dealer: dealer
                    })
                }
            }
            return dealerList;
        },

        async handleClickClickMap(bmap, point) {
            const {
                city = ''
            } = await this.getCityNameByLnglat(point);
            if (this.cityInViewpoint === city) {
                return;
            }
            this.cityInViewpoint = city;
            await this.setViewport(bmap, city);
            const dealers = await this.getDealerList(city)
            const pointers = await this.getPointByAddressBatch(dealers)
            pointers.forEach(({
                dealer,
                point
            }) => {
                this.addMarker(bmap, point, dealer, (dealer) => {
                    this.$router.push({
                        name: 'dealerDetail',
                        query: {
                            dealerId: dealer.id
                        }
                    })
                });
            })
        }

    },
    mounted() {
        this.chart = echarts.init(document.getElementById("home_chart"));
        this.chart.setOption(chartOption);
        this.chart.on('finished', () => {
            // 从echarts对象中获取bmap对象
            var bmap = this.chart.getModel().getComponent('bmap').getBMap();

            bmap.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
            bmap.enablePinchToZoom(true);
            bmap.enableDragging(true);
            bmap.addEventListener("click", (event) => {
                this.handleClickClickMap(bmap, event.point)
            })

            bmap.addEventListener("zoomend", () => {
                console.log("地图缩放至：" + bmap.getZoom() + "级");
                if (bmap.getZoom() <= 5) {
                    bmap.clearOverlays() //清除地图覆盖物
                    console.log(this.nationalNetworkCityGroupCountList)
                    this.setChartOption(this.nationalNetworkCityGroupCountList);
                }
            });
            // bmap.addControl(new BMap.MapTypeControl());
        })

        this.initCity()

        window.addEventListener("resize", this.resetChartSize);
    },
    destroyed() {
        window.removeEventListener("resize", this.resetChartSize);
    },
};
</script>

<style lang="scss" scoped>
#home_chart {
    height: 268px;
    margin-top: 10px;
}

.index {

    background: #ffffff;
    padding-bottom: 10px;
    min-height: 100%;

    .chart__header {
        margin-top: 36px;
        height: 24px;
        font-size: 17px;
        font-weight: 400;
        line-height: 24px;
        text-align: center;
        color: rgba(51, 51, 51, 1);
        padding-bottom: 15px;
    }

    .slider-wrap {
        height: 170px;
    }

    .search {
        height: 79px;
        background: rgba(198, 0, 31, 0.11);

        /deep/ {
            .qw-tab-bar__wrapper {
                height: 33px;
            }

            .qw-tab-pane {
                padding: 0;
            }

            .qw-tab-bar {
                height: 33px;
                background: rgba(198, 0, 31, 0);
            }

            .qw-tabs__wrapper {
                border-top: none;
            }

            .header {
                background: rgba(198, 0, 31, 0);
            }

            .qw-search-bar {
                background: rgba(240, 240, 240, 1);
            }

            .qw-tab-bar__pane {
                color: rgba(153, 153, 153, 1);
            }

            .qw-tab-bar__pane.is-active {
                color: rgba(0, 0, 0, 1);
                font-weight: 600;
            }

            .qw-tab-bar__slider {
                background-color: rgba(198, 0, 31, 1);
            }

        }
    }

    /deep/ {
        .qw-slide-item {
            line-height: 0;

            img {
                width: 100%;
                height: 170px;
                object-fit: cover;
            }
        }
    }

    .title {
        height: 48px;
        display: flex;
        align-items: center;
        padding: 0 18px;
        position: relative;

        &::after {
            content: '';
            position: absolute;
            bottom: 0;
            height: 1px;
            left: 12px;
            right: 12px;
            transform: scaleY(0.5);
            background: #D0D0D0;
        }

        .title__icon {
            width: 30px;
            height: 30px;
            flex-basis: 30px;
            flex-shrink: 0;
            margin: 12px;
        }

        .title__text {
            height: 48px;
            font-size: 17px;
            font-weight: 600;
            line-height: 48px;
            color: rgba(0, 0, 0, 1);
            opacity: 1;
        }
    }

    .message {
        display: flex;
        padding: 10px 20px 0;
        justify-content: space-around;

        .message__item {
            height: 24px;
            font-size: 13px;
            font-weight: 400;
            line-height: 24px;
            color: rgba(102, 102, 102, 1);

            &>span {
                color: #C6001F;
                margin: 0 5px;
            }
        }
    }
}
</style>
