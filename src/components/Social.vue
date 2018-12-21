<template>
    <div class="share">
        <a href="javascript:;" class="social weixin" @mouseover="showQrcode" @mouseout="hideQrcode" @click.stop="showQrcode" @touchend.stop>
            <img v-show="show" src="../assets/img/qrcode-weixin.png">
        </a>
        <a href="https://t.me/joinchat/IiFS9wy4VDQpB8uCQ9Fiug" class="social telegram" target="_blank"></a>
        <a href="javascript:;" class="social twitter" @click="setMailShow">
            <span ref="mail" v-if="this.showMail" @click.stop="selectMail">{{mail}}</span>
        </a>
    </div>
</template>

<script>
export default {
    name: 'Share',

    data() {
        return {
            show: false,
            showMail: false,
            mail: 'admin@luck.cafe'
        }
    },

    mounted() {
        document.addEventListener('touchend', this.hideQrcode.bind(this), false)
    },

    methods: {
        showQrcode() {
            this.show = true
        },

        hideQrcode() {
            this.show = false
        },

        setMailShow() {
            this.showMail = !this.showMail
        },

        selectMail() {
            let selection = window.getSelection(),
                el = this.$refs.mail
            selection.setBaseAndExtent(el, 0, el, 1)
        }
    }
}
</script>

<style lang="scss" scoped>
.share {
    margin: 20px auto;
    text-align: center;
}

.social {
    display: inline-block;
    position: relative;
    z-index: 2;
    margin: 2em;
    width: 40px;
    height: 40px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 40px auto;
    cursor: pointer;
    transition: all 0.2s ease-in;

    &.telegram {
        background-size: 34px auto;
    }

    &.twitter {
        background-size: 38px auto;
        span {
            position: absolute;
            top: -1.8em;
            left: 0;
            padding: 2px 10px;
            border-radius: 3px;
            background-color: rgba(#fff, 0.8);
        }
    }

    &:hover {
        opacity: 0.8;
    }
}

.social img {
    width: 150px;
    height: 150px;
    position: absolute;
    bottom: 50px;
    left: 50%;
    margin-left: -75px;
}

.telegram {
    background-image: url(../assets/img/telegram.png);
}

.twitter {
    background-image: url(../assets/img/twitter.png);
}

.weixin {
    background-image: url(../assets/img/weixin.png);
}
</style>

