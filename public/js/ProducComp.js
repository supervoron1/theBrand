Vue.component('products', {
  data() {
    return {
      catalogUrl: '/server/db/products.json',
      products: [],
      filtered: [],
    }
  },
  props: ["amount"],
  methods: {
    filter(value) {
      let regexp = new RegExp(value, 'i');
      this.filtered = this.products.filter(el => regexp.test(el.product_name));
    }
  },
  mounted() {
    this.$parent.getJson(`/api/products`)
      .then(data => {
        for (let el of data) {
          //this.products.push(el);
          this.filtered.push(el);
        }
      })
  },
  template: `
        <div class="product-box container">
            <product v-for="item of filtered.slice(0, amount)" :key="item.id_product" :product="item"></product>
        </div>`
});
Vue.component('product', {
  props: ['product'],
  template: `<div class="product">
                <a href="product.html"><img class="product__img" :src="product.img" :alt="product.product_pic"></a>
                    <div class="product__text">
                        <a href="product.html" class="product__name">{{product.product_name}}</a><br>
                        <p class="product__price">&#36;<span>{{product.price}}</span></p>
                        <button class="product__add" @click="$root.$refs.cart.addProduct(product)">
                            <img src="img/cart_mini.svg" alt="cart" class="product__add_img">Add to&nbsp;Cart
                        </button>
                    </div>
            </div>`
});
