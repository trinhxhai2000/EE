<script lang="ts">
    import { waitingModalStore } from "../Stores/modalStore";
    import {
        loginVisibilityStore,
        adminPageVisibilityStore,
        registerVisibilityStore,
    } from "../Stores/LoginVisibilityStore";
    import ConfirmModal from "./Modal/ConfirmModal.svelte";
    import InfoModal from "./Modal/InfoModal.svelte";
    import WaitingModal from "./Modal/WaitingModal.svelte";
    import Login from "./Login/Login.svelte";
    import Main from "./Main/Main.svelte";
    import Register from "./Register/Register.svelte";
    import AdminPage from "./Admin/AdminPage.svelte";
    import { currentComponentModalStore } from "../Stores/ComponentModal";
    import ModalPlaceHolder from "./Modal/ModalPlaceHolder.svelte";
    export let game: Phaser.Game | undefined;

    console.log("App component start!");
</script>

<div class="main">
    <ConfirmModal />
    <InfoModal />

    {#if $currentComponentModalStore != null}
        <ModalPlaceHolder />
    {/if}

    {#if $waitingModalStore.length > 0}
        <WaitingModal />
    {:else if $loginVisibilityStore}
        <Login />
    {:else if $registerVisibilityStore}
        <Register />
    {:else if $adminPageVisibilityStore}
        <AdminPage />
    {:else}
        <Main {game} />
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
