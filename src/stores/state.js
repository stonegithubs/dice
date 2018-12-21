const { port } = location
const IS_ONLINE = port === ''

export default {
    locale: 'zh-CN',

    rid: 0, // refer id

    // 开发环境
    env: {
        PROD: false,
        DEV: false,
        TEST: false,
    },

    config: {
        // server api host 配置
        baseApiUrl: `${location.protocol}//${location.hostname}`,

        // 以太 host 配置
        ethhost: IS_ONLINE ? '' : 'ropsten.',

        // gas
        gas: 150000,

        // 定时检测账号变化
        checkAccountInterval: 2000,

        // 定时检测MetaMask状态
        checkMetaMaskInterval: 2000,

        // 定时检测历史列表数据
        checkHistoryInterval: 3000,

        // 定时检测大奖
        checkJackpotSizeInterval: 6000,

        // 定时检测余额
        checkAmountInterval: 3000,

        // 检测lockedInBets
        checkLockedInBetsInterval: 5000,

        contract: {
            address: '',
            abi: [],
        },

        // 管理费收取比例
        HOUSE_EDGE_PERCENT: 1,

        // 最低管理费
        MIN_HOUSE_FEE: 0.0004,

        // 最小下注金额
        MIN_BET: '0.01',

        // 默认下注金额
        DEFAULT_BET: '0.10',

        // 历史记录数
        historyCount: 100,

        logo: {
            coin: '/logo-coinflip.png?1',
            dice: '/logo-dice.png?1',
            dice2: '/logo-dice2.png',
            roll: '/logo-etheroll.png',
        },

        titles: {
            coin: 'Coin',
            dice: 'Dice',
            dice2: 'Two Dice',
            roll: 'Roll'
        }
    },

    // web3是否已被初始化
    web3: null,

    // 插件已安装
    isMetaMaskInstalled: false,

    // 插件已解锁
    isMetaMaskUnlocked: false,

    // 当前登录账号
    defaultAccount: null,

    // 支持的游戏
    supportGames: ['coin', 'dice', 'dice2', 'roll'],

    // 当前游戏
    currentGame: '',

    // modulo
    modulo: 0,

    // 获胜机会
    winChance: '?',

    // 获胜倍数
    winTimes: '?',

    // 获胜收益
    winAmount: '?',

    // 当前筹码
    bet: 0,

    // 大奖池
    jackpotSize: '?',

    // Adjustable max bet profit. Used to cap bets against dynamic odds
    maxProfit: 0,

    // Funds that are locked in potentially winning bets. Prevents contract from
    // committing to bets it cannot pay out.
    lockedInBets: 0,

    // 合约账户余额
    contractBalance: 0,

    // 最新历史（包含我）
    histories: [],
}
