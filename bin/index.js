import { loadCorpus, saveCorpus } from "../lib/corpus.js";
import { generate } from "../lib/generator.js";
import { createRandomPicker } from "../lib/random.js";
import { options } from "../lib/cmd.js";





const corpus = loadCorpus('corpus/data.json');

const pickTitle = createRandomPicker(corpus.title);

const title = options.title || pickTitle();

const article = generate(title, { corpus, options })


saveCorpus(title, article)
