import Vue from 'vue'
import App from './App.vue'
import './plugins/dayjs'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faCheck, faTimes, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faEdit)
library.add(faTrashAlt)
library.add(faCheck)
library.add(faTimes)
library.add(faThumbtack)

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.config.productionTip = false
Vue.prototype.$config = JSON.parse(window.requires.fs.readFileSync('config.json', { encoding: 'utf8' }));

new Vue({
  render: h => h(App),
}).$mount('#app')
