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

    public startScene(sceneName: string, data?: any) {
        if (!this.game) {
            throw new Error(
                `Can't start the Scene ${sceneName} because game was false`
            );
        }

        if (!this.game) {
            throw new Error(
                `Can't start the Scene ${sceneName} because game was false`
            );
        }

        if (!this.game.scene) {
            throw new Error(
                `Can't start the Scene ${sceneName} because scene was false`
            );
        }

        const gameScene = this.game.scene.getScene(sceneName);

        if (!gameScene) {
            throw new Error(
                `Can't get the Scene ${sceneName} from game instance !`
            );
        }



        gameScene.scene.start(sceneName, data);
    }

    public stopScene(sceneName: string) {
        if (!this.game) {
            throw new Error(
                `Can't start the Scene ${sceneName} because game was false`
            );
        }

        if (!this.game) {
            throw new Error(
                `Can't start the Scene ${sceneName} because game was false`
            );
        }

        if (!this.game.scene) {
            throw new Error(
                `Can't start the Scene ${sceneName} because scene was false`
            );
        }

        const gameScene = this.game.scene.getScene(sceneName);

        if (!gameScene) {
            throw new Error(
                `Can't get the Scene ${sceneName} from game instance !`
            );
        }

        gameScene.scene.stop()
    }

    // public startSceneByGame(game: Phaser.Game, sceneName: string) {

    //     if (!game.scene) {
    //         throw new Error(
    //             `Can't start the Scene ${sceneName} because scene was false`
    //         );
    //     }

    //     const gameScene = game.scene.getScene(sceneName);

    //     if (!gameScene) {
    //         throw new Error(
    //             `Can't get the Scene ${sceneName} from game instance !`
    //         );
    //     }

    //     gameScene.scene.start(sceneName);
    // }

    public startTheGame() { }
}

export const gameManager = new GameManager();
