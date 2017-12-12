require("./index.scss");
require("../../common/common");
//获取工具类
//在工具类中准备一个解析URL参数的方法
let util = require("../../common/util");

let overView = new Vue({
	el: "#app",
	data: {
		id: "",
		postData: {},
		navi: null,
		overviewLoading: true
	},
	created() {
		let search = document.location.search;
		if (search) {
			this.id = util.fetchParam(search, "id");
			this.navi = util.fetchParam(search, "navi");
			if (!this.id) {
				this.$message({
					type: "error",
					message: "获取帖子ID失败"
				});
			}
			this.$http({
				url: API(`/circle/article/${this.id}`),
				method: "get"
			}).then(
				(res) => {
					if (res.ok && res.status === 200) {
						let data = res.body;
						if (data.code === 0 && data.msg === "成功") {
							this.postData = data.data;
						} else {
							this.$message({
								type: "error",
								message: "获取帖子失败"
							});
						}
					}else {
						this.$message({
							type: "error",
							message: "获取帖子失败"
						});
					}
					this.overviewLoading = false;
					// console.log(res);
				},
				(res) => {
					this.$message({
						type: "error",
						message: "获取帖子失败"
					});
					this.overviewLoading = false;
					// console.error(res);
				}
			);
		}
	}
});