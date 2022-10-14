import { Scene } from "phaser";

import { SelectMapSceneName } from "../Game/GameManager";

export class SelectMapScene extends Scene {
    constructor() {
        super({
            key: SelectMapSceneName,
        });
    }

    preload() {}

    create() {}

    update(time: number, delta: number): void {}
}
