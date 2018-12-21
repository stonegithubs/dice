<template>
    <section>
        <div class="stat ds-roll">
            <div class="header">
                <span></span>
                <span>0-25</span>
                <span>26-50</span>
                <span>51-75</span>
                <span>76-100</span>
                <span></span>
            </div>
            <ul class="body">
                <li>
                    <span>{{$t('stat_result')}}</span>
                    <span v-for="(r,i) in 4" :key="i">{{result[i]}}</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_winRatio')}}</span>
                    <span v-for="(r,i) in 4" :key="i">{{winRatio[i] | percent(denominators[i])}}%</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_maxContinuous')}}</span>
                    <span v-for="(r,i) in 4" :key="i">{{maxContinuous[i]}}</span>
                    <span></span>
                </li>
                <li>
                    <span>{{$t('stat_maxAmount')}}</span>
                    <span v-for="(r,i) in 4" :key="i">{{maxAmount[i] | fixed(2)}}</span>
                    <span></span>
                </li>
            </ul>
        </div>
        <em ref="em" class="info-panel" :style="position">{{infoText}}</em>
    </section>
</template>

<script>
export default {
    name: 'RollDataStat',

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
            denominators: this.core.genArray(4, 0), // 胜率分母
        }
    },

    watch: {
        '$t.locale': {
            handler() {
                this.infoTextElements = this.$t('roll_area')
            },
            immediate: true
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

        // 结果, 最近50把出现在范围内的次数
        result() {
            const { list, core, total } = this
            return list
                .slice(0, total)
                .reduce(reducer.bind(this), core.genArray(4, 0))

            function reducer(acc, cur) {
                acc[this.getAreaIndex(cur.modResult)]++
                return acc
            }
        },

        // 胜率, 最近50把压在范围内的玩家胜率（50把赢的次数/50）
        winRatio() {
            const { list, core, total } = this

            let denominators = this.denominators = core.genArray(4, 0)
            return list.slice(0, total).reduce(reducer.bind(this), core.genArray(4, 0))

            function reducer(acc, cur) {
                const index = this.getAreaIndex(cur.bet_on)
                denominators[index]++
                if (cur.wins > 0) acc[index]++
                return acc
            }
        },

        // 最大连出, 最近50把最大连出数
        maxContinuous() {
            const { list, core, total } = this
            let prevIndex,
                max = core.genArray(4, 0)

            list.slice(0, total).reduce(reducer.bind(this), core.genArray(4, 0))

            return max

            function reducer(acc, cur) {
                let index = this.getAreaIndex(cur.modResult)

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
            return list.slice(0, total).reduce(reducer.bind(this), core.genArray(4, 0))

            function reducer(acc, cur) {
                let index = this.getAreaIndex(cur.bet_on)
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
        },

        // 根据 modResult 返回其在统计报表中的位置
        getAreaIndex(n) {
            const area = [25, 50, 75, 100],
                len = area.length
            let i = 0

            while (i < len) {
                if (+n <= area[i++]) return i - 1
            }
        }
    }
}
</script>
