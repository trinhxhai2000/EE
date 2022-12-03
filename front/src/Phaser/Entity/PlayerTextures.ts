//The list of all the player textures, both the default models and the partial textures used for customization

import type { FrameConfig } from "./PlayerTexturesLoadingManager";

export interface BodyResourceDescriptionListInterface {
    [key: string]: BodyResourceDescriptionInterface;
}

export interface BodyResourceDescriptionInterface {
    name: string;
    img: string;
    frameConfig?: FrameConfig;
    level?: number;
}

export const PLAYER_RESOURCES: BodyResourceDescriptionListInterface = {
    dude: {
        name: "dude",
        img: "/game-characters/dude.png",
        frameConfig: { frameWidth: 32, frameHeight: 48 },
    },
    arrow: {
        name: "arrow",
        img: "/game-objects/arrow.png",
        frameConfig: { frameWidth: 62, frameHeight: 46 },
    },
};


export const CLOUD_RESOURCES: BodyResourceDescriptionListInterface = {
    cloud1: {
        name: "cloud1",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud2: {
        name: "cloud2",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud3: {
        name: "cloud3",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud4: {
        name: "cloud4",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud5: {
        name: "cloud5",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud6: {
        name: "cloud6",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud7: {
        name: "cloud7",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud8: {
        name: "cloud8",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud9: {
        name: "cloud9",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
    cloud10: {
        name: "cloud10",
        img: "/game-objects/cloud2.png",
        frameConfig: { frameWidth: 127, frameHeight: 75 },
    },
};

// export const CLOUD_RESOURCES: BodyResourceDescriptionListInterface = {
//     cloud1: {
//         name: "cloud1",
//         img: "/game-objects/cloud1.png",
//         frameConfig: { frameWidth: 127, frameHeight: 88 },
//     },
//     cloud2: {
//         name: "cloud2",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 127, frameHeight: 75 },
//     },
//     cloud3: {
//         name: "cloud3",
//         img: "/game-objects/cloud3.png",
//         frameConfig: { frameWidth: 141, frameHeight: 97 },
//     },
//     cloud4: {
//         name: "cloud4",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 208, frameHeight: 99 },
//     },
//     cloud5: {
//         name: "cloud5",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 128, frameHeight: 99 },
//     },
//     cloud6: {
//         name: "cloud6",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 128, frameHeight: 75 },
//     },
//     cloud7: {
//         name: "cloud7",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 234, frameHeight: 102 },
//     },
//     cloud8: {
//         name: "cloud8",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 136, frameHeight: 101 },
//     },
//     cloud9: {
//         name: "cloud9",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 128, frameHeight: 94 },
//     },
//     cloud10: {
//         name: "cloud10",
//         img: "/game-objects/cloud4.png",
//         frameConfig: { frameWidth: 235, frameHeight: 86 },
//     },
// };

export const DEFAULT_PLAYER_RESOURCE = PLAYER_RESOURCES.boystandard;

export const COMMON_PLAYER_RESOURCES = [
    PLAYER_RESOURCES.boystandard,
    PLAYER_RESOURCES.girlstandard,
    PLAYER_RESOURCES.fairyman,
    PLAYER_RESOURCES.tree1,
    PLAYER_RESOURCES.tree2,
    PLAYER_RESOURCES.tree3,
    PLAYER_RESOURCES.tree4,
    PLAYER_RESOURCES.tree5,
];
