<template>
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
        <span
          v-if="item.redirect === 'noRedirect' || index == levelList.length - 1"
          class="no-redirect"
        >
          {{ generateTitle(item.meta.title) }}
        </span>
        <span v-else style="color: #666c80; font-size: 16px">{{
          generateTitle(item.meta.title)
        }}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
import { generateTitle } from "@/utils/i18n";
import pathToRegexp from "path-to-regexp";

export default {
  data() {
    return {
      levelList: null,
    };
  },
  watch: {
    $route(route) {
      // if you go to the redirect page, do not update the breadcrumbs
      if (route.path.startsWith("/redirect/")) {
        return;
      }
      this.getBreadcrumb();
    },
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    generateTitle,
    getBreadcrumb() {
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        (item) => item.meta && item.meta.title
      );
			//----------------------
			// 此处修改根据最后的菜单，查询出所有父菜单进行显示
      const last = matched[matched.length - 1];
      let menuList = window.SITE_CONFIG["menuList"];
			let list = this.findParents(menuList,last.meta.menuId)
			if(list && list.length > 0){
				list.forEach(function(item) {
					item.path = item.id
					item.meta = {
						title: item.name
					};
				})
			}
			this.levelList = list
			//------------------------------
      // this.levelList = matched.filter(
      //   (item) => item.meta && item.meta.title && item.meta.breadcrumb !== false
      // );
    },
    isDashboard(route) {
      const name = route && route.name;
      if (!name) {
        return false;
      }
      return (
        name.trim().toLocaleLowerCase() === "Dashboard".toLocaleLowerCase()
      );
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route;
      var toPath = pathToRegexp.compile(path);
      return toPath(params);
    },
    handleLink(item) {
      const { redirect, path } = item;
      if (redirect) {
        this.$router.push(redirect);
        return;
      }
      this.$router.push(this.pathCompile(path));
    },
    // 递归查菜单父级
    findParents(treeData, id) {
      let allparents = [];
      if (treeData.length == 0) {
        return;
      }
      let findele = (data, id) => {
        if (!id) return;
        data.forEach((item, index) => {
          if (item.id == id) {
            allparents.unshift(item);
            findele(treeData, item.parentId);
          } else {
            if (!!item.children) {
              findele(item.children, id);
            }
          }
        });
      };
      findele(treeData, id);
      return allparents;
    },
  },
};
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 16px;
  line-height: 54px;
  margin-left: 0px;

  .no-redirect {
    color: #666c80;
    cursor: text;
    font-size: 16px;
  }

	.el-breadcrumb__separator{
		color: #666c80 !important;
    cursor: text;
	}
}
</style>
