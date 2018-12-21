<template>
    <div class="logo row">
        <div>
            <img src="../assets/img/logo.png" @click="play">
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Logo',

    data() {
        return {}
    },

    computed: {
        ...mapState(['currentGame', 'config', 'rid']),
    },

    methods: {
        play() {
            let query = { rid: this.rid }
            this.$router.push({ name: 'dice', query })
        }
    }
}
</script>

<style lang="scss" scoped>
.logo {
    position: relative;
}
img {
    display: block;
    height: 42px;
    cursor: pointer;
    &:hover {
        opacity: 0.8;
    }
}
em {
    position: absolute;
    left: 230px;
    top: 50%;
    margin-top: -1.4em;
    margin-left: 1em;
    white-space: nowrap;
    text-transform: uppercase;
    font-size: 12px;
    color: #cf4c42;
}
</style>
