const dataBase = {
  /*必配-start*/
  mask: false,//遮罩层控制
  loading: false,//loading控制
  config: '',//公共配置信息
  isOverDue: false,
  // 模板数据
  printTemplate: {
    cells: {},
    cols: [100],
    merge: [],
    rows: [25],
    page: {
      size: 'A4',
      layout: 'portrait'
    },
    pageData: {
      size: [
        {
          optionName: 'A4',
          val: 'A4'
        },
        {
          optionName: 'A3',
          val: 'A3'
        }
      ],
      sizeVal:{
        name: 'A4',
        idx: 0
      },
      position: [
        {
          optionName: '纵向',
          val: 'portrait'
        },
        {
          optionName: '横向',
          val: 'landscape'
        }
      ],
      positionVal:{
        name: '纵向',
        idx: 0
      }
    },
    range: {
      s: '0:0',
      e: '0:0'
    },
    iconData: {
      undo:[
        {
          name:"icon-undo",
          text:"撤销",
          action:"undo",
          type:"undoRedo"
        },
        {
          name:"icon-redo",
          text:"重做",
          action:"redo",
          type:"undoRedo"
        }
      ],
      fontStyle: [
        {
          name: "font-family",
          text: "字体",
          type: "fontStyle",
          fontFamily: true,
          className: "font-family"
        },
        {
          name: "font-size",
          text: "字号",
          type: "fontStyle",
          hasIcon: true,
          className: "font-size"
        },
        {
          name: "icon-bold",
          text: "加粗",
          type: "fontStyle",
          selected: false,
          className: "bold"
        },
        {
          name: "icon-italic",
          text: "倾斜",
          selected: false,
          type: "fontStyle",
          className: "italic"
        },
        {
          name: "icon-underline",
          text: "下划线",
          selected: false,
          type: "fontStyle",
          className: "underline"
        },
        {
          name: "icon-text-color",
          text: "字体颜色",
          type: "fontStyle",
          className: "fontColor",
          hasIcon: true
        }
      ],
      textAlignHorizontal: [
        {
          name: "icon-left",
          text: "左对齐",
          selected: false,
          type: "align",
          className: "left"
        },
        {
          name: "icon-center",
          text: "居中对齐",
          selected: false,
          type: "align",
          className: "center"
        },
        {
          name: "icon-right",
          text: "右对齐",
          selected: false,
          type: "align",
          className: "right"
        }
      ],
      textAlignVertical: [
        {
          name: "icon-top",
          text: "顶端对齐",
          type: "align",
          selected: false,
          className: "top"
        },
        {
          name: "icon-middle",
          text: "垂直居中",
          selected: false,
          type: "align",
          className: "middle"
        },
        {
          name: "icon-bottom",
          text: "底端对齐",
          selected: false,
          type: "align",
          className: "bottom"
        }
      ],
      textBorder: [
        {
          name: "icon-border-bottom",
          text: "下框线",
          type: "border",
          className: "bottom"
        },
        {
          name: "icon-border-top",
          text: "上框线",
          type: "border",
          className: "top"
        },
        {
          name: "icon-border-left",
          text: "左框线",
          type: "border",
          className: "left"
        },
        {
          name: "icon-border-right",
          text: "右框线",
          type: "border",
          className: "right"
        },
        {
          name: "icon-border",
          text: "外框线",
          type: "border",
          className: "outer"
        },
        {
          name: "icon-border-1",
          text: "内外框线",
          type: "border",
          className: "all"
        },
        {
          name: "icon-border-none",
          text: "无框线",
          type: "border",
          className: "none"
        },
        {
          name: "icon-border-width",
          text: "边框粗细",
          type: "border",
          hasIcon: true
        }
      ],
      merge:[
        {
          name: "icon-merge",
          text: "合并",
          type: "merge",
        },
      ],
      insertImg:[
        {
          name: "icon-img",
          text: "插入图片",
          type: "insertImg"
        },
        {
          name: "icon-Bg",
          text: "插入背景图",
          type: "insertBg",
          hasIcon: true
        }
      ],
      page: [
        {
          name: "icon-page",
          text: "纸张设置",
          type: "page",
          hasIcon: true,
        }
      ],
      set: [
        {
          name: "icon-set",
          text: "水印设置",
          type: "set",
          hasIcon: true,
        }
      ]
    },
    textColorList: [
      {
        name: "font-color-B02418",
        value: "#B02418"
      },
      {
        name: "font-color-EA3324",
        value: "#EA3324"
      },
      {
        name: "font-color-F5C243",
        value: "#F5C243"
      },
      {
        name: "font-color-FFFF54",
        value: "#FFFF54"
      },
      {
        name: "font-color-9ECE63",
        value: "#9ECE63"
      },
      {
        name: "font-color-4EAC5A",
        value: "#4EAC5A"
      },
      {
        name: "font-color-4EADEA",
        value: "#4EADEA"
      },
      {
        name: "font-color-306EBA",
        value: "#306EBA"
      },
      {
        name: "font-color-081F5C",
        value: "#081F5C"
      },
      {
        name: "font-color-683499",
        value: "#683499"
      },
      {
        name: "font-color-FFFFFF",
        value: "#FFFFFF"
      },
      {
        name: "font-color-000000",
        value: "#000000"
      },
      {
        name: "font-color-E7E6E6",
        value: "#E7E6E6"
      },
      {
        name: "font-color-475368",
        value: "#475368"
      },
      {
        name: "font-color-4E71BE",
        value: "#4E71BE"
      },
      {
        name: "font-color-DE8343",
        value: "#DE8343"
      },
      {
        name: "font-color-A5A5A5",
        value: "#A5A5A5"
      },
      {
        name: "font-color-F5C243",
        value: "#F5C243"
      },
      {
        name: "font-color-6A99D0",
        value: "#6A99D0"
      },
      {
        name: "font-color-7DAB54",
        value: "#7DAB54"
      },
      {
        name: "font-color-F4F5F8",
        value: "#F4F5F8"
      },
      {
        name: "font-color-848484",
        value: "#848484"
      },
      {
        name: "font-color-D0CECE",
        value: "#D0CECE"
      },
      {
        name: "font-color-D7DCE3",
        value: "#D7DCE3"
      },
      {
        name: "font-color-DBE2F1",
        value: "#DBE2F1"
      },
      {
        name: "font-color-F6E6D7",
        value: "#F6E6D7"
      },
      {
        name: "font-color-EDEDED",
        value: "#EDEDED"
      },
      {
        name: "font-color-FDF2D0",
        value: "#FDF2D0"
      },
      {
        name: "font-color-E0EBF5",
        value: "#E0EBF5"
      },
      {
        name: "font-color-E4EFDB",
        value: "#E4EFDB"
      },
      {
        name: "font-color-D8D8D8",
        value: "#D8D8D8"
      },
      {
        name: "font-color-595959",
        value: "#595959"
      },
      {
        name: "font-color-AEABAB",
        value: "#AEABAB"
      },
      {
        name: "font-color-AFB8C8",
        value: "#AFB8C8"
      },
      {
        name: "font-color-B7C5E4",
        value: "#B7C5E4"
      },
      {
        name: "font-color-F0CDB0",
        value: "#F0CDB0"
      },
      {
        name: "font-color-DBDBDB",
        value: "#DBDBDB"
      },
      {
        name: "font-color-FAE6A2",
        value: "#FAE6A2"
      },
      {
        name: "font-color-C2D6EC",
        value: "#C2D6EC"
      },
      {
        name: "font-color-CADFB7",
        value: "#CADFB7"
      },
      {
        name: "font-color-BFBFBF",
        value: "#BFBFBF"
      },
      {
        name: "font-color-3F3F3F",
        value: "#3F3F3F"
      },
      {
        name: "font-color-747070",
        value: "#747070"
      },
      {
        name: "font-color-8795AE",
        value: "#8795AE"
      },
      {
        name: "font-color-8795AE",
        value: "#8795AE"
      },
      {
        name: "font-color-EAB48A",
        value: "#EAB48A"
      },
      {
        name: "font-color-C9C9C9",
        value: "#C9C9C9"
      },
      {
        name: "font-color-F9DA76",
        value: "#F9DA76"
      },
      {
        name: "font-color-A4C1E2",
        value: "#A4C1E2"
      },
      {
        name: "font-color-B0CF94",
        value: "#B0CF94"
      },
      {
        name: "font-color-A5A5A5",
        value: "#A5A5A5"
      },
      {
        name: "font-color-262626",
        value: "#262626"
      },
      {
        name: "font-color-3A3838",
        value: "#3A3838"
      },
      {
        name: "font-color-353F4D",
        value: "#353F4D"
      },
      {
        name: "font-color-385391",
        value: "#385391"
      },
      {
        name: "font-color-B86129",
        value: "#B86129"
      },
      {
        name: "font-color-7B7B7B",
        value: "#7B7B7B"
      },
      {
        name: "font-color-B89230",
        value: "#B89230"
      },
      {
        name: "font-color-4273B0",
        value: "#4273B0"
      },
      {
        name: "font-color-60",
        value: "#5D803F"
      },
      {
        name: "font-color-7E7E7E",
        value: "#7E7E7E"
      },
      {
        name: "font-color-0C0C0C",
        value: "#0C0C0C"
      },
      {
        name: "font-color-171616",
        value: "#171616"
      },
      {
        name: "font-color-242A34",
        value: "#242A34"
      },
      {
        name: "font-color-243761",
        value: "#243761"
      },
      {
        name: "font-color-7A411A",
        value: "#7A411A"
      },
      {
        name: "font-color-525252",
        value: "#525252"
      },
      {
        name: "font-color-79611D",
        value: "#79611D"
      },
      {
        name: "font-color-2C4D75",
        value: "#2C4D75"
      },
      {
        name: "font-color-3E552A",
        value: "#3E552A"
      },

    ],
    styles: {
      default: {
        'border-color': "#000",
        'border-style': "none",
        'border-width': 1,
        'color': "#000",
        'font-color': "#000000",
        'font-family': "MicrosoftYahei",
        'font-size': 9,
        'font-style': "normal",
        'font-weight': "normal",
        'image-padding': 5,
        'line-height': 14.4,
        'opacity': 1,
        'padding': [4, 4, 4, 4],
        'text-align': "left",
        'text-decoration': [],
        'vertical-align': "middle"
      }
    }
  }
}
export default dataBase

