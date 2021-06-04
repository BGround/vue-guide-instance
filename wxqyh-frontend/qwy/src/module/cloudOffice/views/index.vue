<template>
  <div class="wrap">
    <chooseModel></chooseModel>
    <topAlert></topAlert>
  </div>
</template>

<script>
import chooseModel from '../components/chooseModel';
import topAlert from '@/components/base/topAlert';
export default {
  name: 'index',
  components: {
    chooseModel,
    topAlert
  },
}
</script>
