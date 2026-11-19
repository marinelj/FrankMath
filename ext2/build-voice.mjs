#!/usr/bin/env node
// Build voice-data.js from voice/mp3/*.mp3 using real ffprobe durations.
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
import { fileURLToPath } from 'url';

const dir = path.dirname(fileURLToPath(import.meta.url));
const mp3dir = path.join(dir, 'voice', 'mp3');

function duration(file) {
  const out = execFileSync('ffprobe', [
    '-v', 'error',
    '-show_entries', 'format=duration',
    '-of', 'default=nokey=1:noprint_wrappers=1',
    file
  ], { encoding: 'utf8' }).trim();
  return Math.round(Number(out) * 1000) / 1000;
}

const durs = [];
const srcs = [];
for (let t = 0; t < 3; t++) {
  const drow = [], srow = [];
  for (let s = 0; s < 5; s++) {
    const file = path.join(mp3dir, `t${t}_s${s}.mp3`);
    if (!fs.existsSync(file)) throw new Error('missing ' + file);
    const buf = fs.readFileSync(file);
    if (buf.length < 1000) throw new Error('tiny ' + file);
    drow.push(duration(file));
    srow.push('data:audio/mpeg;base64,' + buf.toString('base64'));
  }
  durs.push(drow);
  srcs.push(srow);
}

const js =
  'const VOICE_DUR = ' + JSON.stringify(durs) + ';\n' +
  'const VOICE_SRC = ' + JSON.stringify(srcs) + ';\n';
const out = path.join(dir, 'voice-data.js');
fs.writeFileSync(out, js);
console.log('wrote', out, fs.statSync(out).size, 'bytes');
console.log('VOICE_DUR', JSON.stringify(durs));
console.log('tab totals', durs.map(r => r.reduce((a, b) => a + b, 0)));
