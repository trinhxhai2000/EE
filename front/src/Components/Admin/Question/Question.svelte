<!-- <script lang="ts">
    import Table from "../../../lib/RemoteTable/Table.svelte";
    import Search from "../../../lib/RemoteTable/Search.svelte";
    import Row from "../../../lib/RemoteTable/Row.svelte";
    import Sort from "../../../lib/RemoteTable/Sort.svelte";
    import Pagination from "../../../lib/RemoteTable/Pagination.svelte";

    import Tabs from "../../../lib/Tab/Tabs.svelte";
    import Tab from "../../../lib/Tab/Tab.svelte";
    import TabList from "../../../lib/Tab/TabList.svelte";
    import TabPanel from "../../../lib/Tab/TabPanel.svelte";

    import iconTrash from "../../../../assets/popo/icon/icon-trash.png";
    import iconDelete from "../../../../assets/popo/icon/icon-delete.png";
    import iconAdd from "../../../../assets/popo/icon/icon-add.png";
    import iconRefresh from "../../../../assets/popo/icon/icon-refresh.png";
    import iconEdit from "../../../../assets/popo/icon/icon-edit.svg";
    import iconPreview from "../../../../assets/popo/icon/icon-eye.svg";
    import iconSave from "../../../../assets/popo/icon/icon-save.svg";
    import { onMount } from "svelte";

    import {
        confirmModalStore,
        infoModalStore,
        waitingModalStore,
    } from "../../../Stores/modalStore";

    import type { Question } from "../../../interface/entity/Question";
    import { questionApi } from "../../../api/questionApi";
    // import {
    //     componentModalStore,
    //     ComponentModalType,
    // } from "../../../Stores/ComponentModal";

    // import { flashStore } from "../../../../stores/FlashStore";

    // chunk size to split large array input multiple array to
    // use as parameter with solidity

    let rows: Question[] = [];
    let page = 0; //first page
    let pageIndex = 0; //first row
    let pageSize = 10; //optional, 10 by default

    let loading = true;
    let rowsCount = 0;
    let text: string;
    let sorting: any;

    let isSelectAll: boolean = false;

    let selectedRows: Question[] = [];
    // $: selectedRowsLength

    let waitDeleting = false;

    function openAddingModal() {
        let closeCallback = () => {
            // console.log("reload after edit row");
            load(page);
        };
        // componentModalStore.showComponentModal(
        //     ComponentModalType.ADD_MAP_TYPE,
        //     closeCallback
        // );
    }

    onMount(async () => {
        await load(page);
    });

    async function load(_page: number) {
        loading = true;
        // const data = await questionApi.paging(_page, pageSize, text, sorting);

        // console.log("load Maptypeapi ", data);
        // rows = data.rows;
        // rowsCount = data.rowsCount;
        loading = false;
    }

    function onCellClick(row: Question) {
        // alert(JSON.stringify(row));
    }

    function onPageChange(event: any) {
        load(event.detail.page);
        page = event.detail.page;
    }
    function resetSelect() {
        selectedRows = [];
        isSelectAll = false;
    }

    async function onSearch(event: any) {
        resetSelect();
        page = 0;
        text = event.detail.text;
        await load(page);
        page = 0;
    }

    async function onSort(event: any) {
        sorting = { dir: event.detail.dir, key: event.detail.key };
        await load(page);
    }

    function onDeleteRow(id: number) {
        // console.log("onClickRemove", walletAddress);
        if (waitDeleting) {
            return;
        }
        let callbackYes = () => {
            // waitDeleting = true;
            // mapTypeApi
            //     .deleteMapType(id)
            //     .then((res) => {
            //         if (res.success) {
            //             load(page);
            //             flashStore.showSuccessFlash("Successfully deleted !!!");
            //         } else {
            //             flashStore.showErrorFlash(
            //                 res?.message || "No message return!"
            //             );
            //         }
            //     })
            //     .finally(() => {
            //         // do uncomment, stop loading delete
            //         waitDeleting = false;
            //     });
        };
        let record = rows.find((item) => item.id == id);
        // let text = `Are you sure to delete mapType ${
        //     record ? " : " + record.name : ""
        // } ?`;

        let text = `Are you sure to delete ?`;
        confirmModalStore.showConfirmModal(text, callbackYes, () => {
            // console.log("no");
        });
    }

    function onEditRow(id: number) {
        if (waitDeleting) {
            return;
        }

        let record = rows.find((item) => item.id == id);

        if (!record) {
            throw new Error("Can't find item!");
        }

        let closeCallback = () => {
            // console.log("reload after edit row");
            load(page);
        };

        // componentModalStore.showComponentModal(
        //     ComponentModalType.EDIT_MAP_TYPE,
        //     closeCallback,
        //     record
        // );
    }
    function onPreviewRow(id: number) {
        let record = rows.find((item) => item.id == id);

        if (!record) {
            throw new Error("Can't find item!");
        }

        let closeCallback = () => {
            // console.log("reload after edit row");
            // load(page);
        };

        // componentModalStore.showComponentModal(
        //     ComponentModalType.PREVIEW_MAP_TYPE,
        //     closeCallback,
        //     record
        // );
    }

    function onChangeSelectAll(event: any, rows: any) {
        // console.log("onChangeSelectAll: event", event.currentTarget.checked);
        // console.log("onChangeSelectAll: rows", rows);

        if (event.currentTarget.checked) {
            selectedRows = rows;
        } else {
            selectedRows = [];
        }
        // setContext("selectRows", rows);
    }
    function isRowSelected(row: any, selectedRows: Question[]) {
        let result = selectedRows.find((item) => item.id == row.id);
        return !!result;
    }
    function onSelectRow(event: any, row: Question) {
        // console.log("event.currentTarget.checked", event.currentTarget.checked);
        if (event.currentTarget.checked) {
            //do check
            if (!isRowSelected(row, selectedRows)) {
                selectedRows.push(row);
                // relate to disable and enable the button based on whether there are any row being selected
                selectedRows = [...selectedRows];
            }
        } else {
            //do uncheck, if exist
            if (isRowSelected(row, selectedRows)) {
                selectedRows = selectedRows.filter((item) => item.id != row.id);
            }
        }

        // console.log("onSelectRow", row);
        // console.log("onSelectRows: ", selectedRows);
    }
    function onDeleteRows() {
        if (selectedRows.length == 0 || waitDeleting == true) {
            return;
        }

        let callbackYes = () => {
            waitDeleting = true;

            const ids = selectedRows.map((item) => item.id);

            // mapTypeApi
            //     .deleteListMapType(ids)
            //     .then((res) => {
            //         if (res.success) {
            //             load(page);
            //             resetSelect();
            //             // console.log("after delete rows: ", rows);
            //             flashStore.showSuccessFlash("Successfully deleted !!!");
            //         } else {
            //             flashStore.showErrorFlash(
            //                 res?.message || "No message return!"
            //             );
            //         }
            //     })
            //     .finally(() => {
            //         // do uncomment, stop loading delete
            //         waitDeleting = false;
            //     });
        };

        let text = `Are you sure to delete ${selectedRows.length} mapTypes ?`;
        confirmModalStore.showConfirmModal(text, callbackYes, () => {});

        // console.log("onDeleteRows", selectedRows);
    }

    function deleteAllMapType() {
        if (waitDeleting === true) {
            return;
        }

        let callbackYes = () => {
            waitDeleting = true;
            // mapTypeApi
            //     .deleteAll()
            //     .then((res) => {
            //         if (res.success) {
            //             load(page);
            //             resetSelect();
            //             // console.log("after delete rows: ", rows);
            //             flashStore.showSuccessFlash("Successfully deleted !!!");
            //         } else {
            //             // alert(res.message);
            //             flashStore.showErrorFlash(
            //                 res?.message || "No message return!"
            //             );
            //         }
            //     })
            //     .finally(() => {
            //         // do uncomment, stop loading delete
            //         waitDeleting = false;
            //     });
        };

        let text = `Are you sure to delete all map type ?`;
        confirmModalStore.showConfirmModal(text, callbackYes, () => {});
    }

    async function validateAddingBeforeSubmit() {}
</script>

<div class="map-type-container">
    <div class="tab-wrapper">
        <Tabs>
            <TabList>
                <Tab>Map Type</Tab>
                <Tab>Tab 2</Tab>
                <Tab>Tab 3</Tab>
            </TabList>

            <TabPanel>
                <div class="table-actions">
                    <div class="btn" id="btn-add" on:click={openAddingModal}>
                        <span class="icon-container">
                            <img src={iconAdd} alt="" />
                        </span>
                        <span class="text"> Add </span>
                    </div>

                    <div
                        class={"btn" +
                            (selectedRows.length == 0 || waitDeleting
                                ? ""
                                : " btn-delete-active")}
                        id="btn-delete"
                        on:click={onDeleteRows}
                    >
                        <span class="icon-container">
                            <img src={iconDelete} alt="" />
                        </span>
                        <span class="text"> Delete </span>
                    </div>
                    <div
                        class="btn"
                        id="btn-refresh"
                        on:click={() => load(page)}
                    >
                        <span class="icon-container">
                            <img src={iconRefresh} alt="" />
                        </span>
                        <span class="text"> Reload </span>
                    </div>

                    <div
                        class="btn btn-delete-active"
                        id="btn-delete-all"
                        on:click={deleteAllMapType}
                    >
                        <span class="icon-container">
                            <img src={iconDelete} alt="" />
                        </span>
                        <span class="text"> Delete All </span>
                    </div>
                </div>

                <div class="table-wrapper">
                    <Table
                        {loading}
                        {rows}
                        {pageIndex}
                        {pageSize}
                        let:rows={rows2}
                    >
                        <div slot="top">
                            <Search on:search={onSearch} />
                        </div>
                        <thead slot="head">
                            <tr>
                                <th class="checkbox-td">
                                    <input
                                        type="checkbox"
                                        on:change={(e) =>
                                            onChangeSelectAll(e, rows2)}
                                        bind:checked={isSelectAll}
                                    />
                                    All
                                </th>
                                <th class="id-td">
                                    Id
                                    <Sort key="id" on:sort={onSort} />
                                </th>
                                <th>
                                    Address
                                    <Sort key="name" on:sort={onSort} />
                                </th>
                                <th class="actions-td"> Actions </th>
                            </tr>
                        </thead>
                        <tbody>
                            {#each rows2 as row, index (row)}
                                <Row {index} on:click={(e) => onCellClick(row)}>
                                    <td class="center-td checkbox-td">
                                        <input
                                            type="checkbox"
                                            checked={isRowSelected(
                                                row,
                                                selectedRows
                                            )}
                                            on:change={(e) =>
                                                onSelectRow(e, row)}
                                        />
                                    </td>
                                    <td data-label="Id" class="center-td id-td"
                                        >{row.id}</td
                                    >
                                    <td data-label="Name">{row.name}</td>
                                    <td
                                        data-label="Actions"
                                        class=" center-td actions-td"
                                    >
                                        <div class="actions-container">
                                            <a
                                                href=""
                                                on:click={() =>
                                                    onDeleteRow(row.id)}
                                            >
                                                <img src={iconTrash} alt="" />
                                            </a>
                                            <a
                                                href=""
                                                on:click={() =>
                                                    onEditRow(row.id)}
                                            >
                                                <img src={iconEdit} alt="" />
                                            </a>
                                            <a
                                                href=""
                                                on:click={() =>
                                                    onPreviewRow(row.id)}
                                            >
                                                <img src={iconPreview} alt="" />
                                            </a>
                                        </div>
                                    </td>
                                </Row>
                            {/each}
                        </tbody>
                        <div slot="bottom">
                            <div class="bottom-container">
                                <div class="total-record-text">
                                    <span>
                                        <b>Total: {rowsCount} MapType</b>
                                    </span>
                                </div>
                                <Pagination
                                    {page}
                                    {pageSize}
                                    count={rowsCount}
                                    serverSide={true}
                                    on:pageChange={onPageChange}
                                />
                            </div>
                        </div>
                    </Table>
                </div>
            </TabPanel>

            <TabPanel>
                <h2>Second panel</h2>
            </TabPanel>

            <TabPanel>
                <h2>Third panel</h2>
            </TabPanel>
        </Tabs>
    </div>
</div>

<h2>h2</h2>

<style lang="scss">
    @import "../../../../style/breakpoints.scss";
    .map-type-container {
        position: relative;
        width: calc(100% - 20px);
        height: calc(100% - 20px);
        box-shadow: 0px 0px 0px 6px #00ac0e, inset 0px 0px 2px 2px lightgrey;
        border-radius: 30px;
        margin: 10px;
        border: 10px solid #d9ee02;
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px;
        padding-left: 30px;
        padding-right: 30px;
        overflow-y: auto;

        // -webkit-box-shadow: inset 0px 0px 2px grey;
        // -moz-box-shadow: inset 0px 0px 2px grey;
        // box-shadow: inset 0px 0px 2px grey;

        //
    }

    .tab-wrapper {
        width: 100%;
    }
    .table-wrapper {
        width: 100%;
    }

    .table-actions {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 10px;
        padding-left: 0;
        margin-bottom: 10px;
        $item-height: 40px;
        .btn {
            height: $item-height;
            margin-left: 10px;
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

        #btn-delete-all {
            width: 140px;
            padding-right: 20px;
            &:hover {
                cursor: pointer;
                transform: scale(1.05);
            }
        }

        #btn-add {
            // height: $item-height;
            background-color: #8eff77;
            width: 120px;
            // margin-left: 0px;
            &:hover {
                cursor: pointer;
                transform: scale(1.05);
            }
        }

        #btn-refresh {
            background-color: #dcffe3;
            width: 120px;
            margin-left: 12px;
            &:hover {
                cursor: pointer;
                transform: scale(1.05);
            }
        }

        #btn-delete {
            // height: $item-height;
            background-color: #7eee4c;
            width: 120px;
            background-color: lightgrey;
            transition: 0.2s;
        }

        .btn-delete-active {
            background-color: #ff7668 !important;
            &:hover {
                cursor: pointer;
                transform: scale(1.05);
            }
        }
    }

    .actions-container {
        // width: 150px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        a {
            // color: red;
            display: inline-block;
            text-decoration: none;
            height: 20px;
            width: 20px;
            margin-right: 10px;
            img {
                max-width: 100%;
                max-height: 100%;
            }
        }
        a:visited {
            color: black;
        }
    }

    .bottom-container {
        // border:3px solid pink;
        display: flex;
        justify-content: space-between;
        .total-record-text {
            display: flex;
            align-items: center;
        }
    }

    @include media-breakpoint-up(sm) {
        .map-type-container {
            overflow-y: scroll;
        }
    }

    @include media-breakpoint-up(xs) {
        .table-actions {
            flex-wrap: wrap;
            row-gap: 10px;
            .btn {
                width: 50%;
            }
            #btn-delete {
                margin-left: 0;
            }
            #btn-refresh {
                margin-left: 0;
            }
        }
        .map-type-container {
            padding: 0 10px;
        }
    }
</style> -->
