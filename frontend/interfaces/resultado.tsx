import { Quiz } from "./quiz";

export interface Resultado {
    explicacao: string,
    analogia: string,
    exemplo: string,
    quiz: Array<Quiz>,
}