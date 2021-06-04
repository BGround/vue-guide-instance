const state = {
  fieldHelp: {
    typeId: '',
    dept: '',
    loanMoney: '',
    loanDate: '',
    repayDate: '',
    remark: '',
    receiptFullName: '',
    bankAccount: '',
    depositBank: '',
  },
};
const getters = {
  fieldHelp: state => state.fieldHelp,
};
const mutations = {
  setFieldHelp(state, fieldHelp) {
    if(fieldHelp){
      state.fieldHelp = fieldHelp;
    }else{
      for(var item in state.fieldHelp){
        state.fieldHelp[item] = '';
      }
    }
  },
};
export default {
  state,
  getters,
  mutations,
};
