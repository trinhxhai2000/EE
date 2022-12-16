import type { Choice } from "./Choice"
export interface Question {
    id: number
    description: string
    createdDate?: Date
    updateDate?: Date
    choices: Choice[],
}