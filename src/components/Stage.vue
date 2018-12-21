<template>
    <div class="stage">
        <component :is="currentGame" @select="select"></component>

        <div class="bet">
            <div class="shortcut">
                <a href="javascript:;" v-for="(item,index) in quicks" :key="index" :class="{current:quickIndex===index, disable: Number(item) > betMax}" @click="setBetValue(item)">
                    {{(index + 1 === quicks.length) ? $t('max') : item}}
                </a>
            </div>
            <div class="input">
                <a href="javascript:;" class="step step-sub" @click="stepBet(-1)">-</a>
                <input class="amount" type="text" v-model="bet" @blur="calcValidAmountValue">
                <a href="javascript:;" class="step step-plus" @click="stepBet(1)">+</a>
            </div>
            <!-- 您的赌注 -->
            <div class="comment">{{$t('game_comment_bet')}}</div>
        </div>

        <div class="command" style="flex-direction:column;">
            <div class="placeholder"></div>
            <!-- 下注 -->
            <a class="btn btn-hit" style="width:100%;" href="javascript:;" @click="hit">{{$t('hit')}}</a>
            <div class="gas-price" v-if="gasPrice">{{$t('advice_gas_price', {gasPrice})}}</div>
            <div class="placeholder"></div>
        </div>
        <div></div>

        <!-- 下注流程 -->
        <div class="waiting-panel" v-if="waiting">
            <!-- 第一步: 等待用户支付 -->
            <div class="wait-confirm" :class="{hidden: waiting !== 1}">
                <img class="waiting" src="@/assets/img/waiting.png">
                <div>{{$t('transaction_confirm')}}</div>
                <div class="command" v-if="showReplay">
                    <a class="btn btn-hit" href="javascript:;" @click="hideWaiting">{{$t('button_playagain')}}</a>
                </div>
            </div>

            <!-- 第二步: 等待交易过程 -->
            <div class="wait-transaction" :class="{hidden: waiting !== 2 }">
                <img class="waiting" src="@/assets/img/waiting.png" />
                <div>
                    {{$t('transaction_sent')}} <br />{{$t('transaction_wait')}}
                </div>
                <div class="loading"></div>
                <template v-if="showReplay">
                    <div class="command">
                        <a class="btn btn-hit" href="javascript:;" @click="hideWaiting">{{$t('button_nowait')}}</a>
                    </div>
                    <div class="tips-wait comment text-left">{{$t('wait_transaction')}}</div>
                </template>
            </div>

            <!-- 第三步: 显示交易结果 -->
            <div class="transaction-result" :class="{hidden: waiting !== 3}">
                <div class="result" :class="{win: +hitResult.wins}">{{+hitResult.wins ? $t('hit_win') : $t('hit_lose')}}</div>

                <div class="win-eth" v-if="hitResult.wins">
                    <em>{{hitResult.wins}}</em>
                    <span>ETH</span>
                </div>

                <div class="bet-detail">
                    <!-- 用户投注区 -->
                    <div class="bet-hit">
                        {{$t('game_player_hit')}}
                        <div class="bet-container" v-if="hitResult.modulo===100">
                            <em :class="userClass" v-html="hitResult.hit.join('')"></em>
                        </div>
                        <div v-else class="bet-container" :class="{transform: (hitResult.hit || []).length > 1}">
                            <em v-for="(hit, index) in hitResult.hit" :key="index" :class="[userClass, getUserHitOnClass(hit)]">
                                <b></b>
                                <b></b>
                            </em>
                        </div>
                    </div>

                    <!-- 开奖结果区 -->
                    <div class="bet-result">
                        {{$t('game_player_result')}}
                        <div class="result-container" v-if="hitResult.modulo===100">{{hitResult.sha3_mod_n}}</div>
                        <div class="result-container" v-else :class="{transform: hitResult.modulo === 36, win: hitResult.wins > 0}">
                            <template v-if="hitResult.modulo === 36">
                                <em v-for="(resultItem, rIndex) in hitResult.modResultArray" :key="rIndex" :class="[resultClass, getUserHitOnClass(Number(resultItem), true)]">
                                    <b></b>
                                    <b></b>
                                </em>
                            </template>
                            <template v-else>
                                <em :class="[resultClass, getUserHitOnClass(hitResult.result)]">
                                    <b></b>
                                    <b></b>
                                </em>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="command" v-if="showReplay">
                    <a class="btn btn-hit" href="javascript:;" @click="hideWaiting">{{$t('button_playagain')}}</a>
                </div>
            </div>
        </div>

        <Modal v-model="Modal.show" no-button="1">
            <span v-html="Modal.content"></span>
        </Modal>
    </div>
</template>

<script>
import { mapState } from 'vuex'
let timerSetWinAmount

export default {
    components: {
        coin: () => import('@/components/Coin.vue'),
        dice: () => import('@/components/Dice.vue'),
        dice2: () => import('@/components/Dice2.vue'),
        roll: () => import('@/components/Roll.vue')
    },

    data() {
        return {
            // 当前选择的快捷方式索引
            quickIndex: 0,

            // 快捷列表
            quicks: ['0.10', '0.15', '0.20', '5.00'],

            betMax: '5.00',

            // 下注金额
            bet: '0.00',

            // betMask
            betMask: [],

            // modulo
            modulo: 0,

            // 步进金额
            step: 0.01,

            // 默认弹窗
            Modal: {
                show: false,
                content: ''
            },

            // 下注流程
            waiting: false,

            // 显示{{$t('button_playagain')}}按钮
            showReplay: false,

            // 下注时记录Commit
            userClass: '',
            resultClass: '',
            Commit: '',
            CommitTime: 0,
            hitResult: {},
            ignoredCommits: [], // 用户放弃等待下注结果

            // gasPrice
            gasPrice: 0
        }
    },

    mounted() {
        const { currentGame } = this
        this.core.setUserResultClass(this, currentGame)
        this.setBet(0)
        this.getGasPrice()
    },

    watch: {
        // 0. 更新Bet状态
        // 1. 计算获胜金额
        // 2. 计算获胜倍数
        bet(newBet) {
            newBet = Number(newBet)

            this.quickIndex = this.quicks.indexOf(newBet.toFixed(2))
            if (newBet <= 0 || isNaN(newBet)) return
            this.setBetState(newBet)
            this.setWinAmount()
        },

        quicks(quicks) {
            const { bet } = this
            this.quickIndex = quicks.findIndex(
                item => item === Number(bet).toFixed(2)
            )
        },

        // 最大下注金额发生变化时
        betMax(betMax) {
            const { quickIndex } = this
            this.quicks.splice(3, 1, Number(betMax).toFixed(2))
            // console.log('betMax change', {betMax, old, quickIndex})

            if (quickIndex === 3) {
                this.setBet(3, betMax)
            }
        },

        // 用户选择发生变化, rollUnder改变, 导致(获胜金额/获胜机会)发生改变
        betMask() {
            this.setWinAmount()
            this.setWinChance()
        },

        // 获胜金额的变化直接推算出获胜倍数
        winAmount(amount) {
            const { bet, $store } = this
            const { div } = this.calc
            const winTimes = div(amount, bet).toFixed(2)
            $store.dispatch('setWinTimes', winTimes)
        },

        // 监测当前游戏，用于区分不同游戏的不同配置
        currentGame(currentGame) {
            this.core.setUserResultClass(this, currentGame)
        },

        // 观察历史列表，找到当前下注的结果数据
        histories(histories) {
            // item.time server 返回的UTC时间戳，理应大于用户点击下注的时间
            const hitResult = histories.find(
                item =>
                    item.commit === this.Commit &&
                    this.CommitTime < item.time * 1000
            )
            // console.log('hitResult', hitResult)
            if (hitResult) {
                this.Commit = ''
            }
            this.showHitResult(hitResult)
        }
    },

    computed: {
        ...mapState([
            'winAmount', 'isMetaMaskInstalled', 'isMetaMaskUnlocked', 'config', 'defaultAccount',
            'currentGame', 'histories', 'maxProfit', 'lockedInBets',
            'contractBalance', 'jackpotSize', 'rid'
        ]),

        rollUnder() {
            const { modulo, betMask } = this

            // 过山车
            if (modulo === 100) {
                return betMask
            }

            // 两个骰子
            if (modulo === 36) {
                return this.possibleIntLen
            }

            // 返回二进制中1的个数
            return betMask.reduce((acc, cur) => (cur === 1 ? acc + 1 : acc), 0)
        }
    },

    methods: {
        calcValidAmountValue() {
            const { MIN_BET, DEFAULT_BET } = this.config

            let bet = Number(this.bet)

            if (bet <= 0 || isNaN(bet)) {
                return this.setBetValue(DEFAULT_BET)
            }

            if (bet < MIN_BET) {
                return this.setBetValue(MIN_BET)
            }

            if (bet > this.betMax) {
                return this.setBetValue(this.betMax)
            }

            this.setBetValue(bet)
        },

        // 下注
        hit() {
            const { isMetaMaskInstalled, isMetaMaskUnlocked, core } = this

            if (!isMetaMaskInstalled) {
                return this.showModal(this.$t('tips_mm_notfound'))
            }

            if (!isMetaMaskUnlocked) {
                return this.showModal(this.$t('tips_mm_locked'))
            }

            this.checkMaxAmount()
            this.wait(1)
            this.getTicket(({ CommitLastBlock, Commit, R, S, code }) => {
                if (code) {
                    this.hideWaiting()
                    return this.showModal(this.$t(`hit_error_${code}`))
                }
                this.Commit = Commit
                this.CommitTime = core.getNowUTCTime()
                this.startHit(CommitLastBlock, Commit, R, S)
            })
        },

        // uint betMask,
        // uint modulo,
        // uint commitLastBlock,
        // uint commit,
        // bytes32 r,
        // bytes32 s
        startHit(CommitLastBlock, Commit, R, S) {
            const { web3, bet, defaultAccount, core, modulo, calc } = this
            const { gas } = this.config
            const betMask = this.getBetMask()
            const pay = {
                value: web3.toWei(bet, 'ether'),
                gas,
                from: defaultAccount
            }
            R = core.bytes2hex(R)
            S = core.bytes2hex(S)

            this.getGasPrice(gasPrice => {
                pay.gasPrice = web3.toWei(gasPrice, 'gwei')
                this.placeBet(
                    betMask,
                    modulo,
                    CommitLastBlock,
                    Commit,
                    R,
                    S,
                    pay
                )
            })
        },

        // 调用下注接口
        placeBet(betMask, modulo, CommitLastBlock, Commit, R, S, pay) {
            let { rid } = this
            // const { ethhost, gas } = this.config
            this.core.log('Stage/placeBet', { betMask, modulo, CommitLastBlock, Commit, R, S, rid, pay })

            this.contract.placeBet(
                betMask,
                modulo,
                CommitLastBlock,
                Commit,
                R,
                S,
                rid, // 等待合约支持时开启
                pay,
                (err, txid) => {
                    if (err) {
                        this.hideWaiting()

                        const { message: errMsg } = err

                        // 用户主动取消交易
                        if (errMsg.indexOf('denied') > -1) {
                            return this.showModal(this.$t('transaction_cancel'))
                        }

                        return this.showModal(
                            `${this.$t(
                                'pay_error'
                            )}<br>${this.$options.filters.pickError(errMsg)}`
                        )
                    }

                    this.wait(2, txid)
                }
            )
        },

        select({ betMask, modulo, possibleIntLen }) {
            // console.warn('select,', betMask, modulo, possibleIntLen)
            this.modulo = modulo
            this.$store.dispatch('setModulo', modulo)
            this.possibleIntLen = possibleIntLen
            this.betMask = betMask
            this.checkMaxAmount()
        },

        getDiceWinAmount() {
            this.checkMaxAmount()

            const { div, mul, sub } = this.calc
            const { bet: amount1, modulo, rollUnder } = this
            // console.error('getDiceWinAmount', {amount1, modulo, rollUnder, maxProfit, jackpotSize, lockedInBets, contractBalance})

            let amount = Number(amount1)

            // 如果赌博的金额足够, 就可以参加大奖, 所以要收大奖参与费
            let jackpotFee = this.getJackpotFee(amount)

            // 从投资金额里面扣除维护游戏的成本
            // let houseEdge = amount * HOUSE_EDGE_PERCENT / 100;
            let houseEdge = this.getHouseEdge(amount)

            // (amount - houseEdge - jackpotFee) * modulo / rollUnder
            let winAmount = div(
                mul(sub(sub(amount, houseEdge), jackpotFee), modulo),
                rollUnder
            )

            return Number(winAmount).toFixed(4)
        },

        // 获取管理费用
        getHouseEdge(amount) {
            const { MIN_HOUSE_FEE, HOUSE_EDGE_PERCENT } = this.config
            const { div, mul } = this.calc

            // 从投资金额里面扣除维护游戏的成本
            // let houseEdge = amount * HOUSE_EDGE_PERCENT / 100;
            let houseEdge = div(mul(amount, HOUSE_EDGE_PERCENT), 100)

            // 扣除至少:  MIN_HOUSE_FEE ether; 以10Gwei为假设的一笔交易
            if (houseEdge < MIN_HOUSE_FEE) {
                houseEdge = MIN_HOUSE_FEE
            }

            return houseEdge
        },

        // 获取大奖抽成费用
        getJackpotFee(amount) {
            // 如果赌博的金额足够, 就可以参加大奖, 所以要收大奖参与费
            let jackpotFee = amount >= 0.1 ? 0.001 : 0
            return jackpotFee
        },

        // 取得最大下注金额
        getMaxAmount() {
            const { MIN_BET: betMin } = this.config
            let maxAmount1 = Number(this.getMaxAmountByMaxProfit())
            let maxAmount2 = Number(this.getMaxAmountByBalance())
            let maxAmount = Math.min(maxAmount1, maxAmount2)

            if (maxAmount < betMin) {
                maxAmount = betMin
            }

            return maxAmount
        },

        // 根据允许的最大利润计算最大下注金额
        getMaxAmountByMaxProfit() {
            const { modulo, rollUnder, maxProfit } = this
            const { MIN_HOUSE_FEE, HOUSE_EDGE_PERCENT } = this.config
            // 计算最大 amount 值
            // possibleWinAmount <= amount + maxProfit
            // (amount - houseEdge - jackpotFee) * modulo / rollUnder <= amount + maxProfit
            let maxAmount =
                (100 * maxProfit * rollUnder + 100 * MIN_HOUSE_FEE * modulo) /
                (100 * modulo - HOUSE_EDGE_PERCENT * modulo - 100 * rollUnder)
            // console.error('getMaxAmountByMaxProfit', {maxAmount})
            return (maxAmount - 0.01).toFixed(2)
        },

        // 根据总合约可用金额计算最大下注金额
        getMaxAmountByBalance() {
            const {
                lockedInBets,
                jackpotSize,
                contractBalance,
                modulo,
                rollUnder
            } = this
            const { MIN_HOUSE_FEE, HOUSE_EDGE_PERCENT } = this.config

            // jackpotSize + jackpotFee + lockedInBets + possibleWinAmount <= address(this).balance
            // (amount - houseEdge - jackpotFee) * modulo / rollUnder + lockedInBets + jackpotSize + jackpotFee <= contractBalance
            let maxAmount =
                (contractBalance * rollUnder +
                    MIN_HOUSE_FEE * modulo -
                    lockedInBets * rollUnder -
                    jackpotSize * rollUnder -
                    MIN_HOUSE_FEE * rollUnder) /
                (modulo - (modulo * HOUSE_EDGE_PERCENT) / 100)
            // console.error('getMaxAmountByBalance', {maxAmount})
            return (maxAmount - 0.01).toFixed(2)
        },

        // 检测设置最大金额
        // possibleWinAmount <= address(this).balance - (jackpotSize + jackpotFee + lockedInBets)
        checkMaxAmount() {
            const { modulo, maxProfit } = this
            if (!modulo || !maxProfit) return
            let maxAmount = this.getMaxAmount()
            if (!maxAmount) return
            this.setMaxAmount(maxAmount.toFixed(2))
        },

        getBetMask() {
            const { betMask } = this

            // 通常情况
            if (Array.isArray(betMask)) {
                return parseInt(this.betMask.join(''), 2)
            }

            // 过山车
            return betMask
        },

        getTicket(fn) {
            const { $http: http, defaultAccount } = this
            const { baseApiUrl } = this.config

            this.core.getTicket({ http, baseApiUrl, defaultAccount }, fn)
        },

        // 设置下注金额
        setBet(index, value) {
            if (Number(value) > Number(this.betMax))
                return this.core.info('setBet', { value, betMax: this.betMax })

            this.quickIndex = index
            this.bet = Number(value || this.quicks[index]).toFixed(2)
        },

        // 设置下注金额
        setBetValue(value) {
            value = Number(value).toFixed(2)
            // this.core.error('stage/setBetValue', {value})
            this.setBet(this.quicks.indexOf(value), value)
        },

        // 步进微调下注金额
        stepBet(d) {
            const { step, bet, betMax } = this
            const { add, sub } = this.calc
            const { MIN_BET: betMin } = this.config
            let result

            // +
            if (d > 0) {
                result = add(Number(bet), step)
                if (result > betMax) result = Number(betMax)

                // -
            } else {
                result = sub(Number(bet), step)
                if (result < betMin) result = Number(betMin)
            }
            result = result.toFixed(2)

            this.setBetValue(result)
        },

        // 更新 Bet 状态
        setBetState(bet) {
            this.$store.dispatch('setBet', bet)
        },

        // 计算获胜机会
        setWinChance() {
            const { $store, rollUnder, modulo } = this
            const { mul, div } = this.calc
            const winChance = mul(div(rollUnder, modulo), 100).toFixed(2)
            $store.dispatch('setWinChance', winChance)
        },

        // 设置最大金额
        setMaxAmount(maxAmount) {
            let bet = Number(this.bet)
            maxAmount = Number(maxAmount)

            this.betMax = maxAmount
            if (bet > maxAmount) {
                this.quickIndex = 3
                this.setBet(3, maxAmount) // 让最大保持选定状态
            }
        },

        // 计算获胜收益
        setWinAmount() {
            clearTimeout(timerSetWinAmount)

            const { $store, bet, rollUnder, contractBalance } = this

            if (!Number(bet) || !rollUnder || !contractBalance) {
                timerSetWinAmount = setTimeout(this.setWinAmount.bind(this), 50)
                return
            }

            const winAmount = this.getDiceWinAmount()
            $store.dispatch('setWinAmount', { winAmount })
        },

        showModal(content) {
            this.Modal.show = true
            this.Modal.content = content
        },

        // 有第二个参数txid，随时可以启用
        wait(step /*, txid*/) {
            if (this.ignoredCommits.includes(this.Commit)) {
                // return
            }

            let time = 5000

            this.waiting = step
            this.showReplay = false
            switch (step) {
                case 1:
                case 2:
                    time = 5000
                    break
                case 3:
                    time = 2000
                    break
                default:
                    time = 0
            }
            setTimeout(() => (this.showReplay = true), time)
        },

        hideWaiting() {
            this.waiting = false
            this.showReplay = false
            this.ignoredCommits.push(this.Commit)
        },

        // 返回用户选择每个位置的 CSS 类
        getUserHitOnClass(on, two) {
            const { currentGame } = this
            let mapping = {
                coin: ['', 'front', 'back'],
                dice: ['', 'one', 'two', 'three', 'four', 'five', 'six'],
                dice2: [
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
                ],
                roll: []
            }
            if (two) {
                mapping.dice2 = mapping.dice
            }
            return mapping[currentGame][on]
        },

        // 展示开奖结果
        showHitResult(hitResult) {
            if (hitResult) {
                // console.log(hitResult)
                this.hitResult = hitResult
                this.wait(3)
                this.Commit = ''
                this.CommitTime = 0
            }
        },

        // 调整gasPrice
        // 获取线上gasPrice, 上浮3.95
        getGasPrice(fn = new Function()) {
            const { web3, calc } = this

            web3.eth.getGasPrice((err, gasPrice) => {
                setTimeout(this.getGasPrice.bind(this), 5000)

                const onlineGasPrice = web3.fromWei(gasPrice.toString(), 'gwei')
                let diceGasPrice = calc.add(Number(onlineGasPrice), 3.95).toFixed(2)

                this.gasPrice = diceGasPrice
                fn(diceGasPrice)
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.stage {
    position: relative;
    width: 335px;
    margin: 0;
    text-align: center;
    align-self: flex-start;
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .transaction-result {
        .bet-container em::before {
            color: darken(#c4a493, 60);
        }
    }
}
.bet {
    .shortcut {
        display: flex;
        justify-content: space-around;
        align-items: center;
        a {
            flex-grow: 1;
            border-radius: 5px;
            padding: 0.5em 0;
            margin: 0 6px;
            color: #fff;
            border: 1px solid #d2a78f;
            font-size: 12px;
            &.current,
            &:hover {
                color: #333;
                background: linear-gradient(to bottom, #cbab9a, #a38375);
            }
            &.disable {
                opacity: 0.3;
                cursor: not-allowed;
            }
        }
    }
    .input {
        display: flex;
        justify-content: space-between;
        align-items: stretch;
        margin: 20px auto 0;
    }
    .step {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-grow: 0;
        width: 2em;
        text-align: center;
        background: linear-gradient(to bottom, #cbab9a, #a38375);
        color: #fff;
        font-size: 36px;

        &:hover {
            opacity: 0.8;
        }

        &.step-sub {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
        &.step-plus {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;
        }
    }
    .amount {
        flex-grow: 1;
        width: 100px;
        padding: 0.5em 0;
        height: 100%;
        font-size: 30px;
        text-align: center;
        background: #fff;
        border: 0;
        outline: none;
    }
    .comment {
        margin-top: 10px;
    }
}
.comment {
    color: #fff;
    font-size: 14px;
    margin-top: 5px;
}
.command,
.tips-wait {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 25px auto 0;
    min-width: 100%;

    .placeholder {
        width: 30px;
    }

    .btn {
        flex-grow: 1;
        margin: 0 30px;
        padding: 6px 0 5px;
        background: linear-gradient(
            to right,
            rgba(#9a7a6d, 1),
            rgba(#d6b7a5, 1)
        );
        color: #fff;
        border-radius: 2em;
        font-size: 16px;
        transition: all 0.2s ease-in-out;
        &:hover {
            background: linear-gradient(
                to right,
                rgba(#d6b7a5, 1),
                rgba(#9a7a6d, 1)
            );
        }
    }
}
.tips-wait .btn {
    color: #333;
    background: #fff;
}
.waiting-panel {
    position: absolute;
    z-index: 10;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    background-color: rgba(#4e413b, 0.9);
    font-size: 12px;
}
.waiting {
    height: 140px;
    margin-bottom: 20px;
    animation: waiting 1s ease-in-out infinite;
}
@keyframes waiting {
    0% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.1);
    }
    100% {
        transform: scale(1);
    }
}
.loading {
    width: 30px;
    height: 30px;
    margin: 15px auto 0;
    background: url(../assets/img/loading.png) no-repeat;
    background-size: 100% 100%;
    animation: rotate 2s linear infinite;
}
@keyframes rotate {
    from {
        transform: rotate(0);
    }
    to {
        transform: rotate(360deg);
    }
}
.bet-container {
    &.transform {
        width: 210%;
        transform: scale(0.5);
        transform-origin: left top;
        text-align: left;
    }
    em {
        display: inline-block;
    }
}
.bet-container,
.result-container {
    margin: 20px auto 0;
    display: block;
    width: 100%;
}
.result-container {
    text-align: center;
    &.transform {
        white-space: nowrap;
        transform: scale(0.6);
        transform-origin: center top;
        text-align: center;
        em:first-child {
            margin-right: 10px;
        }
    }
}
.result {
    font-size: 22px;
    &.win {
        color: #efcab4;
    }
}
.win-eth {
    font-size: 22px;
    span {
        font-size: 14px;
    }
}
.bet-detail {
    display: flex;
    justify-content: space-around;
    margin: 30px auto;
    text-align: center;
}
.bet-hit,
.bet-result {
    width: 150px;
    margin: 5px;
    padding: 20px;
    border-radius: 10px;
    background-color: rgba(255, 255, 255, 0.1);
    .user-dice,
    .result-dice,
    .user-coin,
    .result-coin,
    .user-dice2,
    .result-dice2 {
        opacity: 1;
        margin: 0 5px 0 0;
    }
    .user-dice {
        &::before,
        &::after,
        b::before,
        b::after {
            opacity: 1;
            width: 4px;
            height: 4px;
            border-radius: 8px;
            overflow: hidden;
        }
    }
}
.user-dice {
    &::before,
    &::after,
    > b::before,
    > b::after {
        width: 4px;
        height: 4px;
        border-radius: 4px;
    }

    // 一
    &.one::before {
        display: block;
        top: 50%;
        left: 50%;
        margin: -2px 0 0 -2px;
    }

    // 二 三
    &.two::before,
    &.three::before {
        display: block;
        right: 20%;
        top: 20%;
    }

    &.two::after,
    &.three::after {
        display: block;
        left: 20%;
        bottom: 20%;
    }

    &.three b::before {
        display: block;
        left: calc(50% - 2px);
        top: calc(50% - 2px);
    }

    // 四 五
    &.four::before,
    &.five::before,
    &.six::before {
        display: block;
        left: calc(30% - 2px);
        top: calc(20%);
    }

    &.four::after,
    &.five::after,
    &.six::after {
        display: block;
        right: calc(30% - 2px);
        top: calc(20%);
    }

    &.four b::before,
    &.five b:first-child::before,
    &.six b:first-child::before {
        display: block;
        left: calc(30% - 2px);
        bottom: calc(20%);
    }

    &.four b::after,
    &.five b:first-child::after,
    &.six b:first-child::after {
        display: block;
        right: calc(30% - 2px);
        bottom: calc(20%);
    }

    // 五
    &.five b:last-child::after {
        display: block;
        left: calc(50% - 2px);
        top: calc(50% - 2px);
    }

    // 六
    &.six b:last-child::before {
        display: block;
        left: calc(30% - 2px);
        top: calc(50% - 2px);
    }

    &.six b:last-child::after {
        display: block;
        right: calc(30% - 2px);
        top: calc(50% - 2px);
    }
}
.result-dice {
    &::before,
    &::after,
    > b::before,
    > b::after {
        width: 8px;
        height: 8px;
        border-radius: 8px;
    }

    // 一
    &.one::before {
        display: block;
        top: 50%;
        left: 50%;
        margin: -4px 0 0 -4px;
    }

    // 二 三
    &.two::before,
    &.three::before {
        display: block;
        right: 20%;
        top: 20%;
    }

    &.two::after,
    &.three::after {
        display: block;
        left: 20%;
        bottom: 20%;
    }

    &.three b::before {
        display: block;
        left: calc(50% - 4px);
        top: calc(50% - 4px);
    }

    // 四 五
    &.four::before,
    &.five::before,
    &.six::before {
        display: block;
        left: calc(30% - 4px);
        top: calc(20%);
    }

    &.four::after,
    &.five::after,
    &.six::after {
        display: block;
        right: calc(30% - 4px);
        top: calc(20%);
    }

    &.four b::before,
    &.five b:first-child::before,
    &.six b:first-child::before {
        display: block;
        left: calc(30% - 4px);
        bottom: calc(20%);
    }

    &.four b::after,
    &.five b:first-child::after,
    &.six b:first-child::after {
        display: block;
        right: calc(30% - 4px);
        bottom: calc(20%);
    }

    // 五
    &.five b:last-child::after {
        display: block;
        left: calc(50% - 4px);
        top: calc(50% - 4px);
    }

    // 六
    &.six b:last-child::before {
        display: block;
        left: calc(30% - 4px);
        top: calc(50% - 4px);
    }

    &.six b:last-child::after {
        display: block;
        right: calc(30% - 4px);
        top: calc(50% - 4px);
    }
}
.tips-wait {
    width: 80%;
    margin: 10px auto 0;
    padding: 10px 20px;
    text-align: left;
    opacity: 0.8;
}
.gas-price {
    margin-top: 6px;
    width: 100%;
    color: rgba($color: #fff, $alpha: 0.6);
    font-size: 12px;
}
</style>
