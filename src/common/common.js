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
window.Bus = new Vue({
	// data: {
	// 	resourceList: []
	// },
	// //向CRM添加权限控制
	// created() {
	// 	if(token){
	// 		this.fetchSysuserResource(token);
	// 	}
	// },
	// methods: {
	// 	fetchSysuserResource() {
	// 		this.$http({
	// 			url: API("/sysuser/resource"),
	// 			method: "get",
	// 			headers:{
	// 				token:token
	// 			}
	// 		}).then(
	// 			(res) => {
	// 				let response = res.body;
	// 				if (response && response.code === 0 && response.msg === "成功") {
	// 					this.resourceList = response.data;
	// 				} else {
	// 					this.$message({
	// 						type: "error",
	// 						message: response.msg
	// 					});
	// 				}
	// 			},
	// 			(res) => {
	// 				if (res) {
	// 					this.$message({
	// 						type: "error",
	// 						message: "请求失败"
	// 					});
	// 				}
	// 			}
	// 		);
	// 	}
	// }
});

//全局添加权限验证
Vue.directive("permission",{
	bind(el,binding){
		let resourceList = window.Bus.resourceList;
		// console.log(window.Bus.resourceList);
		// console.log("bind",el,binding);
	},
	inserted(el,binding){
		// console.log(window.Bus.resourceList);
		// console.log("inserted",el,binding);
	},
	update(el,binding){
		let resourceList = window.Bus.resourceList;
		let value = {};
		if(binding.value){
			value = binding.value;
		}
		_.forEach(window.Bus.resourceList,(resource)=>{
			// if(resource.buttonId===value.buttonId||resource.menuId===value.menuId){
			// 	console.log("拥有按钮权限",value);
			// 	return false;
			// }
			console.log(resource);
		});
		// console.log(window.Bus.resourceList);
		// console.log("componentUpdated",el,binding);
	},
	componentUpdated(el,binding){
		// console.log(window.Bus.resourceList);
		// console.log("componentUpdated",el,binding);
	},
	// unbind(el,binding){
	// 	console.log(window.Bus.resourceList);
	// 	console.log("unbind",el,binding);
	// }
});

if (!window["sessionStorage"]) {
	window.Bus.$message({
		type: "error",
		message: "当前浏览器不能使用本地存储,请更换浏览器"
	});
}

//获取token
let token = window.sessionStorage.getItem("token");

if(token){
	Vue.http({
		url: API("/sysuser/resource"),
		method: "get",
		headers:{
			token:token
		}
	}).then(
		(res)=>{
			console.log(res);
		}
	).catch(
		(res)=>{
			console.error(res);
		}
	);
}









