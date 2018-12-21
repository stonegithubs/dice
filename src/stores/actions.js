let timerCheckMetaMask, timerCheckAccount, timerCheckJackpotSize, checkLockedInBetsTimer, checkContractBalanceTimer

export default {
    setEnv({ commit }, { env, baseApiUrl }) {
        commit('setEnv', { env, baseApiUrl })
    },

    setRid({ commit }, rid) {
        commit('rid', rid)
    },

    setLocale({ commit }, { locale, cookie, storage }) {
        const localeKey = 'locale'
        const domain = location.hostname
        cookie.set(localeKey, locale, { expires: 365, secure: location.protocol.startsWith('https'), domain })
        storage.save(localeKey, locale)
        commit('saveLocale', locale)
    },

    setWinChance({ commit }, winChance) {
        commit('setWinChance', winChance)
    },

    setWinTimes({ commit }, times) {
        commit('setWinTimes', times)
    },

    setWinAmount({ commit }, { winAmount }) {
        commit('setWinAmount', winAmount)
    },

    setBet({ commit }, bet) {
        commit('setBet', bet)
    },

    setContract({ commit }, { abi, contract }) {
        commit('setContractAddr', contract)
        commit('setContractAbi', abi)
    },

    checkAndUpdateMetaMaskStatus({ commit, dispatch, state }, $web3) {
        const isMetaMaskInstalled = typeof web3 !== 'undefined'
        const isMetaMaskUnlocked = isMetaMaskInstalled && Boolean(web3.eth.defaultAccount)
        const { checkMetaMaskInterval } = state.config

        commit('updateMetaMaskStatus', { isMetaMaskInstalled, isMetaMaskUnlocked })
        // console.log({ isMetaMaskInstalled, isMetaMaskUnlocked })

        clearTimeout(timerCheckMetaMask)
        timerCheckMetaMask = setTimeout(loopCheck, checkMetaMaskInterval)

        function loopCheck() {
            dispatch('checkAndUpdateMetaMaskStatus', $web3)
        }
    },

    checkAndUpdateAccount({ commit, state, dispatch }, { web3 }) {
        const { accounts } = web3.eth
        const { checkAccountInterval } = state.config

        commit('updateAccount', accounts[0])

        clearTimeout(timerCheckAccount)
        timerCheckAccount = setTimeout(loopCheck, checkAccountInterval)

        function loopCheck() {
            dispatch('checkAndUpdateAccount', { web3 })
        }
    },

    updateWeb3({ commit }, { web3 }) {
        commit('updateWeb3', web3)
    },

    // 更新/定时检测大奖池
    updateJackpotSize({ commit, state, dispatch }, { http, web3, contract }) {
        const { checkJackpotSizeInterval } = state.config
        clearTimeout(timerCheckJackpotSize)

        if (web3 && contract) {
            return contract.jackpotSize((err, jackpotSize) => {
                loopNext()
                if (err) return
                let jsize = web3.fromWei(jackpotSize.toString(), 'ether')
                commit('updateJackpotSize', jsize)
            })
        }

        const { baseApiUrl } = state.config
        const api = `${baseApiUrl}/api/jackpot`
        http.jsonp(api).then(
            res => {
                const { jackpot: _jackpot } = res.data
                let jackpot = _jackpot / 1e18
                let tmp = String(jackpot).split('.')
                let jsize = jackpot

                if (tmp[1] && tmp[1].length > 4) {
                    jsize = jackpot.toFixed(4)
                }

                commit('updateJackpotSize', jsize)
                loopNext()
            },
            loopNext
        )

        function loopNext() {
            // console.log('Enter Loop For Jackpot', Date.now())
            timerCheckJackpotSize = setTimeout(dispatch, checkJackpotSizeInterval, 'updateJackpotSize', { http, contract, web3 })
        }
    },

    // 更新当前游戏
    setCurrentGame({ commit, state }, currentGame) {
        const { supportGames } = state
        if (supportGames.includes(currentGame)) {
            commit('setCurrentGame', currentGame)
            // console.log('actions/currentGame', currentGame)
        }
    },

    setModulo({ commit }, modulo) {
        commit('setModulo', modulo)
    },

    setHistoryData({ commit }, data) {
        commit('setHistoryData', data)
    },

    update_HOUSE_EDGE_MINIMUM_AMOUNT({ commit }, { contract, web3 }) {
        contract.HOUSE_EDGE_MINIMUM_AMOUNT((err, value) => {
            if (err) return
            commit('HOUSE_EDGE_MINIMUM_AMOUNT', web3.fromWei(value.toString(), 'ether'))
        })
    },

    update_HOUSE_EDGE_PERCENT({ commit }, { contract }) {
        contract.HOUSE_EDGE_OF_TEN_THOUSAND((err, value) => {
            if (err) return
            value = Number(String(value))
            commit('HOUSE_EDGE_PERCENT', value <= 1 ? value : Number((value / 100).toFixed(2)))
        })
    },

    updateMaxProfit({ commit }, { contract, web3 }) {
        contract.maxProfit((err, maxProfit) => {
            if (err) return
            let mprofit = web3.fromWei(maxProfit.toString(), 'ether')
            // console.log('actions/maxProfit', mprofit)
            commit('maxProfit', mprofit)
        })
    },

    updateLockedInBets({ commit, dispatch, state }, { contract, web3 }) {
        clearTimeout(checkLockedInBetsTimer)
        contract.lockedInBets((err, lockedInBets) => {
            // console.log('lockedInBets', err, lockedInBets.toString())
            if (err) return
            const lInBets = web3.fromWei(lockedInBets.toString(), 'ether')
            // console.log('actions/lockedInBets', lInBets)
            commit('lockedInBets', lInBets)
            checkLockedInBetsTimer = setTimeout(dispatch, state.config.checkLockedInBetsInterval, 'updateLockedInBets', { contract, web3 })
        })
    },

    // 合约账号余额
    updateContractBalance({ commit, dispatch, state }, { contract, web3 }) {
        clearTimeout(checkContractBalanceTimer)

        const { address } = state.config.contract
        const { checkLockedInBetsInterval } = state.config
        web3.eth.getBalance(address, (err, balance) => {
            if (err || !balance) balance = 0
            let cBalance = web3.fromWei(balance.toString(), 'ether')
            // console.log('actions/contractBalance', cBalance)
            commit('contractBalance', cBalance)
            checkContractBalanceTimer = setTimeout(dispatch, checkLockedInBetsInterval, 'updateContractBalance', { contract, web3 })
        })
    }
}
