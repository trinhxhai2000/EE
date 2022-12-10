<script lang="ts">
    import { authApi } from "../../../api/authApi";
    import { currentUser } from "../../../Stores/CurrentUserStore";
    import type { User } from "../../../interface/entity/User";
    import { flashStore } from "../../../Stores/FlashStore";
    import { navigate } from "svelte-routing";
    import {
        userSession,
        userSessionStore,
    } from "../../../Stores/UserSessionStore";
    import { get } from "svelte/store";
    import { ValidationUtils } from "../../../Utils/ValidationUtils";
    import { userApi } from "../../../api/userApi";

    let currentPassword: string;
    let newPassword: string;
    let confirmPassword: string;
    let validationMessage: string = "";

    function change() {
        const validateResult = validateInput();
        if (!validateResult.success) {
            validationMessage = validateResult.message;
            return;
        }
        userApi
            .changePassword(currentPassword, newPassword)
            .then((res) => {
                if (res.success) {
                    flashStore.showSuccessFlash("Change password success!");
                } else {
                    if (res.message) {
                        validationMessage = res.message;
                    } else {
                        validationMessage =
                            "Something went wrong please reload or try later!";
                    }
                }
            })
            .catch((err) => {
                flashStore.showErrorFlash(
                    "Something went wrong please reload or try later!"
                );
            });

        // console.log("login", { username, password });
        // authApi.login(username, password).then((res) => {
        //     console.log("authApi.login res", res);
        //     if (res.success) {
        //         flashStore.showSuccessFlash("Login successful!");
        //         goToMain();
        //     }
        // });
    }

    function validateInput(): { success: boolean; message: string } {
        const result = {
            success: false,
            message: "",
        };

        if (!currentPassword || currentPassword === "") {
            result.message = ValidationUtils.emptyMessage("Current password");
            return result;
        }
        if (!newPassword || newPassword === "") {
            result.message = ValidationUtils.emptyMessage("New password");
            return result;
        }
        if (!confirmPassword || confirmPassword === "") {
            result.message = ValidationUtils.emptyMessage("Confirm password");
            return result;
        }

        if (newPassword !== confirmPassword) {
            result.message = "New password not match confirm password!";
            return result;
        }

        result.success = true;
        return result;
    }

    function closeLogin() {}
    function goToRegister() {
        navigate("/register");
    }
    function goToAdminPage() {
        // console.log("goToAdminPage");
        // closeLogin();
        // adminPageVisibilityStore.set(true);
        navigate("/admin");
    }

    function goToMain() {
        navigate("/");
    }

    function onKeyDown(e: KeyboardEvent) {
        if (e.key === "Enter") {
            change();
        }
        // if (e.key === "Enter") {
        //     confirmModalStore?.yesConfirm();
        // }
    }
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="change-password-page">
    <div class="page-header page-title-text">Change password</div>
    <div class="login-container">
        <div class="fields-container">
            <div class="field">
                <div class="title field-text">Current password</div>
                <input type="password" bind:value={currentPassword} />
            </div>
            <div class="field">
                <div class="title field-text">New password</div>
                <input type="password" bind:value={newPassword} />
            </div>

            <div class="field">
                <div class="title field-text">Confirm password</div>
                <input type="password" bind:value={confirmPassword} />
            </div>
        </div>
        <div class="button-container">
            <div class="raw-btn-small raw-btn" on:click={change}>
                <span>Change</span>
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
    @import "../../../../style/breakpoints.scss";
    @import "../../../../style/common.scss";

    .change-password-page {
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
    .message-container {
        /* @include debugChangePass(2px, pink); */
        padding: 10px 20px;
        .message {
            color: $error-color;
        }
    }
</style>
