 /* 
 * @Author: nooldey 
 * @Author-Email: <nooldey@gmail.com> 
 * @Date: 2017-11-24 16:46:23 
 * @Last Modified by:   nooldey 
 * @Last Modified time: 2017-11-24 16:46:23 
 * @Description: 纯vue无框架导航布局
 */
<template>
    <div class="layout">
        <nav>
            <router-link v-for="(item,i) in routes" :key="i" :to="item.path">
                {{ item.name || 'link' }}
            </router-link>
        </nav>
        <router-view/>
    </div>
</template>

<script>
export default {
    data () {
        return {
            routes: this.$router.options.routes[0].children
        }
    }
}
</script>
