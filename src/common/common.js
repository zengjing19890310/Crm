require("./common.css");
//公共配置信息
require("element-ui/lib/theme-chalk/index.css");
/*symbol引用阿里巴巴图标库*/
// require('./font/iconfont');
import VueQuillEditor from "vue-quill-editor";

<<<<<<< HEAD
Vue.use(VueQuillEditor);
Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(VueRouter);
Vue.use(element);

// console.log("common.js公共配置文件被引入!");

//全局变量，用于保存数据总线
window.Bus = new Vue();

if (!window["sessionStorage"]) {
    window.Bus.$message({
        type: "error",
        message: "当前浏览器不能使用本地存储,请更换浏览器"
    });
=======
// Vue.use(Vuex);
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
>>>>>>> 00544b5aa1e3eda4037b94d1d9c52a1c1e46ac5a
}

//获取token
let token = window.sessionStorage.getItem("token");

<<<<<<< HEAD
if (token) {
    let resourceList = [];

    //使用同步请求去获取用户权限信息
    let xhr = new XMLHttpRequest();
    xhr.open("get", API("/sysuser/resource"), false);
    xhr.setRequestHeader("token", token);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let res = JSON.parse(xhr.response);
            if (res.code === 0 && res.msg === "成功") {
                resourceList = res.data;
            }
        }
    };
    xhr.onerror = () => {
        window.Bus.$message({
            type: "error",
            message: "获取授权失败..."
        });
        window.sessionStorage.removeItem("token");
        window.location.href = "../login";
    };
    xhr.ontimeout = () => {
        window.Bus.$message({
            type: "error",
            message: "获取授权超时..."
        });
        window.sessionStorage.removeItem("token");
        window.location.href = "../login";
    };
    try {
        xhr.send();
    } catch (error) {
        window.location.href = "../login";
    }


    //全局添加权限验证
    Vue.directive("permission", {
        bind(el, binding) {
            let permission = binding.value || {},
                hasPermission = false;
            if (resourceList) {
                _.forEach(resourceList, (resource) => {
                    //如果为菜单
                    if ((resource.type === 0 && resource.buttonId === -1 && resource.menuId === permission.menuId) || (resource.type === 1 && resource.buttonId === permission.buttonId)) {
                        hasPermission = true;
                        //将当前菜单中的permissionHidden类删除
                        let className = el.getAttribute("class").replace("permissionHidden", "");
                        el.setAttribute("class", className);
                        return false;
                    }
                });
                if (!hasPermission) {
                    // console.log("没有权限",permission);
                    setTimeout(() => {
                        el.remove();
                    }, 0);
                }
            }
        }
    });
    //若无权限,则显示其他提示信息
    Vue.directive("no-permission-show", {
        bind(el, binding) {
            let permission = binding.value || {},
                hasPermission = false;
            if (resourceList) {
                _.forEach(resourceList, (resource) => {
                    //如果为菜单
                    if ((resource.type === 0 && resource.buttonId === -1 && resource.menuId === permission.menuId) || (resource.type === 1 && resource.buttonId === permission.buttonId)) {
                        hasPermission = true;
                        return false;
                    }
                });
                if (!hasPermission) {
                    //将当前菜单中的permissionHidden类删除
                    let className = el.getAttribute("class").replace("permissionHidden", "");
                    el.setAttribute("class", className);
                }
            }
        }
    });
=======
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
>>>>>>> 00544b5aa1e3eda4037b94d1d9c52a1c1e46ac5a
}









<<<<<<< HEAD


=======
>>>>>>> 00544b5aa1e3eda4037b94d1d9c52a1c1e46ac5a
