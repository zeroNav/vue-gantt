<template>
    <div class="layout">
        <!-- 当前只做支持二级菜单，可自行拓展 -->
        <nav>
            <template v-for="(item,i) in routes" v-if="!item.hidden">
                <router-link :key="i" :to="'/' + item.path" v-if="!item.children || !item.children.length">
                    {{ item.name }}
                </router-link>
                <template v-else v-for="(child,j) in item.children">
                    <router-link :key="item.path+j" :to="'/' + item.path + '/' + child.path">
                        {{ child.name }}
                    </router-link>
                </template>
            </template>
        </nav>
        <router-view class="wrapper"/>
    </div>
</template>

<script>
 /* 
 * @Author: nooldey 
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-24 16:46:23 
 * @Last Modified by: nooldey
 * @Last Modified time: 2017-12-18 16:45:20
 * @Description: 纯vue无框架导航布局
 */
export default {
    data() {
        return {
            routes: this.$router.options.routes[0].children
        }
    }
}
</script>

<style lang="scss" scoped>
    nav {
        margin-bottom: 35px;
        border-bottom: 1px solid #ccc;
        a {
            display: inline-block;
            margin-right: 8px;
            font-size: 18px;
        }
    }
</style>
