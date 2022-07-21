const readline = require('node:readline/promises');
const { stdin: input, stdout: output } = require('node:process');

const rl = readline.createInterface({ input, output });

rl.question('is this working?', (answer) => {
  console.log(`idk, you said ${answer} so probably`);
});

rl.close();
