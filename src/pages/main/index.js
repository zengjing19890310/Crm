require("../../common/common");
require("./index.scss");


import commonHeader from "../../components/header.vue";
import commonMenu from "../../components/menu.vue";
import commonNav from "../../components/nav.vue";

import homepage from "./components/homepage.vue";
import userManagement from "./components/userManagement.vue";
import roleManagement from "./components/roleManagement.vue";
import customerInformation from "./components/customerInformation.vue";
import permissionManagement from "./components/permissionManagement.vue";
import customerShare from "./components/customerShare.vue";
import publishArticle from "./components/publishArticle.vue";
import circleManangement from "./components/circleManagement.vue";
import circleDetail from "./components/circleDetail.vue";

import testIM from "./components/testIM.vue";

//路由配置同步传输面包屑导航信息
const routes = [
	{
		path: "/circleManagement",
		name: "circleManagement",
		component: circleManangement,
		children: []
	},
	{
		path: "/circleDetail/:id",
		name: "circleDetail",
		component: circleDetail
	},
	{
		path: "/publishArticle",
		name: "publishArticle",
		component: publishArticle,
	},
	{
		path: "/customerShare",
		name: "customerShare",
		component: customerShare,
		children: []
	},
	{
		path: "/customerInformation",
		name: "customerInformation",
		component: customerInformation,
		children: []
	},
	{
		path: "/homepage",
		name: "homepage",
		component: homepage,
		children: []
	},
	{
		path: "/userManagement",
		name: "userManagement",
		component: userManagement,
		children: []
	},
	{
		path: "/roleManagement",
		name: "roleManagement",
		component: roleManagement,
		children: []
	},
	{
		path: "/permissionManagement",
		name: "permissionManagement",
		component: permissionManagement,
		children: []
	},
	{
		path: "/testIM",
		name: "testIM",
		component: testIM
	},
	{path: "/", redirect: "/homepage"}
];

let pathInfo = {
	"homepage": [
		{
			path: "/",
			name: "首页"
		}
	],
	"customerInformation": [
		{
			path: "/",
			name: "客户管理"
		},
		{
			path: "/customerInformation",
			name: "客户信息"
		}
	],
	"customerShare": [
		{
			path: "/",
			name: "客户管理"
		},
		{
			path: "/customerShare",
			name: "分享关系"
		}
	],
	"publishArticle": [
		{
			path: "/",
			name: "内容管理"
		},
		{
			path: "/circleManagement",
			name: "圈子管理"
		},
		{
			path: "/publishArticle",
			name: "发表文章"
		}
	],
	"circleManagement": [
		{
			path: "/",
			name: "内容管理"
		},
		{
			path: "/circleManagement",
			name: "圈子管理"
		}
	],
	"circleDetail": [
		{
			path: "/",
			name: "内容管理"
		},
		{
			path: "/circleManagement",
			name: "圈子管理"
		},
		{
			path: "",
			name: "圈子详情"
		}
	],
	"userManagement": [
		{
			path: "/",
			name: "系统管理"
		},
		{
			path: "/userManagement",
			name: "用户管理"
		}
	],
	"roleManagement": [
		{
			path: "/",
			name: "系统管理"
		},
		{
			path: "/roleManagement",
			name: "角色管理"
		}
	],
	"permissionManagement": [
		{
			path: "/",
			name: "系统管理"
		},
		{
			path: "/permissionManagement",
			name: "权限资源"
		}
	],
	"testIM": [
		{
			path: "/",
			name: "首页"
		},
		{
			path: "/testIM",
			name: "IM测试"
		}
	]
};
const router = new VueRouter({
	// mode: 'history',
	routes: routes
});

let checkToken = require("../../common/checkToken").checkToken;
checkToken();

//注册路由守卫
router.afterEach((to, from) => {
	setTimeout(function () {
	    let path = pathInfo[to.name];
		if (path) {
			mainView.currentNav = path;
		}
		//跳转路由时,检查access_token
		checkToken();
	}, 0);
});

let access_token = window.sessionStorage.getItem("access_token");

let mainView = new Vue({
	el: "#app",
	router,
	components: {
		"common-header": commonHeader,
		"common-menu": commonMenu,
		"common-nav": commonNav
	},
	data: {
		activeName: "1",
		isCollapse: false,
		currentNav: [],
	},
	mounted() {
		let _this = this;

		function checkWidth() {
			const WIDTH = document.body.clientWidth;
			WIDTH <= 1024 ? _this.isCollapse = true : _this.isCollapse = false;
			window.Bus.$emit("resize-window", _this.isCollapse);
		}

		checkWidth();

		window.onresize = function () {
			checkWidth();
		};
	},
	methods: {
		clearModal() {
			window.Bus.$emit("clear-modal");
			window.Bus.$emit("clear-child-menu");
		},
		collapseMenu(isCollapse) {
			// console.log("切换菜单布局");
			this.isCollapse = isCollapse;
		},
		goTestIM() {

		}
	}
});


