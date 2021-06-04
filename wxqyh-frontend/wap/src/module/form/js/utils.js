
let utils = {
  isNumber:function(inputData){
    if (parseFloat(inputData).toString() == "NaN") {
      return false;
    } else {
      return true;
    }
  },
  isObjectEmpty: function(t) {
    if (null == t)
      return !0;
    if (t.length > 0)
      return !1;
    if (0 === t.length)
      return !0;
    for (var e in t)
      if (hasOwnProperty.call(t, e))
        return !1;
    return isNaN(t)
  },
  fixDecimalPrecision: function(t, e) {
    var i = "";
    if (e || (e = 8),
        !this.isEmpty(t)) {
      var a = parseFloat(t);
      if (!isNaN(a)) {
        var s = (a + "").split(".")[1];
        i = s && s.length > e ? parseFloat(a.toFixed(e)) : a,
        e > 6 && Math.abs(i) < 1 && /e-/.test(i + "") && (i = parseFloat(a.toFixed(6)))
      }
    }
    return i
  },
  isEmpty:function(t){
    return "" === t|| null == t
  },
  hasBorder: function(e) {
    return e !== DEFAULT_STYLE_NAME && (styleMap[e] && styleMap[e]["border-width"])
  },
  pick: function(t, e) {
    var i = {};
    return this.forEach(e, function(e, a) {
      a in t && (i[a] = t[a])
    }),
      i
  },
  forEach: function(t, e) {
    if (Array.isArray(t))
      for (var i = 0, a = t.length; i < a && !1 !== e.apply(t[i], [i, t[i]]); i++) ;
    else if (t && "object" == typeof t)
      for (var s in t)
        if (t.hasOwnProperty(s) && !1 === e.apply(t[s], [s, t[s]]))
          break
  },
  getRandomCode: function(t, e) {
    for (var i = e || "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", a = ""; t > 0; )
      a += i[Math.floor(Math.random() * i.length)],
        t--;
    return a
  },
  isString: function(t) {
    return "string" == typeof t
  },
  isArray(t){
    return Array.isArray(t)
  },
}
export default utils;
