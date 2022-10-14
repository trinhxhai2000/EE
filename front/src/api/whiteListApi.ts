import axiosClient from "./axiosClient";
import type {
    DeleteRowsParam,
    WhiteList,
    WhiteListItem,
} from "../interface/WhiteListInterface";

import { addRow, addWhiteList, deleteRow, deleteRows, getMockData, getWhiteList, removeWhiteList } from "./server";
import type { AddResult, DeleteResult } from "../interface/CommonInterfaces";

class WhiteListApi {
    paging = (
        page: any,
        pageSize: any,
        text: any,
        sorting: any
    ): Promise<WhiteList> => {
        // const url = "api/WhiteListInterface";
        const data = getWhiteList(page, pageSize, text, sorting);
        return data;
    };
    deleteRow = (walletAddress: string): Promise<DeleteResult> => {
        return removeWhiteList([walletAddress]);
    };
    deleteRows = (params: DeleteRowsParam): Promise<DeleteResult> => {
        const lstWalletAddress:string[] = [];
        params.rows.forEach(wl => lstWalletAddress.push(wl.walletAddress));
        return removeWhiteList(lstWalletAddress);
    };
    addRow = (item: WhiteListItem): Promise<AddResult> => {
        return addWhiteList(item.walletAddress);
    };
}

class MockWhiteListApi {
    // paging = (
    //     page: any,
    //     pageSize: any,
    //     text: any,
    //     sorting: any
    // ): Promise<WhiteList> => {
    //     // const url = "api/WhiteListInterface";
    //     const data = getMockData(page, pageSize, text, sorting);
    //     return data;
    // };
    // deleteRow = (id: number): Promise<DeleteResult> => {
    //     return deleteRow(id);
    // };
    // deleteRows = (params: DeleteRowsParam): Promise<DeleteResult> => {
    //     return deleteRows(params);
    // };
    // addRow = (item: WhiteListItem): Promise<AddResult> => {
    //     return addRow(item);
    // };
}
const itemApi = new WhiteListApi();
export default itemApi;
