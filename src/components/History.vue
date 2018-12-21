<template>
    <div class="history">
        <div>
            <div class="datastat">
                <data-stat :histories="histories"></data-stat>
            </div>
            <div class="top">
                <div class="title">
                    <span>{{$t('game_history')}}</span>
                    <div class="more">
                        <a href="javascript:;" class="jackpot-history" :class="{active: onlyJackpot}" @click="showJackpotHistory">{{$t('jackpot_history')}}</a>
                        <a href="javascript:;" class="my-history" :class="{active: onlyMine}" @click="showMyHistories">{{$t('only_mine')}}</a>
                        <a href="javascript:;" class="my-stat" :class="{active: onlyMyStat}" @click="showMyStat">{{$t('stat_myStat')}}</a>
                    </div>
                </div>
                <ul class="thead">
                    <li>
                        <div class="item-jackpots" v-if="onlyJackpot">
                            <span class="addr">{{$t('game_player')}}</span>
                            <span class="result">{{$t('game_player_result')}}</span>
                        </div>
                        <div class="item" v-else-if="!onlyMyStat">
                            <span class="addr">{{$t('game_player')}}</span>
                            <span class="bet">{{$t('game_player_bet')}}</span>
                            <span class="result">{{$t('game_player_result')}}</span>
                            <span class="prize"></span>
                            <span class="icon"></span>
                        </div>
                    </li>
                </ul>
            </div>
            <div class="list">
                <!-- 获胜 为链接地址 -->
                <div class="tbody scroll" :class="['game-is-'+currentGame]">
                    <div class="no-record" v-if="loading">{{$t('data_loading')}}</div>
                    <jackpot-history-list v-else-if="onlyJackpot && jackpots.length" :jackpots="jackpots"></jackpot-history-list>
                    <game-history-list v-else-if="onlyHistory && histories.length" v-bind="{modulo, histories, mineText, userClass, resultClass, current, getUserHitOnClass}" @expand="expand"></game-history-list>
                    <game-history-list v-else-if="onlyMine && myHistories.length" v-bind="{modulo, histories:myHistories, mineText, userClass, resultClass, current, getUserHitOnClass}" @expand="expand"></game-history-list>
                    <my-stat v-else-if="onlyMyStat && myStats" v-bind="{modulo, myStats}"></my-stat>
                    <div v-else class="no-record">No Record</div>
                </div>
            </div>

            <!-- 账号余额 -->
            <div class="amount text-right">
                <span v-html="$t('account_balance', {n: formatedBalance})"></span>
            </div>
        </div>

        <modal v-model="Tips.show" :no-button="1" class="text-center">
            <span v-html="Tips.content"></span>
        </modal>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import DataStat from '@/components/DataStat.vue'
import JackpotHistoryList from '@/components/JackpotHistoryList.vue'
import GameHistoryList from '@/components/GameHistoryList.vue'
import MyStat from '@/components/MyStat.vue'

export default {
    name: 'History',

    components: { DataStat, JackpotHistoryList, GameHistoryList, MyStat },

    data() {
        return {
            loading: true,

            current: -1, // 当前点击查看的历史项

            userClass: '', // 用户投注 CSS 类

            resultClass: '', // 开奖结果 CSS 类

            maxId: 0, // 历史列表当前最大ID

            Tips: {
                show: false,
                content: 'Coming soon...'
            },

            onlyHistory: true,
            map: {}, // 存储所有历史数据，与 order 配合得出最终histories {id: history}
            order: [], // 存储排序
            balance: 0, // 余额

            // timer
            fetchTimer: null,
            loadingTimer: null,
            amountTimer: null,

            onlyMine: false, // 过滤仅显示我的历史
            gambler: '', // 我的账号地址，作为 server 接口请求的参数
            mineText: '',
            myOrder: [],

            request: null, // 当前请求对象，在需要的时候abort 掉，因为网络慢导致在一个游戏中轮询另一个游戏的历史数据

            // 大奖历史
            onlyJackpot: false,
            jackpots: [],

            // 统计
            _histories: [],
            onlyMyStat: false
        }
    },

    computed: {
        ...mapState([
            'config',
            'locale',
            'modulo',
            'currentGame',
            'defaultAccount',
            'supportGames',
            'isMetaMaskInstalled',
            'isMetaMaskUnlocked'
        ]),

        formatedBalance() {
            const balance = String(this.balance)
            const [, decimal] = balance.split('.')
            if (!decimal || decimal.length < 5) return balance
            return Number(balance).toFixed(3)
        },

        myStats() {
            const { myHistories } = this
            let [
                totalAmount,
                betTimes,
                avgWinChance,
                winTimes,
                maxAmount,
                maxWin
            ] = [
                    this.getTotalAmount(myHistories),
                    this.getBetTimes(myHistories),
                    this.getAvgWinChance(myHistories),
                    this.getWinTimes(myHistories),
                    this.getMaxAmount(myHistories),
                    this.getMaxWin(myHistories)
                ]
            return {
                totalAmount,
                betTimes,
                avgWinChance,
                winTimes,
                maxAmount,
                maxWin
            }
        },

        myHistories() {
            return this.myOrder.map(id => this.map[id])
        },

        histories() {
            const histories = this.order.map(id => this.map[id])
            if (this.onlyHistory) {
                this.$store.dispatch('setHistoryData', histories)
            }
            // console.log(JSON.stringify(histories[0], null, 4))
            return histories
        }
    },

    mounted() {
        const { currentGame } = this
        this.initHistory()
        this.setUserResultClass(currentGame)
        this.loopCheckAmount()
    },

    watch: {
        currentGame(currentGame) {
            this.setUserResultClass(currentGame)
            this.resetHistory()
        },

        modulo() {
            this.initHistory()
        },

        // 游戏历史
        onlyHistory(onlyHistory) {
            if (!onlyHistory) return
            this.order = []
            this.resetHistory()
            this.fetchHistoryList(true)
        },

        // 我的历史
        onlyMine(onlyMine) {
            this.gambler =
                ((onlyMine || this.onlyMyStat) && this.defaultAccount) || ''
            if (!onlyMine) return
            this.resetHistory()
            this.fetchMyHistoryList()
        },

        // 大奖历史
        onlyJackpot(onlyJackpot) {
            if (!onlyJackpot) return
            this.fetchJackpotList()
        },

        // 我的统计
        onlyMyStat(onlyMyStat) {
            this.gambler =
                ((onlyMyStat || this.onlyMine) && this.defaultAccount) || ''
            if (!onlyMyStat) return
            this.resetHistory()
            this.fetchMyStatList()
        },

        defaultAccount() {
            this.loopCheckAmount()
        },

        locale: {
            handler() {
                this.$nextTick(() => (this.mineText = this.$t('mine')))
            },
            immediate: true
        }
    },

    methods: {
        // 拉取游戏历史数据, 与拉取我的历史共享
        fetchHistoryList(initial = false) {
            const {
                modulo,
                fetchTimer,
                config,
                maxId,
                gambler,
                $http,
                onlyHistory,
                onlyMine,
                onlyMyStat
            } = this
            const { baseApiUrl, historyCount: n, checkHistoryInterval } = config

            clearTimeout(fetchTimer)

            // 不拉取游戏历史和我的历史，退出这个函数的执行
            if (!onlyHistory && !onlyMine && !onlyMyStat) return
            // console.log({onlyHistory, onlyMine})
            if (initial) {
                this.showLoading()
            }

            if (!modulo) {
                return loopNext(this, initial)
            }

            const pNumber = initial ? n : 10
            const pMaxId = initial ? maxId : maxId + 1
            const ag = ((onlyMine || onlyMyStat) && gambler) || ''
            const api = `${baseApiUrl}/api/history?number=${pNumber}&modulo=${modulo}&gambler=${ag}&id=${pMaxId}`
            this.request = $http.jsonp(api).then(
                res => {
                    this.processResData(res.data)
                    loopNext(this, false)
                },
                () => loopNext(this, initial)
            )

            function loopNext(vm, initial) {
                if (!vm.onlyHistory && !vm.onlyMine && !onlyMyStat) return
                // 轮询获取最新历史数据
                vm.fetchTimer = setTimeout(
                    vm.fetchHistoryList.bind(vm),
                    checkHistoryInterval,
                    initial
                )
            }
        },

        // 拉取我的历史数据
        fetchMyHistoryList() {
            this.fetchHistoryList(true)
        },

        // 拉取大奖历史数据
        fetchJackpotList() {
            const { $http, web3 } = this
            const { baseApiUrl } = this.config
            const api = `${baseApiUrl}/api/jackpotlog?number=99&id=0`

            clearTimeout(this.fetchTimer)
            this.showLoading()
            $http.jsonp(api).then(res => {
                const jackpots = res.data
                this.jackpots = jackpots
                    .filter(item => item.amount)
                    .map(item => {
                        return Object.assign({}, item, {
                            amount: web3.fromWei(item.amount, 'ether')
                        })
                    })
                this.hideLoading()
                // core.log('History/fetchJackpotList', this.jackpots)
            })
        },

        // 拉取我的统计数据
        fetchMyStatList() {
            this.fetchMyHistoryList()
        },

        // 总投入金额
        getTotalAmount(list) {
            return list.reduce((acc, cur) => acc + Number(cur.bet), 0)
        },

        // 下注次数
        getBetTimes(list) {
            return list.length
        },

        // 胜率
        getAvgWinChance(list) {
            let [winTimes, betTimes] = [
                this.getWinTimes(list),
                this.getBetTimes(list)
            ]
            return (((winTimes / betTimes) * 100) | 0) + '%'
        },

        // 赢钱次数
        getWinTimes(list) {
            return list.reduce((acc, cur) => acc + (cur.wins > 0 ? 1 : 0), 0)
        },

        // 最大投注额
        getMaxAmount(list) {
            return list.reduce(reducer, 0)

            function reducer(acc, cur) {
                let bet = Number(cur.bet)
                return Math.max(bet, acc)
            }
        },

        // 最高赢取
        getMaxWin(list) {
            return list.reduce(reducer, 0)

            function reducer(acc, cur) {
                let wins = cur.wins
                return Math.max(wins, acc)
            }
        },

        setUserResultClass(currentGame) {
            this.core.setUserResultClass(this, currentGame)
        },

        initHistory() {
            this.resetHistory()
            this.fetchHistoryList(true)
        },

        // 重置历史列表
        resetHistory() {
            clearTimeout(this.fetchTimer)
            this.current = -1
            this.maxId = 0
            // this.order = []
            this.myOrder = []
            try {
                this.request.abort()
            } catch (e) { } // eslint-disable-line
        },

        processResData(list) {
            const {
                core,
                modulo,
                defaultAccount,
                onlyHistory,
                onlyMine,
                onlyMyStat
            } = this
            let order = [],
                myOrder = []
                ; (list || [])
                    .filter(item => item.bet) // 过滤掉空对象
                    .map(item => {
                        let { gambler, bet_tx, sha3_mod_n, commit, bet_on } = item
                        let isMine =
                            String(defaultAccount).toLowerCase() ==
                            gambler.toLowerCase()
                        let postData = {
                            isMine,
                            gambler_short: gambler.substring(0, 8),
                            gamblerLink: this.getGamberLink(gambler),
                            bet: Number(item.bet),
                            wins: Number(item.wins),
                            swins: Number(item.wins),
                            jackpot: item.jackpot > -1 ? item.jackpot : '—',
                            trxLink: this.getTrxLink(bet_tx),
                            hit: core.getHitPos(bet_on, modulo),
                            result: core.getResultPosByMod(sha3_mod_n, modulo),
                            modResult: this.getModResult(sha3_mod_n, commit),
                            modResultArray: this.getModResultArray(
                                sha3_mod_n,
                                commit
                            )
                        }

                        // 将处理后的数据项merge到原数据对象,更新本地数据
                        this.map[item.id] = Object.assign({}, item, postData)

                        // 更新排序
                        if (onlyHistory) {
                            if (!order.includes(item.id)) order.push(item.id)
                        }
                        if (onlyMine || onlyMyStat) {
                            if (!myOrder.includes(item.id)) myOrder.push(item.id)
                        }

                        // 记录最大 ID
                        if (item.id > this.maxId) {
                            this.maxId = item.id
                        }
                    })

            // 将新获取到的数据更新到列表
            this.hideLoading()
            this.order = order.concat(this.order)
            this.myOrder = myOrder.concat(this.myOrder)
        },

        getGamberLink(gambler) {
            const { ethhost } = this.config
            return `https://${ethhost}etherscan.io/address/${gambler}`
        },

        getTrxLink(bet_tx) {
            const { ethhost } = this.config
            this.core.getTrxLink(bet_tx, ethhost)
        },

        getModResult(sha3_mod_n, commit) {
            const { modulo, core } = this
            return core.getModResult(sha3_mod_n, modulo, commit)
        },

        getModResultArray(sha3_mod_n, commit) {
            const { core } = this
            return core.getModResultArray(sha3_mod_n, commit)
        },

        // 返回用户选择每个位置的 CSS 类
        getUserHitOnClass(on, two) {
            const { currentGame } = this
            const coin = ['', 'front', 'back']
            const dice = ['', 'one', 'two', 'three', 'four', 'five', 'six']
            const dice2 = [
                '',
                'one',
                'two',
                'three',
                'four',
                'five',
                'six',
                'seven',
                'eight',
                'nine',
                'ten',
                'eleven',
                'twelve'
            ]
            const roll = []
            let mapping = { coin, dice, dice2: two ? dice : dice2, roll }
            return mapping[currentGame][on]
        },

        showLoading() {
            this.loading = true
        },

        hideLoading() {
            this.loading = false
            clearTimeout(this.loadingTimer)
        },

        expand(index) {
            if (this.current === index) return (this.current = -1)
            this.current = index
        },

        showMyHistories() {
            const { isMetaMaskInstalled, isMetaMaskUnlocked } = this

            this.onlyMine = !this.onlyMine

            if (!isMetaMaskInstalled && this.onlyMine) {
                this.onlyMine = false
                return this.showTips(this.$t('tips_mm_notfound'))
            }

            if (!isMetaMaskUnlocked && this.onlyMine) {
                this.onlyMine = false
                return this.showTips(this.$t('tips_mm_locked'))
            }

            if (this.onlyMine) {
                this.onlyHistory = false
                this.onlyJackpot = false
                this.onlyMyStat = false
            } else {
                if (!this.onlyHistory && !this.onlyJackpot && !this.onlyMyStat)
                    this.onlyHistory = true
            }
        },

        showMyStat() {
            const { isMetaMaskInstalled, isMetaMaskUnlocked } = this

            this.onlyMyStat = !this.onlyMyStat

            if (!isMetaMaskInstalled && this.onlyMyStat) {
                this.onlyMyStat = false
                return this.showTips(this.$t('tips_mm_notfound'))
            }

            if (!isMetaMaskUnlocked && this.onlyMyStat) {
                this.onlyMyStat = false
                return this.showTips(this.$t('tips_mm_locked'))
            }

            if (this.onlyMyStat) {
                this.onlyHistory = false
                this.onlyJackpot = false
                this.onlyMine = false
            } else if (!this.onlyHistory && !this.onlyMine && !this.onlyJackpot)
                this.onlyHistory = true
        },

        showJackpotHistory() {
            this.onlyJackpot = !this.onlyJackpot
            if (this.onlyJackpot) {
                this.onlyHistory = false
                this.onlyMine = false
                this.onlyMyStat = false
            } else {
                if (!this.onlyHistory && !this.onlyMine && !this.onlyMyStat)
                    this.onlyHistory = true
            }
        },

        showTips(content) {
            this.Tips.show = true
            this.Tips.content = content
        },

        loopCheckAmount() {
            clearTimeout(this.amountTimer)

            const { defaultAccount, web3, isMetaMaskUnlocked } = this
            const { checkAmountInterval } = this.config

            if (!defaultAccount) return

            web3.eth.getBalance(defaultAccount, (err, balance) => {
                if (err || !balance) balance = 0
                // console.log('getBalance', defaultAccount, web3.fromWei(balance.toString(), 'ether'))
                this.balance = isMetaMaskUnlocked
                    ? Number(web3.fromWei(balance.toString(), 'ether'))
                    : 0
                this.amountTimer = setTimeout(
                    this.loopCheckAmount.bind(this),
                    checkAmountInterval
                )
            })
        }
    }
}
</script>
<style lang="scss">
.history {
    width: 424px;
    padding: 20px 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    > div {
        width: 100%;
    }
    .top,
    .list {
        width: 100%;
    }
    .top {
        padding: 10px 0 5px;
        background-color: #0d0d0d;
        border-radius: 5px;
        .title {
            position: relative;
            padding: 0 0 0 17px;
            margin-bottom: 5px;
            font-size: 18px;
            .more {
                position: absolute;
                top: 50%;
                right: 15px;
                transform: translateY(-50%);
                font-size: 12px;
            }
            a {
                padding: 2px 5px;
                margin-right: 2px;
                color: rgba(255, 255, 255, 0.6);
                &:hover {
                    text-decoration: none;
                }
                &.active {
                    background-color: rgba(255, 255, 255, 0.2);
                    border-radius: 5px;
                }
            }
        }
    }
    @media (max-width: 625px) {
        .top .title {
            font-size: 16px;
            .more {
                font-size: 12px;
            }
        }
    }
    em {
        display: inline-block;
        vertical-align: top;
        width: 2.6em;
    }

    .user-coin,
    .result-coin,
    .user-dice,
    .result-dice,
    .user-dice2,
    .result-dice2 {
        width: 1.4em;
        height: 1.4em;
        line-height: 1.4em;
        border-width: 2px;
        opacity: 1;
        vertical-align: top;
        background-size: auto 80%;
    }
    .game-is-dice2 .bet-container {
        margin-left: 5px;
    }
    .bet-container .user-dice2,
    .history .result-dice2 {
        &::before,
        &::after {
            position: static;
            width: auto;
            height: auto;
            line-height: 1.6em;
        }
    }
    .user-dice2 {
        background: none;
        color: rgba(255, 255, 255, 0.6);
        margin: 0;
        transform: scale(1.2);
        &::after {
            content: ",";
        }
        &:last-child::after {
            content: "";
        }
    }
    .user-dice,
    .result-dice {
        background-size: 100% 100%;
    }
    .user-coin,
    .user-dice {
        margin: 0 0 0 5px !important;
    }
    .result-coin,
    .result-dice {
        margin: 0 5px 0 0 !important;
    }
    .user-dice,
    .result-dice {
        &::before,
        &::after,
        b::before,
        b::after {
            width: 2px;
            height: 2px;
            overflow: hidden;
        }
    }

    ul {
        position: relative;
    }
    li {
        font-size: 12px;
        text-align: left;
        &.jackpot {
            color: #e29767;
            .item {
                background: url(../assets/img/icon-jackpot.png) no-repeat 5px
                    center;
                background-size: auto 50%;
            }
            a {
                color: #e29767;
            }
        }
    }
    div {
        &.item,
        &.item-jackpots {
            overflow: hidden;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 20px 5px 25px;
            cursor: pointer;
            transition: all 0.2s ease-out;

            &:nth-child(2n) {
                background-color: #2e2a4f;
            }
            &:hover {
                background-color: rgba(#fff, 0.2);
                a {
                    color: #fff;
                }
            }
            > span {
                overflow: hidden;
                white-space: nowrap;
                display: flex;
                align-items: center;
            }
        }
        &.item-jackpots {
            cursor: default;
        }
        &.detail {
            padding: 0.5em 0;
            background-color: #303030;
            opacity: 1;
            transition: opacity 0.4s ease-in-out;
            strong {
                font-weight: 400;
                width: 30%;
                margin-right: 10px;
                flex-shrink: 0;
            }
            .row {
                justify-content: space-between;
                margin: 5px 0;
                padding: 0 calc(1em + 12px);
                > span {
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    flex-grow: 1;
                    overflow: hidden;
                }
                &:nth-child(2n) {
                    padding: 0.5em calc(1em + 12px);
                    background-color: #3f3f3f;
                }
            }
        }
    }
    .thead {
        color: #cba38c;
        li .item,
        li .item-jackpots {
            cursor: default;
            align-items: stretch;
            &:hover {
                background-color: transparent;
            }
        }
        li {
            font-size: 14px;
            .prize {
                background: url(../assets/img/icon-back.png) no-repeat left
                    center;
                background-size: auto 70%;
            }
        }
    }
    .list {
        padding: 15px 0;
        margin-top: 3px;
        background-color: #0d0d0d;
        border-radius: 5px;
    }
    .tbody {
        position: relative;
        height: 282px;
        overflow-x: hidden;
        overflow-y: auto;
        li:nth-child(2n) {
            background-color: rgba(#1f1e1d, 0.8);
        }
    }
    // 玩家
    .addr {
        width: 22%;
        padding-right: 1em;
    }
    .item-jackpots .addr {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    // 赌注
    .bet {
        width: 30%;
        white-space: nowrap;
        .bet-container {
            display: inline-block;
            flex-grow: 1;
        }
    }
    .game-is-dice .bet-container,
    .game-is-dice2 .bet-container {
        width: 50px;
        text-overflow: ellipsis;
        transform: scale(0.6);
        transform-origin: left center;
    }
    .game-is-dice2 .bet-container {
        overflow: hidden;
    }
    // 结果
    .result {
        width: 30%;
    }
    .item-jackpots .result {
        width: 20%;
        white-space: nowrap;
        overflow: visible;
    }
    .item-jackpots a:hover {
        color: #fff;
    }
    // 大奖
    .prize {
        width: 14%;
    }
    .icon {
        width: 4%;
    }
    // Time
    .item-jackpots .time {
        width: 30%;
    }
    .no-record {
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    // 余额
    .amount {
        margin-top: 10px;
        font-size: 14px;
        span {
            padding: 2px 10px;
            background-color: rgba(#100F0D, 0.8);
            border-radius: 2px;
        }
        b {
            font-weight: 400;
            color: #cba38c !important;
        }
    }
    .user-roll {
        margin-left: 10px;
        color: rgba(255, 255, 255, 0.6);
    }
    .result-roll {
        width: 1.5em;
        margin-right: 10px;
    }
    .win .result-roll {
        color: #eaac4f;
    }
}
</style>

