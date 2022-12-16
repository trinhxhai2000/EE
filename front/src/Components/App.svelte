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
    import ChangePassword from "./UserComponents/ChangePassword/ChangePassword.svelte";
    import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.svelte";
    import AdminRoute from "./AdminRoute/AdminRoute.svelte";
    import UserPage from "./Admin/User/UserPage.svelte";
    import UserEditPage from "./Admin/User/UserEditPage.svelte";
    import QuestionAddingPage from "./Admin/Question/QuestionAddingPage.svelte";
    import QuestionEditPage from "./Admin/Question/QuestionEditPage.svelte";
    export let game: Phaser.Game | undefined;
    import { gameSizeStore } from "../Stores/GameSizeStore";
    import { onMount } from "svelte";
    import { localUserStore } from "../Stores/localUserStore";
    import { gameManager } from "../Phaser/Game/GameManager";

    console.log("App component start!");
    onMount(() => {
        const localGameResolution = localUserStore.getGameResolution();
        console.log("localGameResolution", localGameResolution);
        if (localGameResolution !== "") {
            gameManager.changeResolution(localGameResolution);
        }
    });
</script>

<div
    class={$currentGameStore === null ? "main-admin" : "main-game"}
    style={`${
        $currentGameStore === null
            ? ""
            : `background-color: transparent; width: ${$gameSizeStore.width}px; height: ${$gameSizeStore.height}px;`
    }`}
>
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

            <!--User-->
            <Route path="/login">
                <Login />
            </Route>

            <Route path="/register">
                <Register />
            </Route>

            <Route path="/profile">
                <!-- <Profile /> -->
            </Route>
            <ProtectedRoute path="/changepassword" component={ChangePassword} />
            <AdminRoute path="/admin" component={AdminPage} />
            <AdminRoute path="/admin/user/:username" component={UserEditPage} />

            <AdminRoute path="/admin/question" component={QuestionAddingPage} />
            <AdminRoute
                path="/admin/question/:id"
                component={QuestionEditPage}
            />

            <!-- <AdminRoute path="/changepassword" component={ChangePassword} /> -->
            <Route path="/*">
                <NotFound />
            </Route>
        </div>

        <!-- <Route path="/launchpad/:id" let:params>
            <LaunchPad id={params.id} />
        </Route> -->

        <!-- END CONTENT_PAGE -->

        {#if $currentGameStore === null}
            <Footer />
        {/if}
    </Router>
</div>

<style lang="scss">
    @import "../../style/breakpoints.scss";
    @import "../../style/common.scss";
    .main-game {
        position: relative;
        width: 100%;
        height: 100%;
        border: 2px solid $primary-color;
        background-color: white;
        /* @include debug(5px, blue); */
        /* overflow-y: auto; */
    }

    .main-admin {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: white;
        border: 2px solid $primary-color;
        /* @include debug(5px, blue); */
        /* overflow-y: auto; */
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
