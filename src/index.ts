import { CourierApp } from './cli/CourierApp';

let input = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (chunk) => { input += chunk; });
process.stdin.on('end', () => {
  const app = new CourierApp();
  const results = app.processAndFormat(input);
  results.forEach((line) => console.log(line));
});
