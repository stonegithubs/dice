<template>
    <div class="data-stat">
        <div class="title">
            <span>{{$t('stat_title')}}</span>
        </div>
        <div class="round">
            <div class="pre-round">{{$t('stat_recent')}}</div>
            <ul class="rounds">
                <li v-for="el of [5,10,25,50,100]" :key="el" :class="{current: total===el}" @click="showRound(el)"><em>{{el}}</em></li>
            </ul>
            <div class="post-round">{{$t('stat_round')}}</div>
        </div>
        <component :is="GameDataStat" :list="histories" :total="total"></component>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import RollDataStat from '@/components/RollDataStat.vue'
import CoinDataStat from '@/components/CoinDataStat.vue'
import DiceDataStat from '@/components/DiceDataStat.vue'
import Dice2DataStat from '@/components/Dice2DataStat.vue'

export default {
    name: 'DataStat',

    components: { RollDataStat, CoinDataStat, DiceDataStat, Dice2DataStat },

    props: ['histories'],

    data() {
        return {
            total: 50,
            GameDataMap: {
                roll: RollDataStat,
                coin: CoinDataStat,
                dice: DiceDataStat,
                dice2: Dice2DataStat
            }
        }
    },

    computed: {
        ...mapState(['currentGame']),

        GameDataStat() {
            return this.GameDataMap[this.currentGame]
        }
    },

    methods: {
        showRound(total = 50) {
            this.total = total
        }
    }
}
</script>

<style lang="scss">
.data-stat {
    background-color: #0d0d0d;
    border-radius: 5px;
    margin-bottom: 3px;

    .title {
        padding: 10px 0;
        border-bottom: 1px solid #423832;
        font-size: 16px;
        text-indent: 17px;
    }

    .round {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 17px;
        border-bottom: 1px solid #423832;
        color: #fff;

        ul {
            flex-grow: 1;
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 0 2em;
        }

        li {
            position: relative;
            width: 20%;
            padding-bottom: 15px;
            padding-right: 0;
            cursor: pointer;
            transition: opacity 0.1s ease-in;

            &:hover {
                opacity: 0.6;
            }

            em {
                position: relative;
                display: inline-block;
                width: 26px;
                height: 32px;
                line-height: 28px;
                text-align: center;
                font-size: 12px;
                color: #333;
                background: url(../assets/img/round.png) no-repeat center/contain;

                &::before {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 50%;
                    transform: translateX(-50%);
                    transform-origin: left center;
                    width: 6px;
                    height: 6px;
                    border-radius: 6px;
                    background-color: #fff;
                }
            }
            &::after {
                content: '';
                position: absolute;
                left: 13px;
                bottom: 7.5px;
                width: calc(100% - 5px);
                height: 1px;
                background-color: #fff;
            }
        }

        li.current {
            &:hover {
                opacity: 1;
                cursor: default;
            }
            em {
                background-image: url(../assets/img/round-current.png);
                color: #fff;
                &::before {
                    background-color: #d9ae95;
                    animation: heartbeat 1s ease-in-out infinite alternate;
                }
            }
            &::after {
                background-color: #d9ae95;
            }
        }
    }

    .stat {
        display: table;
        width: 100%;
        padding: 10px;
        border-spacing: 5px;
        font-size: 12px;
        overflow: hidden;

        .header {
            display: table-header-group;
            color: #d9ae95;
            span:last-child {
                visibility: hidden;
            }
        }
        ul {
            display: table-row-group;
            width: 100%;
        }
        li {
            display: table-row;
            div {
                display: table-row;
                width: 100%;
            }
        }
        span {
            display: table-cell;
            min-height: 1px;
            text-align: center;
            line-height: 16px;
            &:first-child {
                text-align: left;
                color: #868686;
            }
            &:last-child {
                width: 14px;
                background: url(../assets/img/icon-info.png) no-repeat center;
                cursor: pointer;
                transition: transform 200ms ease-in-out;
                &:hover {
                    background-image: url(../assets/img/icon-info-hover.png);
                    transform: rotate(360deg);
                }
            }
        }
    }
}
@keyframes heartbeat {
    0% {
        transform: scale(1) translate(-50%, 0);
    }
    50% {
        transform: scale(1.5) translate(-50%, 0);
    }
    100% {
        transform: scale(1) translate(-50%, 0);
    }
}
em.info-panel {
    position: absolute;
    padding: 2px 0.5em;
    border-radius: 3px;
    white-space: nowrap;
    text-align: right;
    background-color: #cba38c;
    color: rgba(#fff, 1);
    font-size: 12px;
    &::after {
        position: absolute;
        right: -8px;
        top: 50%;
        transform: translateY(-50%);
        content: '';
        width: 0;
        height: 0;
        border-top: 5px solid transparent;
        border-left: 8px solid #cba38c;
        border-bottom: 5px solid transparent;
    }
}
@media screen and (max-width: 750px) {
    .data-stat {
        .round ul {
            margin: 0 0.8em;
        }
    }
}
</style>
