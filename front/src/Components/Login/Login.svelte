<script lang="ts">
    import { authApi } from "../../api/authApi";
    import { currentUser } from "../../Stores/CurrentUserStore";
    import {
        loginVisibilityStore,
        adminPageVisibilityStore,
        registerVisibilityStore,
    } from "../../Stores/LoginVisibilityStore";
    import type { User } from "../../interface/entity/User";
    import { flashStore } from "../../Stores/FlashStore";

    let username: string;
    let password: string;

    function login() {
        console.log("login", { username, password });
        authApi.login(username, password).then((res) => {
            console.log("authApi.login res", res);
            if (res.success) {
                flashStore.showSuccessFlash("Login successful!");
                goToMain();
            }
        });
    }
    function closeLogin() {
        loginVisibilityStore.set(false);
    }
    function goToRegister() {
        console.log("goToRegister");
        closeLogin();
        registerVisibilityStore.set(true);
    }
    function goToAdminPage() {
        console.log("goToAdminPage");
        closeLogin();
        adminPageVisibilityStore.set(true);
    }

    function goToMain() {
        closeLogin();
    }

    authApi
        .getLoginUser()
        .then((res) => {
            console.log("authApi.getLoginUser res", res);
            if (res.success) {
                if (!res.data) {
                    throw new Error("Something went wrong!");
                }
                currentUser.set(res.data as User);
                flashStore.showSuccessFlash("Login successful!");
                goToMain();
            }
        })
        .catch((err) => {
            console.warn(`Can't get login user`);
        });
</script>

<div class="login-page">
    <div class="page-header page-title-text">Login</div>
    <div class="login-container">
        <div class="fields-container">
            <div class="field">
                <div class="title field-text">username</div>
                <input type="text" bind:value={username} />
            </div>
            <div class="field">
                <div class="title field-text">password</div>
                <input type="password" bind:value={password} />
            </div>
        </div>
        <div class="button-container">
            <div class="raw-btn-small raw-btn" on:click={login}>
                <span>Login</span>
            </div>
            <div class="raw-btn-small raw-btn" on:click={goToRegister}>
                <span>Register</span>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";
    #login-btn {
    }
    .login-page {
        /* @include debugLogin(2px, green); */
        /* display: flex; */
        /* justify-content: center; */
        padding: $page-padding;
    }
    .login-container {
        /* border: 2px solid $primary-color; */
        /* @include debugLogin(3px, cyan); */
    }
    .fields-container {
        padding: 10px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        .field {
            .title {
                margin-bottom: 3px;
            }
        }
    }

    .button-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        gap: 10px;
        margin-top: 20px;
        .btn {
        }
    }
</style>
