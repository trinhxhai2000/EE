<script lang="ts">
    import { waitingModalStore } from "../Stores/ModalStore";
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
    import Flasher from "./Flasher/Flasher.svelte";
    import Header from "./Header/Header.svelte";

    import { flashStore } from "../Stores/FlashStore";
    import Footer from "./Footer/Footer.svelte";
    import { currentGameStore, LIST_GAME } from "../Stores/CurrentGameSceneStore";
    export let game: Phaser.Game | undefined;

    console.log("App component start!");
    // loginVisibilityStore.set(false);
    // currentGameStore.set(LIST_GAME.CLOUD_SHOOT)
</script>

<div class="main">
    <ConfirmModal />
    <InfoModal />

    <!-- <Main {game} /> -->
    <Flasher />

    {#if $currentGameStore === null}
        <Header />
    {/if}

    {#if $currentComponentModalStore != null}
        <ModalPlaceHolder />
    {/if}

    {#if $waitingModalStore.length > 0}
        <WaitingModal />
    {/if}

    <div class="page-container">
        {#if $loginVisibilityStore}
            <Login />
        {:else if $registerVisibilityStore}
            <Register />
        {:else if $adminPageVisibilityStore}
            <AdminPage />
        {:else}
            <Main {game} />
        {/if}

    </div>

    {#if $currentGameStore === null}
        <Footer />
    {/if}
</div>

<style lang="scss">
    @import "../../style/breakpoints.scss";
    @import "../../style/common.scss";
    .main {
        position: relative;
        width: 100%;
        height: 100%;
        /* @include debug(5px, blue); */
        overflow-y: auto;
    }
    .page-container {
        width: 96%;
        min-height: calc(100% - $header-height - $footer-height - 20px);
        /* height: 100%; */
        /* border: 4px solid $primary-color; */
        /* box-shadow: 4px 4px 10px 2px rgba($color: black, $alpha: 0.6); */
        border-radius: 4px;
        margin-left: auto;
        margin-right: auto;
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>
