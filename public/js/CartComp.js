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
    clearCart() {
      this.$parent.deleteJson(`/api/cart`)
        .then(data => {
          this.cartItems = []
        })
    }
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

Vue.component('cart-page', {
  template: `
        <div>
        <cart-page-item
        v-for="item of $root.$refs.cart.cartItems"
        :key="item.id_product"
        :img="item.img"
        :quantity="item.quantity"
        :id="item.id_product"
        :cart-page-item="item"
        ></cart-page-item>
        <nav class="cart__flex_buttons">
            <button @click="$root.$refs.cart.clearCart()"><a href="#" class="button-cart">clear shopping cart</a></button>
            <button><a href="product.html" class="button-cart">continue shopping</a></button>
        </nav>   
        <div class="shipping container">
            <section class="shipping__address">
                <h3 class="shipping__h3">shipping address</h3>
                <form action="#">
                    <label for="shipping__country"></label>
                    <select name="shipping__country" id="shipping__country">
                        <option value="shipping__country" selected>Bangladesh</option>
                        <option value="shipping__country">Russia</option>
                        <option value="shipping__country">Belarus</option>
                        <option value="shipping__country">Germany</option>
                        <option value="shipping__country">France</option>
                        <option value="shipping__country">Italy</option>
                    </select> <br>
                    <label for="shipping__state"></label>
                    <input id="shipping__state" type="text" placeholder="State" required><br>
                    <label for="shipping__zip"></label>
                    <input id="shipping__zip" type="number" placeholder="Postcode / Zip"
                           required><br>
                </form>
                <a href="#" class="button-shipping">get a&nbsp;quote</a>
            </section>
            <section class="shipping__coupon">
                <h3 class="shipping__h3">coupon discount</h3>
                <p class="shipping__p">Enter your coupon code if&nbsp;you have one</p>
                <form action="#">
                    <label for="shipping__state2"></label>
                    <input id="shipping__state2" type="text" placeholder="State" required><br>
                </form>
                <a href="#" class="button-shipping">apply coupon</a>
            </section>
            <div class="grandtotal">
                <div class="grandtotal__checkout">
                    <div class="grandtotal__sum">
                        <p>sub total</p>
                        <p class="padd">$ {{$root.$refs.cart.totalCart}}</p>
                    </div>
                    <div class="grandtotal__sumfinal">
                        <p>grand total</p>
                        <p class="pink padd">$ {{$root.$refs.cart.totalCart}}</p>
                    </div>
                </div>
                <a href="checkout.html" class="button-grandtotal">proceed to&nbsp;checkout</a>
            </div>
        </div>
        </div>
  `
});

Vue.component('cart-page-item', {
  props: ['cartPageItem', 'img'],
  template: `
            <div class="cart__flex">
                <div class="cart__flex_left">
                    <a href="item.html"><img class="cart-page-img" :src="img" alt="pic"></a>
                    <div class="cart__flex_text">
                        <a href="item.html" class="cart__flex_text-h3">{{cartPageItem.product_name}}</a>
                        <div class="cart__flex_text-p">
                            <p>Color:<span class="cart_text"> Red</span></p>
                            <p>Size:<span class="cart_text"> XL</span></p>
                        </div>
                    </div>
                </div>
                <div class="cart__flex_right wide">
                    <p>$ {{cartPageItem.price}}</p>
                    <form action="#">
                        <label for="cart_ammount"></label>
                        <input id="cart_ammount" type="number" v-model.number="cartPageItem.quantity">
                    </form>
                    <p>FREE</p>
                    <p>$ {{ cartPageItem.price * cartPageItem.quantity }}</p>
                    <button @click="$root.$refs.cart.remove(cartPageItem)"><i class="fas fa-times-circle"></i></button>
                </div>
            </div>
  `
});
