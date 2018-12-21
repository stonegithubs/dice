<template>
    <div id="app">
        <dice2-header class="dice2-header"></dice2-header>
        <div class="wrap notice text-center" v-if="notInCobo" v-html="$t('cobo_notice')"></div>
        <bear-nav v-if="$route.name !== 'question'"></bear-nav>
        <router-view></router-view>
        <dice2-footer class="dice2-footer"></dice2-footer>

        <div class="mask maserati" v-if="maserati && !closed">
            <div class="activity">
                <!-- <div class="slogan" v-html="$t('maserati_slogan')"></div> -->
                <a href="javascript:;" class="close" @click="closeMaserati"></a>

                <!-- <div class="content">
                    <div class="time">{{$t('maserati_time')}}</div>
                    <div class="final" v-html="$t('maserati_final_prize', {count: 1})"></div>
                    <ul class="prize">
                        <li v-html="$t('maserati_prizes[0]', {amount: 1, count: 2})"></li>
                        <li v-html="$t('maserati_prizes[1]', {amount: 1, count: 2})"></li>
                        <li v-html="$t('maserati_prizes[2]', {amount: 1, count: 2})"></li>
                    </ul>
                    <div class="text" v-html="$t('maserati_join')"></div>
                    <div class="text" v-html="$t('maserati_lucky')"></div>
                    <div class="copyright">{{$t('maserati_copyright')}}</div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import Dice2Header from '@/components/Header.vue'
import Home from '@/views/Home.vue'
import Dice2Footer from '@/components/Footer.vue'
import BearNav from '@/components/BearNav'

export default {
    name: 'App',

    components: { Dice2Header, BearNav, Home, Dice2Footer },

    data() {
        return {
            maserati: true
        }
    },

    created() { },

    computed: {
        ...mapState(['currentGame', 'config', 'locale']),

        notInCobo() {
            return !navigator.userAgent.toLowerCase().includes('cobo')
        },

        slogan() {
            return this.locale === 'zh-CN' ? '/maserati/maserati-slogan.png' : '/maserati/maserati-slogan-en.png'
        },

        // 是否关闭了
        closed() {
            return sessionStorage.getItem('maserati')
        }
    },

    watch: {
        currentGame: {
            handler: 'setPageTitle',
            immediate: true
        },
    },

    methods: {
        setPageTitle() {
            const title = this.$t('html_title')
            const currentGame = this.currentGame.replace(/^(\w)/, (m, char) =>
                char.toUpperCase()
            )
            document.title = `${currentGame} - ${title}`
        },

        closeMaserati() {
            this.maserati = false
            sessionStorage.setItem('maserati', true)
        }
    }
}
</script>

<style lang="scss">
::selection {
    color: #fff;
    background-color: rgba(#a38375, 0.4);
    opacity: 1;
}

.notice {
    padding-top: 20px;
}

#app {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

.maserati {
    background-color: rgba(#000, 0.8) !important;
    font-size: 12px;

    .slogan {
        position: absolute;
        left: 100px;
        top: -90px;
        font-size: 62px;
        font-weight: 700;
        line-height: 1.1;
        transform: rotate(-16deg);
        text-shadow: 0 -4px 0 lighten(#aeaeae, 10);
        background: linear-gradient(to top, rgba(#000, 0.5), rgba(#000, 0.2));
        -webkit-background-clip: text;
        color: transparent;
        user-select: none;
    }

    .close {
        position: absolute;
        right: 10px;
        top: 10px;
        transform: translate(-50%, calc(-50%));
        width: 56px;
        height: 56px;
        background: url(./assets/img/coffee/close.png) no-repeat;

        &:hover {
            opacity: 0.6;
            font-size: 50px;
        }
    }

    .content {
        padding: 50px 0 0 120px;
    }

    .time {
        text-align: center;
        text-indent: -230px;
        font-size: 12px;
    }

    .final {
        margin: 40px 0;
        .car {
            display: inline-block;
            width: 1em;
            height: 1.2em;
            margin: 0 5px;
            vertical-align: middle;
            background: url(./assets/img/maserati.png) no-repeat;
            background-size: contain;
        }
    }

    li {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: left;

        em:first-child {
            width: 260px;
        }
        em:last-child {
            flex-grow: 1;
            color: #a89f97;
        }
    }

    .text {
        width: 370px;
        margin: 2em 0;
    }

    .copyright {
        position: absolute;
        bottom: 80px;
        width: 100%;
        color: #a89f97;
        text-align: center;
        text-indent: -400px;
        font-size: 12px;
    }
}

// 弹窗背景
.activity {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, calc(-50%));
    width: 570px;
    height: 646px;
    background: url(./assets/img/coffee/coffee.png) no-repeat;
}

@media screen and (max-width: 1000px) {
    .maserati {
        .slogan {
            position: absolute;
            left: 20px;
            top: 20px;
            font-size: 22px;
            font-weight: 500;
            transform: rotate(0);
        }

        .final {
            margin: 20px 0 10px;
        }

        .close {
            position: absolute;
            right: 20%;
            top: 30%;
            background-position-x: right;
            background-position-y: top;
            background-size: 50%;
        }

        .time {
            text-align: center;
            text-indent: 0;
            font-size: 12px;
        }

        .content {
            padding: 90px 15px 0 15px !important;
        }

        li {
            em:first-child {
                width: 85%;
            }
            em:last-child {
                flex-grow: 1;
                color: #a89f97;
            }
        }

        .text {
            width: 95%;
            margin: 15px 0;
        }

        .copyright {
            position: static;
            width: 100%;
            text-indent: 0;
        }
    }
    
    .activity {
        display: inline;
        background-position-x: center;
        background-position-y: center;
        background-size: 50%;
    }
}

@media (max-width: 1632px) {
    .wrap {
        width: 98% !important;
    }
}
@media (max-width: 1035px) and (min-width: 625px) {
    .home .wrap {
        justify-content: flex-start !important;
    }
}
@media (max-width: 625px) {
    .dice2-header .wrap {
        display: block;
        height: auto;
        padding: 10px 0;
    }
    .logo {
        justify-content: center;
        padding: 0 0 10px;
    }
    .link-metamask {
        display: none;
    }
    .locale-selector {
        display: flex !important;
        justify-content: center;
        align-items: center;
        ul {
            padding: 10px;
        }
        .locale {
            font-size: 12px !important;
            margin: 0 5px;
        }
        .current {
            height: 30px;
            line-height: 30px;
        }
        .current > .locale {
            display: none !important;
        }
    }
    .guess {
        margin: 20px auto !important;
    }
    .links a {
        margin: 0 3px 0 0 !important;
        padding: 3px 3px 2px;
    }
    .home .wrap > div {
        width: 90% !important;
        margin: 0 auto !important;
    }
    .win-bet {
        padding: 20px 0;
    }
    .share {
        margin: 10px auto 50px !important;
    }
    .social {
        margin: 1em !important;
    }
    .history {
        .item .prize {
            display: none !important;
        }
    }
}
</style>
