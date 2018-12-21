<template>
    <div class="question">
        <div class="wrap">
            <template v-if="locale === 'zh-CN'">
                <h1>哪种在线博彩游戏可以证明其公平性？</h1>
                <p>简单来说，
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Provably_fair">可以证明其公平性</a>意味着任何投注结果都可以进行独立验证，并且运营商或其他玩家都没有办法来篡改结果。</p>
                <h1>
                    luck.cafe是否可以证明其公平性？</h1>
                <p>是的。 整个游戏玩法都由以太坊
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Ethereum#Smart_contracts">智能合约</a>进行控制，它会根据运营商的输入以及区块链数据(区块哈希)计算随机数。 任何一方都可以对合约进行审核，并检查任何交易，确保luck.cafe以及恶意玩家都不会影响结果。</p>
                <h1>您与其他博彩网站有什么不同？</h1>
                <p>与竞争对手的网站相比，在 luck.cafe上进行下注的交易费用要低得多 - 它可以提供低至0.01 以太幣的投注。 我们的游戏非常简单易懂，就像抛硬币或掷骰子一样。</p>
                <p>当然，我们还提供大奖！</p>
                <h1>您明白了吗？ 请尽可能用通俗易懂的方式向我解释一下它是如何运作的。</h1>
                <p>在这个问题上，我们必须要说点技术性的东西：
                    <ol>
                        <li> luck.cafe会选择一个秘密的随机数，并为您提供它的
                            <a target="_blank" href="https://en.wikipedia.org/wiki/Cryptographic_hash_function">哈希</a>。</li>
                        <li>您把以太网交易中的赌注与上一步中的哈希一起发送至我们的智能合约。</li>
                        <li>此时，在您选择结果之前，luck.cafe已经承诺了一个数字。</li>
                        <li>一旦您的交易被网络确认，该合约将会存储哈希以及投注详细信息。</li>
                        <li>我们的庄家机器人会通过发送投注结算交易来“揭晓”该数字。</li>
                        <li>当且仅当提供的数字的哈希与存储的哈希相同时，合约才会接受该交易。</li>
                        <li>合约会把下注交易的数量和区块哈希进行混合以获得一个随机数。</li>
                        <li>合约会决定您是赢还是输，并向您发送您所赢取的以太币。</li>
                    </ol>luck.cafe是否可以篡改结果？ 不可以，因为合约记录了秘密数字的哈希，这就意味着运营商在接受赌注后就无法更改数字。 将区块哈希与数字进行混合，这使得其结果完全是随机的，不允许矿工们耍花招来赢取赌注。 另一方面，由于区块哈希组件，luck.cafe本身无法控制投注结果。 这就是众所周知的
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Commitment_scheme">“承诺方案”</a>，它使luck.cafe能够提供博彩级的随机数生成，可以进行大赌注、累积大奖以及快速结算，同时完全透明。</p>
                <h1>如果我
                    <strong>确实想要</strong>验证您所说的一切是否真实，该怎么做？</h1>
                <p>请随意研究我们的智能合约 - 您可以在
                    <a target="_blank" href="https://github.com/">Github上找到它</a>。 如果您有任何疑问或犹豫，请通过
                    <a target="_blank" href="https://t.me/joinchat/IiFS9wy4VDQpB8uCQ9Fiug">Telegram</a>或
                    <a target="_blank" href="mailto:admin@luck.cafe">电子邮件</a>联系我们。</p>
                <h1>费用是多少？</h1>
                <p>每次下注时， luck.cafe 均会扣除1％(但不低于0.0003 以太幣)，(以帮助我们支付账单并使游戏可以运行），并且，0.1 以太幣以上的赌注会在累积大奖中累积0.001 以太幣以上（这也使得这些赌注会参与累积大奖！）</p>
                <h2>祝您玩得愉快！</h2>
            </template>
            <template v-else-if="locale === 'ru'">
                <div class="wall-of-text">
                    <h1>Что означает термин "доказуемая честность"?</h1>
                    <p>Простыми словами,
                        <a target="_blank" href="https://en.wikipedia.org/wiki/Provably_fair">доказуемая честность</a> означает, что исход любой ставки можно подвергнуть независимой проверке; а также то, что не существует способа повлиять на результат ни со стороны игроков, ни со стороны оператора.</p>
                    <h1>Является ли
                        luck.cafe "доказуемо честным"?</h1>
                    <p>Конечно. Весь игровой процесс контролируется
                        <a target="_blank" href="https://en.wikipedia.org/wiki/Ethereum#Smart_contracts">смарт-контрактом</a> Ethereum, который вычисляет случайные числа на основании данных оператора и состояния блокчейна (хешей блоков). Кто угодно может произвести аудит исходного кода контракта, а также проверить каждую транзакцию в блокчейне, дабы убедиться, что ни luck.cafe, ни злонамеренные игроки не влияют на исходы ставок.</p>
                    <h1>В чем ваше отличие от других подобных сайтов?</h1>
                    <p>Комиссии
                        luck.cafe гораздо меньше чем у конкурентов, что дает возможность делать ставки много меньшего размера − вплоть до 0.01 ETH. Наши игры просты и понятны - как бросок монеты или кубика.</p>
                    <p>Ну и конечно же, у нас есть джекпот!</p>
                    <h1>В чем подвох? Объясните, как это работает</h1>
                    <p>Ну, нам придется немного углубиться в технические детали:
                        <ol>
                            <li>luck.cafe загадывает число и отправляет вам его
                                <a target="_blank" href="https://en.wikipedia.org/wiki/Cryptographic_hash_function">хэш</a>.</li>
                            <li>Вы отправляете транзакцию с вашей ставкой и хэшом числа из предыдущего шага.</li>
                            <li>Заметьте, что luck.cafe уже "подписался" под это число, еще до вашей ставки.</li>
                            <li>Когда транзакция подтверждается сетью, смарт-контракт запоминает детали ставки и хэш числа.</li>
                            <li>Наш бот-крупье "вскрывает" загаданное число, отправляя его отдельной транзакцией.</li>
                            <li>Смарт-контракт принимает транзакцию тогда и только тогда, когда хэш присланного числа совпадает с запомненным.</li>
                            <li>Смарт-контракт "смешивает" число и хэш блока ставки, чтобы получить случайное число.</li>
                            <li>Полученное число используется для определения исхода ставки. В случае выигрыша, смарт-контракт отправляет вам Эфир.</li>
                        </ol>Может ли luck.cafe влиять на исход? Нет, так как контракт запоминает хэш числа, а значит, luck.cafe не может поменять его впоследствии. "Смешивание" числа с хэшом блока делает невозможным влияние на результат со стороны майнеров. С другой стороны, luck.cafe не может влиять на результат (несмотря на то, что числа генерируются нашим сервером), так как мы не можем предсказывать хэши блоков. Все описанное выше - это хорошо известная
                        <a target="_blank" href="https://en.wikipedia.org/wiki/Commitment_scheme">"commitment scheme"</a>, благодаря которой luck.cafe предоставляет высококачественный генератор случайных чисел, позволяющий играть по-крупному, поддерживать джекпот и при этом сохранять прозрачность.</p>
                    <h1>А что если я
                        <strong>очень</strong> хочу убедиться, что это все правда?</h1>
                    <p>Нет проблем, взгляните на исходный код нашего смарт-контракта - он доступен на
                        <a target="_blank" href="https://github.com/">Github</a>. Ну а если останутся вопросы, добро пожаловать к нам в
                        <a target="_blank" href="https://t.me/FCK_Official">Telegram</a>,
                        <a target="_blank" href="https://twitter.com/FCKGameCenter">Twitter</a> или
                        <a target="_blank" href="mailto:fckteamwork@gmail.com">e-mail</a>.</p>
                    <h1>Каков размер вашей комиссии?</h1>
                    <p>Мы берем 1% с каждой ставки (но не менее чем 0.0003 ETH), чтобы поддерживать работу серверов и инженеров, а также переводим 0.001 ETH в джекпот для ставок от 0.1 ETH (эти ставки автоматически участвуют в розыгрыше джекпота!)</p>
                    <h2>Удачной игры!</h2>
                </div>
            </template>
            <template v-else>
                <h1>What is provably fair on-chain gambling?</h1>
                <p>Simply put,
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Provably_fair">provably fair</a> means that any bet outcome can be independently verified and that the operator or other players have no means of tampering with the result.</p>
                <h1>Is luck.cafe provably fair?</h1>
                <p>Yes. The whole gameplay is controlled by Ethereum
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Ethereum#Smart_contracts">Smart Contract</a> that computes random numbers based on operator inputs and blockchain data (block hashes). Any party can audit the contract as well as inspect any transaction to make sure that neither luck.cafe nor malicious players are influencing the results.</p>
                <h1>How are you different from the other gambling sites?</h1>
                <p>Placing a bet on luck.cafe has much lower transaction fee compared to competing websites − this allows supporting bets as low as 0.01 ETH. Our games are very simple &amp; easily understandable, just like tossing a coin or rolling a luck.cafe.</p>
                <p>And, of course, we have jackpot!</p>
                <h1>Is there any catch? Explain how it works like I'm five.</h1>
                <p>This is where we have to get a bit technical:
                    <ol>
                        <li>luck.cafe picks a secret random number and provides you with its
                            <a target="_blank" href="https://en.wikipedia.org/wiki/Cryptographic_hash_function">hash</a>.</li>
                        <li>You send your bet in Ethereum transaction to our smart contract along with the hash from previous step.</li>
                        <li>At this point luck.cafe has already commited to a number, prior to you chosing an outcome.</li>
                        <li>Once your transaction is confirmed by the network, the contract stores the hash and bet details.</li>
                        <li>Our croupier bot "reveals" the number by sending a bet settling transaction.</li>
                        <li>The contract accepts the transaction if and only if the hash of provided number is the same as the stored one.</li>
                        <li>The contract mixes the number and block hash of the bet transaction to get a random number.</li>
                        <li>The contract decides whether you won or lost and sends you the winning amount of Ether.</li>
                    </ol>Can luck.cafe tamper with the results? Nope, as the contract keeps track of secret number's hash, meaning the operator cannot change the number after the bet has been accepted. Mixing the block hash with the numbers makes the result totally random yet disallows miners from crafting winning bets. On the other hand, luck.cafe themselves cannot control bet outcomes either because of block hash component. This is a well-known
                    <a target="_blank" href="https://en.wikipedia.org/wiki/Commitment_scheme">"commitment scheme"</a> which enables luck.cafe to provide gambling-grade random number generation allowing for big bets, jackpots and quick settlements while being fully transparent.</p>
                <h1>What if I want to
                    <strong>really</strong> verify that everything you say is actually true?</h1>
                <p>Feel free to study our Smart Contract - it's available on
                    <a target="_blank" href="https://github.com/">Github</a>. In case you have any questions or hesitations, drop us a line via
                    <a target="_blank" href="https://t.me/FCK_Official">Telegram</a>,
                    <a target="_blank" href="https://twitter.com/FCKGameCenter">Twitter</a> or
                    <a target="_blank" href="mailto:fckteamwork@gmail.com">e-mail</a>.</p>
                <h1>What are the fees?</h1>
                <p>Every bet is deducted 1% (but no less than 0.0003 ETH) in favour of the luck.cafe (to help us pay the bills and keep the game running) and 0.001 ETH more gets accumulated in the jackpot for bets of 0.1 ETH and up (which also makes these bets participate in jackpot!)</p>
                <h2>Happy playing!</h2>
            </template>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'Question',

    data() {
        return {}
    },

    computed: {
        ...mapState(['locale'])
    }
}
</script>

<style lang="scss" scoped>
.wrap {
    padding: 50px 10px;
    color: rgba(255,255,255,.8);
}
h1,
h2 {
    font-size: 18px;
    font-weight: 400;
}
h2 {
    text-align: center;
}
strong {
    font-weight: 500;
}
</style>

