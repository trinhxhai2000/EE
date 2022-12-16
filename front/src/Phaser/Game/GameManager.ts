import { gameSizeStore } from "../../Stores/GameSizeStore";
import { HdpiManager, hdpiManager } from "../../Utils/HdpiManager";

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
    public changeResolution(resolution: string) {

        const navbarH = 111;
        //"1920x1080" | "1366x768" | "1280x800" | "1024x768"
        console.log("changeResolution", resolution)
        if (resolution == "1920x1080") {
            this.setResolution(1929, 1080 - navbarH);
            return
        }
        if (resolution == "1366x768") {
            this.setResolution(1366, 768 - navbarH);
            return
        }

        if (resolution == "1280x800") {
            this.setResolution(1280, 800 - navbarH);
            return
        }

        if (resolution == "1024x768") {
            this.setResolution(1024, 768 - navbarH);
            return
        }
        throw new Error(`Can't change to unsupported resolution ${resolution}`)
    }
    private setResolution(width: number, height: number) {
        const { game: gameSize, real: realSize } = hdpiManager.getOptimalGameSize({ width, height });
        // console.log("setResolution hdpiManager.getOptimalGameSize", {
        //     from: { width, height },
        //     result: gameSize
        // })
        gameSizeStore.set(gameSize);
        this.game?.scale.setGameSize(gameSize.width, gameSize.height);
    }
}

export const gameManager = new GameManager();
