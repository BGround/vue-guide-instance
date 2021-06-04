<template>
    <div>
        <date-picker
            v-model="item.data"
            format="YYYY-MM-DD HH:mm"
            :showButtons ="true"
            :placeholder="item.placeholder"
            @confirm="dateConfirm"
        ></date-picker>
    </div>
</template>
<script>
import DatePicker from '@/components/base/VueDatepickerLocalCalendar';

export default {
    name: 'clientDate',
    components: {
        DatePicker
    },
    props: {
        item: {
            type: Object,
            required: true
        }
    },
    data () {
        return {}
    },
    methods: {
        dateConfirm(val) {
            let date = new Date(val).Format('yyyy-MM-dd hh:mm');
 
            this.$set(this.item, 'data', date);
            this.$emit('confirm', date);
        }
    }
}
</script>
<style lang='scss' scoped>

</style>