<script lang="ts">
    import { onMount } from "svelte";
    import { navigate } from "svelte-routing";
    import { get } from "svelte/store";
    import { authApi } from "../../api/authApi";
    import { USER_ROLE } from "../../interface/api/UserInterfaces";
    import { flashStore } from "../../Stores/FlashStore";
    import { userSession } from "../../Stores/UserSessionStore";
    import iconArrow from "../images/icon/icon-arrow.png";
    import iconProfile from "../images/icon/icon-profile.png";

    let isOpenDropDown = false;
    let username = "trinhxhai";
    let isAdmin = true;

    onMount(() => {
        const user = get(userSession);
        if (user) {
            username = user.username;
            isAdmin = user.role == USER_ROLE.ADMIN;
        }
    });

    function clickProfile() {
        isOpenDropDown = !isOpenDropDown;
    }

    function logout() {
        authApi.logout().then((res) => {
            console.log("logout response", res);
            if (res.success === true) {
                flashStore.showSuccessFlash("Logout successful !");
            } else {
                flashStore.showErrorFlash(res.message ?? "");
            }
        });
    }
    function goToChangePassword() {
        isOpenDropDown = false;
        navigate("/changepassword");
    }

    function goToAdmin() {
        isOpenDropDown = false;
        navigate("/admin");
    }
</script>

<div class="profile-container">
    <div class="profile-btn btn-bg-prop btn-effect " on:click={clickProfile}>
        <div class="icon-profile">
            <img src={iconProfile} alt="" />
        </div>
        <div class="username-text">
            Welcome {username}
        </div>
        <div
            class={"icon-arrow" + (isOpenDropDown ? " rotate-icon-arrow" : "")}
        >
            <img src={iconArrow} alt="" />
        </div>
    </div>
    {#if isOpenDropDown}
        <div class="drop-down-container">
            {#if isAdmin}
                <div class="option" on:click={goToAdmin}>Admin</div>
            {/if}

            <div class="option">Profile</div>
            <div class="option" on:click={goToChangePassword}>
                Change password
            </div>
            <div class="option" on:click={logout}>Logout</div>
        </div>
    {/if}
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";
    .profile-container {
        position: relative;
        width: auto;
        height: auto;
        z-index: 9999;
        /* @include debugProfile(3px, pink); */
    }
    .profile-btn {
        /* @include debugProfile(3px, cyan); */
        background-image: url("../images/profile-icon.png");
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 5px;

        border: 2px solid $primary-color;
        border-radius: 4px;
        padding: 3px;

        div {
            /* @include debugProfile(1px, green); */
        }
        .icon-profile {
            width: 35px;
            height: 35px;
            img {
                display: block;
                max-width: 100%;
                max-height: 100%;
            }
        }

        .icon-arrow {
            width: 15px;
            height: 15px;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 2px;
            /* padding-bottom: 4px; */
            /* padding-top: 0px; */
            transition: 0.2s;
            img {
                display: block;
                max-width: 100%;
                max-height: 100%;
            }
        }
        .rotate-icon-arrow {
            transform: rotate(-180deg);
        }
    }
    .drop-down-container {
        position: absolute;
        top: calc(100% + 3px);
        /* left: -40px; */
        right: 0px;
        background-color: white;
        padding: 3px;
        width: 220px;
        border: 3px solid black;
        .option {
            padding: 5px;
            margin-top: 3px;
            border-bottom: 1px solid $primary-color;
            &:hover {
                background-color: $primary-color;
                color: white;
                cursor: pointer;
            }
        }
    }
</style>
