<template>
    <div class="locale-selector">
        <div class="links">
            <a href="javascript:;" @click="gotoQuestions">{{$t('faq')}}</a>
            <a class="link-metamask" href="https://metamask.io/" target="_blank">METAMASK</a>
            <a :href="contractUrl" v-if="config.contract.address" target="_blank">CONTRACT</a>
        </div>
        <div class="current" @click.stop="selectlocale" @touchend.stop>
            <span class="flag" :class="'flag-'+defaultLocale.flag"></span>
            <span class="locale">{{defaultLocale.display}}</span>
            <span class="icon iconfont" v-html="arrow"></span>
            <ul :class="{hidden: !expand || hideList}">
                <li v-for="(lang, index) in locales" :key="index" @click.stop="setlocale(lang.flag)">
                    <span class="flag" :class="'flag-'+lang.flag"></span>
                    <span class="locale">{{lang.display}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'LocaleSelector',

    props: ['hideList'],

    data() {
        return {
            expand: false, // 是否展开
            arrow: '&#xf0124;', // 箭头图标
            locales: [
                { flag: 'en', display: 'English' },
                { flag: 'zh-CN', display: '繁體中文' },
            ]
        }
    },

    created() {
        this.initLocale()
    },

    watch: {
        expand(expand) {
            this.arrow = (expand && '&#xf0122;') || '&#xf0124;'
        },

        hideList(cur) {
            if (cur) {
                this.expand = false
            }
        },

        locale: {
            handler: 'setHTMLTitle',
            immediate: true
        }
    },

    computed: {
        ...mapState(['locale', 'config', 'currentGame', 'rid']),

        defaultLocale() {
            const locale = this.locales.find(item => item.flag === this.locale)
            this.$t.locale = locale.flag || this.locale
            return locale
        },

        contractUrl() {
            const { ethhost, contract } = this.config
            return `https://${ethhost}etherscan.io/address/${contract.address}`
        }
    },

    methods: {
        initLocale() {
            const { cookie } = this
            const { storage } = this.$core
            const locale = cookie.get('locale')

            if (locale) {
                console.log('local/cookie cached locale:', locale)
                this.$store.dispatch('setLocale', { locale, cookie, storage })
            }
        },

        selectlocale() {
            this.expand = !this.expand
        },

        setlocale(locale) {
            const { cookie } = this
            const { storage } = this.core

            this.expand = false
            this.$store.dispatch('setLocale', { locale, cookie, storage })
        },

        gotoQuestions() {
            let query = { rid: this.rid }
            this.$router.push({ name: 'question', query })
        },

        setHTMLTitle() {
            this.$nextTick(() => {
                const title = this.$t('html_title')
                const currentGame = this.currentGame.replace(/^(\w)/, (m, char) => char.toUpperCase())
                document.title = `${currentGame} - ${title}`
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.locale-selector {
    position: relative;
    z-index: 2;
    display: inline-block;
    > div {
        display: inline-block;
    }
}
.links {
    margin-right: 10px;
    a {
        color: #d7ab93;
        margin: 0 5px;
        padding: 3px 6px 2px;
        border: 1px solid #d7ab93;
        border-radius: 2px;
        font-size: 12px;
        &:hover {
            background-color: #d7ab93;
            color: #fff;
        }
        transition: all 0.2s ease-in;
    }
}
.current {
    height: 70px;
    line-height: 70px;
    cursor: pointer;
}
span {
    display: inline-block;
    vertical-align: middle;
}
.locale {
    margin: 0 15px;
    font-size: 16px;
}
.iconfont {
    font-size: 12px;
    transform: scale(0.8, 0.8);
}
.flag {
    width: 26px;
    height: 26px;
    background: url(../assets/img/sprite-flag.png) no-repeat;
    background-size: 100%;
    &.flag-en {
        background-position: 0 0;
    }
    &.flag-zh-CN {
        background-position: 0 -78px;
    }
    &.flag-jp {
        background-position: 0 -26px;
    }
    &.flag-kr {
        background-position: 0 -52px;
    }
    &.flag-ru {
        background-position: 0 -130px;
    }
}
ul {
    position: absolute;
    margin: 0;
    padding: 25px;
    min-width: 160px;
    background: rgba(#221e1c, 0.7);
    border-radius: 10px;
    text-align: left;
    li {
        white-space: nowrap;
        margin-bottom: 15px;
        line-height: normal;
        &:last-child {
            margin: 0;
        }
        cursor: pointer;
        &:hover {
            color: #d7ab93;
        }
    }
    span {
        font-size: 14px;
    }
}
@media screen and (max-width: 625px) {
    ul {
        right: 0;
        min-width: 120px;
    }
}
</style>

