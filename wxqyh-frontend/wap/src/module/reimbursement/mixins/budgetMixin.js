import { formatMoney } from '../js/common';

export const budgetMixin = {
  filters: {
    formatMoney: formatMoney,
  },
  methods: {
    checkIsExcess(money) {
      return Number(money) < 0;
    },
  },
};
