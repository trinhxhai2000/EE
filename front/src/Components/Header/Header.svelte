<script lang="ts">
    import logo from "../images/logo.png";
    import headerPage from "../images/header-page.png";
</script>

<div class="header">
    <div class="prefix-header">
        <div class="logo-container">
            <img src={logo} alt="" />
        </div>
        <div class="current-page">
            <span> Login </span>
        </div>
        <div class="link-container">
            <div class="link raw-btn">Home</div>
            <div class="link raw-btn">Record</div>
        </div>
    </div>

    <div class="suffix-header">
        <!-- <div class="user-profile">User profile</div> -->
        <div class="raw-btn">Resgister</div>
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
        width: 165px;
        height: 60px;
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
        gap: 20px;
        .link {
        }
    }

    .suffix-header {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .user-profile {
        justify-self: flex-end;
        align-self: flex-end;

        /* align-self: flex-end; */
    }
</style>
