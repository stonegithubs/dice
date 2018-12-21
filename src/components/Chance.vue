<template>
    <div class="chance">
        <!-- 获胜机会 -->
        <div class="win-chance">
            <div class="title">{{$t('chance_win')}}</div>
            <div class="content">
                <em>{{winChance}}%</em>
            </div>
        </div>

        <!-- 赢得投注 -->
        <div class="win-bet">
            <div class="title">{{$t('chance_win_bet')}}</div>
            <div class="content">
                <em>{{winTimes}}X</em>
            </div>
            <div class="warn">{{$t('win_bet_n', {n: winAmount})}}</div>
            <div class="comment" v-if="bet < 0.1">{{fee}}%{{$t('fee')}}</div>
            <div class="comment" v-else>{{fee}}%{{$t('fee')}}，0.001{{$t('jackpot_fee')}}</div>
        </div>

        <!-- 大奖 -->
        <div class="win-prize">
            <div class="title">{{$t('jackpot_include')}}</div>
            <div class="content">
                <em>{{tweenedJackpotSize}}</em>
                <span class="unit">{{$t('ether')}}</span>
            </div>
            <div class="warn" v-if="bet < 0.1">{{$t('hit_condition')}}</div>
            <div class="warn" v-else>{{$t('chance_jackpot')}}</div>
            <div class="comment" v-html="$t('jackpot_notice')"></div>
        </div>
        <div></div>
    </div>
</template>

<script>
import TWEEN from '@tweenjs/tween.js'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            tweenedJackpotSize: 0
        }
    },

    created() { },

    computed: {
        ...mapState([
            'bet',
            'winChance',
            'winTimes',
            'winAmount',
            'jackpotSize',
            'config'
        ]),

        fee() {
            const { bet } = this
            const { div, mul } = this.calc
            const { MIN_HOUSE_FEE, HOUSE_EDGE_PERCENT } = this.config

            if (!bet) return HOUSE_EDGE_PERCENT

            let houseFee = mul(MIN_HOUSE_FEE, 100)

            if (bet < houseFee) {
                let _fee = mul(div(MIN_HOUSE_FEE, bet), 100)
                if (String(_fee).indexOf('.') > 0) {
                    _fee = _fee.toFixed(2)
                }
                return _fee
            }

            return HOUSE_EDGE_PERCENT
        }
    },

    watch: {
        jackpotSize(jackpotSize, old) {
            jackpotSize = Number(jackpotSize)
            old = Number(old)
            this.tweenJackpotSize(old, jackpotSize)
        }
    },

    methods: {
        tweenJackpotSize(from = 0, to = 0) {
            const tween = new TWEEN.Tween({ value: from })
                .to({ value: to }, 4000)
                .easing(TWEEN.Easing.Quadratic.Out)
                .onUpdate(object => this.tweenedJackpotSize = object.value.toFixed(3))
                .onComplete(() => cancelAnimationFrame(animate))

            tween.start()

            animate()

            function animate() {
                requestAnimationFrame(animate)
                TWEEN.update()
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.chance {
    width: 260px;
    padding: 0 0 10px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: center;
    font-size: 14px;

    .title {
        font-size: 12px;
        margin-bottom: 5px;
    }
    .content {
        font-size: 22px;
        margin-bottom: 8px;
        em {
            vertical-align: middle;
        }
    }
    .warn {
        color: #e6baa2;
    }
    .unit {
        font-size: 12px;
        vertical-align: bottom;
        line-height: 1.5;
        margin-left: 3px;
    }
    .comment {
        color: rgba(#fff, 0.5);
    }
    .win-bet,
    .win-prize {
        .content {
            line-height: 1;
        }
        .content::before {
            content: "";
            display: inline-block;
            width: 1em;
            height: 1em;
            margin-right: 5px;
            vertical-align: top;
            background-size: contain;
        }
        .warn {
            margin-bottom: 5px;
            font-size: 12px;
        }
    }
    .win-bet .content::before {
        display: none;
    }
    .win-prize .content::before {
        background-image: url(../assets/img/icon-back.png);
    }
}
</style>

