<script lang="ts">
    import { authApi } from "../../api/authApi";

    import { navigate } from "svelte-routing";
    import { flashStore } from "../../Stores/FlashStore";
    import { ValidationUtils } from "../../Utils/ValidationUtils";
    import { onMount } from "svelte";
    import { headerDataStore } from "../../Stores/HeaderStore";

    let username: string;
    let password: string;

    let validationMessage: string = "";
    onMount(() => {
        headerDataStore.setHeaderTitle("Register");
    });

    function validateInput(): { success: boolean; message: string } {
        const result = {
            success: false,
            message: "",
        };

        if (!username || username === "") {
            result.message = ValidationUtils.emptyMessage("Username");
            return result;
        }
        if (!password || password === "") {
            result.message = ValidationUtils.emptyMessage("Password");
            return result;
        }

        if (username.length < 5) {
            result.message = "Username should have at least 5 characters!";
            return result;
        }

        if (password.length < 5) {
            result.message = "Password should have at least 5 characters!";
            return result;
        }

        result.success = true;
        return result;
    }

    function register() {
        const validateResult = validateInput();
        if (!validateResult.success) {
            validationMessage = validateResult.message;
            return;
        }

        // console.log("register ", {
        //     username,
        //     password,
        // });

        authApi.register(username, password).then((res) => {
            // console.log("authApi.register res", res);
            if (res.success) {
                flashStore.showSuccessFlash("Login successful!");
                goToLogin();
            }
        });
    }

    function closeRegister() {}

    function goToLogin() {
        navigate("/login");
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            register();
        }
        // if (e.key === "Enter") {
        //     confirmModalStore?.yesConfirm();
        // }
    }
</script>

<svelte:window on:keydown={onKeyDown} />
<div class="register-page">
    <div class="page-header page-title-text">Register</div>
    <div class="register-container">
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
            <div class="raw-btn-small raw-btn" on:click={register}>
                <span>Register</span>
            </div>
            <div class="raw-btn-small raw-btn" on:click={goToLogin}>
                <span>Login</span>
            </div>
        </div>
        <div class="message-container">
            <div class="message">
                <i>
                    {validationMessage !== "" ? "* " + validationMessage : ""}
                </i>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";

    .register-page {
        /* @include debugLogin(2px, green); */
        /* display: flex; */
        /* justify-content: center; */
        padding: $page-padding;
    }
    .register-container {
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

    .message-container {
        /* @include debugChangePass(2px, pink); */
        padding: 10px 20px;
        .message {
            color: $error-color;
        }
    }
</style>
