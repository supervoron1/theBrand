Vue.component('error', {
  data() {
    return {
      text: ''
    }
  },
  methods: {
    setError(text) {
      this.text = text;
    }
  },
  template: `<div class="error-block" v-if="text">
            <p class="error-msg">
            {{text}}
            <button class="close-btn" @click="setError('')">&times;</button></p>
            </div>`
});