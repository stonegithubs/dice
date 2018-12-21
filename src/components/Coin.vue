<template>
    <div class="coin-stage">
        <div class="game-title">
            <!-- 抛硬币 -->
            <h1>{{$t('coinflip_name')}}</h1>
        </div>

        <div class="guess">
            <div>
                <a class="coin" href="javascript:;" v-for="(dir,index) in dirs" :key="index" :class="[dir, {active: dir === idir}]" @click="active(index)"></a>
            </div>
            <!-- 选择硬币的一面来进行投注 -->
            <div class="comment">{{$t('game_comment_coinflip')}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Coin',

    data() {
        return {
            // 硬币的方向/朝向，默认空, 用于控制界面显示
            idir: '',
            dirs: ['front', 'back'],

            // 下注数据，用于完成下注交易
            betMask: [0, 0],
            modulo: 2
        }
    },

    created() {
        this.active(0)
    },

    methods: {
        active(index) {
            this.setBetMask(index)

            let { modulo, dirs, betMask } = this
            this.idir = dirs[index]
            // console.log('select', { betMask: String(betMask), modulo })
            this.$emit('select', { betMask, modulo })
        },

        setBetMask(index) {
            let betMask = [0, 0]
            betMask[1 - index] = 1
            this.betMask = betMask
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
        width: 105px;
        height: 97px;
        background-size: 100% 100%;
    }
    h1 {
        font-size: 18px;
        font-weight: 400;
    }
}
.coin {
    display: inline-block;
    width: 80px;
    height: 80px;
    opacity: 0.3;
    transition: opacity 0.4s ease-in-out;

    &.active {
        opacity: 1;
    }

    &.front {
        margin-right: 2.5em;
        background: url(../assets/img/front.png) no-repeat center/35% auto, url(../assets/img/bg-coin.png) no-repeat center/contain;
    }

    &.back {
        background: url(../assets/img/back.png) no-repeat center/35% auto, url(../assets/img/bg-coin.png) no-repeat center/contain;
    }
}
.guess {
    margin: 20px auto 40px;
}
.comment {
    color: #fff;
    font-size: 14px;
    margin-top: 20px;
}
</style>

