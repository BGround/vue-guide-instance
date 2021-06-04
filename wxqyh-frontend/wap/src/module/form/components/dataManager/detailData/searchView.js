export const mixinSearchView = {
    data() {
        return {
            customView: []
        }
    },
    computed: {
        defaultView() {
            let defaultView = [ { 'id': 'All', 'name': '全部', 'param': { } } ];
            if(this.isTask != 3) {
                defaultView.push(...[
                    { 'id': 'Submit', 'name': '我提交的', 'param': { 'meRange': '3' } },
                    { 'id': 'Charge', 'name': '我负责的', 'param': { 'meRange': '1' } },
                    { 'id': 'Relevant', 'name': '我相关的', 'param': { 'meRange': '2' } }
                ])
            }
            return defaultView
        }
    },
    created() {
        this.currView = this.defaultView[0];
    }
}