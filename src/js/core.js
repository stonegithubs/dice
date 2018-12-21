import Vue from 'vue'

// js 浮点数计算
import { add, sub, mul, div, round } from 'calculatorjs'

Vue.use({
    install: Vue => {
        Vue.prototype.calc = { add, sub, mul, div, round }
    }
})

// cookie
import Cookie from 'js-cookie'

Vue.use({
    install(Vue) {
        Vue.prototype.cookie = Cookie
    }
})

export default {
    install(Vue, options = {}) {
        Vue.prototype.core = Vue.prototype.$core = this
        this.options = options
    },

    // 生成区间随机数
    random(min, max) {
        if (max == null) {
            max = min
            min = 0
        }
        return min + Math.floor(Math.random() * (max - min + 1))
    },

    // 字节数组转十六进制字符串
    bytes2hex(arr) {
        return arr.reduce((acc, cur) => acc + toHex(cur), '0x')

        function toHex(n) {
            let hex = n.toString(16)
            return hex.length === 1 ? `0${hex}` : hex
        }
    },

    // 生成指定初始值及长度的数组
    genArray(n = 0, defaultValue = 0) {
        return [].fill.call(Array(+n || 0), defaultValue)
    },

    // 时间戳转日期
    getDate(timestamp) {
        const date = new Date(timestamp * 1000)
        const parsed = date.toLocaleString('zh-CN', {
            hour12: false,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
        return parsed.replace(/\//g, '-')
    },

    // @params $route对象
    getParams({ query }) {
        let { rid: rid1 } = query
        let rid2 = location.search.substring(1).split('&').reduce(
            (acc, cur) => {
                let [key, value] = cur.split('=')
                return key === 'rid' && value.trim() || acc
            },
            0
        )

        return rid1 || rid2 || 0
    },

    getTrxLink(bet_tx, ethhost = '') {
        return `https://${ethhost}etherscan.io/tx/${bet_tx}`
    },

    getTicket({ http, baseApiUrl, defaultAccount }, fn) {
        http.jsonp(`${baseApiUrl}/api/ticket?gambler=${defaultAccount}`).then(res => {
            const { CommitLastBlock, Commit, R, S, code } = res.data
            fn({ CommitLastBlock, Commit, R, S, code })
        })
    },

    getContractInfo({ http, baseApiUrl }, fn) {
        const { env } = this.options
        let promise

        switch (true) {
            case env.DEV:
            case env.PROD:
            case env.TEST:
            default:
                promise = http.jsonp(`${baseApiUrl}/api/contract`)
        }

        promise.then(res => {
            const { abi, contract: address } = res.data
            fn({ abi, address })
        })
    },

    // 根据 betMask 获取用户选择的位置
    getHitPos(betMask, modulo) {
        betMask = Number(betMask)
        // 过山车直接显示
        if (modulo === 100) {
            return ['&lt;', betMask]
        }

        let mask = betMask.toString(2).split('')

        // 不足补位
        while (mask.length < modulo) {
            mask.unshift('0')
        }

        let maskWithPos = mask
            .reverse()
            .reduce((acc, cur, index) => { return cur > 0 ? acc.concat(index + 1) : acc }, [])

        // dice2
        if (modulo === 36) {
            // console.log('getHitPos/36', betMask, maskWithPos, this.getDice2MaskMap()[16])
            let uniqueMap = {}
            maskWithPos = maskWithPos.map(pos => {
                let tmp = this.getDice2MaskMap()[pos - 1]
                let splitNum = String(tmp).split('')
                return Number(splitNum[0]) + Number(splitNum[1])
            }).filter(item => {
                if (uniqueMap[item]) return false
                uniqueMap[item] = 1
                return true
            })
        }
        return maskWithPos.sort((a, b) => Number(a) - Number(b))
    },

    // 获取 Dice2 MaskMap
    getDice2MaskMap() {
        // [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
        // 2: [1,1]
        // 3: [1,2], [2,1]
        // 4: [1,3], [2,2], [3,1]
        // 5: [1,4], [2,3], [3,2], [4,1]
        // 6: [1,5], [2,4], [3,3], [4,2], [5,1]
        // 7: [1,6], [2,5], [3,4], [4,3], [5,2], [6,1]
        // 8: [1,7]x, [2,6], [3,5], [4,4], [5,3], [6,2], [7,1]x
        // n: index = x % (n-1)
        let mask = []
        for (let i = 1; i <= 6; i++) {
            for (let j = 1; j <= 6; j++) {
                mask.push(`${i}${j}`)
            }
        }
        // console.log('getMaskMap', mask.length, mask)
        return mask
    },

    getResultPosByMod(sha3_mod_n, modulo) {
        const mask = this.getHitPos(Math.pow(2, Number(sha3_mod_n)), modulo)

        // console.log('getResultPosByMod', mask[0])
        return mask[0]
    },

    // 使用commit决定选用哪个组合
    getModResult(sha3_mod_n, modulo, commit) {
        // 过山车 easy
        if (modulo === 100) {
            return sha3_mod_n
        }

        const resultPos = this.getResultPosByMod(sha3_mod_n, modulo)

        // Dice2
        if (modulo === 36) {
            let possibleIntegers = this.getPossibleIntegers(resultPos)

            let mod = commit % possibleIntegers.length
            let tmpNum = String(possibleIntegers[mod]).split('')
            return `${tmpNum[0]}+${tmpNum[1]}`
        }

        return resultPos
    },

    // 仅支持 Dice2 游戏
    getModResultArray(sha3_mod_n, commit) {
        let sModResult = this.getModResult(sha3_mod_n, 36, commit)
        let aModResult = sModResult.split('+')
        return aModResult
    },

    // 获取某数字可能的相加组合
    getPossibleIntegers(integer) {
        let i = 0
        let j = 0
        let result = []
        while (i++ < 6) {
            j = integer - i
            if (j > 6 || j < 1) continue
            result.push(`${i}${j}`)
        }
        // console.log('possibleIntegers', integer, result)
        return result
    },

    setUserResultClass(vm, currentGame) {
        vm.userClass = `user-${currentGame}`
        vm.resultClass = `result-${currentGame}`
        if (currentGame === 'dice2') {
            vm.resultClass = 'result-dice'
        }
    },

    // 显示统计项介绍
    showStatInfo(index, e) {
        let em = e.currentTarget
        let offset = em.getBoundingClientRect()
        this.infoText = this.getInfo(index).replace('[total]', this.total).replace('[elements]', this.infoTextElements || '')
        this.position.display = 'block'
        this.$nextTick(() => {
            let infoPanelOffset = this.$refs.em.getBoundingClientRect()
            this.position.left =
                offset.left - infoPanelOffset.width - 10 + 'px'
            let el = document.scrollingElement || document.documentElement // ios fix
            this.position.top =
                (offset.y + el.scrollTop - 4) + 'px'
        })
    },

    // 隐藏统计项介绍
    hideStatInfo() {
        this.position.display = 'none'
    },

    // 获取当前时间的 UTC 时间戳(ms)
    getNowUTCTime() {
        var d = new Date()
        return new Date(d.getTime() + d.getTimezoneOffset() * 60000)
    },

    // 日志打印
    _log(method, args) {
        const { env } = this.options
        // support: log, info, error
        if (env.DEV) {
            return console[method].apply(console, args)
        }
    },

    log(...args) {
        return this._log.call(this, 'log', args)
    },

    info(...args) {
        return this._log.call(this, 'info', args)
    },

    error(...args) {
        return this._log.call(this, 'error', args)
    },

    storage: {
        save(key, value) {
            localStorage.setItem(key, JSON.stringify(value))
        },

        get(key) {
            return JSON.parse(localStorage.getItem(key))
        },

        remove(key) {
            localStorage.removeItem(key)
        }
    }
}
