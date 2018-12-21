export default {
    html_title: 'dice, roll, flip your ether',

    // var
    mine: 'it\'s me',
    'close': 'close',
    'copy': 'copy',
    'waiting': 'please wait',
    'confirm': 'confirm',
    'success': 'Success',
    'fail': 'Fail',
    'error_invest_ammount': 'Incorrect Invest Amount',
    'no_record': 'No Record',
    'app_loading': 'Loading...',
    'data_loading': 'Loading...',
    'faq': 'FAQ',

    // MM
    'goto_metamask': 'Please finish your transaction on MetaMask',
    'tips_mm_notfound': 'You need to install MetaMask to play this game',
    'tips_mm_locked': 'You need to unlock your MetaMask account to play the game',
    'metamask_cancel': 'Transaction Canceled',

    // Stage
    'coinflip_name': 'Flip Coin',
    'dice_name': 'Dice',
    'dice2_name': 'Two Dice',
    'etheroll_name': 'Etheroll',
    'game_comment_coinflip': 'Heads or tails? Fifty-Fifty',
    'game_comment_dice': 'Bet on number, 1 to 6',
    'game_comment_dice2': 'Choose the dice number(s) to bet on',
    'game_comment_etheroll': 'Adjust your winning chance',
    'max': 'max',
    'game_comment_bet': 'Your bet',
    'hit': 'bet',
    'button_nowait': 'Keep Playing',

    // pay
    // 注解：{ethhost} {txid} 内的 ethhost 和 txid 为程序变量，不需要翻译
    'pay_error': 'Wrong bet',
    'pay_sent': 'Bet transaction sent <a href="https://{ethhost}etherscan.io/tx/{txid}" target="_blank">View Transaction on Etherscan </a>',

    // history
    'game_history': 'Game history',
    'game_player': 'player',
    'game_player_result': 'result',
    'game_player_addr': 'address',
    'game_player_bet': 'bet',
    'game_player_hit': 'place bet on',
    'game_coin_front': 'Head',
    'game_coin_back': 'Tail',
    'game_win': 'You won',
    'ether': 'ETH',
    'only_mine': 'My bets',

    // 余额
    'your_amount': 'Your Amount {n} ETH',

    // chance
    // 注解： {n}内的 n 为程序变量,不需要翻译
    'chance_win': 'Winning chance',
    'chance_win_bet': 'Winning bet pays',
    'win_bet_n': 'You will win {n}ETH',
    'fee': 'fee',
    'jackpot_fee': 'ETH to jackpot',
    'jackpot_include': ' Jackpot contains ',
    'hit_condition': 'Bet 0.10 ETH to get your qualification',
    'chance_jackpot': '0.1% jackpot chance ',
    jackpot_notice: 'A bet of each game &gt;0.1ETH will produce a random number of 0-999, and when the generated random number is 0, the grand prize will be awarded.',

    // questions
    'freq_questions': 'FAQ',

    // 2018-09-25 added
    'hit_error_100': 'Insufficient Balance',
    'hit_error_200': 'Wrong Address',
    'hit_error_300': 'Lack of callback function parameter',
    'account_balance': 'Account Balance <b style="color: #c472a2;font-weight:400;">{n}</b> ETH',
    'hit_win': 'You Won！',
    'hit_lose': 'You Lose',
    'transaction_confirm': 'Please confirm your bet',
    'transaction_sent': 'Bet has submitted！',
    'transaction_wait': 'Please wait for Ethereum...',
    'button_playagain': 'Play again',
    'transaction_cancel': 'Your bet has been canceled',
    'back_to_fck': 'Back to FCK',

    // 2018-09-30
    'wait_transaction': 'When the transaction is completed, it will show that in the history of game, if you don\'t want to wait, you can click on the top button to continue the game.',

    // 2018-10-08
    'jackpot_history': 'Jackpot history',

    // 2018-10-09
    'advice_gas_price': 'Recommended gas price: {gasPrice}',

    // 2018-11-08
    coin_head_tail: 'Head/Tail',
    roll_area: 'ranges',

    stat_title: 'Game statistics',
    stat_recent: 'Recent',
    stat_round: 'Round',
    stat_result: 'Result',
    stat_winRatio: 'Winning Chance',
    stat_maxContinuous: 'Sequential result',
    stat_maxAmount: 'Biggest Bet',
    stat_infoText: [
        'in last [total] rounds',
        'in last [total] rounds',
        'in last [total] rounds',
        'in last [total] rounds',
        'in last [total] rounds',
        'in last [total] rounds',
        'The number of [elements] occurrences in recent [total] rounds',
        'Recent [total] rounds of [elements] player win rate',
        'Recent [total] rounds of max continuous bets',
        'Recent [total] rounds of maximum bet',
        'The winning ratio of [elements] occurrences in recent [total] rounds', // 最近[total]把出现[elements]玩家的胜率
        'The maximum bet of [elements] occurrences in recent [total] rounds', // 最近[total]把出现[elements]的最大赌注
    ],

    stat_myStat: 'My statistics',
    stat_my_totalAmount: 'Total betting amount',
    stat_my_betTimes: 'Total betting times',
    stat_my_winRatio: 'Avg winning chance',
    stat_my_winTimes: 'Total times of winning',
    stat_my_maxAmount: 'Your biggest bet',
    stat_my_maxWin: 'Your biggest prize',
    stat_my_note: 'The Statistics Data is From Your Recent 100 Bets',

    cobo_notice: 'Please open Luck.Cafe with <a href="https://cobo.com/" target="_blank">Cobo Wallet</a> for a better user experience',

    // maserati activity
    maserati_slogan: 'Here? Bro!!!<br>Get a Maserati!!!',
    maserati_time: 'Activity Time: Dec. 13th 2018-Dec. 20th 2018',
    maserati_final_prize: '<b>The ultimate prize</b>: <em class="car"></em>Maserati - Quattroporte (one-year right to use), 1 in all',
    maserati_prizes: [
        '<em><b>Second prize</b> : iPhone XMAX</em><em>{count} in all</em>',
        '<em><b>Third prize</b> : iPhone X</em><em>{count} in all</em>',
        '<em><b>Fourth prize</b> : Mi MIX 3 mobile phone</em><em>{count} in all</em>'
    ],
    maserati_join: '<b>Method of participation</b> : All users are ranked by the accumulated bet amount during the activity, and win the first, second, third and fourth prizes ',
    maserati_lucky: '<b>Luck cafe prize</b> : coffee vouchers are given out every day<br><b>Community hourly lucky money</b> : 11:00, 15:00, 18:00, 20:00',
    maserati_copyright: 'Note: the final interpretation right of this activity belongs to luck.cafe',
}
