<script lang="ts">
    import { waitingModalStore } from "../Stores/modalStore";
    import { loginVisibilityStore } from "../Stores/LoginVisibilityStore";
    import ConfirmModal from "./Modal/ConfirmModal.svelte";
    import InfoModal from "./Modal/InfoModal.svelte";
    import WaitingModal from "./Modal/WaitingModal.svelte";
    import Login from "./Login/Login.svelte";
    import Main from "./Main/Main.svelte";

    export let game: Phaser.Game | undefined;
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
