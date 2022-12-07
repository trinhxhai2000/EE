<script lang="ts">
    import {
        LIST_GAME,
        currentGameStore,
    } from "../../Stores/CurrentGameSceneStore";
    import CloudShootLayout from "../Game/CloudShootLayout.svelte";

    // game
    export let game: Phaser.Game | undefined;

    function onChooseCloudShooting() {
        currentGameStore.set(LIST_GAME.CLOUD_SHOOT);
    }
</script>

<div class="main-container">
    <!-- some thing common like back to home -->

    {#if $currentGameStore === null}
        <div class="select-game-layout">
            <div class="option-game raw-btn" on:click={onChooseCloudShooting}>
                CloudShooting
            </div>
        </div>
    {:else}
        <div class="game-layout-container">
            {#if $currentGameStore === LIST_GAME.CLOUD_SHOOT}
                <CloudShootLayout {game} />
            {/if}
        </div>
    {/if}
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";

    .select-game-layout {
        padding: 50px;
    }

    .option-game {
        width: 280px;
        height: 140px;
        font-size: 22px;
    }
    .main-container {
        width: 100%;
        height: 100%;
    }

    .game-layout-container {
        position: absolute;
        @include debug(5px, cyan);
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .top-left {
        @include debug(5px, pink);
        height: 100px;
        width: 100px;
        top: 0;
        left: 0;
    }

    .bottom-right {
        @include debug(5px, green);
        height: 100px;
        width: 100px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>
