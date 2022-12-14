<script lang="ts">
    import { onMount } from "svelte";
    import { userApi } from "../../../api/userApi";
    import iconSave from "../../images/icon/icon-save.png";
    import iconBack from "../../images/icon/icon-back.png";
    import {
        USER_ROLE,
        type UserItem,
    } from "../../../interface/api/UserInterfaces";
    import { get } from "svelte/store";
    import { flashStore } from "../../../Stores/FlashStore";
    import { navigate } from "svelte-routing";
    import { ErrorMessage } from "../../../api/ErrorMessage";
    import { waitingModalStore } from "../../../Stores/ModalStore";
    import {
        ADMIN_PAGES,
        currentAdminPage,
    } from "../../../Stores/AdminPageStore";

    export let username: string;

    // need to verify that actually user login in

    let txtUsername = "";
    let txtPassword: string | undefined;
    let errorEditingModalValidate = "";

    let waitAdding = false;
    let editingUser: UserItem | undefined;
    let role: USER_ROLE = USER_ROLE.USER;

    let data: UserItem | null = null;

    onMount(async () => {
        const userData = await userApi.get(username);
        if (!userData.success) {
            if (userData.message) {
                flashStore.showErrorFlash(userData.message);
            }
            navigate("/notfound");
        }

        editingUser = userData.data as UserItem;
        txtUsername = editingUser.username;
        role = editingUser.role;
    });

    async function validateEditingBeforeSubmit() {
        if (waitAdding) {
            return;
        }

        // console.log("editing mapType", edittingMapType);

        if (!editingUser) {
            throw new Error("Not found editing item!");
        }

        editingUser.username = txtUsername;
        editingUser.role = role;

        if (!editingUser.username || editingUser.username === "") {
            errorEditingModalValidate = "Name can't be empty!";
            return;
        }
        if (txtPassword?.length == 0) {
            txtPassword = undefined;
        }

        waitingModalStore.set("Processing");
        userApi
            .update(editingUser.username, txtPassword, editingUser.role)
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

    function onClickBack() {
        currentAdminPage.set(ADMIN_PAGES.USER);
        navigate("/admin");
    }
</script>

<div class="page-container">
    <div class="page-header">
        <div class="title">Edit User</div>
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
            <tr>
                <td class="field-title"> Username: </td>
                <td class="field-value">
                    <input
                        bind:value={txtUsername}
                        disabled
                        on:focus={() => {
                            errorEditingModalValidate = "";
                        }}
                    />
                </td>
            </tr>
            <tr>
                <td class="field-title"> New password: </td>
                <td class="field-value">
                    <input
                        bind:value={txtPassword}
                        type="password"
                        on:focus={() => {
                            errorEditingModalValidate = "";
                        }}
                    />
                </td>
            </tr>

            <tr>
                <td class="field-title"> Role: </td>
                <td class="field-value">
                    <select bind:value={role}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </td>
            </tr>

            <tr>
                <td
                    colspan="2"
                    class="field-value error"
                    style="text-align: center"
                >
                    {errorEditingModalValidate}
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
