<script lang="ts">
    import { onMount } from "svelte";
    import { userApi } from "../../../api/userApi";
    import iconAdd from "../../images/icon/icon-add.png";
    import iconSave from "../../images/icon/icon-save.png";
    import iconEdit from "../../images/icon/icon-edit.png";
    import iconDelete from "../../images/icon/icon-delete.png";
    import iconBack from "../../images/icon/icon-back.png";

    import iconCorrect from "../../images/icon/icon-correct.png";
    import iconWrong from "../../images/icon/icon-wrong.png";

    import { type QuestionItem } from "../../../interface/api/QuestionInterfaces";

    import { get } from "svelte/store";
    import { flashStore } from "../../../Stores/FlashStore";
    import { navigate } from "svelte-routing";
    import { CommonMessage, ErrorMessage } from "../../../api/ErrorMessage";
    import {
        confirmModalStore,
        waitingModalStore,
    } from "../../../Stores/ModalStore";
    import {
        ADMIN_PAGES,
        currentAdminPage,
    } from "../../../Stores/AdminPageStore";
    import { questionApi } from "../../../api/QuestionApi";
    import Switch from "../../../lib/Switch/Switch.svelte";
    import {
        componentModalStore,
        ComponentModalType,
    } from "../../../Stores/ComponentModal";
    import type { ChoiceItem } from "../../../interface/api/ChoiceInterfaces";
    import { choiceApi } from "../../../api/ChoiceApi";

    export let id: number;

    // need to verify that actually user login in

    let txtDescription = "";
    let errorEditingModalValidate = "";

    let waitAdding = false;
    let editingQuestion: QuestionItem | undefined;

    let data: QuestionItem | null = null;

    let choicesList: ChoiceItem[] = [];

    onMount(async () => {
        const questionData = await questionApi.get(id);

        console.log("questionData", questionData);
        if (!questionData.success) {
            if (questionData.message) {
                flashStore.showErrorFlash(questionData.message);
            }
            navigate("/notfound");
        }

        editingQuestion = questionData.data as QuestionItem;
        txtDescription = editingQuestion.description;

        loadChoices();
    });

    async function loadChoices() {
        const choicesData = await choiceApi.getAll(id);
        console.log("loadChoices choicesData", choicesData);
        if (choicesData.data) {
            choicesList = choicesData.data;
        }
    }

    async function validateEditingBeforeSubmit() {
        if (waitAdding) {
            return;
        }

        // console.log("editing mapType", edittingMapType);

        if (!editingQuestion) {
            throw new Error("Not found editing item!");
        }

        editingQuestion.description = txtDescription;

        if (
            !editingQuestion.description ||
            editingQuestion.description === ""
        ) {
            errorEditingModalValidate = "Description can't be empty!";
            return;
        }

        waitingModalStore.set("Processing");
        questionApi
            .update(id, editingQuestion.description)
            .then((res) => {
                console.log("sjet userApi.update res", res);
                if (res.success) {
                    flashStore.showSuccessFlash("Successfully updated !");
                } else {
                    if (res.message) {
                        flashStore.showSuccessFlash(res.message);
                    } else {
                        flashStore.showSuccessFlash(
                            ErrorMessage.UNEXPECTED_ERROR
                        );
                    }
                }
            })
            .catch((err) => {
                if (err instanceof Error) {
                    if (err.message) {
                        flashStore.showSuccessFlash(err.message);
                    } else {
                        flashStore.showSuccessFlash(
                            ErrorMessage.UNEXPECTED_ERROR
                        );
                    }
                }
            })
            .finally(() => {
                // do uncomment, stop loading
                waitAdding = false;
                waitingModalStore.set("");
            });
    }

    function onClickChoiceAdding() {
        const onCloseAddingModal = () => {
            loadChoices();
        };
        componentModalStore.showComponentModal(
            ComponentModalType.ADD_CHOICE,
            onCloseAddingModal,
            {
                questionId: id,
            }
        );
    }

    function formatChoiceText(text: string) {
        const maxDisplayStrLen = 40;
        if (text.length < maxDisplayStrLen) {
            return text;
        } else {
            return text.substring(0, maxDisplayStrLen) + "...";
        }
    }

    function onClickEditChoice(choice: ChoiceItem) {
        const onCloseAddingModal = () => {
            loadChoices();
        };
        componentModalStore.showComponentModal(
            ComponentModalType.EDIT_CHOICE,
            onCloseAddingModal,
            choice
        );
    }

    function onClickDeleteChoice(choice: ChoiceItem) {
        const yesCallBack = () => {
            waitAdding = true;
            waitingModalStore.set("Loading ...");

            choiceApi
                .delete(choice.id)
                .then(async (res) => {
                    if (res.success) {
                        flashStore.showSuccessFlash(
                            CommonMessage.SUCCESS_DELETED
                        );
                        await loadChoices();
                    } else {
                        if (res.message) {
                            flashStore.showErrorFlash(res.message);
                        } else {
                            flashStore.showErrorFlash(
                                ErrorMessage.UNEXPECTED_ERROR
                            );
                        }
                    }
                })
                .catch((err) => {
                    if (err instanceof Error) {
                        if (err.message) {
                            flashStore.showErrorFlash(err.message);
                        } else {
                            flashStore.showErrorFlash(
                                ErrorMessage.UNEXPECTED_ERROR
                            );
                        }
                    }
                })
                .finally(() => {
                    waitingModalStore.set("");
                    waitAdding = false;
                });
        };

        confirmModalStore.showConfirmModal(
            "Are you sure to delete this choice ?",
            yesCallBack,
            undefined
        );
    }

    function onClickBack() {
        currentAdminPage.set(ADMIN_PAGES.QUESTION);
        navigate("/admin");
    }
</script>

<div class="page-container">
    <div class="page-header">
        <div class="title">Edit Question</div>
    </div>
    <div class="page-actions">
        <div class="btn btn-back" on:click={onClickBack}>
            <span class="icon-container">
                <img src={iconBack} alt="" />
            </span>
            <span class="text"> Black </span>
        </div>

        <div
            class={"btn btn-add" + (waitAdding ? " wait-adding" : "")}
            on:click={validateEditingBeforeSubmit}
        >
            <span class="icon-container">
                <img src={iconSave} alt="" />
            </span>
            <span class="text"> Save </span>
        </div>
    </div>
    <div class="page-content">
        <table>
            {#if errorEditingModalValidate.length > 0}
                <tr>
                    <td class="field-title-cell"> <div>Error:</div> </td>
                    <td
                        colspan="2"
                        class="field-value error"
                        style="text-align: center"
                    >
                        {errorEditingModalValidate}
                    </td>
                </tr>
            {/if}

            <tr>
                <td class="field-title-cell"> <div>Description:</div> </td>
                <td class="field-value">
                    <textarea
                        bind:value={txtDescription}
                        on:focus={() => {
                            errorEditingModalValidate = "";
                        }}
                    />
                </td>
            </tr>

            <tr>
                <td class="field-title-cell"> <div>Choices:</div> </td>
                <td class="field-value">
                    <div class="choice-container">
                        <div class="actions-container">
                            <div
                                class="btn"
                                id="btn-add"
                                on:click={onClickChoiceAdding}
                            >
                                <span class="icon-container">
                                    <img src={iconAdd} alt="" />
                                </span>
                                <span class="text"> Add </span>
                            </div>
                        </div>

                        <div class="choice-items">
                            {#each choicesList as choice}
                                <div class="choice">
                                    <div class="choice-prefix-actions">
                                        <div class="choice-correctness">
                                            <div class="icon">
                                                {#if choice.isAnswer}
                                                    <img
                                                        src={iconCorrect}
                                                        alt="correct"
                                                    />
                                                {:else}
                                                    <img
                                                        src={iconWrong}
                                                        alt="wrong"
                                                    />
                                                {/if}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="choice-content">
                                        {formatChoiceText(choice.description)}
                                    </div>

                                    <div class="choice-suffix-actions">
                                        <div
                                            class="edit-btn"
                                            on:click={() => {
                                                onClickEditChoice(choice);
                                            }}
                                        >
                                            <img src={iconEdit} alt="" />
                                        </div>
                                        <div
                                            class="delete-btn"
                                            on:click={() => {
                                                onClickDeleteChoice(choice);
                                            }}
                                        >
                                            <img src={iconDelete} alt="" />
                                        </div>
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</div>

<style lang="scss">
    @import "../../../../style/breakpoints.scss";
    @import "../../../../style/common.scss";

    .page-container {
        padding: 10px;
    }

    .page-header {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid lightgrey;
        // background-color: #c24519;
        // border-radius: 20px 20px 0px 0px;
        padding: 10px 20px;
        padding-top: 15px;
        .title {
            font-size: $page-header-font-size;
            font-weight: bold;
        }
    }

    .page-content {
        padding: 10px;
        min-height: 100px;

        table {
            width: 100%;
        }
        table td,
        tr {
            border: none;
            margin-bottom: 5px;
            border: 1px solid black;
        }
        table .field-title-cell {
            width: 200px;
            position: relative;
            font-size: 20px;
            div {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
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
            textarea {
                display: block;
                height: 100%;
                min-width: 300px;
                min-height: 100px;
                font-size: 18px;
            }
        }

        .error {
            color: #ed2939;
        }

        $choice-container-h: 500px;
        $choice-container-header-h: ca80px;
        $choice-h: 50px;
        $choice-w: 600px;

        .choice-container {
            /* border: 5px solid cyan; */
            .actions-container {
                /* border: 2px solid pink; */
                height: 60px;
                .btn {
                    height: 50px;
                    /* margin-left: 10px; */
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px 10px;
                    border-radius: 16px;
                    box-shadow: 3px 2px 2px 0px lightgray;
                    .text {
                        width: 72px;
                        text-align: center;
                        font-weight: bold;
                    }
                    .icon-container {
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        height: 100%;
                        // justify-self: flex-end;

                        img {
                            height: 100%;
                            max-width: 100%;
                            max-height: 100%;
                        }
                    }
                }
                #btn-add {
                    // height: $item-height;
                    border: 3px solid $primary-color;
                    width: 120px;
                    // margin-left: 0px;
                    padding: 3px;
                    &:hover {
                        cursor: pointer;
                        transform: scale(1.05);
                    }
                }
            }
            .choice-items {
                border: 2px solid grey;
                box-shadow: inset 2px 2px 2px 2px
                    rgba($color: black, $alpha: 0.1);
                width: 100%;
                height: 550px;
                display: flex;
                flex-direction: column;
                flex-wrap: wrap;

                overflow-x: auto;
                gap: 22px;
                padding: 20px;

                .choice {
                    border: 3px solid black;
                    width: $choice-w;
                    height: $choice-h;
                    border-radius: 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 5px;

                    .choice-prefix-actions {
                        width: 15%;
                        .choice-correctness {
                            .icon {
                                width: 40px;
                                height: 40px;
                                img {
                                    display: block;
                                    max-width: 100%;
                                    max-height: 100%;
                                }
                            }
                        }
                    }

                    .choice-content {
                        width: 65%;
                    }
                    .choice-suffix-actions {
                        display: flex;
                        justify-content: space-around;
                        align-items: center;
                        width: 20%;
                        div {
                            &:hover {
                                cursor: pointer;
                                transform: scale(1.05);
                            }
                        }
                        .edit-btn {
                            width: $choice-h - 20px;
                            height: $choice-h - 20px;
                            img {
                                display: block;
                                max-width: 100%;
                                max-height: 100%;
                            }
                        }
                        .delete-btn {
                            width: $choice-h - 20px;
                            height: $choice-h - 20px;
                            img {
                                display: block;
                                max-width: 100%;
                                max-height: 100%;
                            }
                        }
                    }
                }
            }
        }
    }

    .page-actions {
        // border-top: 3px solid grey;
        border-top: 1px solid lightgrey;
        padding: 6px;
        display: flex;
        justify-content: flex-start;
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
                background-color: $primary-color;
                color: white;
            }
        }
        .btn-back {
            &:hover {
                cursor: pointer;
                background-color: $primary-color;
                color: white;
            }
        }
        .close-button {
            margin-right: 0px;
        }
    }
</style>
