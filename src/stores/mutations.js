export default {
    setEnv(state, { env, baseApiUrl }) {
        state.env[env] = true
        state.config.baseApiUrl = baseApiUrl
    },

    rid(state, rid) {
        state.rid = Number(rid) || 0
    },

    saveLocale(state, locale) {
        state.locale = locale
    },

    setWinChance(state, winChance) {
        state.winChance = winChance
    },

    setWinTimes(state, times) {
        state.winTimes = times
    },

    setWinAmount(state, winAmount) {
        state.winAmount = winAmount
    },

    setBet(state, bet) {
        state.bet = bet
    },

    setContractAddr(state, addr) {
        state.config.contract.address = addr
    },

    setContractAbi(state, abi) {
        state.config.contract.abi = abi
    },

    updateMetaMaskStatus(state, { isMetaMaskInstalled, isMetaMaskUnlocked }) {
        state.isMetaMaskInstalled = isMetaMaskInstalled
        state.isMetaMaskUnlocked = isMetaMaskUnlocked
    },

    updateAccount(state, account) {
        state.defaultAccount = account
    },

    updateWeb3(state, version) {
        state.web3 = version
    },

    updateJackpotSize(state, jackpotSize) {
        state.jackpotSize = Number(jackpotSize)
    },

    setCurrentGame(state, currentGame) {
        state.currentGame = currentGame
    },

    setModulo(state, modulo) {
        state.modulo = modulo
    },

    setHistoryData(state, data) {
        state.histories = data
    },

    HOUSE_EDGE_MINIMUM_AMOUNT(state, value) {
        state.config.MIN_HOUSE_FEE = Number(value)
    },

    HOUSE_EDGE_PERCENT(state, value) {
        state.config.HOUSE_EDGE_PERCENT = Number(value)
    },

    maxProfit(state, maxProfit) {
        state.maxProfit = Number(maxProfit)
    },

    lockedInBets(state, lockedInBets) {
        state.lockedInBets = Number(lockedInBets)
    },

    contractBalance(state, contractBalance) {
        state.contractBalance = Number(contractBalance)
    }
}
