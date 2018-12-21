<template>
    <div class="wrap text-center">Page Not Found</div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'NotFound',

    data() {
        return {}
    },

    mounted() {
        setTimeout(this.redirect.bind(this), 3000)
    },

    computed: {
        ...mapState(['env'])
    },

    methods: {
        redirect() {
            if (this.env.PROD) {
                location.href = '/'
            }
        }
    }
}
</script>
