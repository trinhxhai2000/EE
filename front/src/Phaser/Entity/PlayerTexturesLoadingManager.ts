import LoaderPlugin = Phaser.Loader.LoaderPlugin;
import { CLOUD_RESOURCES, type BodyResourceDescriptionInterface } from "./PlayerTextures";
import { PLAYER_RESOURCES } from './PlayerTextures'
import CancelablePromise from "cancelable-promise";

export interface FrameConfig {
    frameWidth: number;
    frameHeight: number;
}

const DEFAULT_FRAME_CONFIG: FrameConfig = { frameWidth: 32, frameHeight: 32 };

export const loadAllDefaultModels = (load: LoaderPlugin): BodyResourceDescriptionInterface[] => {
    const resourceArray = Object.values(PLAYER_RESOURCES);
    const returnArray: BodyResourceDescriptionInterface[] = [];
    resourceArray.forEach((playerResource: BodyResourceDescriptionInterface) => {
        // console.log(playerResource.name + ": ", playerResource.frameConfig);
        load.spritesheet(
            playerResource.name,
            playerResource.img,
            playerResource.frameConfig ? playerResource.frameConfig : DEFAULT_FRAME_CONFIG
        );
        if (!playerResource.level || playerResource.level > 0) returnArray.push(playerResource);
    });
    return returnArray;
};

export const lazyLoadPlayerCharacterTextures = (
    loadPlugin: LoaderPlugin,
    texturekeys: Array<string | BodyResourceDescriptionInterface>
): CancelablePromise<string[]> => {
    const promisesList: CancelablePromise<unknown>[] = [];
    texturekeys.forEach((textureKey: string | BodyResourceDescriptionInterface) => {
        try {
            //TODO refactor
            const playerResourceDescriptor = getResourceDescriptor(textureKey);
            // console.log("lazyLoadPlayerCharacterTextures", playerResourceDescriptor)
            if (playerResourceDescriptor && !loadPlugin.textureManager.exists(playerResourceDescriptor.name)) {
                // console.log("lazyLoadPlayerCharacterTextures", playerResourceDescriptor)
                promisesList.push(
                    createLoadingPromise(
                        loadPlugin,
                        playerResourceDescriptor,
                        playerResourceDescriptor.frameConfig
                            ? playerResourceDescriptor.frameConfig
                            : DEFAULT_FRAME_CONFIG
                    )
                );
            } else {
                // console.log("FUCK")
            }
        } catch (err) {
            console.error(err);
            // console.log("FUCK ERROR", err)
        }
    });
    let returnPromise: CancelablePromise<Array<string | BodyResourceDescriptionInterface>>;
    if (promisesList.length > 0) {
        loadPlugin.start();
        returnPromise = CancelablePromise.all(promisesList).then(() => texturekeys);
    } else {
        returnPromise = CancelablePromise.resolve(texturekeys);
    }

    //If the loading fail, we render the default model instead.
    return returnPromise.then((keys) =>
        keys.map((key) => {
            return typeof key !== "string" ? key.name : key;
        })
    );
};

// string => BodyResourceDescriptionInterface
export const getResourceDescriptor = (
    textureKey: string | BodyResourceDescriptionInterface
): BodyResourceDescriptionInterface => {
    if (typeof textureKey !== "string" && textureKey.img) {
        return textureKey;
    }
    const textureName: string = typeof textureKey === "string" ? textureKey : textureKey.name;
    let playerResource = PLAYER_RESOURCES[textureName];
    if (playerResource !== undefined) return playerResource;

    playerResource = CLOUD_RESOURCES[textureName];
    if (playerResource !== undefined) return playerResource;

    throw new Error("Could not find a data for texture " + textureName);
};

// do run the LoaderPlugin
export const createSingleLoadingPromise = (
    loadPlugin: LoaderPlugin,
    textureKey: string,
) => {
    return new CancelablePromise<BodyResourceDescriptionInterface>((res, rej, cancel) => {
        let playerResourceDescriptor: BodyResourceDescriptionInterface;
        try {
            playerResourceDescriptor = getResourceDescriptor(textureKey);
        } catch (e) {
            rej(e);
            return;
        }

        if (loadPlugin.textureManager.exists(playerResourceDescriptor.name)) {
            // console.log("loadPlugin.textureManager exist ", playerResourceDescriptor.name)
            return res(playerResourceDescriptor);
        } else {
            // console.log("loadPlugin.textureManager NOT exist ", playerResourceDescriptor.name)
        }
        // console.log("createSingleLoadingPromise!!!!!!!!",playerResourceDescriptor)

        cancel(() => {
            loadPlugin.off("loaderror");
            loadPlugin.off("filecomplete-spritesheet-" + playerResourceDescriptor.name);
            return;
        });

        loadPlugin.spritesheet(playerResourceDescriptor.name, playerResourceDescriptor.img, playerResourceDescriptor.frameConfig);

        const errorCallback = (file: { src: string }) => {
            if (file.src !== playerResourceDescriptor.img) return;
            console.error("failed loading player resource: ", playerResourceDescriptor);
            rej(playerResourceDescriptor);
            loadPlugin.off("filecomplete-spritesheet-" + playerResourceDescriptor.name, successCallback);
            loadPlugin.off("loaderror", errorCallback);
        };
        const successCallback = () => {
            loadPlugin.off("loaderror", errorCallback);
            // console.log("createSingleLoadingPromise! SUCCESS ",playerResourceDescriptor)
            res(playerResourceDescriptor);
        };

        loadPlugin.start();
        loadPlugin.once("filecomplete-spritesheet-" + playerResourceDescriptor.name, successCallback);
        loadPlugin.on("loaderror", errorCallback);

    });
};

// not start the loadPlugin.start() => can't do the load alone

export const createLoadingPromise = (
    loadPlugin: LoaderPlugin,
    playerResourceDescriptor: BodyResourceDescriptionInterface,
    frameConfig: FrameConfig
) => {
    return new CancelablePromise<BodyResourceDescriptionInterface>((res, rej, cancel) => {
        if (loadPlugin.textureManager.exists(playerResourceDescriptor.name)) {
            return res(playerResourceDescriptor);
        }

        cancel(() => {
            loadPlugin.off("loaderror");
            loadPlugin.off("filecomplete-spritesheet-" + playerResourceDescriptor.name);
            return;
        });

        // console.log('do load spritesheet', playerResourceDescriptor);
        loadPlugin.spritesheet(playerResourceDescriptor.name, playerResourceDescriptor.img, frameConfig);
        const errorCallback = (file: { src: string }) => {
            if (file.src !== playerResourceDescriptor.img) return;
            console.error("failed loading player resource: ", playerResourceDescriptor);
            rej(playerResourceDescriptor);
            loadPlugin.off("filecomplete-spritesheet-" + playerResourceDescriptor.name, successCallback);
            loadPlugin.off("loaderror", errorCallback);
        };
        const successCallback = () => {
            loadPlugin.off("loaderror", errorCallback);
            // console.log('successCallback do load spritesheet', playerResourceDescriptor);
            res(playerResourceDescriptor);
        };

        loadPlugin.once("filecomplete-spritesheet-" + playerResourceDescriptor.name, successCallback);
        loadPlugin.on("loaderror", errorCallback);
    });
};
