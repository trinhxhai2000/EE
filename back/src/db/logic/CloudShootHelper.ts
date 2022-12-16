import { Choice } from "../entity/Choice";

export class CloudShootHelper {
    public static fillRandomChoice(choices: Choice[], nWrongChoice: number, nCorrectChoice: number) {
        // do later for now just return
        let wChoices = choices.filter(e => e.isAnswer == false)
        let cChoices = choices.filter(e => e.isAnswer == true)

        // console.log("fillRandomChoice", {
        //     // wChoices,
        //     // cChoices,
        //     choices
        // })

        wChoices = CloudShootHelper.suffle(wChoices);
        cChoices = CloudShootHelper.suffle(cChoices);

        if (wChoices.length < nWrongChoice) {
            throw new Error(`Do not have enough wrong choice for question ${choices[0].questionId}`)
        }

        if (cChoices.length < nCorrectChoice) {
            throw new Error(`Do not have enough correct choice for question ${choices[0].questionId}`)
        }

        return {
            wrongChoices: wChoices,
            correctChoices: cChoices
        }

    }

    public static suffle<T>(array: T[]): T[] {
        let currentIndex = array.length, randomIndex;

        // While there remain elements to shuffle.
        while (currentIndex != 0) {

            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }

        return array;
    }
}