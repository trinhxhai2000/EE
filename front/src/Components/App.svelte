<script lang="ts">
    import { Router, links, Route } from "svelte-routing";
    import { waitingModalStore } from "../Stores/ModalStore";

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
    import {
        currentGameStore,
        LIST_GAME,
    } from "../Stores/CurrentGameSceneStore";
    import NotFound from "./NotFound/NotFound.svelte";
    import Profile from "./ProfileButton/ProfileButton.svelte";
    export let game: Phaser.Game | undefined;

    console.log("App component start!");
</script>

<div class="main">
    <!-- <Main {game} /> -->
    <Router url="" basepath="/">
        <!-- BEGIN MODAL-->
        <ConfirmModal />
        <InfoModal />
        {#if $currentComponentModalStore != null}
            <ModalPlaceHolder />
        {/if}

        {#if $waitingModalStore.length > 0}
            <WaitingModal />
        {/if}
        <!-- END MODAL-->

        <!-- <WaitingModal /> -->
        {#if $currentGameStore === null}
            <Header />
        {/if}

        <Flasher />

        <!-- BEGIN CONTENT_PAGE -->

        <div class="page-container">
            <Route path="/">
                <Main {game} />
            </Route>

            <Route path="/login">
                <Login />
            </Route>

            <Route path="/register">
                <Register />
            </Route>

            <Route path="/profile">
                <!-- <Profile /> -->
            </Route>
        </div>

        <!-- <Route path="/launchpad/:id" let:params>
            <LaunchPad id={params.id} />
        </Route> -->

        <Route path="/*">
            <NotFound />
        </Route>

        <!-- END CONTENT_PAGE -->

        {#if $currentGameStore === null}
            <Footer />
        {/if}
    </Router>
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
