Vue.component('filter-el', {
  data() {
    return {
      userSearch: ''
    }
  },
  template: '<form action="#" class="search-form"' +
    ' @submit.prevent="$root.$refs.products.filter(userSearch)">\n' +
    '                <input type="text" class="search-field" v-model="userSearch">\n' +
    '                <button class="btn-search" type="submit">\n' +
    '                    <i class="fas fa-search"></i>\n' +
    '                </button>\n' +
    '            </form>'
});