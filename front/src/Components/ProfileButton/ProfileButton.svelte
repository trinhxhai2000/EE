<script lang="ts">
    import iconArrow from "../images/icon/icon-arrow.png";
    import iconProfile from "../images/icon/icon-profile.png";

    let isOpenDropDown = true;
    let username = "trinhxhai";

    function clickProfile() {
        isOpenDropDown = !isOpenDropDown;
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
            <div class="option">Profile</div>
            <div class="option">Change password</div>
            <div class="option">Logout</div>
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
        left: -20px;
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
