import type { Option } from "./Option"
export interface Question {
    id: number
    description: string
    createdDate?: Date
    updateDate?: Date
    options: Option[],
}