<script lang="ts">
    import type { Question } from "../../interface/entity/Question";
    import { gameManager } from "../../Phaser/Game/GameManager";
    import { CloudShootGameSceneName } from "../../Phaser/Scene/GameScene/CloudShootGameScene.ts/CloudShootGameScene";

    import iconQuestion from "../images/icon/icon-ques.png";
    import iconClose from "../images/icon/icon-close.png";
    import iconPlay from "../images/icon/icon-play.png";
    import iconBack from "../images/icon/icon-back.png";

    import {
        currentScore,
        currentQuestion,
        currentCountDown,
        type CountDownData,
        isStartGame,
    } from "../../Stores/GameActionStore/CloudShootGameStore";

    import { onMount } from "svelte";
    import { cloudShootApi } from "../../api/CloudShootApi";
    import { waitingModalStore } from "../../Stores/ModalStore";
    import { ErrorMessage } from "../../api/ErrorMessage";
    import { get } from "svelte/store";
    import { currentGameStore } from "../../Stores/CurrentGameSceneStore";

    export let game: Phaser.Game | undefined;

    let isExpandQuestion = true;
    let intervalCountDown: NodeJS.Timeout | null = null;
    let currentRemSec: number | null = null;

    let isStart = false;

    onMount(() => {
        currentScore.set(0);
        console.log("currentCountDown", $currentCountDown);
    });

    const unsubcriber = currentCountDown.subscribe((val) => {
        if (val === null) return;
        if (intervalCountDown) {
            clearInterval(intervalCountDown);
        }
        intervalCountDown = setInterval(() => {
            currentRemSec =
                val.duration - Math.floor((Date.now() - val.startTime) / 1000);
            currentRemSec = Math.max(0, currentRemSec);
        }, 200);
    });

    function startTheGame() {
        isStartGame.set(true);
        // openfullscreen();
        // document.requestFullscreen();
        // document.webkitRequestFullscreen();
        // screen.orientation.lock("landscape");
        waitingModalStore.set("Getting question data ...");

        // Tạo một lượt chơi và trả về câu hỏi
        cloudShootApi
            .getStartingData()
            .then((res) => {
                console.log("getStartingData ", res);
                try {
                    if (res.success) {
                        gameManager.startScene(
                            CloudShootGameSceneName,
                            res.data
                        );
                    } else {
                        throw new Error(ErrorMessage.UNEXPECTED_ERROR);
                    }

                    // gameManager.startSceneByGame(game, VowelSoundsGameSceneName);
                } catch (err) {
                    isStartGame.set(false);
                    console.log("startScene err", err);
                }
            })
            .finally(() => {
                waitingModalStore.set("");
            });
    }

    // function openfullscreen() {
    //     // Trigger fullscreen
    //     const docElmWithBrowsersFullScreenFunctions =
    //         document.documentElement as HTMLElement & {
    //             mozRequestFullScreen(): Promise<void>;
    //             webkitRequestFullscreen(): Promise<void>;
    //             msRequestFullscreen(): Promise<void>;
    //         };

    //     if (docElmWithBrowsersFullScreenFunctions.requestFullscreen) {
    //         docElmWithBrowsersFullScreenFunctions.requestFullscreen();
    //     } else if (docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen) {
    //         /* Firefox */
    //         docElmWithBrowsersFullScreenFunctions.mozRequestFullScreen();
    //     } else if (
    //         docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen
    //     ) {
    //         /* Chrome, Safari and Opera */
    //         docElmWithBrowsersFullScreenFunctions.webkitRequestFullscreen();
    //     } else if (docElmWithBrowsersFullScreenFunctions.msRequestFullscreen) {
    //         /* IE/Edge */
    //         docElmWithBrowsersFullScreenFunctions.msRequestFullscreen();
    //     }
    //     // this.isfullscreen = true;
    // }

    function toggleQuestion() {
        isExpandQuestion = !isExpandQuestion;
    }

    function formatTime(remTime: number) {
        return remTime + "";
    }

    function onKeyDown(e: KeyboardEvent) {
        // e.preventDefault();
        // e.stopPropagation();

        if (e.key === "q") {
            toggleQuestion();
        }
    }

    function onClickQuit() {
        const isStart = get(isStartGame);
        if (isStart) {
            gameManager.stopScene(CloudShootGameSceneName);
            isStartGame.set(false);
        } else {
        }
    }
    function onClickBackMain() {
        currentGameStore.set(null);
    }

    // console.log("FINAL fuck this sjet");
    //[todo]: Time formater
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="cloudshoot-layout">
    {#if !$isStartGame}
        <div class="start-layout">
            <div class="back-main-button" on:click={onClickBackMain}>
                <img src={iconBack} alt="icon-back" />
            </div>
            <div class="pre-game-content">
                <div class="btn play-button" on:click={startTheGame}>
                    <div class="btn-icon">
                        <img src={iconPlay} alt="icon-play" />
                    </div>

                    <div class="btn-text">Play</div>
                </div>
                <div class="pre-game-info">
                    Your current record is {120} points
                </div>
            </div>
        </div>
    {:else}
        <div class="play-layout">
            <div class="score-panel">
                Scores: {$currentScore ? $currentScore : "---"} points
            </div>
            <div class="time-panel">
                {currentRemSec ? formatTime(currentRemSec) : "---"} s
            </div>
            <div class="quit-button" on:click={onClickQuit}>
                <img src={iconBack} alt="icon-back" />
            </div>
            <div class="question-modal">
                <div
                    class={"question-container" +
                        (isExpandQuestion
                            ? " question-container-expand"
                            : " question-container-close")}
                >
                    {#if isExpandQuestion}
                        <div class="icon icon-close" on:click={toggleQuestion}>
                            <img src={iconClose} alt="icon-close" />
                        </div>

                        <div class="question-content">
                            <div class="title">
                                {`Question #${
                                    $currentQuestion
                                        ? $currentQuestion.title
                                        : "---"
                                }: `}
                            </div>

                            <div class="desc">
                                {$currentQuestion
                                    ? $currentQuestion.desc
                                    : "---"}
                            </div>
                        </div>
                    {:else}
                        <div
                            class="icon icon-question"
                            on:click={toggleQuestion}
                        >
                            <img src={iconQuestion} alt="icon-question" />
                        </div>
                    {/if}
                </div>
            </div>
        </div>
    {/if}
</div>

<style lang="scss">
    @import "../../../style/breakpoints.scss";
    @import "../../../style/common.scss";
    .cloudshoot-layout {
        position: absolute;

        @include debugCloudShootLayout(10px, blue);
        padding: 10px;

        width: 100%;
        height: 100%;
        .start-layout,
        .play-layout {
            position: relative;
            @include debugCloudShootLayout(5px, pink);

            width: 100%;
            height: 100%;
        }
        .start-layout {
            display: flex;
            justify-content: center;
            align-items: center;
            .pre-game-content {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                .play-button {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    border: 5px solid $primary-color;
                    width: 200px;
                    height: 120px;
                    font-size: 30px;
                    border-radius: 10px;
                    transition: 0.12s;
                    gap: 10px;
                    &:hover {
                        cursor: pointer;
                        transform: scale(1.12);
                        background-color: $primary-color;
                        color: white;
                        .btn-icon {
                            display: none;
                        }
                        .btn-text {
                            display: block;
                        }
                    }
                    .btn-icon {
                        width: 50px;
                        height: 50px;
                        img {
                            display: block;
                            max-width: 100%;
                            max-height: 100%;
                        }
                    }
                    .btn-text {
                        font-size: 50px;
                        display: none;
                    }
                }
                .pre-game-info {
                    border-bottom: 3px solid $primary-color;
                    background-color: $primary-color;
                    color: white;
                    margin-top: 20px;
                    padding: 10px;
                    font-size: 20px;
                }
            }
        }
    }

    $p-time-w: 100px;
    $p-time-h: 80px;

    $p-score-w: 200px;
    $p-score-h: 80px;

    @mixin grey-trans-bg {
        background-color: rgba(black, 0.6);
        color: white;
    }

    .time-panel {
        @include grey-trans-bg();
        border-radius: 5px;
        width: $p-time-w;
        height: $p-time-h;
        position: absolute;
        top: 0;
        left: calc(50% - $p-time-w / 2);
        display: flex;
        justify-content: center;
        align-items: center;
        word-wrap: none;
        font-size: 22px;
    }
    .quit-button {
        background-color: white;
        border: 4px solid $primary-color;
        width: 68px;
        height: 68px;
        padding: 10px;
        border-radius: 50%;
        box-shadow: 2px 2px 2px 2px rgba(black, 0.2);
        transition: 0.12s;
        img {
            display: block;
            max-width: 100%;
            max-height: 100%;
        }
        &:hover {
            cursor: pointer;
            transform: scale(1.12);
        }
    }
    .back-main-button {
        pointer-events: auto;
        position: absolute;
        top: 0;
        left: 10px;
        background-color: white;
        border: 4px solid $primary-color;
        width: 68px;
        height: 68px;
        padding: 10px;
        border-radius: 50%;
        box-shadow: 2px 2px 2px 2px rgba(black, 0.2);
        transition: 0.12s;
        img {
            display: block;
            max-width: 100%;
            max-height: 100%;
        }
        &:hover {
            cursor: pointer;
            transform: scale(1.12);
        }
    }
    .score-panel {
        @include grey-trans-bg();
        border-radius: 5px;

        position: absolute;
        width: $p-score-w;
        height: $p-score-h;
        right: 0;
        top: 0;

        display: flex;
        justify-content: center;
        align-items: center;
        word-wrap: none;
        font-size: 18px;
    }

    .question-modal {
        height: auto;
        width: 100%;
        position: absolute;
        top: max($p-time-h, $p-score-h) + 10px;

        /* padding-left: 10%; */
        /* display: flex; */
        /* justify-content: center; */
        /* align-items: center; */
        .question-container {
            background-color: white;
            /* @include debugCloudShootLayout(4px, green); */
            border-radius: 10px;
            transition: 0.5s;
            padding: 5px;
            .icon-question {
                width: 50px;
                height: 50px;
            }

            .icon-close {
                width: 50px;
                height: 50px;
            }
            .question-content {
                padding: 20px 50px;
                .title {
                    font-size: 30px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .desc {
                    font-size: 18px;
                }
            }
        }
        .question-container-expand {
            /* height: 200px; */
            width: 100%;
        }

        .question-container-close {
            /* height: 50px; */
            width: 58px;
        }
    }
</style>
