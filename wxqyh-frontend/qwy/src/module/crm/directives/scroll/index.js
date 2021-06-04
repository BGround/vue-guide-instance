export default {
  bind: function (el, binding) {
    var ele = el;
    ele.addEventListener('scroll', function () {
      var fun = binding.value;
      fun(ele);
    })
  }
}
