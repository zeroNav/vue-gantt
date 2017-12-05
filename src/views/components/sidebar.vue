<template>
    <el-menu
        router
        :default-active="$route.path"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
    >
        <template v-for="(menu,idx) in links">
            <sidebar-item :link="menu" :key="idx"></sidebar-item>
            <!-- <el-menu-item
                v-if="!menu.children || !menu.children.length"
                :key="idx"
                :index="menu.path"
            >
                {{ menu.name }}
            </el-menu-item>
            <el-submenu
                v-else
                :key="idx"
                :index="menu.path"
            >
                <template slot="title">{{ menu.name }}</template>
                <el-menu-item v-for="c of menu.children" :key="c.name + idx" :index="c.path">
                    {{ c.name }}
                </el-menu-item>
            </el-submenu> -->
        </template>
    </el-menu>
</template>

<script>
import sidebarItem from './sidebar_item'
export default {
    components: {
        sidebarItem
    },
    data () {
        return {
            links: this.$router.options.routes[0].children
        }
    }
}
</script>
