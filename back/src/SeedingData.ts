import { CommonHelper } from "./CommonHelper";
import { Question } from "./db/entity/Question"
import { choiceRepositoryController } from "./db/repository/ChoiceRepository";
import { questionRepositoryController } from "./db/repository/QuestionRepository"
import { recordRepositoryController } from "./db/repository/RecordRepositoty";
import { submissionRepositoryController } from "./db/repository/SubmissionRepository";
import { userRepositoryController } from "./db/repository/UserRepository";

interface QuestionSeedingData {
    desc: string,
    cr_choices: string[],
    wr_choices: string[],
}

let fixed_data: QuestionSeedingData[] = [
    {
        desc: "Choose the animals !",
        cr_choices: [
            'dogs', 'cat', 'cow', 'bat', 'bird', 'sheep', 'cat', 'ant', 'mouse', 'bird', 'chicken', 'bull'
        ],
        wr_choices: [
            'sleep', 'plane', 'computer', 'paper', 'laptop', 'home', 'water', 'lamp', 'keyboard', 'phone', 'software', 'answer'
        ],
    },
    {
        desc: "Choose the sport !",
        cr_choices: [
            'basketball', 'baseball', 'boxing', 'cycling', 'judo', 'weightlifting', 'volleyball', 'football', 'soccer', 'karate', 'golf', 'ice hockey'
        ],
        wr_choices: [
            'browser', 'website', 'computer', 'business', 'laptop', 'home', 'screen', 'lamp', 'mouse', 'bird', 'water', 'keyboard'
        ],
    },
    {
        desc: "Choose the transport !",
        cr_choices: [
            'car', 'train', 'bike', 'van', 'taxi', 'ship', 'bicycle', 'bus', 'ambulance', 'skateboard', 'scooter', 'helicopter', 'airplane', 'boat'
        ],
        wr_choices: [
            'browser', 'website', 'computer', 'business', 'laptop', 'home', 'screen', 'lamp', 'mouse', 'bird', 'water', 'keyboard'
        ]
    },
    {
        desc: "Choose the jobs !",
        cr_choices: [
            'accountant', 'baker', 'barber', 'butcher', 'chef', 'lawyer', 'nurse', 'doctor', 'policeman', 'scientist', 'vet', 'waiter'
        ],
        wr_choices: [
            'browser', 'website', 'computer', 'business', 'laptop', 'home', 'screen', 'lamp', 'mouse', 'bird', 'water', 'keyboard'
        ],
    },


]

export const seedQuestionData = async () => {

    fixed_data = [...fixed_data, ...fixed_data, ...fixed_data, ...fixed_data]

    for (let j = 0; j < fixed_data.length; j++) {
        const inp = fixed_data[j];

        const question = await questionRepositoryController.add(inp.desc);
        try {

            for (let i = 0; i < inp.cr_choices.length; i++) {
                const choice = inp.cr_choices[i];
                await choiceRepositoryController.add(question.id, choice, true);
            }
            for (let i = 0; i < inp.wr_choices.length; i++) {
                const choice = inp.wr_choices[i];
                await choiceRepositoryController.add(question.id, choice, false);
            }
        } catch (err) {
            console.log(err)
        }

    }
}

const RECORD_SEEDING_CONFIG = {
    username: "txhai12",
    numberOfRecord: 50,
    numberOfQuestionPerRecord: 20,
}


export const seedRecordsData = async () => {

    const ERROR_PREFIX = 'SEEDING ERROR';

    try {
        const user = await userRepositoryController.getUser(RECORD_SEEDING_CONFIG.username);
        if (!user) {
            console.log(`${ERROR_PREFIX}: can't get user ${RECORD_SEEDING_CONFIG.username}`)
            return
        }


        for (let iRec = 0; iRec < RECORD_SEEDING_CONFIG.numberOfRecord; iRec++) {

            const record = await recordRepositoryController.add(RECORD_SEEDING_CONFIG.username);


            const questions = await questionRepositoryController.paging(0, RECORD_SEEDING_CONFIG.numberOfQuestionPerRecord, '');

            if (!questions) {
                console.log(`${ERROR_PREFIX}: can't get question`)
                return
            }

            if (questions.length < RECORD_SEEDING_CONFIG.numberOfQuestionPerRecord) {
                console.log(`${ERROR_PREFIX}: there is only ${questions.length} in database!`)
                return
            }

            for (let iq = 0; iq < questions.length; iq++) {
                const question = questions[iq];

                const choices = await choiceRepositoryController.getAll(question.id);
                const cChoices = CommonHelper.shuffle(choices.filter(c => c.isAnswer == true));
                const wChoices = CommonHelper.shuffle(choices.filter(c => c.isAnswer == false));

                const nSubCorrect = Math.floor(Math.random() * cChoices.length);
                const nSubWrong = Math.floor(Math.random() * wChoices.length);

                const subs = CommonHelper.shuffle([...cChoices.slice(0, nSubCorrect), ...wChoices.slice(0, nSubWrong)]);


                for (let iSub = 0; iSub < subs.length; iSub++) {
                    const c = subs[iSub];
                    if (c.isAnswer) {
                        await recordRepositoryController.update(record.id, record.result + 10);
                    }
                    await submissionRepositoryController.add(record.id, c.id);
                }

            }
        }



    } catch (err) {
        console.log(`${ERROR_PREFIX}: unexpected error`, err)
    }


}