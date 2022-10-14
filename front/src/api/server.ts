import type { AddResult, DeleteResult } from "../interface/CommonInterfaces";
import type {
    WhiteListItem,
    WhiteList,
    DeleteRowsParam,
} from "../interface/WhiteListInterface";
import axiosClient from "./axiosClient";
import { sortNumber, sortString } from "./sorting";

let fixedData = generateFixedData();

function generateFixedData() {
    let mockData: WhiteListItem[] = [];
    for (let i = 0; i < 26; i++) {
        let c = String.fromCharCode("a".charCodeAt(0) + i);
        for (let j = 0; j < 2 + Math.floor(Math.random() * 10); j++) {
            mockData.push({
                id: mockData.length,
                walletAddress: c + "zzzzzzzzzzzzzzzzzzz",
            });
        }
    }
    // console.log("mockData", mockData);
    return mockData;
}

function generateData() {
    return fixedData;
}

function deleteWhiteList(id: number) {
    fixedData = fixedData.filter((item) => item.id != id);
}

// export function getAll(text): Promise<WhiteListItem[]> {
//     return new Promise((resolve, reject) => {
//         setTimeout(function () {
//             resolve(generateData());
//         }, 500);
//     });
// }

export function deleteRow(id: number): Promise<DeleteResult> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if (Math.random() * 10 < 3) {
                resolve({
                    success: false,
                    message: "something went wrong",
                    id,
                });
            } else {
                fixedData = fixedData.filter((item) => item.id !== id);
                resolve({
                    success: true,
                    id,
                });
            }
        }, 2000);
    });
}

export function deleteRows(param: DeleteRowsParam): Promise<DeleteResult> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if (Math.random() * 10 < 3) {
                resolve({
                    success: false,
                    message: "something went wrong",
                    id: -1,
                });
            } else {
                fixedData = fixedData.filter(
                    (item) =>
                        !!!param.rows.find((sub_item) => sub_item.id == item.id)
                );
                resolve({
                    success: true,
                    id: -1,
                });
            }
        }, 2000);
    });
}

export function getMockData(page: number, pageSize: number, text: string, sorting: any): Promise<WhiteList> {
    // console.log("page", page);
    let originalData = generateData();


    // console.log("sorting", {
    //     sorting,
    // });
    if (sorting) {
        if (sorting.key == "id") {
            originalData = sortNumber(originalData, sorting.dir, sorting.key);
        } else {
            originalData = sortString(originalData, sorting.dir, sorting.key);
        }
    } else {
        originalData = sortNumber(originalData, "asc", "id");
    }

    return new Promise((resolve, reject) => {
        setTimeout(function () {
            let rowsCount = originalData.length;
            const originalRows = originalData;
            let rows = [];

            if (text && text.length > 0) {
                for (let i in originalRows) {
                    for (let j in originalRows[i]) {
                        if (
                            originalRows[i].walletAddress
                                .toString()
                                .toLowerCase()
                                .indexOf(text) > -1
                        ) {
                            rows.push(originalRows[i]);
                            break;
                        }
                    }
                }

                rowsCount = rows.length;
            } else {
                rows = originalRows;
            }

            resolve({
                rows: rows.slice(page * pageSize, page * pageSize + pageSize),
                rowsCount: rowsCount - 1,
            });
        }, 200);
    });
}

export function addRow(param: WhiteListItem): Promise<AddResult> {
    return new Promise((resolve, reject) => {
        setTimeout(function () {
            if (Math.random() * 10 < 3) {
                resolve({
                    success: false,
                    message: "something went wrong",
                    id: -1,
                });
            } else {
                param.id = fixedData.length;
                fixedData.push(param);
                // console.log("server rows", fixedData);
                resolve({
                    success: true,
                    id: param.id,
                });
            }
        }, 2000);
    });
}

export function getWhiteList(page: number, pageSize: number, text: string, sorting: any): Promise<WhiteList> {
    
    const from = page * pageSize;
    const to = from + pageSize;

    return new Promise((resolve, reject) => {
        axiosClient.get("/whiteList/getWhiteList", {
            params: {
                from: from,
                to: to,
                search: text
            }
        }).then(
            res => {
                resolve(res.data);
            }
        ).catch(err => {
            reject(err);
        })
    });
}

export function addWhiteList(walletAddress: string): Promise<AddResult> {
    return new Promise((resolve, reject) => {
        axiosClient.post("/whiteList/add", {
            walletAddress: walletAddress
        }).then(
            res => {
                resolve(res.data);
            }
        ).catch(err => {
            console.error(err.response);
            reject(err);
        })
    });
}

export function removeWhiteList(lstWalletAddress: string[]): Promise<DeleteResult> {
    return new Promise((resolve, reject) => {
        axiosClient.post("/whiteList/remove", {
            lstWalletAddress: lstWalletAddress
        }).then(
            res => {
                resolve(res.data);
            }
        ).catch(err => {
            reject(err);
        })
    });
}
