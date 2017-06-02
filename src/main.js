import Vue from 'vue'
import DataTable from './DataTable.vue'
import VueResource from 'vue-resource';
Vue.use(VueResource);

let idCustom = Vue.component('id-custom', {
    template : '<a href="#" @click.stop="viewRow">{{rowData.id}}</a>',
    props : ['rowData'],
    methods : {
        viewRow(){
            alert(JSON.stringify(this.rowData));
        }
    }
});

new Vue({
    el: '#app',
    data: {
        tableHead: [
            {
                columnName: 'ID',
                columnAttr: 'id',
                type : 'custom',
                custom : 'id-custom'
            },
            {
                columnName: 'Name',
                columnAttr: 'name',
            },
            {
                columnName: 'Phone',
                columnAttr: 'phone',
            },
            {
                columnName: 'Company',
                columnAttr: 'company'
            },
            {
                columnName: 'Zip',
                columnAttr: 'zip'
            },
            {
                columnName: 'City',
                columnAttr: 'city'
            },
            {
                columnName: 'Date',
                columnAttr: 'date'
            }
        ],
        tableData: [],
    },
    methods: {
        rowClick(item){
            alert(JSON.stringify(item));
        },
        getCheckedRow(){
            alert(JSON.stringify(this.$refs.child.checked));
        }
    },
    mounted() {
        this.$http.get('./data.json').then(res => {
            this.tableData = res.body;
        })
    },
    components: {
        DataTable,
        'id-custom' : idCustom
    }
})
