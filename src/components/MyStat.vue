<template>
    <div class="my-stat">
        <ul>
            <li>
                <span>{{$t('stat_my_totalAmount')}}</span>
                <span>{{myStats.totalAmount | fixed(2)}} ETH</span>
            </li>
            <li>
                <span>{{$t('stat_my_betTimes')}}</span>
                <span>{{myStats.betTimes}}</span>
            </li>
            <li>
                <span>{{$t('stat_my_winRatio')}}</span>
                <span>{{myStats.avgWinChance}}</span>
            </li>
            <li>
                <span>{{$t('stat_my_winTimes')}}</span>
                <span>{{myStats.winTimes}}</span>
            </li>
            <li>
                <span>{{$t('stat_my_maxAmount')}}</span>
                <span>{{myStats.maxAmount}} ETH</span>
            </li>
            <li>
                <span>{{$t('stat_my_maxWin')}}</span>
                <span>{{myStats.maxWin | fixed(4)}} ETH</span>
            </li>
        </ul>
        <span class="tips">{{$t('stat_my_note')}}</span>
    </div>
</template>

<script>
export default {
    name: 'MyStat',

    props: ['myStats'],

    data() {
        return {}
    }
}
</script>

<style lang="scss" scoped>
.my-stat {
    ul {
        padding: 0 10px;
        li {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 10px;
        }
        span {
            color: #868686;
        }
        span:last-child {
            color: #cba38c;
        }
    }
    .tips {
        position: absolute;
        bottom: 0;
        right: 17px;
        font-size: 12px;
        color: rgba(255,255,255,.6);
    }
}
</style>
