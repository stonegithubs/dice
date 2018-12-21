<template>
    <section>
        <div class="stat ds-coin">
            <div class="header">
                <span></span>
                <span></span>
                <span></span>
                <span>{{$t('game_coin_front')}}</span>
                <span>{{$t('game_coin_back')}}</span>
                <span></span>
            </div>
            <ul class="body">
                <li>
                    <span>{{$t('stat_result')}}</span>
                    <span></span>
                    <span></span>
                    <span>{{result[0]}}</span>
                    <span>{{result[1]}}</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_winRatio')}}</span>
                    <span></span>
                    <span></span>
                    <span>{{winRatio[0] | percent(denominators[0])}}%</span>
                    <span>{{winRatio[1] | percent(denominators[1])}}%</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_maxContinuous')}}</span>
                    <span></span>
                    <span></span>
                    <span>{{maxContinuous[0]}}</span>
                    <span>{{maxContinuous[1]}}</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_maxAmount')}}</span>
                    <span></span>
                    <span></span>
                    <span>{{maxAmount[0] | fixed(2)}}</span>
                    <span>{{maxAmount[1] | fixed(2)}}</span>
                    <span></span>
                </li>
            </ul>
        </div>
        <em ref="em" class="info-panel" :style="position">{{infoText}}</em>
    </section>
</template>

<script>
export default {
    name: 'CoinDataStat',

    props: ['list', 'total'],

    data() {
        return {
            position: {
                display: 'none',
                width: 'auto',
                left: 'auto',
                top: 'auto'
            },
            infoText: '',
            infoTextElements: '',
            denominators: this.core.genArray(2, 0)
        }
    },

    mounted() {
        let statInfoIcons = document.querySelectorAll(
            '.stat .body span:last-child'
        )
        statInfoIcons.forEach((el, index) => {
            el.addEventListener(
                'mouseover',
                this.showStatInfo.bind(this, index),
                false
            )
            el.addEventListener('mouseout', this.hideStatInfo.bind(this), false)
        })
    },

    watch: {
        '$t.locale': {
            handler() {
                this.infoTextElements = this.$t('coin_head_tail')
            },
            immediate: true
        }
    },

    computed: {
        // 计算实际数据条数
        len() {
            return Math.min(this.total, this.list.length)
        },

        // 结果, 最近50把出现正反面的次数
        result() {
            const { list, total } = this
            return list.slice(0, total).reduce(reducer, [0, 0]) /* 正面,反面 */

            function reducer(acc, cur) {
                acc[cur.modResult - 1]++
                return acc
            }
        },

        // 胜率, 最近50把压正反面的玩家胜率（50把赢的次数/50）
        winRatio() {
            const { list, total, core } = this

            let denominators = (this.denominators = core.genArray(2, 0)) // 保存正反面的下注次数
            return list
                .slice(0, total)
                .reduce(reducer, core.genArray(2, 0)) /* 正面,反面 */

            function reducer(acc, cur) {
                let index = cur.hit - 1 // 确定正反面

                if (cur.wins > 0) {
                    acc[index]++
                }

                denominators[index]++
                return acc
            }
        },

        // 最大连出, 最近50把最大连出数
        maxContinuous() {
            const { list, total } = this
            let prevIndex,
                max = [0, 0]

            list.slice(0, total).reduce(reducer, [0, 0])

            return max

            function reducer(acc, cur) {
                let index = cur.modResult - 1

                acc[index]++

                // 连出中断
                if (prevIndex !== index) {
                    acc[prevIndex] = 0
                    prevIndex = index
                }

                max[index] = Math.max(max[index], acc[index])

                return acc
            }
        },

        // 最大赌注, 最近50把最大赌注
        maxAmount() {
            const { list, total } = this
            return list.slice(0, total).reduce(reducer, [0, 0])

            function reducer(acc, cur) {
                let index = cur.hit - 1
                acc[index] = Math.max(acc[index], +cur.bet)
                return acc
            }
        }
    },

    methods: {
        showStatInfo(e, index) {
            this.core.showStatInfo.call(this, e, index)
        },

        hideStatInfo() {
            this.core.hideStatInfo.call(this)
        },

        getInfo(index) {
            const arr = [
                this.$t('stat_infoText[0]'),
                this.$t('stat_infoText[1]'),
                this.$t('stat_infoText[2]'),
                this.$t('stat_infoText[3]')
            ]
            return arr[index]
        }
    }
}
</script>
