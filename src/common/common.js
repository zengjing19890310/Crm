require("./common.css");
//公共配置信息
require("element-ui/lib/theme-chalk/index.css");
/*symbol引用阿里巴巴图标库*/
// require('./font/iconfont');
import VueQuillEditor from "vue-quill-editor";

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
}

//获取token
let token = window.sessionStorage.getItem("token");

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
        console.log(error);
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
}











