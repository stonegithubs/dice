<template>
    <nav class="game-list">
        <div class="wrap">
            <ul>
                <li v-for="(game,i) in games" :key="i" :class="{current: [currentGame, curGame].includes(game.name)}">
                    <div class="logo" :class="['logo-'+game.name]" @click="gotoGame(game.name)">
                        <em>{{game.title}}</em>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { mapState } from 'vuex'

export default {
    name: 'BearNav',

    data() {
        return {
            curGame: '',
        }
    },

    computed: {
        ...mapState(['currentGame', 'rid']),

        games() {
            const { $t: t } = this

            return [
                {
                    title: t('coinflip_name'),
                    name: 'coin'
                },
                {
                    title: t('dice_name'),
                    name: 'dice'
                },
                {
                    title: t('dice2_name'),
                    name: 'dice2'
                },
                {
                    title: t('etheroll_name'),
                    name: 'roll'
                }
            ]
        }
    },

    methods: {
        gotoGame(game) {
            const rnd = Math.random().toString(16).substring(2, 4),
                { rid } = this
            location.href = location.href.replace(/(\?.+|#.+)/, `?${rnd}#/${game}?rid=${rid}`)
        }
    }
}
</script>

<style lang="scss" scoped>
.game-list {
    margin-top: 60px;

    ul {
        display: flex;
        justify-content: center;
        align-items: center;
        padding-bottom: 30px;
        background: url(../assets/img/plate.png) no-repeat center bottom/100%
            55px;
        font-size: 18px;
    }

    li {
        width: 22%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 200ms ease;

        &:hover {
            opacity: 0.8;
        }

        &.current {
            transform: translateY(-30px);
            color: #cba38c;

            &:hover {
                opacity: 1;
            }

            .logo {
                cursor: default;
            }

            .logo::before {
                filter: drop-shadow(0 0 10px #caaa99)
                    drop-shadow(0 0 2px rgba(#caaa99, 0.3));
            }
            .logo-coin::before {
                background-image: url(/logo/logo-coin-hover.png);
            }
            .logo-dice::before {
                background-image: url(/logo/logo-dice-hover.png);
            }
            .logo-dice2::before {
                background-image: url(/logo/logo-dice2-hover.png);
            }
            .logo-roll::before {
                background-image: url(/logo/logo-roll-hover.png);
            }
        }
    }

    .logo {
        text-align: center;
        cursor: pointer;

        &::before {
            content: "";
            display: block;
            margin: 0 auto 8px;
            width: 40px;
            height: 40px;
            background-repeat: no-repeat;
            background-position: center top;
            background-size: contain;
        }
        &.logo-coin::before {
            background-image: url(/logo/logo-coin.png);
        }
        &.logo-dice::before {
            background-image: url(/logo/logo-dice.png);
        }
        &.logo-dice2::before {
            background-image: url(/logo/logo-dice2.png);
        }
        &.logo-roll::before {
            background-image: url(/logo/logo-roll.png);
        }
    }
}

@media screen and (max-width: 750px) {
    ul {
        padding-bottom: 5px !important;
        font-size: 14px !important;
    }
    li.current {
        transform: translateY(0) !important;
    }
    .logo::before {
        width: 40px !important;
        height: 40px !important;
    }
}
</style>
