<template>
  <div class="unselectable">
    <div class="dt-toolbar">
      <div class="filter_entry">
        Search:
        <input v-model="search" @input="searchFn"/>
      </div>
      <div class="entry_length">
        Show
        <select v-model="pageEntry">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
          <option value="100">100</option>
        </select>
         Entries
      </div>
    </div>
    <table>
      <thead>
        <tr>
          <th v-for="(item, index) in tableHead"
              class="sorting left"
              :class="{
                 desc: sort.sortBy === item.columnAttr && sort.desc,
                 asc: sort.sortBy === item.columnAttr && !sort.desc
              }"
              @click="sorting(item)">
            {{item.columnName}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in getList" :class="index % 2 == 0 ? 'odd' : 'even'">
          <template v-for="t in tableHead">
            <td>{{item[t.columnAttr]}}</td>
          </template>
        </tr>
      </tbody>
    </table>
    <div class="dt-toolbar-footer">
      <div class="dataTables_entries">
        Showing {{(currentPage - 1) * pageEntry + 1}} to {{currentPage * pageEntry > allEntries ? allEntries : currentPage * pageEntry}} of {{allEntries}} entries
      </div>
      <div class="dataTables_paginate">
        <ul class="pagination">
          <li class="prev">
            <a href="javascript:;"
               @click="togglePage('prev')"
               :class="{disabled : currentPage <= 1}">Previous</a>
          </li>
          <li>
            <a href="javascript:;"
               @click="togglePage(1)"
               :class="{active : currentPage == 1}">1</a>
          </li>
          <li v-if="currentPage >= 5 &&lastPage > 5">
            <a href="javascript:;" class="disabled">...</a>
          </li>
          <li v-for="(page,index) in centerPartPage" >
            <a href="javascript:;"
               @click="togglePage(page + 1)"
               :class="{active : currentPage == page + 1}">{{page + 1}}</a>
          </li>
          <li v-if="lastPage > 5 && lastPage - currentPage > 5">
            <a href="javascript:;" class="disabled">...</a>
          </li>
          <li>
            <a href="javascript:;"
               :class="{active: currentPage == page + 1}"
               @click="togglePage(page + 1)"
               v-for="page in lastPartPage">{{page + 1}}</a>
          </li>
          <li class="next">
            <a href="javascript:;"
               @click="togglePage('next')"
               :class="{disabled : currentPage >= lastPage}">Next</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'app',
  props:['tableHead', 'tableData'],
  data () {
    return {
        pageEntry : 10,
        currentPage : 1,
        rows : '',
        search : '',
        sort: {
            sortBy: '',
            desc: false
        }
    }
  },
  computed : {
    getList(){
        return this.filterRows(this.tableData);
    },
    allEntries() {
        return this.rows.length;
    },
    lastPage(){
        return Math.ceil(this.rows.length / this.pageEntry);
    },
    centerPartPage() {
        if(this.lastPage > 5 && this.currentPage >= 5) {
            if(this.lastPage - this.currentPage > 5) {
                return this.currentPage === this.lastPage ? [this.currentPage - 3, this.currentPage - 2, this.currentPage - 1] : [this.currentPage - 2, this.currentPage - 1, this.currentPage];
            }else {
                const r = [];
                for(let i = this.lastPage - 6; i < this.lastPage; i++) {
                    r.push(i);
                }
                return r;
            }
        }else if(this.lastPage > 5) {
            const r = [];
            for(let i = 1; i < 5; i++) {
                r.push(i);
            }
            return r;
        }else {
            const r = [];
            for(let i = 1; i < this.lastPage; i++) {
                r.push(i);
            }
            return r;
        }
    },
    lastPartPage() {
        if(this.lastPage > 5 && this.lastPage - this.currentPage > 5) {
            return [this.lastPage - 1];
        }else {
            return [];
        }
    },
  },
  methods:{
    filterRows(rows){
      var arr = rows.sort((a, b) => {
          let r = this.sort.desc ? a[this.sort.sortBy] < b[this.sort.sortBy] : a[this.sort.sortBy] > b[this.sort.sortBy];
          if(!isNaN(parseInt(a[this.sort.sortBy]))){
              r = this.sort.desc ? parseInt(a[this.sort.sortBy]) < parseInt(b[this.sort.sortBy]) : parseInt(a[this.sort.sortBy]) > parseInt(b[this.sort.sortBy]);
          }
          return r ? 1 : -1;
      });
      if(this.search !== '') {
          arr = arr.filter(item => {
              var r = false;
              for (let key in item) {
                  if (item[key]
                          .toString()
                          .toLowerCase()
                          .indexOf(this.search.toLowerCase()) !== -1) {
                      r = true;

                  }
              }
              return r;
          });
      }
      this.rows = arr;
      return arr.slice((this.currentPage - 1) * this.pageEntry, (this.currentPage) * this.pageEntry);;
    },
    sorting(column){
        this.currentPage = 1;
        if(column.columnAttr === this.sort.sortBy) {
            this.sort.desc = !this.sort.desc;
        }else {
            this.sort.sortBy = column.columnAttr;
            this.sort.desc = false;
        }
    },
    togglePage(page){
        switch(page) {
            case  'prev' :
                if(this.currentPage <= 1) return;
                this.currentPage --;
                break;
            case 'next' :
                if(this.currentPage >= this.lastPage) return;
                this.currentPage ++;
                break;
            default:
                this.currentPage = page;
        }
    },
    searchFn(){
        this.currentPage = 1;
    }
  },
  mounted(){
      this.sort.sortBy = this.tableHead[0].columnAttr;
  }

}
</script>

<style scoped="scoped">
table{
  width:100%;
  border-collapse: collapse;
}
table>thead>tr{
  background-color: #eee;
  background-image: -webkit-gradient(linear,0 0,0 100%,from(#f2f2f2),to(#fafafa));
  background-image: -webkit-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
  background-image: -moz-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
  background-image: -ms-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
  background-image: -o-linear-gradient(top,#f2f2f2 0,#fafafa 100%);
  background-image: -linear-gradient(top,#f2f2f2 0,#fafafa 100%);
  font-size: 12px;
}
table>thead>tr>th.left{
  text-align:left
}
table>thead>tr>th.right{
  text-align:right
}
table>thead>tr>th.center{
  text-align:center
}
.sorting{
 background : url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATAgMAAAAPPt5fAAAACVBMVEUAAADIyMjl5eVIBBP/AAAAAXRSTlMAQObYZgAAAClJREFUCNdjwAYEwGQKiGDsBJFsTA5AUoJhAqZaiDhEDVg9RC/MHEwAANsMA91AQfd/AAAAAElFTkSuQmCC) no-repeat center right;
  cursor: pointer;
}
.asc{
  background : url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATAQMAAABInqSPAAAABlBMVEUAAABVVVUT3Vn+AAAAAXRSTlMAQObYZgAAAB1JREFUCNdjwAkcgPgBAwPjBwYG5h8MDOx/GAgBAKRJBBCQbHkwAAAAAElFTkSuQmCC) no-repeat center right;
}
.desc{
  background : url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATAQMAAABInqSPAAAABlBMVEUAAABVVVUT3Vn+AAAAAXRSTlMAQObYZgAAABxJREFUCNdjIATY/zAwMP9gYGD8AOQ8AGIHnEoBkNkEEEbbutQAAAAASUVORK5CYII=) no-repeat center right;
}
table>tbody>tr>td{
  font-size:12px
}
table>thead>tr>th,table>tbody>tr>td  {
  padding: 8px 10px;
  border: 1px solid #ddd;
}
table>tbody>tr.odd{
  background-color: #f9f9f9;
}
.dt-toolbar-footer{
  background: #fafafa;
  font-size: 11px;
  overflow: hidden;
  padding: 5px 10px;
  border: 1px solid #ccc;
  -webkit-box-shadow: inset 0 1px #fff;
  -moz-box-shadow: inset 0 1px #fff;
  -ms-box-shadow: inset 0 1px #fff;
  box-shadow: inset 0 1px #fff;
  height:40px;
  line-height:40px;
}
.dt-toolbar{
  background: #fafafa;
  font-size: 11px;
  overflow: hidden;
  padding: 5px 10px;
  border: 1px solid #ccc;
  border-bottom:none;
  height:40px;
  line-height:40px;
}
.entry_length{
  float:right;
}
.entry_length select{
  height: 30px;
  line-height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  display: inline-block;
  width: auto;
  vertical-align: middle;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
}
.filter_entry{
  float:left;
}
.filter_entry input{
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  color: #555;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  box-sizing: border-box;
}
div.dataTables_entries{
  float:left;
}
div.dataTables_paginate{
  float: right;
  margin: 0;
}
.pagination{
  margin:0;
  padding:0
}
.pagination li{
  float:left;
  list-style:none;
}
.pagination li a{
  text-decoration:none;
  padding:7px 12px;
  border: 1px solid #ddd;
  background-color: #fff;
  box-shadow: inset 0 -2px 0 rgba(0,0,0,.05);
  -moz-box-shadow: inset 0 -2px 0 rgba(0,0,0,.05);
  -webkit-box-shadow: inset 0 -2px 0 rgba(0,0,0,.05);
  color : #3276b1;
  margin-left: -1px;
}
.pagination li a.active{
  background:#3276b1;
  color:#fff;
}
.pagination li a.disabled{
  color: #999;
  background-color: #fff;
  border-color: #ddd;
  cursor: not-allowed;
}

input:focus, select:focus{
  outline: 0;
  -webkit-box-shadow: none!important;
  -moz-box-shadow: none!important;
  box-shadow: none!important;
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
  box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
}
.unselectable {
  -moz-user-select: -moz-none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
