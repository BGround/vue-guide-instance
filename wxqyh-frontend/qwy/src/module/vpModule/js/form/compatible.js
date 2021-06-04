export function compatible(ordered_fields){
  $.each(ordered_fields,function(index,el){
    if(el._type=='ChildField'&&el['childForm']!= undefined &&el['childForm'].length>0){
      //判断是否是旧数据
      if(el['childForm'][0].type){
        var new_childForm = [];
        $.each(el['childForm'],function(i,el){
          el._id = el.id;
          el.predefined_value = el.default_value;
          el._type = el.type;
          el.label = el.tit_value;
          delete el.id;
          delete el.default_value;
          delete el.type;
          delete el.tit_value;
          el.maximum_length = el.max_value;
          el.minimum_length = el.min_value;
          el.validations = [];
          if(el.required)el.validations.push('presence');
          if(el.read_only)el.validations.push('uniqueness');
          if(el.capital)el.validations.push('iscapital');
          if(el.id_card)el.validations.push('isCard');
          delete el.max_value;
          delete el.min_value;
          delete el.read_only;
          delete el.required;
          delete el.id_card;
          delete el.capital;
          //数字字段
          if(el._type == 'NumberField'){
            el.range_max = el.maximum_length;
            el.range_min = el.minimum_length;
            delete el.maximum_length;
            delete el.minimum_length;
          }
          //时间字段
          if(el._type == 'TimeField'){
            var timeObj = {};
            timeObj.hour = el.hour_value;
            timeObj.minute = el.minute_value;
            el.predefined_value = timeObj;
            delete el.hour_value;
            delete el.minute_value;
          }
          //评分字段
          if(el._type == 'RatingField'){
            var rating = [];
            for(var j = 1;j<=el.predefined_value;j++){
              rating.push({
                value: j,
              })
            }
            el.choices = rating;
            delete el.predefined_value;
          }
          //单项，多项，下拉框
          if(el._type == 'RadioButton'||el._type == 'CheckBox'||el._type == 'DropDown'){
            var choices = [];
            var option_ids = el.option_ids;
            var radio = el.radio;
            if(el._type == 'CheckBox')radio = el.checkbox;
            var group = el.group;
            $.each(option_ids,function(i,e) {
              choices.push({
                _id: e,
                _type: "Choice",
                quota: "",
                quota_temp: "",
                selected:group[i],
                sub_choices: [],
                value: radio[i]
              });
            });
            el.choices = choices;
            console.log(choices)
          }

          //两级下拉框CascadeDropDown,修改predefined_value的值的数据
          if(el._type == 'CascadeDropDown'){
            var option_ids = el.option_ids;
            if(!option_ids)option_ids = [];
            var t = [];var n = null;
            var s = $.grep(el.predefined_value.split("\n"), function(e) {
              return e != "" && e != undefined;
            });
            $.each(s,function(index,e){
              var r;
              if (e[0] !== "-" || !n)
                return n = {
                  value: e,
                  sub_choices: []
                },
                  t.push(n);

              r = $.trim(e.replace(/^-/, ""));
              if (r)
                return n.sub_choices.push({
                  value: r
                })});

            var r = $.grep(t, function(e) {
              return e.sub_choices.length === 0
            });
            $.each(t,function(i,e){
              t[i]._id = option_ids[i]
            });
            var choices = $.grep(t, function(e){
              return r.indexOf(e) == -1
            });
            el.choices = choices;
            el.predefined_value = '';
          }
          //计算式的数据的修改
          if(el._type == 'Fields::EquationField'){
            el.notes = el.predefined_value;
            el.predefined_value = '';
          }else{
            delete el.calculator;
          }

          delete el.radio;
          delete el.checkbox;
          delete el.group;
          delete el.option_ids;
          //删除没用的属性
          delete el.max_lengthinput;
          delete el.min_lengthinput;
          new_childForm.push(el);
        });
        ordered_fields[index].children = new_childForm;
      }
    }
  });
}
