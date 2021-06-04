
import utils from './utils'
//打印数据处理的构造函数，e是styles的数据，t是images的数据
let PrintUtils = function(e, t, n) {
  var o = this;
  this.styleMap = {},
  this.imageMap = {},
  this.styleNameMap = {},
  this.images = t,
  this.dpi = n,
  e.default && (this.defaultStyle = e.default),//如果default数据没有就用默认的，styleMap是styles的数据
    this.forEach(e, function(e, t) {
      o.styleMap[e] = t,
        o.styleNameMap[JSON.stringify(t)] = e
  })
}
Object.assign(PrintUtils.prototype, utils,{
  defaultStyle: {
    "font-family": "MicrosoftYahei",
    "font-size": 9,
    "color": "#000",
    "font-color": "#000000",
    "font-style": "normal",
    "font-weight": "normal",
    "line-height": 14.4,
    "text-align": "left",
    "vertical-align": "middle",
    "text-decoration": [],
    "opacity": 1,
    "padding": [4, 4, 4, 4],
    "image-padding": 5,
    "border-style": "none",
    "border-width": 1,
    "border-color": "#000"
  },
  DEFAULT_STYLE_NAME:'default',
  STYLE_MAP: {
    htTop: {
      type: "vertical-align",
      style: "top"
    },
    htBottom: {
      type: "vertical-align",
      style: "bottom"
    },
    htMiddle: {
      type: "vertical-align",
      style: "middle"
    },
    htLeft: {
      type: "text-align",
      style: "left"
    },
    htRight: {
      type: "text-align",
      style: "right"
    },
    htCenter: {
      type: "text-align",
      style: "center"
    },
    bold: {
      type: "font-weight",
      style: "bold"
    },
    italic: {
      type: "font-style",
      style: "italic"
    },
    underline: {
      type: "text-decoration",
      style: "underline",
      result: "array"
    },
  },
  ClASS_MAP: {
    "vertical-align": {
      top: "htTop",
      bottom: "htBottom",
      middle: "htMiddle"
    },
    "text-align": {
      left: "htLeft",
      right: "htRight",
      center: "htCenter"
    },
    "font-weight": {
      bold: "bold"
    },
    "font-style": {
      italic: "italic"
    },
    "font-family": {
      SimSun: "font-family-SimSun",
      KaiTi: "font-family-KaiTi",
      SimHei: "font-family-SimHei",
      MicrosoftYahei: "font-family-MicrosoftYahei"
    },
    "font-color": {
      "#B02418": "font-color-B02418",
      "#EA3324": "font-color-EA3324",
      "#F5C243": "font-color-F5C243",
      "#FFFF54": "font-color-FFFF54",
      "#9ECE63": "font-color-9ECE63",
      "#4EAC5A": "font-color-4EAC5A",
      "#4EADEA": "font-color-4EADEA",
      "#306EBA": "font-color-306EBA",
      "#081F5C": "font-color-081F5C",
      "#683499": "font-color-683499",
      "#FFFFFF": "font-color-FFFFFF",
      "#000000": "font-color-000000",
      "#E7E6E6": "font-color-E7E6E6",
      "#475368": "font-color-475368",
      "#4E71BE": "font-color-4E71BE",
      "#DE8343": "font-color-DE8343",
      "#A5A5A5": "font-color-A5A5A5",
      "#F5C243": "font-color-F5C243",
      "#6A99D0": "font-color-6A99D0",
      "#7DAB54": "font-color-7DAB54",
      "#F4F5F8": "font-color-F4F5F8",
      "#848484": "font-color-848484",
      "#D0CECE": "font-color-D0CECE",
      "#D7DCE3": "font-color-D7DCE3",
      "#DBE2F1": "font-color-DBE2F1",
      "#F6E6D7": "font-color-F6E6D7",
      "#EDEDED": "font-color-EDEDED",
      "#FDF2D0": "font-color-FDF2D0",
      "#E0EBF5": "font-color-E0EBF5",
      "#E4EFDB": "font-color-E4EFDB",
      "#D8D8D8": "font-color-D8D8D8",
      "#595959": "font-color-595959",
      "#AEABAB": "font-color-AEABAB",
      "#AFB8C8": "font-color-AFB8C8",
      "#B7C5E4": "font-color-B7C5E4",
      "#F0CDB0": "font-color-F0CDB0",
      "#DBDBDB": "font-color-DBDBDB",
      "#FAE6A2": "font-color-FAE6A2",
      "#C2D6EC": "font-color-C2D6EC",
      "#CADFB7": "font-color-CADFB7",
      "#BFBFBF": "font-color-BFBFBF",
      "#3F3F3F": "font-color-3F3F3F",
      "#747070": "font-color-747070",
      "#8795AE": "font-color-8795AE",
      "#8795AE": "font-color-8795AE",
      "#EAB48A": "font-color-EAB48A",
      "#C9C9C9": "font-color-C9C9C9",
      "#F9DA76": "font-color-F9DA76",
      "#A4C1E2": "font-color-A4C1E2",
      "#B0CF94": "font-color-B0CF94",
      "#A5A5A5": "font-color-A5A5A5",
      "#262626": "font-color-262626",
      "#3A3838": "font-color-3A3838",
      "#353F4D": "font-color-353F4D",
      "#385391": "font-color-385391",
      "#B86129": "font-color-B86129",
      "#7B7B7B": "font-color-7B7B7B",
      "#B89230": "font-color-B89230",
      "#4273B0": "font-color-4273B0",
      "#5D803F": "font-color-60",
      "#7E7E7E": "font-color-7E7E7E",
      "#0C0C0C": "font-color-0C0C0C",
      "#171616": "font-color-171616",
      "#242A34": "font-color-242A34",
      "#243761": "font-color-243761",
      "#7A411A": "font-color-7A411A",
      "#525252": "font-color-525252",
      "#79611D": "font-color-79611D",
      "#2C4D75": "font-color-2C4D75",
      "#3E552A": "font-color-3E552A",
    },
    "text-decoration": {
      underline: "underline"
    },
    "font-size": "style"
  },
  //根据cells的属性去生成style的数据
  getStyleNameByCell: function(e) {
    var t = this.className2Style(e.className);
    if (this.isObjectEmpty(t))
      return this.DEFAULT_STYLE_NAME;
    var n = JSON.stringify(t);
    if (!this.styleNameMap[n]) {
      var o = this._getStyleKey();
      this.styleNameMap[n] = o,
        this.styleMap[o] = t
    }
    return this.styleNameMap[n]
  },
  getStyles: function() {
    // var e = this;
    // return this.forEach(this.styleMap, function(t, n) {
    //   e.styleMap[t] = e._design2Print(n)
    // }),
    return this.styleMap
  },
  initStyles: function() {
    this.styleNameMap = {},
      this.styleMap = {},
      this.styleMap['default'] = this.defaultStyle
  },
  getStyleByClassName: function(t) {
    return Object.assign({},this._defaultCellStyle(), this.className2Style(t))
  },
  hasBorder: function(e) {
    return e !== this.DEFAULT_STYLE_NAME && (this.styleMap[e] && this.styleMap[e]["border-width"])
  },
  //获取styles的样式数据
  className2Style: function(t) {
    // if(t){
    //   debugger
    // }
    var n = this
      , o = {};
    if (this.isEmpty(t))
      return o;
    var i = this._defaultCellStyle()
      , r = [];
    this.forEach(t.split(" "), function(e, t) {
      if (/font-size-[0-9]{1,2}/.test(t)) {
        var a = t.replace("font-size-", "");
        if (a = parseInt(a),
          i["font-size"] === a)
          return;
        o["font-size"] = a
      }
      if(/font-color-[0-9A-Z]{6}/.test(t)){
        var a = "#" + t.replace("font-color-", "");
        if (i["font-color"] === a)
          return;
        o["font-color"] = a
      }
      if(/font-family-[a-zA-Z]+/.test(t)){
        var a = t.replace("font-family-", "");
        if (i["font-family"] === a)
          return;
        o["font-family"] = a
      }
      /border-/.test(t) && r.push(t);
      var s = n.STYLE_MAP[t];
      s && i[s.type] !== s.style && ("array" === s.result ? o[s.type] = [s.style] : o[s.type] = s.style)
    });
    Object.assign(o,this._border2Style(r))
    return o;
  },
  _border2Style: function(e) {
    var t = {};
    utils.forEach(e, function(e, n) {
      if (/border-width-[0-4]{1}/.test(n))
        t.width = parseInt(n.replace("border-width-", ""));
      else
        switch (n) {
          case "border-left":
            t.left = !0;
            break;
          case "border-top":
            t.top = !0;
            break;
          case "border-right":
            t.right = !0;
            break;
          case "border-bottom":
            t.bottom = !0
        }
    });
    var n = {};
    n["border-style"] = "solid",
      n["border-width"] = t.width || 1;
    var o = 4;
    return utils.forEach(["left", "top", "right", "bottom"], function(e, i) {
      var r = t[i]
        , a = ["border", i, "width"].join("-");
      r || (n[a] = 0,
        o--)
    }),
      o > 0 ? n : {}
  },
  _getStyleKey: function() {
    return "s_" + this.getRandomCode(8)
  },
  _getImageKey: function() {
    return "img_" + this.getRandomCode(8)
  },
  _defaultCellStyle(){
    return this.defaultStyle;
  },
  //根据样式数据styles转换成styleMap的样式名称字符串
  style2ClassName: function(e) {
    //判断是否是默认样式
    if (e === this.DEFAULT_STYLE_NAME)
      return "";
    var t = this
      , n = "";
     var obj = this.styleMap[e];//styleMap是styles的数据
      this.forEach(obj, function(e, o) {
        //e可能的值是font-family，font-size，font-style，font-weight，color
        if (t.ClASS_MAP[e]) {
          //如果e = font-size的情况，例如{"font-size": 19,}返回font-size-19
          if ("style" == t.ClASS_MAP[e])
            return o = t._print2Design(e, o),
              void (n += " " + [e, o].join("-"));
          //e的值是text-decoration //判断是否有下划线//返回underline
          //如果o是数组 "padding": [4,4,4,4],"text-decoration": [],"text-decoration": ["underline"]
          if (utils.isArray(o))
            utils.forEach(o, function(i, r) {
              t.ClASS_MAP[e][r] && (utils.isEmpty(n) || (n += " "),
                n += t.ClASS_MAP[e][o])
            });
          else {
            // 如果是其他的,且没有匹配的情况
            if (!t.ClASS_MAP[e][o])
              return;
            //可能key的情况值"font-family","vertical-align","text-align","font-weight","font-style",取匹配的值
            utils.isEmpty(n) || (n += " "),
              n += t.ClASS_MAP[e][o]
          }
        }
      });
       return n
  },
  _print2Design: function(e, t) {
    // switch (e) {
    //   case "font-size":
    //     return Math.round(t / this.dpi.design * this.dpi.print);
    //   case "line-height":
    //     return FX.Utils.fixDecimalPrecision(t / this.dpi.design * this.dpi.print, 1);
    //   default:
        return t
    // }
  },
  formatData: function(e) {
    var t = this;
    if (e) {
      var n = [];
      return this.forEach(e, function(e, o) {
        if (o.image)
          if (o.fields)
            n.push({
              image: o.image,
              fields: o.fields
            });
          else {
            var i = t.images[o.image] || o.image
              , r = i.ossKey;
            if (r) {
              var a = "";
              t.imageMap[r] ? a = t.imageMap[r].key : (a = t._getImageKey(),
                t.imageMap[r] = {
                  key: a,
                  image: i
                }),
                n.push({
                  image: a,
                  fit: [100, 100]
                })
            }
          }
        else
          n.push(o)
      }),
        n
    }
  },
});

export { PrintUtils };
