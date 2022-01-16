import Vue from 'vue'
Vue.prototype.$ELEMENT = { size: 'mini' }
import { Button, Row, Col } from 'element-ui'
Vue.use(Button)
Vue.use(Row)
Vue.use(Col)
