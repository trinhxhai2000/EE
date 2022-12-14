export interface ChoiceItem {
    id: number;
    description: string;
    isAnswer: boolean;
}

export interface ChoiceTableData {
    rows: ChoiceItem[];
    rowsCount: number;
}

export interface DeleteRowsParam {
    rows: ChoiceItem[];
}