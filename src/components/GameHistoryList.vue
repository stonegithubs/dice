<template>
    <ul>
        <!-- 游戏历史 -->
        <li v-for="(item,index) in histories" :key="index" :class="{jackpot: item.jackpot == 0}">
            <div class="item" @click="expand(index)">
                <span class="addr">
                    <template v-if="item.isMine">{{mineText}}</template>
                    <template v-else>{{item.gambler | address | format(8, 40, '')}}</template>
                </span>
                <span class="bet">
                    <em>{{item.bet | fixed(2)}}</em>
                    <div class="bet-container">
                        <em v-if="item.modulo===100" :class="[userClass]" v-html="item.hit.join('')"></em>
                        <em v-else v-for="(hit, index) in item.hit" :key="index" :class="[userClass, getUserHitOnClass(hit)]">
                            <b></b>
                            <b></b>
                        </em>
                    </div>
                </span>
                <span class="result" :class="{win: item.wins > 0}">
                    <template v-if="modulo === 100">
                        <em :class="resultClass">{{item.sha3_mod_n}}</em>
                    </template>
                    <template v-else-if="modulo === 36">
                        <em v-for="(resultItem, rIndex) in item.modResultArray" :key="rIndex" :class="[resultClass, getUserHitOnClass(Number(resultItem), true)]">
                            <b></b>
                            <b></b>
                        </em>
                    </template>
                    <template v-else>
                        <em :class="[resultClass, getUserHitOnClass(item.result)]">
                            <b></b>
                            <b></b>
                        </em>
                    </template>

                    <em v-if="item.wins">{{item.swins | fixed(4)}}</em>
                    <em v-else>—</em>
                </span>
                <span class="prize">{{item.jackpot}}</span>
                <span class="icon iconfont" :class="[current===index?'icon-arrowdown':'icon-arrowright']"></span>
            </div>
            <div class="detail" v-if="current==index" :key="item.id">
                <div class="row">
                    <strong>{{$t('game_player_addr')}}</strong>
                    <span>
                        <a :href="item.gamblerLink" target="_blank">{{item.gambler}}</a>
                    </span>
                </div>
                <div class="row">
                    <strong>{{$t('game_player_bet')}}</strong>
                    <span>{{item.bet | fixed(2)}} ETH</span>
                </div>
                <div class="row">
                    <strong>{{$t('game_player_hit')}}</strong>
                    <span v-html="item.hit.join(modulo===100?'':',')"></span>
                </div>
                <div class="row">
                    <strong>bet trx</strong>
                    <span>
                        <a :href="item.trxLink" target="_blank">{{item.bet_tx}}</a>
                    </span>
                </div>
                <div class="row">
                    <strong>entropy</strong>
                    <span>{{item.entropy}}</span>
                </div>
                <div class="row">
                    <strong>secret</strong>
                    <span>{{item.secret}}</span>
                </div>
                <div class="row">
                    <strong>bet block</strong>
                    <span>{{item.bet_block}}</span>
                </div>
                <div class="row">
                    <strong>sha3 mod {{item.modulo}}</strong>
                    <span>{{item.modResult}}</span>
                </div>
                <div class="row">
                    <strong>jackpot</strong>
                    <span>{{item.jackpot}}</span>
                </div>
                <div class="row">
                    <strong>{{$t('game_win')}}</strong>
                    <span>{{item.swins | fixed(4)}} ETH</span>
                </div>
                <div class="row">
                    <strong>Time</strong>
                    <span>{{core.getDate(item.time)}}</span>
                </div>
            </div>
        </li>
    </ul>
</template>

<script>
export default {
    name: 'GameHistoryList',

    data() {
        return {}
    },

    props: [
        'modulo',
        'histories',
        'mineText',
        'getUserHitOnClass',
        'userClass',
        'resultClass',
        'current'
    ],

    computed: {},

    methods: {
        expand(index) {
            this.$emit('expand', index)
        }
    }
}
</script>
