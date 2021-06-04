<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
    };
  },
  created() {
    let href = window.location.href;
    let corpId = this.getRequest([]).corp_id;
    console.log(corpId);
    if(href.indexOf('tqy') != -1) { //dev、release
      window.location.replace(`https://tqy.do1.net.cn/qwy/vp/module/form.html?agentCode=form&corp_id=ww76540ea8781f31c5#/open/add?id=form01626a5c3b2a46d899ac183bd044708f&field=${corpId}&field1=${_.userId}`);
    }else if(href.indexOf('10.10.0.174') != -1) { //local
      window.location.replace(`http://10.10.0.174:8089/vp/module/form.html?agentCode=form&corp_id=wx05ab253814890c89#/open/add?id=forma81eca4e763b4ecba556878568fba4b8&field=${corpId}&field1=${_.userId}`);
    }else { //线上
      window.location.replace(`https://qy.do1.com.cn/open/vp/module/form.html?agentCode=form&corp_id=ww393e4dbf1eef102e#/open/add?id=form890780f8e91b4ae3b848c22c622ff31f&field=${corpId}&field1=${_.userId}`);
    }
  },
  methods: {
    getRequest(arr) {
      var url = decodeURIComponent(window.location.search); //获取url中"?"符后的字串
      var theRequest = new Object();
      if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
          var pd = true;
          for(var j = 0;j<arr.length;j++){
            if(strs[i].split("=")[0]==arr[j]){
              pd = false;
              break
            }
          }
          if(pd){
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
          }

        }
      }
      return theRequest;
    }
  }
}

</script>
<style lang='scss' scoped>
</style>
