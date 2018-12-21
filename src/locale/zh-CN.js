export default {
    html_title: '骰子、硬幣、各類以太賭博遊戲',

    // var
    mine: '我自己',
    'close': '關閉',
    'copy': '複製',
    'waiting': '請稍後',
    'confirm': '確認',
    'success': '成功',
    'fail': '失敗',
    'error_invest_ammount': '下注金額錯誤',
    'no_record': '暫無數據',
    'app_loading': '遊戲正在加載中...',
    'data_loading': '數據加載中...',
    'faq': '常見問題',

    // MM
    'goto_metamask': '請移步您的 MetaMask，完成後續交易',
    'tips_mm_notfound': '您需要安裝 MetaMask 才能玩本遊戲',
    'tips_mm_locked': '您需要解鎖 MetaMask 賬號才能玩本遊戲',
    'metamask_cancel': '交易已取消',

    // Stage
    'coinflip_name': '拋硬幣',
    'dice_name': '骰子',
    'dice2_name': '兩個骰子',
    'etheroll_name': '過山車',
    'game_comment_coinflip': '選擇硬幣的一面來進行投注',
    'game_comment_dice': '選擇骰子數來進行投注',
    'game_comment_dice2': '選擇要投注的骰子總和',
    'game_comment_etheroll': '調整您的勝率',
    'max': '最大',
    'game_comment_bet': '您的賭注',
    'hit': '下注',
    'button_nowait': '不等了,繼續玩',

    // pay
    // 註解：{ethhost} {txid} 內的 ethhost 和 txid 為程序變量，不需要翻譯
    'pay_error': '下注出錯',
    'pay_sent': '下注交易已發出，<a href="https://{ethhost}etherscan.io/tx/{txid}" target="_blank">查看交易詳情</a>',

    // history
    'game_history': '遊戲歷史',
    'game_player': '玩家',
    'game_player_result': '結果',
    'game_player_addr': '地址',
    'game_player_bet': '賭注',
    'game_player_hit': '將賭注壓在',
    'game_coin_front': '正面',
    'game_coin_back': '反面​​',
    'game_win': '獲勝',
    'ether': '以太幣',
    'only_mine': '我的記錄',

    // 餘額
    'your_amount': '您的餘額 {n} ETH',

    // chance
    // 註解： {n}內的 n 為程序變量,不需要翻譯
    'chance_win': '獲勝機會',
    'chance_win_bet': '贏得投注',
    'win_bet_n': '您將贏得{n}以太幣',
    'fee': '費用',
    'jackpot_fee': '以太幣積累大獎',
    'jackpot_include': '大獎包括',
    'hit_condition': '投注0.10以太幣以獲得資格',
    'chance_jackpot': '0.1%的贏大獎機會',
    jackpot_notice: '每局&gt;0.1ETH的下注將產生0-999的隨機數，當生成的隨機數為0時，即獲得大獎。',

    // questions
    'freq_questions': '常見問題',

    // 2018-09-25 added
    'hit_error_100': '您的餘額不足',
    'hit_error_200': '賬號地址錯誤',
    'hit_error_300': '缺少回調函數參數',
    'account_balance': '賬號餘額 <b style="color: #c472a2;font-weight:400;">{n}</b> ETH',
    'hit_win': '您贏啦 :)',
    'hit_lose': '您輸了 :(',
    'transaction_confirm': '請確認投注交易',
    'transaction_sent': '投注已提交！ ',
    'transaction_wait': '等待以太坊...',
    'button_playagain': '再玩一次',
    'transaction_cancel': '下注交易已取消',
    'back_to_fck': '返回FCK',

    // 2018-09-30
    'wait_transaction': '交易完成後會顯示在遊戲歷史中，如不想等待，可點擊上面按鈕繼續遊戲.',

    // 2018-10-08
    'jackpot_history': '大獎歷史',

    // 2018-10-09
    'advice_gas_price': '建議的汽油價格(Gas Price): {gasPrice}',

    // 2018-11-08
    coin_head_tail: '正反面',
    roll_area: '各個範圍區間',

    stat_title: '遊戲統計',
    stat_recent: '最近',
    stat_round: '輪',
    stat_result: '結果',
    stat_winRatio: '勝率',
    stat_maxContinuous: '最大連出',
    stat_maxAmount: '最大賭注',
    stat_infoText: [
        '最近[total]把出現[elements]的次數',
        '最近[total]把壓[elements]的玩家勝率',
        '最近[total]把最大連出數',
        '最近[total]把最大賭注',
        '最近[total]把出現[elements]玩家的勝率',
        '最近[total]把出現[elements]的最大賭注'
    ],

    stat_myStat: '我的統計',
    stat_my_totalAmount: '投注金額',
    stat_my_betTimes: '投資次數',
    stat_my_winRatio: '勝率',
    stat_my_winTimes: '贏的次數',
    stat_my_maxAmount: '最大賭注',
    stat_my_maxWin: '最高贏取',
    stat_my_note: '您近100輪的下注統計',

    cobo_notice: '請用 <a href="https://cobo.com/" target="_blank">Cobo錢包</a> 打開 luck.cafe 以獲得完整體驗~',

    // maserati activity
    maserati_slogan: '來了,老弟 !<br>來抽瑪莎拉蒂！',
    maserati_time: '活動時間: 2018.12.13—2018.12.20',
    maserati_final_prize: '終極大獎——<em class="car"></em>瑪莎拉蒂-總裁（一年使用權）共{count}名',
    maserati_prizes: [
        '<em>二等獎：iPhone XMAX {amount}台</em><em>共{count}名</em>',
        '<em>三等獎：iPhone X {amount}台</em><em>共{count}名</em>',
        '<em>四等獎：小米MIX 3手机{amount}台</em><em>共{count}名</em>'
    ],
    maserati_join: '參與方法：活動期間內按累計下注額排名，依次獲得一、二、三、四等獎',
    maserati_lucky: '幸運咖啡獎：每日幸運咖啡券大量放送<br>社群整點紅包雨：11:00、15:00、18:00、20:00',
    maserati_copyright: '本活動最終解釋權歸Luck.cafe所有',
}
