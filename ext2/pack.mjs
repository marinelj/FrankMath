#!/usr/bin/env node
// Pack skeleton + CSS + voice-data.js + app.js into a single offline HTML.
// Use find/slice only — do not regex-splice CSS or JS (template backslashes break).
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));

function replaceOnce(src, needle, replacement, label) {
  const i = src.indexOf(needle);
  if (i < 0) throw new Error('packer: not found ' + label);
  if (src.indexOf(needle, i + 1) !== -1) throw new Error('packer: multiple ' + label);
  return src.slice(0, i) + replacement + src.slice(i + needle.length);
}

let html = fs.readFileSync(path.join(dir, '第27题扩展题目2_交互教学.src.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'base.css'), 'utf8');
const voice = fs.readFileSync(path.join(dir, 'voice-data.js'), 'utf8');
const js = fs.readFileSync(path.join(dir, 'app.js'), 'utf8');

if (!css.includes('mobile-adapt-v2')) throw new Error('CSS missing mobile-adapt-v2');
if (!css.includes('.pin-mask')) throw new Error('CSS missing pin-mask');
if (!js.includes("const PIN = '1111'")) throw new Error('app.js missing PIN 1111');
if (!js.includes('ext2-explain-unlock')) throw new Error('app.js missing session key');
if (!voice.includes('const VOICE_DUR') || !voice.includes('const VOICE_SRC')) {
  throw new Error('voice-data.js missing VOICE_DUR / VOICE_SRC');
}

html = replaceOnce(
  html,
  '<link rel="stylesheet" href="base.css">',
  '<style>\n' + css + '\n</style>',
  'css link'
);
html = replaceOnce(
  html,
  '<script src="voice-data.js"></script>\n<script src="app.js"></script>',
  '<script>\n' + voice + '\n' + js + '\n</script>',
  'script tags'
);

if (html.includes('href="base.css"') || html.includes('src="app.js"') || html.includes('src="voice-data.js"')) {
  throw new Error('packer left external references');
}
if (!html.includes("const PIN = '1111'")) throw new Error('packed HTML missing PIN');
if (!html.includes('mobile-adapt-v2')) throw new Error('packed HTML missing mobile CSS');
if (!html.includes('class="explain-off"')) throw new Error('packed HTML missing default explain-off');
if (!html.includes('class="pin-mask')) throw new Error('packed HTML missing pin mask');

const out1 = path.join(dir, '第27题扩展题目2_交互教学.html');
const out2 = path.join(dir, 'ext2.html');
fs.writeFileSync(out1, html);
fs.writeFileSync(out2, html);
console.log('packed', out1);
console.log('copy  ', out2);
console.log('bytes ', fs.statSync(out1).size);
