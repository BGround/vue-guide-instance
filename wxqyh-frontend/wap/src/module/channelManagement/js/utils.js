import wx from 'weixin-js-sdk';
import qs from 'qs';

export function isOpenH5(){
  const query = window.location.search.replace('?','');
  const queryObject = qs.parse(query)
  return queryObject.openh5 === '1';
}

export function getLocation(){
  return new Promise((resolve, reject) => {
    wx.getLocation({
      type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
      success: function (res) {
          // var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
          // var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
          // var speed = res.speed; // 速度，以米/每秒计
          // var accuracy = res.accuracy; // 位置精度
        console.log('getLocation', res);
        if(res.errMsg === 'getLocation:ok'){
          resolve(res);
        }else{
          reject(res);
        }

      },
      fail: function(error){
        console.log(error,'fail')
        reject(error);
      },
      cancel:function (res) {
        reject(new Error('用户拒绝授权获取地理位置'));
      },
    });
    window.setTimeout(()=>{
      reject(new Error('定位超时'));
    },1000*10)
  })
}


// 浏览器原生方法
function getCurrentPosition(){
  return new Promise((resolve, reject) => {
  navigator.geolocation.getCurrentPosition(function(position){
		var latitude = position.coords.latitude;
		var longitude = position.coords.longitude;
		resolve({
			latitude,
			longitude
		})
  }, function(error){
	reject(error.message);
  });
    window.setTimeout(()=>{
      reject(new Error('定位超时'));
    },1000*10)
  })
}


// var latitude = res.latitude;
// var longitude = res.longitude; //
/**
 * 坐标转latLng对象
 * @param lat 纬度，浮点数，范围为90 ~ -90
 * @param lng 经度，浮点数，范围为180 ~ -180。
 * @return {qq.maps.LatLng}
 */
export function toLatLng(lat, lng) {
    return  new qq.maps.LatLng(lat,lng);
}

/**
 * 坐标转换，将标准经纬度或其他地图经纬度转换为腾讯地图经纬度坐标。
 * @params LatLng
 * @return {Promise<latLng>}
 * @see https://lbs.qq.com/javascript_v2/doc/convertor.html
 */
function translateLatLng(latLng){
    return new Promise((resolve, reject) => {
        qq.maps.convertor.translate(latLng, 1, function (result) {
             resolve(result);
        })
    })
}

/**
 * 获取当前地理位置
 * @return {Promise<unknown>}
 */
export function getAddressByLatlng(latLng){
    //地址和经纬度之间进行转换服务
    return new Promise((resolve, reject) => {
        const geocoder = new qq.maps.Geocoder();
        //设置服务请求成功的回调函数
        geocoder.setComplete(function(result) {
            const addressComponents = result.detail.addressComponents || {};
            resolve(addressComponents);
        });

        //若服务请求失败，则运行以下函数
        geocoder.setError(function() {
            reject(new Error('地址和经纬度之间进行转换失败'))
        });

        geocoder.getAddress(latLng);
    })
}

/**
 * 获取地理位置信息失败
 * @return {Promise<unknown>}
 */
export async function getAddress() {
  try {
      const location = await getLocation();
      const latLng = toLatLng(location.latitude, location.longitude);
      const txLatLng = await translateLatLng(latLng);
      const address = await getAddressByLatlng(txLatLng[0]);
      return address;
  }catch (e) {
      console.log(e,'xx1e')
      throw new Error('获取地理位置信息失败')
  }
}

/**
 * 原生浏览器
 */
export async function getAddressByBrowserApi(){
  try {
      const location = await getCurrentPosition();
      const latLng = toLatLng(location.latitude, location.longitude);
      const txLatLng = await translateLatLng(latLng);
      const address = await getAddressByLatlng(txLatLng[0]);
      return address;
  }catch (e) {
      throw new Error('获取地理位置信息失败')
  }
}


/**
 * 获取城市名称
 * @return {Promise<string|string>}
 */
export async function getCityByLocation(){
    if(isOpenH5()){
      console.log('h5');
      return await getCityByBrowserApi()
    }
    console.log('non-h5');
    const isMobile = _.isWeChatApp() || _.isQiyeweixinApp();
    if (isMobile){
        try {
            const {city='全国'} = await getAddress()
            return city;
        }catch (e) {
          console.log(e,'e')
            throw new Error('获取城市名称失败')
        }
    }else{
        return '全国'
    }
}


/**
 * 获取城市名称
 * @return {Promise<string|string>}
 */
export async function getCityByBrowserApi(){
  try {
    const {city='全国'} = await getAddressByBrowserApi()
    return city;
  }catch (e) {
    console.log(e,'e')
      throw new Error('获取城市名称失败')
  }
}
