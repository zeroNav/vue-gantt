<template>
    <li class="nav_item">
        <el-menu-item
            v-if="!link.children || !link.children.length"
            :index="root"
        >
            {{ link.name }}
        </el-menu-item>
        <el-submenu
            v-else
            :index="root"
        >
            <template slot="title">{{ link.name }}</template>
            <template v-for="c of link.children">
                <sidebar-item :uri="root" :link="c" :key="c.path + link.path"></sidebar-item>
            </template>
        </el-submenu>
    </li>
</template>

<script>
export default {
    name: 'SidebarItem',
    props: {
        link: {
            type: Object
        },
        uri: {
            type: String,
            default: ''
        }
    },
    data () {
        return {
            root: this.uri ? this.uri + '/' + this.link.path : '/' + this.link.path
        }
    }
}
</script>
