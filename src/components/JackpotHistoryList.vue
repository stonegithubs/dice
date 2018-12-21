<template>
    <ul>
        <!-- 大奖历史 -->
        <li v-for="(item,index) in jackpots" :key="index">
            <div class="item-jackpots">
                <span class="addr">
                    <a :href="core.getTrxLink(item.tx_hash, config.ethhost)" target="_blank">{{item.beneficiary}}</a>
                </span>
                <span class="result">{{item.amount}}ETH</span>
            </div>
        </li>
    </ul>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'JackpotHistoryList',

    data() {
        return {}
    },

    props: ['jackpots'],

    computed: { ...mapState(['config']) }
}
</script>
