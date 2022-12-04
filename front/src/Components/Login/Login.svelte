<script lang="ts">
    import { authApi } from "../../api/authApi";
    import { currentUser } from "../../Stores/currentUserStore";
    import {
        loginVisibilityStore,
        adminPageVisibilityStore,
        registerVisibilityStore,
    } from "../../Stores/LoginVisibilityStore";
    import type { User } from "../../interface/entity/User";

    let username: string;
    let password: string;

    function login() {
        console.log("login", { username, password });
        authApi.login(username, password).then((res) => {
            console.log("authApi.login res", res);
            if (res.success) {
                goToAdminPage();
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
                goToMain();
            }
        })
        .catch((err) => {
            console.warn(`Can't get login user`);
        });
</script>

<div class="login-main">
    <div class="login-container">
        <div class="text">Login</div>
        <div class="fields-container">
            <div class="field">
                <div class="title">username</div>
                <input type="text" bind:value={username} />
            </div>
            <div class="field">
                <div class="title">password</div>
                <input type="password" bind:value={password} />
            </div>
        </div>
        <div class="btn" on:click={login}>
            <span>Login</span>
        </div>
        <div class="btn" on:click={goToRegister}>
            <span>Register</span>
        </div>
    </div>
</div>

<style lang="scss">
    #login-btn {
    }
    .login-main {
        border: 3px solid red;
    }
    .login-container {
        border: 3px solid cyan;
    }
</style>
