<script lang="ts">
    import {
        confirmModalStore,
        infoModalStore,
        waitingModalStore,
    } from "../Stores/modalStore";
    import { loginVisibilityStore } from "../Stores/LoginVisibilityStore";
    import ConfirmModal from "./Modal/ConfirmModal.svelte";
    import InfoModal from "./Modal/InfoModal.svelte";
    import WaitingModal from "./Modal/WaitingModal.svelte";
    import Login from "./Login/Login.svelte";
    import Main from "./Main/Main.svelte";
    import { EntryScene, EntrySceneName } from "../Phaser/Scene/EntryScene";
    import { VowelSoundsGameSceneName } from "../Phaser/Scene/GameScene/Speaking/VowelSoundsGameScene";
    import { gameManager } from "../Phaser/Game/GameManager";

    export let game: Phaser.Game | undefined;
    console.log("game", game);

    // for testing
    // waitingModalStore.set("Chờ tí ỉa phát")
    setTimeout(() => {
        startTheGame();
    }, 1000);

    function startTheGame() {
        gameManager.startScene(VowelSoundsGameSceneName);
    }
</script>

<div class="main">
    <ConfirmModal />
    <InfoModal />
    {#if $waitingModalStore.length > 0}
        <WaitingModal />
        <!-- {:else if $}
    <ConfirmModal />
     -->
    {:else if $loginVisibilityStore}
        {#if game !== undefined}
            <Login {game} />
        {:else}
            <h2 style="color:red;font-weight:bold;">
                Game instance is undefined
            </h2>
        {/if}
    {:else}
        <Main />
    {/if}
</div>

<style lang="scss">
    .main {
        position: relative;
        width: 100%;
        height: 100%;
        border: 5px solid blue;
    }
    .top-left {
        border: 2px solid orange;
        height: 100px;
        width: 100px;
        top: 0;
        left: 0;
    }

    .bottom-right {
        border: 2px solid green;
        height: 100px;
        width: 100px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>
