<template>
    <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <div class="mask" v-if="show">
            <div class="modal">
                <div class="modal-header text-center" v-if="title">
                    <slot name="header text-center">{{title}}</slot>
                </div>
                <div class="modal-body">
                    <a class="icon iconfont modal-close text-white" v-if="!noClose" href="javascript:;" @click="cancel">&#xf012a;</a>
                    <slot>Hello TripleKill</slot>
                </div>
                <div class="modal-footer text-center" v-if="!noButton">
                    <slot name="footer">
                        <a href="javascript:;" class="btn fck" @click="ok" :disabled="waiting">{{modalButtonText}}</a>
                    </slot>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
/**
 * 支持配置title，及自定义头部
 * 支持配置富文本弹窗主体内容
 * 支持配置footer及自定义弹窗底部
 * 支持获取用户点击的按钮
 * 支持点击蒙层关闭弹窗
 * 支持ESC键关闭弹窗
 * 支持异步确认
 * */
export default {
    name: 'Modal',

    data() {
        return {
            waiting: false,
            beforeClose: (options, done) => done()
        }
    },

    props: ['value', 'title', 'buttonText', 'noButton', 'noClose'],

    computed: {
        show() {
            return this.value
        },

        modalButtonText() {
            return this.buttonText || 'ok'
        }
    },

    mounted() {
        let listener = this.$listeners['close']
        if (listener) {
            this.beforeClose = listener
        }

        if (this.show) {
            this.bindKeyup('add')
        }
    },

    watch: {
        value() {
            this.bindKeyup((this.value && 'add') || 'remove')
        }
    },

    methods: {
        bindKeyup(type) {
            document[`${type}EventListener`]('keyup', this.cancel, false)
        },

        ok() {
            if (this.waiting) return
            this.$emit('ok')
            this.close({ ok: 1 })
        },

        cancel(e) {
            if (this.waiting || (e.type === 'keyup' && e.keyCode !== 27)) return
            this.$emit('cancel')
            this.close({ cancel: 1 })
        },

        close({ ok, cancel }) {
            this.waiting = true
            setTimeout(() => (this.waiting = false), 2000)
            let close = () => {
                this.waiting = false
                this.$emit('input', false)
            }
            this.beforeClose({ ok, cancel }, close)
        }
    }
}
</script>

<style lang="scss" scoped>
.animated {
    animation-duration: 0.3s;
}
.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.78);
    display: flex;
    justify-content: center;
    align-items: center;

    .modal {
        position: relative;
        width: 80%;
        max-width: 500px;
        padding: 45px;
        background-color: rgba(#efcab4, 0.8);
        border-radius: 10px;
    }

    .modal-header {
        color: #d01d50;
        font-size: 22px;
    }
    .modal-body {
        padding: 25px 0;
        font-size: 16px;
        color: rgba(255, 255, 255, 0.78);
    }
    .modal-close {
        position: absolute;
        top: 25px;
        right: 25px;
    }
    .btn {
        display: block;
        margin-right: 0;
        text-transform: uppercase;
    }
}
</style>
