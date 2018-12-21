export default {
    percent(a, b) {
        if (!b) return 0
        return (a / b) * 100 | 0
    },

    fixed: (value, n = 2) => {
        value = Number(value)
        if (value === 0 || isNaN(value)) {
            return 0
        }

        let s = String(value)
        if (s.substring(s.lastIndexOf('.') + 1).length <= n) {
            return value
        }

        return value.toFixed(n)
    },

    format(value, start = 8, cut = 30, pad = '******') {
        let arr = String(value).split('')
        arr.splice(start, cut, pad)
        return arr.join('')
    },

    wei2eth(value) {
        return value / 1e18
    },

    eth2wei(value) {
        return value * 1e18
    },

    address(value) {
        if (!value || value.length !== 42 || !value.startsWith('0x')) {
            value = '0x0000000000000000000000000000000000000000'
        }
        return value.toLowerCase()
    },

    lower(value) {
        return String(value).toLowerCase()
    },

    upper(value) {
        return String(value).toUpperCase()
    },

    pickError(value) {
        value = String(value)

        let index = value.lastIndexOf(':')

        if (index < 0 || !/(metamask|jsonrpc)/i.test(value.toLowerCase())) {
            return value
        }

        return value.substring(index + 1)
    }
}
