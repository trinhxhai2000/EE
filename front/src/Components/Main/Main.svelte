<script lang="ts">
    import CloudShootLayout from "../Game/CloudShootLayout.svelte";

    // game
    export let game: Phaser.Game | undefined;
</script>

<div class="main-container">
    <!-- some thing common like back to home -->

    <div class="top-left" />
    <div class="bottom-right" />
    mainLayout - game layout

    <div class="game-layout-container">
        <CloudShootLayout {game} />
    </div>
</div>

<style lang="scss">
    .main-container {
        width: 100%;
        height: 100%;
    }

    .game-layout-container {
        position: absolute;
        border: 5px solid cyan;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .top-left {
        border: 6px solid pink;
        height: 100px;
        width: 100px;
        top: 0;
        left: 0;
    }

    .bottom-right {
        border: 6px solid green;
        height: 100px;
        width: 100px;
        position: absolute;
        right: 0;
        bottom: 0;
    }
</style>
