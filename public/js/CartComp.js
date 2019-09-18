Vue.component('cart', {
  data() {
    return {
      cartUrl: '/server/db/userCart.json',
      cartItems: [],
      showCart: false,
    }
  },
  methods: {
    addProduct(product) {
      let find = this.cartItems.find(el => el.id_product === product.id_product);
      if (find) {
        this.$parent.putJson(`/api/cart/${find.id_product}`, {quantity: 1})
          .then(data => {
            if (data.result) {
              find.quantity++
            }
          })
      } else {
        let prod = Object.assign({quantity: 1}, product);
        this.$parent.postJson(`/api/cart`, prod)
          .then(data => {
            if (data.result) {
              this.cartItems.push(prod);
            }
          })
      }
    },
    remove(product) {
      if (product.quantity > 1) {
        this.$parent.putJson(`/api/cart/${product.id_product}`, {quantity: -1})
          .then(data => {
            if (data.result) {
              product.quantity--
            }
          })
      } else {
        this.$parent.deleteJson(`/api/cart/${product.id_product}`)
          .then(data => {
            if (data.result) {
              this.cartItems.splice(this.cartItems.indexOf(product), 1)
            }
          })
      }
    },
  },
  mounted() {
    this.$parent.getJson('/api/cart')
      .then(data => {
        for (let el of data.contents) {
          this.cartItems.push(el);
        }
      });
  },
  computed: {
    totalCart() {
      let total = 0;
      for (let item of this.cartItems) {
        total += item.quantity * item.price;
      }
      return total
    },
    totalAmount() {
      let total = 0;
      for (let item of this.cartItems) {
        total += item.quantity;
      }
      return total
    }
  },
  template: `<div>
            <button class="btn-cart" type="button" @click="showCart = !showCart"><img class="cart-pic" src="img/cart.svg" alt="cart"></button>
            <div class="drop drop__cart" v-show="showCart">
                <p class="cart-empty pink" v-if="!cartItems.length">Cart&nbsp;is&nbsp;empty</p>
                <cart-item class="drop__cart_flex" 
                v-for="item of cartItems" 
                :key="item.id_product"
                :cart-item="item" 
                :img="item.img"
                @remove="remove">
                </cart-item>
                <div class="cart_flex-sum">
                     <p class="cart_flex-p fs16">total</p>
                     <p class="cart_flex-p fs16">&#36;{{ totalCart }}</p>
                </div>
                <div class="drop__buttons">
                     <a href="checkout.html" class="dropmenu-button">checkout</a>
                     <a href="cart.html" class="dropmenu-button">go&nbsp;to&nbsp;cart</a>
                </div>
            </div>
            <div class="cart-counter">{{ totalAmount }}</div>
        </div>`
});

Vue.component('cart-item', {
  props: ['cartItem', 'img'],
  template: `<div class="drop__cart_flex">
                 <a href="item.html"><img class="cart__img" :src="img" alt="pic"></a>
                 <div class="drop__cart_flex-text">
                     <a href="product.html" class="cart_flex-p">{{ cartItem.product_name }}</a>
                     <a href="#"><img src="img/rating.png" style="padding: 10px 0;" alt="rating"></a>
                     <p class="cart_flex-pink">{{ cartItem.quantity }}&nbsp;x&nbsp;&#36;{{ cartItem.price }}</p>
                 </div>
                 <button class="del-btn" @click="$emit('remove', cartItem)"><i class="fas fa-times-circle"></i></button>
              </div>`
});
