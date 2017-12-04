require("./common.css");
//公共配置信息
require("element-ui/lib/theme-chalk/index.css");
/*symbol引用阿里巴巴图标库*/
// require('./font/iconfont');
import VueQuillEditor from "vue-quill-editor";

Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(element);
Vue.use(VueQuillEditor);
// console.log("common.js公共配置文件被引入!");

//全局变量，用于保存数据总线
window.Bus = new Vue();
