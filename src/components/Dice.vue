<template>
    <div class="dice-stage">
        <div class="game-title">
            <!-- 骰子 -->
            <h1>{{$t('dice_name')}}</h1>
        </div>

        <div class="guess">
            <div>
                <a class="dice" href="javascript:;" v-for="(dir,index) in dirs" :key="index" :class="[dir, {active: idir[dirs.length - index - 1]}]" @click="active(dirs.length - index - 1)">
                    <b></b>
                    <b></b>
                    <b></b>
                </a>
            </div>
            <!-- 选择骰子数来进行投注 -->
            <div class="comment">{{$t('game_comment_dice')}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Dice',

    data() {
        return {
            // 硬币的方向/朝向，默认空, 用于控制界面显示
            idir: [, , , , , ,],
            dirs: ['one', 'two', 'three', 'four', 'five', 'six'],

            // 下注数据，用于完成下注交易
            betMask: [0, 0, 0, 0, 0, 0],
            modulo: 6
        }
    },

    created() {
        this.active(5)
        this.active(4)
        this.active(3)
    },

    methods: {
        active(index) {
            this.select(index)
            this.sendDataToStage(index)
        },

        setBetMask(index) {
            this.betMask.splice(index, 1, Number(this.idir[index]) || 0)
        },

        // 多选, 选择并设置 betMask
        select(index) {
            let v = this.idir[index]
            this.idir.splice(index, 1, !v)
            this.setBetMask(index)
        },

        sendDataToStage(index) {
            const { betMask, modulo } = this

            // 没选
            if (!betMask.includes(1)) {
                return this.active(index)
            }

            // 全选
            if (!betMask.includes(0)) {
                return this.active(5)
            }

            this.$emit('select', { betMask, modulo })
        }
    }
}
</script>

<style lang="scss" scoped>
.game-title {
    display: none;

    &::before {
        content: '';
        display: block;
        margin: 0 auto;
        width: 106px;
        height: 88px;
        background-size: auto 100%;
    }
    h1 {
        font-size: 18px;
        font-weight: 400;
    }
}
.guess {
    margin: 20px auto 30px;
    > div:first-child {
        width: 216px;
        display: flex;
        margin: 0 auto;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
    }
}
.comment {
    color: #fff;
    font-size: 14px;
    margin-top: 35px;
}
</style>

