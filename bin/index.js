import { loadCorpus, saveCorpus } from "../lib/corpus.js";
import { generate } from "../lib/generator.js";
import { createRandomPicker } from "../lib/random.js";


const corpus = loadCorpus('corpus/data.json');

const pickTitle = createRandomPicker(corpus.title);

const title = pickTitle();

const article = generate(title, { corpus })

// console.log(`${title}\n\n    ${article.join('\n    ')}`)

saveCorpus(title, article)