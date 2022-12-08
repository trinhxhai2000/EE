<script lang="ts">
    import { userSession } from "../../Stores/UserSessionStore";
    import logo from "../images/logo.png";
    import ProfileButton from "../ProfileButton/ProfileButton.svelte";
    import { navigate } from "svelte-routing";
    function onClickLogo() {
        navigate("/");
    }

    function onClickLeaderBoard() {
        navigate("/");
    }
</script>

<div class="header">
    <div class="prefix-header">
        <div class="logo-container" on:click={onClickLogo}>
            <img src={logo} alt="" />
        </div>
        <div class="current-page">
            <span> Login </span>
        </div>
        <div class="link-container">
            <div class="link raw-btn" on:click={onClickLogo}>Home</div>
            <div class="link raw-btn-md" on:click={onClickLeaderBoard}>
                LeaderBoard
            </div>
        </div>
    </div>

    <div class="suffix-header">
        {#if $userSession}
            <div class="user-profile-wrapper">
                <ProfileButton />
            </div>
            <!-- <div class="raw-btn">Logout</div> -->
        {:else}
            <div class="raw-btn">Register</div>
        {/if}
    </div>
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";
    .header {
        border-bottom: 2px solid black;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        height: $header-height;
        div {
            /* @include debugHeader(2px, green); */
        }
    }

    .prefix-header {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
    }
    .logo-container {
        width: 80px;
        height: 80px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        @include hoverEffect();
        img {
            display: block;
            max-width: 100%;
            max-height: 100%;
        }
    }

    .current-page {
        background-image: url(../images/header-page.png);
        background-position: center;
        background-size: contain;
        background-repeat: no-repeat;
        color: white;
        width: 190px;
        height: 70px;
        padding: 10px 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 25px;
        @include hoverEffect();
    }
    .link-container {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        height: 100%;
        gap: 10px;
        .link {
            height: 50px;
            /* width: 100px; */
        }
    }

    .suffix-header {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .user-profile-wrapper {
        /* @include debugHeader(4px, red); */
        max-width: 300px;
        max-height: 100px;
    }
</style>
