<template>
    <div class="etheroll-stage">
        <div class="game-title">
            <!-- 过山车 -->
            <h1>{{$t('etheroll_name')}}</h1>
        </div>

        <div class="guess">
            <div>
                <vue-slider class="slider" v-model="value" v-bind="slider">
                    <template slot="label" slot-scope="{ label, active }">
                        <span :class="['custom-label', { active }]" v-if="[1,25,50,75,97].includes(label)">
                            {{ label + '%' }}
                        </span>
                    </template>
                </vue-slider>
            </div>
            <!-- 调整您的胜率 -->
            <div class="comment">{{$t('game_comment_etheroll')}}</div>
        </div>
    </div>
</template>

<script>
import VueSlider from 'vue-slider-component'

export default {
    name: 'Roll',

    components: { VueSlider },

    data() {
        return {
            value: 0,
            slider: {
                debug: true,
                width: '90%',
                height: 16,
                dotSize: 24,
                min: 1,
                max: 97,
                interval: 1,
                startAnimation: true,
                show: true,
                tooltipMerge: false,
                realTime: true,
                bgStyle: { backgroundColor: '#fff' },
                processStyle: {
                    background: 'linear-gradient(to bottom, #e7bba3, #e7bba3)'
                },
                sliderStyle: {
                    background:
                        '#cea790 url(/icon-slider.png) no-repeat center/100%'
                },
                piecewiseLabel: true,
                tooltip: false
            },

            betMask: [],
            modulo: 100
        }
    },

    created() {
        this.active(51)
    },

    watch: {
        value(value, old) {
            if (!old) return
            this.sendData()
        }
    },

    methods: {
        active(p) {
            this.value = p
            this.sendData()
        },

        sendData() {
            const { modulo, value: betMask } = this
            this.$emit('select', { betMask, modulo })
        }
    }
}
</script>

<style lang="scss">
.etheroll-stage {
    .game-title {
        display: none;
        &::before {
            content: '';
            display: block;
            margin: 0 auto;
            width: 101px;
            height: 104px;
            background-size: auto 100%;
        }
        h1 {
            font-size: 18px;
            font-weight: 400;
        }
    }
    .guess {
        margin: 45px auto 40px;
        > div:first-child {
            display: flex;
            margin: 0 auto;
            justify-content: flex-start;
            align-items: center;
            flex-wrap: wrap;
        }
    }
    .comment {
        color: #fff;
        font-size: 14px;
        margin-top: 35px;
    }

    .slider {
        padding: 0 0 0 0 !important;
        margin: 0 auto 35px !important;
    }
    .vue-slider {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.6);
    }
    .custom-label {
        position: absolute;
        top: 25px;
        left: 0;
    }
    .custom-label::after {
        content: '';
        position: absolute;
        top: -10px;
        left: 50%;
        transform: translate(-50%, 5px);
        width: 1px;
        height: 6px;
        border-radius: 2px;
        background-color: #fff;
    }
    .custom-label.active {
        color: #fff;
    }
    .custom-label.active::after {
        background-color: #fff;
        width: 2px;
    }
    .vue-slider-piecewise-item:last-child .custom-label {
        left: auto;
        right: -0.5em !important;
    }
}
</style>

