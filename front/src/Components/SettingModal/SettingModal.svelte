<script lang="ts">
    import { onDestroy, onMount } from "svelte";
    import { componentModalStore } from "../../Stores/ComponentModal";
    import iconSave from "../images/icon/icon-save.png";
    import iconClose from "../images/icon/icon-close.png";

    import volumeIconMuted from "../images/icon/icon-sound-muted.png";
    import volumeIconLv1 from "../images/icon/icon-sound-lv1.png";
    import volumeIconLv2 from "../images/icon/icon-sound-lv2.png";
    import volumeIconLv3 from "../images/icon/icon-sound-lv3.png";

    import { gameSoundStore } from "../../Stores/GameSoundStore";
    import { get, type Unsubscriber } from "svelte/store";
    import { localUserStore } from "../../Stores/localUserStore";
    import { flashStore } from "../../Stores/FlashStore";
    import { CommonMessage } from "../../api/ErrorMessage";
    import { gameManager } from "../../Phaser/Game/GameManager";

    onMount(() => {
        unsubscriberGameSoundStore = gameSoundStore.subscribe((gameSound) => {
            updateVolumeUI();
        });

        const isMuted = localUserStore.getGameSoundMuted();
        const volume = localUserStore.getGameSoundVolume();
        lastedSaveVolume = volume;
        gameSoundStore.setMuted(isMuted);
        gameSoundStore.setVolume(volume);

        const localGameResolution = localUserStore.getGameResolution();
        selectedResolution =
            localGameResolution !== "" ? localGameResolution : "1920x1080";
    });

    let lastedSaveVolume = 0;

    onDestroy(() => {
        if (unsubscriberGameSoundStore) {
            unsubscriberGameSoundStore();
        }

        const volume = localUserStore.getGameSoundVolume();
        if (volume != lastedSaveVolume) {
            gameSoundStore.setVolume(lastedSaveVolume);
            localUserStore.setGameSoundVolume(lastedSaveVolume);
        }
    });

    async function onSave() {
        const volume = localUserStore.getGameSoundVolume();
        lastedSaveVolume = volume;
        flashStore.showSuccessFlash(CommonMessage.SUCCESS_SAVED);
        closeModal();
    }

    function closeModal() {
        componentModalStore.closeComponentModal();
    }

    // SOUND

    function onMute() {
        // const muted = !get(gameSoundStore).muted;
        // gameSoundStore.setMuted(muted);
        // localUserStore.setGameSoundMuted(muted);
    }

    let currentVolumeIcon: HTMLImageElement;
    let audioPlayerVol: HTMLInputElement;
    let displayGameVolume: number = 0;
    let unsubscriberGameSoundStore: Unsubscriber | null = null;

    function updateVolumeUI() {
        if (get(gameSoundStore).muted || get(gameSoundStore).volume == 0) {
            currentVolumeIcon.src = volumeIconMuted;
            audioPlayerVol.value = "0";
            displayGameVolume = 0;
        } else {
            let volume = get(gameSoundStore).volume;
            audioPlayerVol.value = "" + volume;
            displayGameVolume = Math.round(volume * 100);

            if (volume < 0.3) {
                currentVolumeIcon.src = volumeIconLv1;
            } else if (volume < 0.7) {
                currentVolumeIcon.src = volumeIconLv2;
            } else {
                currentVolumeIcon.src = volumeIconLv3;
            }
        }
    }

    function calVolumeTextExtraLeft(volume: number) {
        let charactersWidth = 11.8;

        if (0 <= volume && volume <= 9) {
            return charactersWidth / 2;
        }

        if (10 <= volume && volume <= 90) {
            return (charactersWidth * 2) / 2;
        }

        return (charactersWidth * 3) / 2;
    }

    function setVolume() {
        let volume = parseFloat(audioPlayerVol.value);
        gameSoundStore.setVolume(volume);
        localUserStore.setGameSoundVolume(volume);
        gameSoundStore.setMuted(false);
        localUserStore.setGameSoundMuted(false);
    }

    function disallowKeys() {
        audioPlayerVol.blur();
        return false;
    }
    let selectedResolution: any;
    function changeResolution(e: Event) {
        console.log("changeResolution", {
            selectedResolution,
            e,
        });
        gameManager.changeResolution(selectedResolution);
        localUserStore.setGameResolution(selectedResolution);
    }
</script>

<div class="modal-container">
    <div class="modal-header">
        <div class="title">Setting</div>
    </div>
    <div class="modal-content">
        <table>
            <tr>
                <td class="field-title"> Resolution </td>
                <td class="field-value">
                    <div class="game-resolution-setting">
                        <select
                            name=""
                            id=""
                            bind:value={selectedResolution}
                            on:change={changeResolution}
                        >
                            <option value="1920x1080">
                                1920 x 1080 (Recommended)
                            </option>
                            <option value="1366x768"> 1366 x 768 </option>
                            <option value="1280x800"> 1280 x 800 </option>
                            <option value="1024x768"> 1024 x 768 </option>
                        </select>
                    </div>
                </td>
            </tr>
            <tr>
                <td class="field-title sound-title"> <div>Sound</div> </td>
                <td class="field-value">
                    <div class="game-sound-volume">
                        <span alt="player volume" on:click={onMute}>
                            <img
                                class="volume-icon"
                                src={volumeIconLv3}
                                bind:this={currentVolumeIcon}
                                alt="sound-icon"
                            />
                        </span>
                        <div class="input-range-container">
                            <div class="display-volume-container">
                                <span
                                    class="display-volume"
                                    style={"left:calc(" +
                                        displayGameVolume +
                                        "% - " +
                                        calVolumeTextExtraLeft(
                                            displayGameVolume
                                        ) +
                                        "px)"}>{displayGameVolume}</span
                                >
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.025"
                                bind:this={audioPlayerVol}
                                on:input={setVolume}
                                on:keydown={disallowKeys}
                            />
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
    <div class="modal-actions">
        <div class={"btn btn-add"} on:click={onSave}>
            <span class="icon-container">
                <img src={iconSave} alt="" />
            </span>
            <span class="text"> Save </span>
        </div>

        <div class="btn btn-close" on:click={closeModal}>
            <span class="icon-container">
                <img src={iconClose} alt="" />
            </span>
            <span class="text"> Close </span>
        </div>
    </div>
</div>

<style lang="scss">
    .modal-container {
        padding: 10px;
    }

    .modal-header {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid lightgrey;
        // background-color: #c24519;
        // border-radius: 20px 20px 0px 0px;
        padding: 10px 10px;
        /* padding-top: 15px; */
        padding-bottom: 15px;
        .title {
            font-size: 25px;
            font-weight: bold;
        }
    }

    .modal-content {
        padding: 10px;
        min-height: 100px;
        width: 500px;
        table {
            width: 100%;
        }
        table td,
        tr {
            border: none;
        }
        table .field-title {
            /* div {
                display: flex;
                height: 100%;
                width: 100%;
                justify-content: flex-start;
                align-items: center;
                font-size: 20px;
            } */
            font-size: 20px;
        }
        .sound-title {
            /* line-height: 30px; */
            /* padding-bottom: 20px; */
            div {
            }
        }
        table .field-value {
            input {
                display: block;
                height: 30px;
                border: 1px solid grey;
                width: 100%;
                border-radius: 2px;
            }
        }

        .error {
            color: #ed2939;
        }
    }
    .modal-actions {
        // border-top: 3px solid grey;
        border-top: 1px solid lightgrey;
        padding: 6px;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        .btn {
            margin-right: 10px;
            border: 1px solid grey;
            height: 36px;
            width: 120px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 6px;
            padding: 5px;
            transition: 0.2s;
            .text {
                width: 72px;
                text-align: center;
                font-weight: bold;
            }
            .icon-container {
                display: inline-block;
                height: 100%;
                // justify-self: flex-end;

                img {
                    height: 100%;
                    max-width: 100%;
                    max-height: 100%;
                }
            }
        }
        .btn-add {
            &:hover {
                cursor: pointer;
                /* background-color: #8eff77; */
            }
        }
        .btn-close {
            &:hover {
                cursor: pointer;
                /* background-color: #ff7668; */
            }
        }
        .close-button {
            margin-right: 0px;
        }
    }

    // resolution setting

    .game-resolution-setting {
        padding: 10px;
        select {
            display: block;
            border: 2px solid grey;
            width: 100%;
            height: 30px;
        }
    }

    // sound setting
    $input-volume-height: 30px;
    $volume-text-size: $input-volume-height * 2 / 3;
    $input-volume-width: 100%;

    .game-sound-volume {
        /* display: grid; */
        /* grid-template-columns: 50px 1fr; */
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 20px;
        /* border: 2px solid black; */ /* padding: 10px; */
        .volume-icon {
            /* height: 100%;
            width: calc(100% - 10px);
            margin-right: 10px; */
            display: block;
            margin-left: auto;
            margin-right: auto;
            height: auto;
            width: 35px;
            margin-top: $volume-text-size;
            padding-top: 4px;
            img {
                display: block;
                max-width: 100%;
                max-height: 100%;
            }
        }
    }

    section.audio-manager-file {
        display: none;
    }

    .input-range-container {
        width: $input-volume-width;
        max-width: 100%;
        padding: 0 !important;

        .display-volume-container {
            margin-left: $input-volume-height/2;
            margin-right: $input-volume-height/2;
            .display-volume {
                font-family: "manrope";
                font-weight: bold;
                font-size: $volume-text-size;
                position: relative;
                /* left: -50%; */
            }
        }
    }
    input[type="range"] {
        outline: 0;
        border: 2px solid white;
        border-radius: 500px;
        width: 100%;
        max-width: 100%;
        /* margin: 24px 0 16px; */
        transition: box-shadow 0.2s ease-in-out;
        // Chrome
        @media screen and (-webkit-min-device-pixel-ratio: 0) {
            & {
                overflow: hidden;
                height: $input-volume-height;
                -webkit-appearance: none;
                background-color: #fff;
            }
            &::-webkit-slider-runnable-track {
                height: $input-volume-height;
                -webkit-appearance: none;
                color: #444;
                transition: box-shadow 0.2s ease-in-out;
            }
            &::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: $input-volume-height;
                height: $input-volume-height;
                /* cursor: ew-resize; */

                box-shadow: -340px 0 0 320px #1077e8, inset 0 0 0 2px #1077e8;
                border-radius: 50%;
                background: white;

                transition: box-shadow 0.2s ease-in-out;
                position: relative;
                // top: 1px;
            }
            &:active::-webkit-slider-thumb {
                border: none;
                box-shadow: -1380px 0 0 1360px #1077e8, inset 0 0 0 3px #1077e8;
            }
            &:not(:active)::-webkit-slider-thumb {
                border: none;
                box-shadow: -1380px 0 0 1360px #1077e8, inset 0 0 0 3px #1077e8;
            }
            // Firefox
            &::-moz-range-runnable-track {
                height: $input-volume-height;
                -webkit-appearance: none;
                color: #444;
                transition: box-shadow 0.2s ease-in-out;
            }
            &::-moz-range-thumb {
                -webkit-appearance: none;
                width: $input-volume-height;
                height: $input-volume-height;
                /* cursor: ew-resize; */

                box-shadow: -340px 0 0 320px #1077e8, inset 0 0 0 2px #1077e8;
                border-radius: 50%;
                background: white;

                transition: box-shadow 0.2s ease-in-out;
                position: relative;
                // top: 1px;
            }
            &:active::-moz-range-thumb {
                border: none;
                box-shadow: -1380px 0 0 1360px #1077e8, inset 0 0 0 3px #1077e8;
            }
            &:not(:active)::-moz-range-thumb {
                border: none;
                box-shadow: -1380px 0 0 1360px #1077e8, inset 0 0 0 3px #1077e8;
            }
            // DID NOT TEST ON SAFARI YET
        }
    }
</style>
