require("../../common/common");
require("./index.scss");


import commonHeader from "../../components/header.vue";
import commonMenu from "../../components/menu.vue";
import commonNav from "../../components/nav.vue";

import homepage from "./components/homepage.vue";
import userManagement from "./components/userManagement.vue";
import roleManagement from "./components/roleManagement.vue";
import permissionManagement from "./components/permissionManagement.vue";

//人员管理
import customerServices from "./components/customerServices.vue";
import customerInformation from "./components/customerInformation.vue";
import customerShare from "./components/customerShare.vue";

//内容管理:圈子管理,线上课程,线下课程
import circleManangement from "./components/circleManagement.vue";
import circleDetail from "./components/circleDetail.vue";
import offlineCourses from "./components/offlineCourses.vue";
import onlineCourses from "./components/onlineCourses.vue";
import offlineVideoOverview from "./components/offlineVideoOverview.vue";
import onlineVideoOverview from "./components/onlineVideoOverview.vue";
//公用组件:编辑器
import editor from "./components/editor.vue";
//测试组件
import publishArticle from "./components/publishArticle.vue";
import testIM from "./components/testIM.vue";

//路由配置同步传输面包屑导航信息
const routes = [
	{
		path: "/offlineVideoOverview/:courseId",
		name: "offlineVideoOverview",
		component: offlineVideoOverview
	},
	{
		path: "/offlineCourses",
		name: "offlineCourses",
		component: offlineCourses
	},
	{
		path: "/onlineVideoOverview/:courseId",
		name: "onlineVideoOverview",
		component: onlineVideoOverview
	},
	{
		path: "/onlineCourses",
		name: "onlineCourses",
		component: onlineCourses
	},
	{
		path: "/editor/:circleId/add",
		name: "addEditor",
		component: editor
	},
	{
		path: "/editor/:postId",
		name: "editor",
		component: editor
	},
	{
		path: "/circleManagement",
		name: "circleManagement",
		component: circleManangement
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
		component: customerShare
	},
	{
		path: "/customerInformation",
		name: "customerInformation",
		component: customerInformation
	},
	{
		path: "/customerServices",
		name: "customerServices",
		component: customerServices
	},
	{
		path: "/homepage",
		name: "homepage",
		component: homepage
	},
	{
		path: "/userManagement",
		name: "userManagement",
		component: userManagement
	},
	{
		path: "/roleManagement",
		name: "roleManagement",
		component: roleManagement
	},
	{
		path: "/permissionManagement",
		name: "permissionManagement",
		component: permissionManagement
	},
	{
		path: "/testIM",
		name: "testIM",
		component: testIM
	},
	{path: "/", redirect: "/homepage"}
];

let pathInfo = {
	"offlineCourses": [
		{
			path: "/",
			name: "内容管理"
		},
		{
			path: "/offlineCourses",
			name: "线下课程"
		}
	],
	"offlineVideoOverview": [
		{
			path: "/",
			name: "内容管理"
		},
		{
			path: "/offlineCourses",
			name: "线下课程"
		},
		{
			path: "/offlineVideoOverview",
			name: "线下课程预览"
		}
	],
	"onlineVideoOverview": [
		{
			path: "/",
			name: "内容管理"
		},
		{
			path: "/onlineCourses",
			name: "线上课程"
		},
		{
			path: "/onlineVideoOverview",
			name: "线上课程预览"
		}
	],
	"onlineCourses": [
		{
			path: "/",
			name: "内容管理"
		},
		{
			path: "/onlineCourses",
			name: "线上课程"
		}
	],
	"addEditor": [
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
			name: "添加帖子"
		}
	],
	"editor": [
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
			name: "编辑帖子"
		}
	],
	"homepage": [
		{
			path: "/",
			name: "首页"
		}
	],

	"customerServices": [
		{
			path: "/",
			name: "人员管理"
		},
		{
			path: "/customerServices",
			name: "客服"
		}
	],
	"customerInformation": [
		{
			path: "/",
			name: "人员管理"
		},
		{
			path: "/customerInformation",
			name: "客户信息"
		}
	],
	"customerShare": [
		{
			path: "/",
			name: "人员管理"
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

//验证token
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

let token = window.sessionStorage.getItem("token");

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
		resizeLock: false
	},
	watch: {},
	mounted() {
		this.checkWidth();
		window.addEventListener("resize", this.checkWidth);
	},
	methods: {
		checkWidth() {
			//400毫秒只能触发一次
			if (!this.resizeLock) {
				this.resizeLock = true;
				let WIDTH = document.body.clientWidth;
				WIDTH <= 1024 ? this.isCollapse = true : this.isCollapse = false;
				window.Bus.$emit("resize-window", this.isCollapse);
				setTimeout(() => {
					this.resizeLock = false;
				}, 400);
			}
		},
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


