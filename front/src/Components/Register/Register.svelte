<script lang="ts">
    import { authApi } from "../../api/authApi";

    import { navigate } from "svelte-routing";

    let username: string;
    let password: string;

    function register() {
        console.log("register ", {
            username,
            password,
        });

        authApi.register(username, password).then((res) => {
            console.log("authApi.register res", res);
        });
    }

    function closeRegister() {}

    function goToLogin() {
        navigate("/login");
    }
</script>

<div class="login-main">
    <div class="login-container">
        <div class="text">Register</div>
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
        <div class="btn-effect" on:click={register}>
            <span>Register</span>
        </div>
        <div class="btn-effect" on:click={goToLogin}>
            <span>Login</span>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";
    #login-btn {
    }
    .login-main {
        @include debug(3px, red);
    }
    .login-container {
        @include debug(3px, cyan);
    }
</style>
