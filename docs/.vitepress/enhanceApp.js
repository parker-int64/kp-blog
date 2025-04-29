// .vitepress/enhanceApp.js
import { defineClientConfig } from 'vitepress'
import { Vue3Lottie } from 'vue3-lottie'
import 'vue3-lottie/dist/style.css'

export default defineClientConfig({
  enhanceApp({ app }) {
    app.component('Vue3Lottie', Vue3Lottie)
  }
})
