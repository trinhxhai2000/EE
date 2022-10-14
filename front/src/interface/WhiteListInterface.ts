export interface WhiteListItem {
    id: number;
    walletAddress: string;
}

export interface WhiteList {
    rows: WhiteListItem[];
    rowsCount: number;
}

export interface DeleteRowsParam {
    rows: WhiteListItem[];
}
