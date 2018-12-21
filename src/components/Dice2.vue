<template>
    <div class="dice2-stage">
        <div class="game-title">
            <!-- 两个骰子 -->
            <h1>{{$t('dice2_name')}}</h1>
        </div>

        <div class="guess">
            <div>
                <a class="user-dice2" href="javascript:;"
                   v-for="(dir,index) in dirs" :key="index"
                   :class="[dir, {active: isActive(index)}]"
                   @click="active(index)"></a>
            </div>
            <!-- 选择要投注的骰子总和 -->
            <div class="comment">{{$t('game_comment_dice2')}}</div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Dice2',

    data() {
        return {
            // 标识每个数字选择状态
            idir: [
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false,
                false
            ],

            dirs: [
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
                'ten',
                'eleven',
                'twelve'
            ],
            integers: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],

            // 下注数据，用于完成下注交易
            betMask: [],

            // 固定36
            modulo: 36,

            // 用户选择了某个数字，可能导致 modulo 减少数量的关键计数
            possibleIntLen: 0
        }
    },

    created() {
        this.initBetMask()

        let randIndexes = this.getRandom(5)
        randIndexes.forEach(index => this.active(index))
    },

    computed: {
        ...mapState(['contractBalance', 'maxProfit'])
    },

    methods: {
        // 初始化mask
        initBetMask() {
            const { modulo } = this
            let mask = []
            while (mask.length < modulo) {
                mask.push(0)
            }
            this.betMask = mask
        },

        // 检测当前索引数字是否处于点击激活状态
        isActive(index) {
            return Boolean(this.idir[index])
        },

        active(index) {
            this.select(index)
            this.sendDataToStage(index)
        },

        // 更新 mask
        setBetMask() {
            const { core } = this
            const masp = core.getDice2MaskMap()

            let possibleIntLen = 0
            this.initBetMask()
            this.integers.forEach((integer, index) => {
                // 用户选择了该数字
                if (this.idir[index]) {
                    // 取到可能组合的一个随机索引
                    let possibleIntegers = core.getPossibleIntegers(integer)
                    let l = possibleIntegers.length

                    possibleIntLen += l

                    possibleIntegers.forEach(possibleInt => {
                        let findIndex = masp.findIndex(
                            item => item === possibleInt
                        )
                        if (findIndex > -1) {
                            this.betMask.splice(findIndex, 1, 1)
                        }
                    })
                }
            })
            this.possibleIntLen = possibleIntLen
            // console.log('this.betMask', this.betMask)
        },

        // 多选, 选择并设置 betMask
        select(index) {
            let v = this.idir[index]
            this.idir[index] = !v
            this.idir.splice(index, 1, !v)
            this.setBetMask()
        },

        sendDataToStage(index) {
            const { idir, betMask, modulo, possibleIntLen } = this

            // 没选
            if (!idir.includes(true)) {
                return this.active(index)
            }

            // 全选
            if (!idir.includes(false)) {
                return this.active(0)
            }

            this.$emit('select', {
                betMask: betMask.reverse(),
                modulo,
                possibleIntLen
            })
        },

        getRandom(n = 5) {
            let exists = []
            while (exists.length < n) {
                let fresh = this.core.random(10)
                if (exists.includes(fresh)) continue
                exists.push(fresh)
            }
            return exists
        }
    }
}
</script>

<style lang="scss" scoped>
.game-title {
    display: none;

    &::before {
        content: "";
        display: block;
        margin: 0 auto;
        width: 119px;
        height: 99px;
        background-size: auto 100%;
    }
    h1 {
        font-size: 18px;
        font-weight: 400;
    }
}
.user-dice2 {
    &:nth-child(5) {
        margin-left: 5px;
    }
}
.guess {
    margin: 20px auto;
    > div:first-child {
        width: 216px;
        margin: 0 auto;
    }
}
.comment {
    color: #cba38c;
    font-size: 14px;
    margin-top: 10px;
}
</style>

