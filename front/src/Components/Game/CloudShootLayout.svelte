<script lang="ts">
    import type { Question } from "../../interface/entity/Question";
    import { gameManager } from "../../Phaser/Game/GameManager";
    import { CloudShootGameSceneName } from "../../Phaser/Scene/GameScene/CloudShootGameScene.ts/CloudShootGameScene";

    import iconQuestion from "../images/icon/icon-question.svg";
    import iconClose from "../images/icon/icon-close.svg";

    import {
        currentScore,
        currentQuestion,
        currentCountDown,
        type CountDownData,
    } from "../../Stores/GameActionStore/CloudShootGameStore";

    import { onMount } from "svelte";

    export let game: Phaser.Game | undefined;

    let isExpandQuestion = true;
    let intervalCountDown: NodeJS.Timeout | null = null;
    let currentRemSec: number | null = null;

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

    try {
        gameManager.startScene(CloudShootGameSceneName);
        // gameManager.startSceneByGame(game, VowelSoundsGameSceneName);
    } catch (err) {
        console.log("startScene err", err);
    }

    function toggleQuestion() {
        isExpandQuestion = !isExpandQuestion;
    }

    function formatTime(remTime: number) {
        return remTime + "";
        // return "00:00";
    }

    function onKeyDown(e: KeyboardEvent) {
        // e.preventDefault();
        // e.stopPropagation();

        if (e.key === "q") {
            toggleQuestion();
        }
    }

    // console.log("FINAL fuck this sjet");
    //[todo]: Time formater
</script>

<svelte:window on:keydown={onKeyDown} />

<div class="cloudshoot-layout">
    <div class="score-panel">
        Scores: {$currentScore ? $currentScore : "---"} points
    </div>
    <div class="time-panel">
        {currentRemSec ? formatTime(currentRemSec) : "---"} s
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
                            $currentQuestion ? $currentQuestion.title : "---"
                        }: `}
                    </div>

                    <div class="desc">
                        {$currentQuestion ? $currentQuestion.desc : "---"}
                    </div>
                </div>
            {:else}
                <div class="icon icon-question" on:click={toggleQuestion}>
                    <img src={iconQuestion} alt="icon-question" />
                </div>
            {/if}
        </div>
    </div>
</div>

<style lang="scss">
    .cloudshoot-layout {
        position: relative;
        border: 10px solid blue;
        width: 100%;
        height: 100%;
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
        /* border: 5px solid red; */
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
        /* border: 10px solid cyan; */
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
            border: 4px solid green;
            border-radius: 10px;
            transition: 0.5s;
            .icon-question {
                width: 50px;
                height: 50px;
            }

            .icon-close {
                width: 50px;
                height: 50px;
            }
            .question-content {
                /* border: 4px solid green; */
                padding: 10px 30px;
                .title {
                    font-size: 22px;
                    font-weight: bold;
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
