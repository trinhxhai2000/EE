<script lang="ts">
    import { onMount } from "svelte";
    import { choiceApi } from "../../../../api/ChoiceApi";
    import { CommonMessage } from "../../../../api/ErrorMessage";
    import Switch from "../../../../lib/Switch/Switch.svelte";
    import { componentModalStore } from "../../../../Stores/ComponentModal";
    import { flashStore } from "../../../../Stores/FlashStore";
    import { waitingModalStore } from "../../../../Stores/ModalStore";

    // import mapTypeApi from "../../../../api/mapTypeApi";
    import iconAdd from "../../../images/icon/icon-add.png";
    import iconDelete from "../../../images/icon/icon-delete.png";

    // import { componentModalStore } from "../../../../stores/ComponentModal";

    let txtDescription = "";
    let isAnswer = false;
    let errorAddingModalValidate = "";

    let waitAdding = false;

    let id: number | undefined = undefined;
    onMount(() => {
        const data = componentModalStore.getData() as {
            id: number;
            description: string;
            isAnswer: boolean;
        };

        id = data.id;
        txtDescription = data.description;
        isAnswer = data.isAnswer;
    });

    async function validateAddingBeforeSubmit() {
        if (waitAdding) {
            return;
        }
        if (!id) {
            errorAddingModalValidate =
                "Something wrong with question id pls try again!";
            return;
        }
        if (!txtDescription || txtDescription === "") {
            errorAddingModalValidate = "Name can't be empty!";
            return;
        }

        waitAdding = true;
        waitingModalStore.set("Loading ... ");
        console.log("update", { id, txtDescription, isAnswer });
        choiceApi
            .update(id, txtDescription, isAnswer)
            .then((res) => {
                if (res.success) {
                    flashStore.showSuccessFlash(CommonMessage.SUCCESS_UPDATED);
                    componentModalStore.closeComponentModal(true);
                } else {
                    if (res.message) {
                        flashStore.showErrorFlash(res.message);
                    } else {
                        flashStore.showErrorFlash("No error message return!");
                    }
                }
            })
            .finally(() => {
                // do uncomment, stop loading
                waitAdding = false;
                waitingModalStore.set("");
            });
    }

    function closeAddingModal() {
        console.log("closeAddingModal");
        componentModalStore.closeComponentModal();
    }
</script>

<div class="modal-container">
    <div class="modal-header">
        <div class="title">Edit Choice</div>
    </div>
    <div class="modal-content">
        <table>
            <tr>
                <td class="field-title"> Description: </td>
                <td class="field-value">
                    <input
                        bind:value={txtDescription}
                        on:focus={() => {
                            errorAddingModalValidate = "";
                        }}
                    />
                </td>
            </tr>
            <tr>
                <td class="field-title"> Is Answer: </td>
                <td class="field-value">
                    <Switch bind:checked={isAnswer} />
                </td>
            </tr>
            <tr>
                <td
                    colspan="2"
                    class="field-value error"
                    style="text-align: center"
                >
                    {errorAddingModalValidate}
                </td>
            </tr>
        </table>
    </div>
    <div class="modal-actions">
        <div
            class={"btn btn-add" + (waitAdding ? " wait-adding" : "")}
            on:click={validateAddingBeforeSubmit}
        >
            <span class="icon-container">
                <img src={iconAdd} alt="" />
            </span>
            <span class="text"> Save </span>
        </div>

        <div class="btn btn-close" on:click={closeAddingModal}>
            <span class="icon-container">
                <img src={iconDelete} alt="" />
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
        padding: 10px 20px;
        padding-top: 15px;
        .title {
            font-size: large;
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
</style>
