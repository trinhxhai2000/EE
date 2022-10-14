import { Scene } from "phaser";

export const EntrySceneName = "EntryScene";

export class EntryScene extends Scene {
    constructor() {
        super({
            key: EntrySceneName,
        });
    }

    preload() {}

    create() {}

    update(time: number, delta: number): void {}
}
