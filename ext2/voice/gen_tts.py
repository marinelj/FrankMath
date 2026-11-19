#!/usr/bin/env python3
import asyncio, json, os, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
OUT = ROOT / "mp3"
OUT.mkdir(parents=True, exist_ok=True)
scripts = json.loads((ROOT / "scripts.json").read_text(encoding="utf-8"))

VOICE = "zh-CN-XiaoxiaoNeural"
RATE = "-10%"

async def one(text, path):
    import edge_tts
    communicate = edge_tts.Communicate(text, VOICE, rate=RATE)
    await communicate.save(str(path))

async def main():
    tasks = []
    files = []
    for ti, tab in enumerate(scripts):
        for si, text in enumerate(tab):
            path = OUT / f"t{ti}_s{si}.mp3"
            files.append((ti, si, path, text))
            tasks.append(one(text, path))
    await asyncio.gather(*tasks)
    durs = [[0]*5 for _ in range(3)]
    for ti, si, path, text in files:
        if not path.exists() or path.stat().st_size < 1000:
            raise SystemExit(f"missing or tiny: {path}")
        out = subprocess.check_output([
            "ffprobe", "-v", "error", "-show_entries", "format=duration",
            "-of", "default=nokey=1:noprint_wrappers=1", str(path)
        ], text=True).strip()
        durs[ti][si] = float(out)
        print(f"t{ti}_s{si}: {durs[ti][si]:.3f}s  {path.stat().st_size} bytes")
    print("VOICE_DUR =", durs)
    print("tab totals", [sum(r) for r in durs])

if __name__ == "__main__":
    asyncio.run(main())
