import { createApp } from 'vue'
import './style.css'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import loadingDirective from './plugins/loadingState.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Toast);
app.directive('loading', loadingDirective);

app.mount('#app')
