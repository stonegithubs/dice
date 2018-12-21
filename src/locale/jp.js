export default {
    html_title: 'サイコロ, コイン, イーサーリアムベット',

    // var
    mine: 'it\'s me',
    'close': '閉じる',
    'copy': 'コピー',
    'waiting': '少々お待ちください',
    'confirm': '確認',
    'success': '成功',
    'fail': '失敗',
    'error_invest_ammount': 'ベット金額間違え',
    'no_record': '暫くデータなし',
    'app_loading': 'ゲームロード中...',
    'data_loading': 'データロード中...',
    // MM
    'goto_metamask': ' MetaMaskに入って、後続の取引を完成してください',
    'tips_mm_notfound': '本ゲームを始める前に、MetaMaskをインストールする必要がある',
    'tips_mm_locked': '本ゲームを始める前に、MetaMaskのアカウントを解除する必要がある',
    'metamask_cancel': '取引キャンセル済み',

    // Stage
    'coinflip_name': 'コインを投げる',
    'dice_name': 'サイコロ',
    'dice2_name': '二つのサイコロ',
    'etheroll_name': 'Etheroll ',
    'game_comment_coinflip': 'コインの片方を選んで、ベットする',
    'game_comment_dice': 'サイコロの数を選んで、ベットする',
    'game_comment_dice2': 'ベットするサイコロの合計を選ぶ',
    'game_comment_etheroll': '勝率を調整する',
    'max': '最大',
    'game_comment_bet': 'あなたのベット',
    'hit': 'ベット',
    'button_nowait': 'Keep Playing',

    // pay
    // 注解：{ethhost} {txid} 内的ethhost和txid为程序变量，不需要翻译
    'pay_error': 'ベット間違え',
    'pay_sent': 'ベット取引発送済み，<a  href="https://{ethhost}etherscan.io/tx/{txid}" target="_blank">Etherscanで取引をチェック </a>',

    // history
    'game_history': 'ゲーム歴史',
    'game_player': 'プレイヤー',
    'game_player_result': '結果',
    'game_player_addr': 'アドレス',
    'game_player_bet': 'ベット',
    'game_player_hit': ' 賭けったのは',
    'game_coin_front': 'コインの表',
    'game_coin_back': 'コインの裏',
    'game_win': 'あなたの勝ち',
    'ether': 'ETH',
    'only_mine': '私のだけ',

    // 余额
    'your_amount': 'Your Amount {n} ETH',

    // chance
    // 注解： {n}内的 n 为程序变量,不需要翻译
    'chance_win': '勝率',
    'chance_win_bet': 'ベットを博する',
    'win_bet_n': ' {n}　ETHを博する',
    'fee': '费用',
    'jackpot_fee': 'ETH ジェックぽっとへ ',
    'jackpot_include': 'ジェックぽっと金額',
    'hit_condition': '0.10のイーサををベットして資格を手に入れる',
    'chance_jackpot': '0.1％の大賞を勝つチャンス',

    // questions
    'freq_questions': '一般的な問題',

    // 2018-09-25 added
    'hit_error_100': 'アカウント残高不足',
    'hit_error_200': '間違ったアドレス',
    'hit_error_300': 'コールバック関数のパラメータがない',
    'account_balance': 'アカウント残高 <b style="color: #c472a2;font-weight:400;">{n}</b> ETH',
    'hit_win': '勝った！',
    'hit_lose': '負けった',
    'transaction_confirm': 'ベットの金額を確認してください',
    'transaction_sent': 'ベットも送信されました！',
    'transaction_wait': 'イーサリアムをも待ち下さい',
    'button_playagain': '再びプレー',
    'transaction_cancel': 'あなたのベットはもうキャンセルしました',
    'back_to_fck': 'FCKに戻る',

    // 2018-09-30
    'wait_transaction': 'When the transaction is completed, it will show that in the history of game, if you don\'t want to wait, you can click on the top button to continue the game.',

    // 2018-10-08
    'jackpot_history': '大賞歴',

    // 2018-10-09
    'advice_gas_price': 'Recommended gas price: {gasPrice}',

    // 2018-11-08
    coin_head_tail: '表/裏',
    roll_area: 'ranges',

    stat_title: '各ゲームの統計値',
    stat_recent: '直前',
    stat_round: 'ラウンド',
    stat_result: '結果',
    stat_winRatio: '勝率',
    stat_maxContinuous: '連続出現回数',
    stat_maxAmount: '最大ベット',
    stat_infoText: [
        '直前[total]ラウンド',
        '直前[total]ラウンド',
        '直前[total]ラウンド',
        '直前[total]ラウンド',
        '直前[total]ラウンド',
    ],

    stat_myStat: '個人統計情報',
    stat_my_totalAmount: '合計ベット金額',
    stat_my_betTimes: '合計ベット回数',
    stat_my_winRatio: '平均勝率',
    stat_my_winTimes: '合計勝利回数',
    stat_my_maxAmount: 'ゲームの最大ベット金額',
    stat_my_maxWin: 'ゲームの最大勝利金額',
    stat_my_note: 'The Statistics Data is From Your Recent 100 Bets',
}
