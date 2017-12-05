<template>
    <div :class="$style.admin_panel">
        <sidebar :class="$style.navigator" class="ui-scrollbar"/>
        <div :class="$style.main_panel">
            <router-view/>
        </div>
    </div>
</template>

<script>
import sidebar from './components/sidebar'
export default {
    components: {
        sidebar
    }  
}
</script>

<style lang="scss" module>
    .admin_panel {
        display: flex;
        height: 100%;
        overflow: hidden;
        .navigator {
            flex: none;
            width: 200px;
            height: 100%;
            overflow-x: hidden;
            overflow-y: auto;
        }
        .main_panel {
            flex: 1;
            width: calc(100% - 200px);
            padding: 15px;
            > * {
                height: 100%;
                background: #f8f8f8;
            }
        }
    }
</style>

