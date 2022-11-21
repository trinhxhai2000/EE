<script context="module">
    import Pagination, {
        setLabels as _setPaginationLabels,
    } from "./Pagination.svelte";
    import Row from "./Row.svelte";
    import Search, { setLabels as _setSearchLabels } from "./Search.svelte";
    import Sort, { setLabels as _setSortLabels } from "./Sort.svelte";
    export { Pagination, Row, Search, Sort };

    let globalLabels;

    export function setTableLabels(labels) {
        globalLabels = labels;
    }

    export const setPaginationLabels = _setPaginationLabels;
    export const setSearchLabels = _setSearchLabels;
    export const setSortLabels = _setSortLabels;
</script>

<script>
    import { createEventDispatcher, setContext } from "svelte";
    const dispatch = createEventDispatcher();

    export let loading = false;
    export let page = 0;
    export let pageIndex = 0;
    export let pageSize = 10;
    export let responsive = true;
    export let rows;
    export let serverSide = false;
    export let labels = {
        empty: "No records available",
        loading: "Loading data",
        ...globalLabels,
    };

    let buttons = [-2, -1, 0, 1, 2];
    let pageCount = 0;

    $: filteredRows = rows;
    $: visibleRows = filteredRows?.slice(pageIndex, pageIndex + pageSize) || [];

    setContext("state", {
        getState: () => ({
            page,
            pageIndex,
            pageSize,
            rows,
            filteredRows,
        }),
        setPage: (_page, _pageIndex) => {
            page = _page;
            pageIndex = _pageIndex;
        },
        setRows: (_rows) => (filteredRows = _rows),
    });

    function onPageChange(event) {
        dispatch("pageChange", event.detail);
    }

    function onSearch(event) {
        dispatch("search", event.detail);
    }
</script>

<div class="table-container">
    <div class="slot-top">
        <slot name="top" attr:class="slot-top">
            <svelte:component this={Search} on:search={onSearch} />
        </slot>
    </div>

    <table class={"table " + $$props.class} class:responsive>
        <slot name="head" />
        {#if loading}
            <tbody>
                <tr>
                    <td class="center" colspan="100%">
                        <span>
                            {@html labels.loading}
                        </span>
                    </td>
                </tr>
            </tbody>
        {:else if visibleRows.length === 0}
            <tbody>
                <tr>
                    <td class="center" colspan="100%">
                        <span>
                            {@html labels.empty}
                        </span>
                    </td>
                </tr>
            </tbody>
        {:else}
            <slot rows={visibleRows} />
        {/if}

        <slot name="foot" />
    </table>
    <div class="slot-bottom">
        <slot name="bottom">
                <!-- <svelte:component
                    this={Pagination}
                    {page}
                    {pageSize}
                    {serverSide}
                    count={filteredRows.length - 1}
                    on:pageChange={onPageChange}
                /> -->
        </slot>
    </div>
</div>

<style lang="scss">

    @import "../../../style/breakpoints.scss";
    .table {
        width: 100%;
        height: 500px;
        border-collapse: collapse;
        // margin: 10px;
    }


    .table :global(th),
    :global(td) {
        position: relative;
        border: 1px solid lightgray;
        padding: 0.5em 0.5em;
    }

    .table :global(thead) {
        background-color: #dcffe3;
        font-weight: bolder;
    }

    .table :global(th) {
        font-weight: bolder;
    }

    .table :global(td) {
        // padding: 0.5em 0.5em;
    }
    .table :global(.center-td) {
        text-align: center;
    }
    .table :global(.checkbox-td) {
        width: 80px;
    }
    .table :global(.id-td) {
        width: 80px;
    }
    .table :global(.actions-td) {
        width: 150px;
    }

    .center {
        text-align: center;
        font-style: italic;
    }

    .center > span {
        padding: 10px 10px;
        float: left;
        width: 100%;
    }

    // div {
    //     display: block;
    //     border: 2px solid cyan;
    //     height: 100px;
    // }

    .slot-top {
        display: block;
        height: 50px;
        padding: 4px;
        margin-bottom: 10px;
        // border: 2px solid cyan;
        & :global(div) {
            height: 100%;
        }
    }
    .slot-bottom {
        margin-top: 10px;
        display: block;
        height: 50px;
        // border: 2px solid orange;

    }
    // :global(.bottom){
    //     border:2px solid orange;
    // }
    :global(.bottom){
        border:2px solid orange;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }


    @media screen and (max-width: 767px) {
        table.responsive {
            border: 0;
        }

        table.responsive :global(thead) {
            border: none;
            clip: rect(0 0 0 0);
            height: 1px;
            margin: -1px;
            overflow: hidden;
            padding: 0;
            position: absolute;
            width: 1px;
        }

        table.responsive :global(tr) {
            border-bottom: 2px solid #ddd;

            display: block;
            padding-bottom: 0.3em;
            margin-bottom: 0.3em;
        }

        table.responsive :global(td) {
            width: 100% !important;
            border-bottom: 1px solid #ddd;
            display: block;

            font-size: 0.8em;
            text-align: right !important;

        }
        
        table.responsive :global(.actions-container) {
            justify-content: right !important;
        }

        table.responsive :global(td::before) {
            /*
      * aria-label has no advantage, it won't be read inside a table content: attr(aria-label);
      */
            content: attr(data-label);
            float: left;
            font-weight: bold;
        }

        table.responsive :global(td[data-label-normal]::before) {
            font-weight: normal;
        }

        table.responsive :global(td[data-label-upper]::before) {
            text-transform: uppercase;
        }

        table.responsive :global(td:last-child) {
            border-bottom: 0;
        }
    }
    // @include media-breakpoint-up(sm) {
    //     .table :global(td) {
    //         width: 100%;
    //     }
    // }
</style>
