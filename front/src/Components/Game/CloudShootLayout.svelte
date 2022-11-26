<script lang="ts">
    import { gameManager } from "../../Phaser/Game/GameManager";
    import { CloudShootGameSceneName } from "../../Phaser/Scene/GameScene/CloudShootGameScene.ts/CloudShootGameScene";
    import { VowelSoundsGameSceneName } from "../../Phaser/Scene/GameScene/Speaking/VowelSoundsGameScene";

    export let game: Phaser.Game | undefined;

    try {
        gameManager.startScene(CloudShootGameSceneName);
        // gameManager.startSceneByGame(game, VowelSoundsGameSceneName);
    } catch (err) {
        console.log("startScene err", err);
    }

    // console.log("FINAL fuck this sjet");
</script>

<div class="cloudshoot-layout" />

<style lang="scss">
    .cloudshoot-layout {
        position: absolute;
        border: 5px solid green;
        width: 100%;
        height: 100%;
    }
</style>
