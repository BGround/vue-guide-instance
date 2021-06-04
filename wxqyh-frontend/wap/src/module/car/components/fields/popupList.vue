<template>
	<transition name="slide">
			<div class="popup-list" @click.stop>
				<div class="popup-list-item choice-field-item"
						 v-for="(item,index) in list" :key="item.id"
						 @click="changeIndex(item,index)">
					<i :class="{active:currentIndex === index}"></i>
					<span>{{item.name}}</span>
				</div>
			</div>
	</transition>
</template>
<script>
	export default {
	  name: 'popupList',
		props: {
	    field: {
	      type: Object,
        required: true
      },
      currentIndex: {
	      type: Number
      }
    },
		data() {
			return {
				list: []
			}
		},
		created() {
			document.body.style.overflow = "hidden";
			this.list = this.field.list
		},
		methods: {
			close() {
				this.$emit('listenShow',false)
			},
			changeIndex(item, index) {
				this.$emit('update:currentIndex', index)
				this.$emit('getItem', item)
        this.close()
			}
		},
		destroyed() {
			document.body.style.overflow = "auto";
		}
	}
</script>
<style scoped>
	.popup-list {
		position: absolute;
		width: 80%;
		top: 0;
		right: 0;
		bottom: 0;
		padding-left: 10px;
		background: #fff;
    overflow-y: auto;
	}
	.popup-list-item {
		padding: 10px;
		font-size: 15px;
		line-height: 23px;
		border-bottom: 1px solid #f7f7f7;
    word-break: break-all;
		cursor: pointer;
	}
  .choice-field-item i {
    display: inline-block;
    width: 16px;
    height: 18px;
    background: 0 0 url(~assets/images/car/icon_form_single-unselected.png) no-repeat;
    background-size: 100%;
    margin-right: 10px;
    vertical-align: text-bottom;
  }
  .choice-field-item i.active {
    background: url(~assets/images/car/icon_form_single-checked.png) no-repeat;
    background-size: 100%;
  }
  /*滚动条*/
  ::-webkit-scrollbar-track {
    border:none;
  }
  ::-webkit-scrollbar-thumb {
    border: none;
    border-radius: 3px;
    background: #eee;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #ccc;
  }

</style>
