<template>
    <div class="home" onclick="void(0)">
        <div class="wrap">
            <stage></stage>
            <chance></chance>
            <history></history>
        </div>
    </div>
</template>

<script>
import Stage from '@/components/Stage'
import Chance from '@/components/Chance'
import History from '@/components/History'

export default {
    name: 'Home',

    data() {
        return {}
    },

    components: { Stage, Chance, History }
}
</script>

<style lang="scss" scoped>
.wrap {
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    flex-wrap: wrap;
    margin: 20px auto;
}
</style>

