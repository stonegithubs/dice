<template>
    <div class="header">
        <div class="wrap">
            <logo></logo>
            <LocaleSelector :hide-list="hideLocaleSelector"></LocaleSelector>
        </div>
    </div>
</template>

<script>
import Logo from '@/components/Logo.vue'
import LocaleSelector from '@/components/LocaleSelector'

export default {
    name: 'Header',

    components: { Logo, LocaleSelector },

    data() {
        return {
            hideLocaleSelector: false
        }
    },

    mounted() {
        window.addEventListener('click', this.hide.bind(this), false)
        document.addEventListener('touchend', this.hide.bind(this), false)
    },

    methods: {
        hide() {
            this.hideLocaleSelector = true
            setTimeout(() => (this.hideLocaleSelector = false), 0)
        }
    }
}
</script>

<style lang="scss" scoped>
.header {
    background-color: rgba(#000000, 0.4);
}
.wrap {
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>

