import { get } from "svelte/store";
import { currentGameSceneStore } from "../../Stores/currentGameSceneStore";

export type MapType = "speaking-map";
export class MapTypeConstant {
    static SELECT_MAP: MapType = "speaking-map";
    static SPEAKING_MAP: MapType = "speaking-map";
}
export const SelectMapSceneName = "ChooseMapScene";

export class GameManager {
    private scenePlugin!: Phaser.Scenes.ScenePlugin;
    public game: Phaser.Game | undefined;

    public setGameInstance(game: Phaser.Game) {
        this.game = game;
    }

    public startScene(sceneName: string) {
        if (!this.game) {
            throw new Error(
                `Can't start the Scene ${sceneName} because game was ${this.game}`
            );
        }

        const gameScene = this.game.scene.getScene(sceneName);
        gameScene.scene.start(sceneName);
    }

    public startTheGame() {}
}

export const gameManager = new GameManager();
