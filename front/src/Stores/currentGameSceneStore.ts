import { writable } from "svelte/store";
import { EntryScene } from "../Phaser/Scene/EntryScene";
import { SelectMapScene } from "../Phaser/Scene/SelectMapScene";
export const currentGameSceneStore = writable<
    EntryScene | SelectMapScene | null
>(null);
