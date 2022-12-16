import type { ChoiceItem } from "./ChoiceInterfaces";

export interface StartGameData {
    recordId: number,
    questions: QuestionData[]
}

export interface QuestionData {
    id: number;
    description: string;
    choices: ChoiceItem[]; // all isAnswer = false
}

