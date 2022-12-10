export interface QuestionItem {
    id: number;
    description: string;
}

export interface QuestionTableData {
    rows: QuestionItem[];
    rowsCount: number;
}

export interface DeleteRowsParam {
    rows: QuestionItem[];
}