import { getReimInfoNum } from '../api/reimbursement';
import { mapMutations } from 'vuex';

export const pageMixin = {
  created () {
    this.getReimInfo();
  },
  methods: {
    // 获取草稿数量和待办数量
    getReimInfo() {
      getReimInfoNum().then((res) => {
        const { waitingNum, draftNum } = res.data;

        this.setWaitingNum(waitingNum);
        this.setDraftNum(draftNum);
      });
    },
    ...mapMutations({
      setDraftNum: 'SET_DRAFT_NUM',
      setWaitingNum: 'SET_WAITING_NUM',
    }),
  }
}