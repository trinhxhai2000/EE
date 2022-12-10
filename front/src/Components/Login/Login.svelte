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

    let username: string;
    let password: string;
    let validationMessage: string = "";

    onMount(() => {
        headerDataStore.setHeaderTitle("Login");
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

    function login() {
        // reset previous state
        validationMessage = "";

        const validateResult = validateInput();
        if (!validateResult.success) {
            validationMessage = validateResult.message;
            return;
        }

        console.log("login", { username, password });
        authApi.login(username, password).then((res) => {
            console.log("authApi.login res", res);
            if (res.success) {
                flashStore.showSuccessFlash("Login successful!");
                goToMain();
            } else {
                if (res.message) {
                    flashStore.showErrorFlash(res.message);
                } else {
                    flashStore.showErrorFlash(ErrorMessage.UNEXPECTED_ERROR);
                }
            }
        });
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

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            login();
        }
    }
</script>

<svelte:window on:keydown={onKeyDown} />
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
    }

    .message-container {
        /* @include debugChangePass(2px, pink); */
        padding: 10px 20px;
        .message {
            color: $error-color;
        }
    }
</style>
