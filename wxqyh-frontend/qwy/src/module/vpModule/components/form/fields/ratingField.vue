<template>
    <div class="field-content" >
		<div class="rating-field"
				 :class="{readOnly:field.readonly||field.disabled}"
				 :disabled="field.readonly||field.disabled"
		>
			<span class="rating-field-item"
				  :class="{heart:field.rating_type === 'heart',active:isRate>=index}"
				  v-for="index in length"
          @click="setRate(index)"
			>
			</span>
		</div>
    </div>
</template>

<script>
  import {field_validation} from './validation.js'
  export default {
    props: {
      field:{type:Object}
    },
    data () {
      return {
        length:5,
        value:0,
        rate: 0,
      }
    },
    computed: {
      isRate () {
        this.length = this.field.choices.length;
        this.value = this.field.value || 0;
        if (this.value >= this.length) {
          this.value = this.length
        } else if (this.value < 0) {
          this.value = 0
        }
        return this.value
      }
    },
    methods: {
      setRate (index) {
		if(this.field.disabled) return;
        var oldValue = this.value
        this.rate = index
        var key = this.field._id;
        var value = index;
        if ( index === 1 && oldValue === 1){
          value = 0;
        }
        this.$emit('change',{key,value})
        field_validation(this.field);
      },
    },
    created () {

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.rating-field {
    height: 40px;
    line-height: 45px;
    border-radius: 4px;
	}
  .rating-field.readOnly {
    padding-left: 10px;
  }

	.rating-field-item {
		display: inline-block;
		width: 22px;
		height: 22px;
    background: url(../../../assets/images/icon_form_score-stars-unselected.png) no-repeat;
    background-size: 100%;
		margin-right: 7px;
		vertical-align: text-bottom;
	}
  @media screen and (max-width: 359px) {
    .rating-field-item {
      width: 17px;
      height: 17px;
    }
  }
  @media screen and (min-width: 360px) and (max-width:374px){
    .rating-field-item {
      width: 21px;
      height: 21px;
    }
  }
	.rating-field-item.active {
		background: url(../../../assets/images/icon_form_score-stars-checked.png) no-repeat;
    background-size: 100%;
	}
	.rating-field-item.heart {
		background: url(../../../assets/images/icon_form_score-love-unselected.png) no-repeat;
    background-size: 100%;
	}
	.rating-field-item.heart.active {
		background: url(../../../assets/images/icon_form_score-love-checked.png) no-repeat;
    background-size: 100%;
	}

</style>
