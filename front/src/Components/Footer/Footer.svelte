<script lang="ts">
    import footerIcon from "../images/footer-icon.png";
</script>

<div class="footer">
    <div class="icon-container">
        <img src={footerIcon} alt="" />
    </div>
    <div class="text-container">
        <div class="tertiary-text">Hanoi Open University</div>
        <div class="quaternary-text">Thesis Edu Phaser 3 game</div>
    </div>
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";
    .footer {
        /* border: 2px solid black; */
        border-top: 2px solid black;

        padding: 10px;
        height: $footer-height;
        display: flex;
        /* justify-content: flex-end; */
        align-items: center;

        .icon-container {
            height: 60px;
            img {
                display: block;
                max-width: 100%;
                max-height: 100%;
            }
        }
        .text-container {
            margin-left: 20px;
        }
    }
</style>
