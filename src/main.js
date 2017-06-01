import Vue from 'vue'
import DataTable from './DataTable.vue'
import VueResource from 'vue-resource';
Vue.use(VueResource);

new Vue({
  el: '#app',
  data: {
    tableHead:[
        {
            columnName : 'ID',
            columnAttr : 'id'
        },
        {
            columnName : 'Name',
            columnAttr : 'name',
        },
        {
            columnName : 'Phone',
            columnAttr : 'phone',
        },
        {
            columnName : 'Company',
            columnAttr : 'company'
        },
        {
            columnName : 'Zip',
            columnAttr : 'zip'
        },
        {
            columnName : 'City',
            columnAttr : 'city'
        },
        {
            columnName : 'Date',
            columnAttr : 'date'
        }
    ],
    tableData : []
  },
  mounted() {
    this.$http.get('./data.json').then(res => {
      this.tableData = res.body;
    })
  },
  components : {DataTable}
})
