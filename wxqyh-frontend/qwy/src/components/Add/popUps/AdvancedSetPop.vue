<template>
  <div v-if="setPopData.popShow">
    <pop-base :popData="popData"
      @listenClose="closePop"
      @listenBtnFunc="runPopFunc">
      <div class="qwui-set_content">
        <div>
          <span>{{ setPopData.titleName }}</span>
          <span class="c999">（微信端仅显示前100字）</span>
          <div v-html="setPopData.titleHtml"
            class="titleInput"
            tabindex="1"
            :contenteditable="true"
            :placeholder="'输入标题内容或选择字段'"
            ref="titleInput">
          </div>
          <p class="c999">{{ setPopData.inputDesc || inputDesc }}</p>
        </div>
        <div class="qwui-select_content">
          <div class="selectItem"
            v-for="(item,key) in setPopData.labelData"
            :key="key"
            :style="{ 'flex':item.flex }">
            <p>{{ item.labelTitle }}</p>
            <div class="selectInput">
              <ul>
                <input type="button"
                  v-for="(list,num) in item.labelList"
                  :key="num"
                  :data-attrid="list.labelCode"
                  :value="list.labelName"
                  @click="selectLabel(list)">
              </ul>
            </div>
          </div>
        </div>
        <slot name="bottomContent"></slot>
      </div>
    </pop-base>
  </div>
</template>

<script>
import PopBase from './PopBase.vue'

export default {
  props: {
    setPopData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      inputDesc:
        '例：“创建人岗位_创建人_年月日”可生成“产品经理_企小微_20180101”',
      popData: {
        popShow: true,
        popTitle: '标题高级设置',
        buttonConfig: {
          confirm: {
            text: '确定',
            type: 'primary'
          }
        }
      }
    }
  },
  watch: {
    'setPopData.popShow': function() {
      this.popData.popTitle = this.setPopData.popTitle
    }
  },
  methods: {
    closePop() {
      this.$emit('listenClose')
    },
    runPopFunc(key) {
      if (this.$refs.titleInput.innerText.length > 100) {
        dataBase.top_alert(
          this.setPopData.titleName + '长度不能超过100字',
          false,
          3000
        )
        return
      }
      if (
        this.changeToFormat(this.$refs.titleInput.cloneNode(true)).length > 255
      ) {
        dataBase.top_alert(
          this.setPopData.titleName + '模板字节长度超限',
          false,
          3000
        )
        return
      }
      this.$emit('listenBtnFunc', this.$refs.titleInput.innerHTML)
    },
    selectLabel(list) {
      this.$refs.titleInput.focus()
      this.pasteHtmlAtCaret(
        '<span class="labelStyle" data-attrid="' +
          list.labelCode +
          '" contenteditable="false">' +
          list.labelName +
          '</span>'
      )
    },
    pasteHtmlAtCaret(html) {
      var sel, range
      if (window.getSelection) {
        // IE9 and non-IE
        sel = window.getSelection()
        if (sel.getRangeAt && sel.rangeCount) {
          range = sel.getRangeAt(0)
          range.deleteContents()

          var el = document.createElement('div')
          el.innerHTML = html
          var frag = document.createDocumentFragment(),
            node,
            lastNode
          while ((node = el.firstChild)) {
            lastNode = frag.appendChild(node)
          }
          range.insertNode(frag)

          if (lastNode) {
            range = range.cloneRange()
            range.setStartAfter(lastNode)
            range.collapse(true)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        }
      } else if (document.selection && document.selection.type != 'Control') {
        // IE < 9
        document.selection.createRange().pasteHTML(html)
      }
    },
    // 将html替换成模版格式
    changeToFormat(html) {
      let titleFormat = html.querySelectorAll('span') || []
      titleFormat.forEach(item => {
        item.replaceWith('{' + item.dataset.attrid + '}')
      })
      return html.innerText
    }
  },
  components: {
    PopBase
  }
}
</script>

<style src="./popUps.scss" lang="scss"></style>
<style lang="scss" scoped>
.qwui-set_content {
  .titleInput {
    height: 60px;
    padding: 8px;
    margin: 8px 0;
    border: 1px solid #ccc;
    border-radius: 2px;
    background: #fff;
    outline: none;
    overflow: auto;

    &:empty:before {
      content: attr(placeholder);
      color: #bbb;
    }
  }

  .qwui-select_content {
    display: flex;
    flex-direction: row;

    .selectItem {
      flex: 1;
      margin-right: 20px;

      &:last-child {
        margin-right: 0;
      }

      p {
        padding: 15px 0 8px;
      }

      .selectInput {
        border: 1px solid #ccc;
        background: #fff;
        border-radius: 2px;

        ul {
          height: 210px;
          overflow: hidden;
          overflow-y: auto;
          line-height: 28px;

          input {
            padding-left: 10px;
            border: none;
            background: #fff;
            display: block;
            width: 100%;
            text-align: left;
            line-height: 28px;

            &:hover {
              background: #ececec;
              cursor: pointer;
            }
          }
        }
      }
    }
  }
}

.c999 {
  color: #999;
}
</style>
