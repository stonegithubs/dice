<template>
    <div>
        <div class="stat ds-dice">
            <div class="header">
                <span></span>
                <span v-for="(r,i) of 6" :key="i">{{r}}</span>
                <span></span>
            </div>
            <ul class="body">
                <li>
                    <span>{{$t('stat_result')}}</span>
                    <span v-for="(r,i) in 6" :key="i">{{result[i]}}</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_winRatio')}}</span>
                    <span v-for="(r,i) in 6" :key="i">{{winRatio[i] | percent(denominators[i])}}%</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_maxContinuous')}}</span>
                    <span v-for="(r,i) in 6" :key="i">{{maxContinuous[i]}}</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_maxAmount')}}</span>
                    <span v-for="(r,i) in 6" :key="i">{{maxAmount[i] | fixed(2)}}</span>
                    <span></span>
                </li>
            </ul>
        </div>
        <em ref="em" class="info-panel" :style="position">{{infoText}}</em>
    </div>
</template>

<script>
export default {
    name: 'DiceDataStat',

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
            infoTextElements: '123456',
            denominators: this.core.genArray(6, 0), // 胜率分母
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

    computed: {
        // 计算实际数据条数
        len() {
            return Math.min(this.total, this.list.length)
        },

        // 结果, 最近50把出现123456的次数
        result() {
            const { list, core, total } = this
            return list.slice(0, total).reduce(reducer, core.genArray(6, 0))

            function reducer(acc, cur) {
                acc[cur.modResult - 1]++
                return acc
            }
        },

        // 胜率, 最近50把压123456的玩家胜率（50把赢的次数/50）
        winRatio() {
            const { list, core, total } = this

            let denominators = this.denominators = core.genArray(6, 0)
            return list.slice(0, total).reduce(reducer, core.genArray(6, 0))

            function reducer(acc, cur) {
                cur.hit.forEach(el => {
                    const index = el - 1
                    denominators[index]++
                    if (cur.wins > 0) acc[index]++
                })

                return acc
            }
        },

        // 最大连出, 最近50把最大连出数
        maxContinuous() {
            const { list, core } = this
            let prevIndex,
                max = core.genArray(6, 0)

            list.slice(0, this.total).reduce(reducer, core.genArray(6, 0))

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
            const { list, core, total } = this
            return list.slice(0, total).reduce(reducer, core.genArray(6, 0))

            function reducer(acc, cur) {
                cur.hit.forEach(
                    el => (acc[el - 1] = Math.max(acc[el - 1], +cur.bet))
                )
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
