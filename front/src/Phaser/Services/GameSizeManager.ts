// fixed window size when first load
export class GameSizeManager {
    public width: number = 0;
    public height: number = 0;
    constructor() {}
    public setSize(height: number, width: number) {
        this.height = height;
        this.width = width;
    }
}

export const gameSizeManager = new GameSizeManager();
