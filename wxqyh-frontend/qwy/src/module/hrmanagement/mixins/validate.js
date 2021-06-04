import schema from 'async-validator';

export default {
    computed: {
        showValidate() {
            return this.validateState === 'error'
        }
    },
    methods: {
        asyncValidate() {
            this.$nextTick(() => {
                this.validate();
            });
        },
        validate() {
            return new  Promise((resolve, reject) => {
                if(!this.rule) resolve({title: this.title, status: true});
                let validator = new schema(this.rule);
                validator.validate({name: this.msg}, (err, fields) => {
                    let state = !err ? 'success' : 'error';
                    let msg = err ? err[0].message : '';
                    this.validateState = state;
                    this.validateMessage = msg;
                    if(err){
                        resolve({
                            title: this.keyName,
                            status: false
                        });
                    }else {
                        resolve({
                            title: this.keyName,
                            status: true
                        });
                    }
                })
            })
        }
    }
}