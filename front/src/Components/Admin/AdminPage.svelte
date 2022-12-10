<script lang="ts">
    import { authApi } from "../../api/authApi";
    import { flashStore } from "../../Stores/FlashStore";
    import { navigate } from "svelte-routing";
    import { ErrorMessage } from "../../api/ErrorMessage";
    import { get } from "svelte/store";
    import { userSession } from "../../Stores/UserSessionStore";
    import { ValidationUtils } from "../../Utils/ValidationUtils";
    import { onMount } from "svelte";
    import { headerDataStore } from "../../Stores/HeaderStore";
    import iconArrow from "../images/icon/icon-arrow.png";
    import { currentAdminPage, ADMIN_PAGES } from "../../Stores/AdminPageStore";
    import QuestionPage from "./Question/QuestionPage.svelte";
    import UserPage from "./User/UserPage.svelte";

    let username: string;
    let password: string;
    let validationMessage: string = "";

    onMount(() => {
        headerDataStore.setHeaderTitle("Login");
    });

    function login() {
        // reset previous state
        // validationMessage = "";
        // const validateResult = validateInput();
        // if (!validateResult.success) {
        //     validationMessage = validateResult.message;
        //     return;
        // }
        // console.log("login", { username, password });
        // authApi.login(username, password).then((res) => {
        //     console.log("authApi.login res", res);
        //     if (res.success) {
        //         flashStore.showSuccessFlash("Login successful!");
        //         goToMain();
        //     } else {
        //         if (res.message) {
        //             flashStore.showErrorFlash(res.message);
        //         } else {
        //             flashStore.showErrorFlash(ErrorMessage.UNEXPECTED_ERROR);
        //         }
        //     }
        // });
    }
    function goToRegister() {
        navigate("/register");
    }
    function goToAdminPage() {
        navigate("/admin");
    }

    function goToMain() {
        navigate("/");
    }

    if (get(userSession) === null) {
        authApi
            .getLoginUser()
            .then((res) => {
                if (res.success) {
                    if (!res.data) {
                        throw new Error("Something went wrong!");
                    }
                    flashStore.showSuccessFlash("Login successful!");
                    goToMain();
                } else {
                    if (res.message) {
                        flashStore.showErrorFlash(res.message);
                    } else {
                        flashStore.showErrorFlash(
                            ErrorMessage.UNEXPECTED_ERROR
                        );
                    }
                }
            })
            .catch((err) => {
                console.warn(`Can't get login user`);
            });
    }

    let currentPage: ADMIN_PAGES = get(currentAdminPage) ?? ADMIN_PAGES.USER;

    function onChangePage(e: Event) {
        console.log("currentPage", currentPage);
        currentAdminPage.set(currentPage);
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            login();
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="admin-page">
    <div class="page-header">
        <select bind:value={currentPage} on:change={onChangePage}>
            <option value={ADMIN_PAGES.USER}>User</option>
            <option value={ADMIN_PAGES.QUESTION}>Question</option>
        </select>
    </div>
    <div class="admin-container">
        {#if $currentAdminPage === ADMIN_PAGES.QUESTION}
            <QuestionPage />
        {:else}
            <UserPage />
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";

    .admin-page {
        /* display: flex; */
        /* justify-content: center; */
        padding: $page-padding;
    }
    .page-header {
        select {
            display: block;
            border: 5px solid $primary-color;
            border-radius: 0px 20px 20px 0px;
            padding: 5px;
            width: 200px;
            height: 60px;
            font-size: 25px;
        }
    }
    .admin-container {
        /* border: 2px solid $primary-color; */
        /* @include debugLogin(3px, cyan); */
    }
</style>
