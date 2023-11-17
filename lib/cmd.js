import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import readline from 'readline';

// export function interact(questions) {
//   process.stdin.setEncoding('utf8');

//   return new Promise(resolve => {
//     const answers = [];
//     let i = 0
//     let { text, value } = questions[i++]
//     console.log(`${text}(${value})`)

//     process.stdin.on('readable', () => {
//       const chunk = process.stdin.read().slice(0, -1);
//       answers.push(chunk || value)
//       const nextQuestion = questions[i++]
//       if (nextQuestion) {
//         process.stdin.read();
//         text = nextQuestion.text;
//         value = nextQuestion.value;
//         console.log(`${text}(${value})`)

//       } else {
//         resolve(answers)
//       }
//     })
//   })
// }

export function question(rl, { text, value }) {
  const q = `${text}(${value})\n`;
  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      resolve(answer || value);
    });
  });
}

export async function interact(questions) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const answers = []

  for (const element of questions) {
    const q = element
    const answer = await question(rl, q)
    answers.push(answer)
  }

  rl.close()
  return answers
}

const sections = [
  {
    header: '狗屁不通文章生成器',
    content: '生成随机的文章段落用于测试',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'title',
        typeLabel: '{underline string}',
        description: '文章的主题。',
      },
      {
        name: 'min',
        typeLabel: '{underline number}',
        description: '文章最小字数。',
      },
      {
        name: 'max',
        typeLabel: '{underline number}',
        description: '文章最大字数。',
      },
    ],
  },
];

const usage = commandLineUsage(sections);

const optionDefinitions = [
  { name: 'help' },
  { name: 'title', type: String },
  { name: 'min', type: Number },
  { name: 'max', type: Number },
];

const options = commandLineArgs(optionDefinitions);

if ('help' in options) {
  console.log(usage);
  process.exit();
}

export { options };