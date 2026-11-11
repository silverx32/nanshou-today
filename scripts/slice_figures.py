"""把「粉彩萌系迷你职业与动物 figurines.png」切成 32 张单独的小人素材。

用法: python -I scripts/slice_figures.py <源图> <输出目录>
- 清理源图背景里残留的低透明度噪点（alpha 1~20）
- 按行/列投影自动找出 4 行 x 8 列的小人，裁切后输出 webp
"""
import sys
from pathlib import Path

import numpy as np
from PIL import Image

NAMES = [
    # 第 1 行：职业小人
    "hiker", "gardener", "painter", "photographer", "baker", "reader", "coder", "traveler",
    # 第 2 行：职业小人
    "builder", "courier", "postman", "cyclist", "coffee", "fisher", "camper", "guitarist",
    # 第 3 行：动物
    "cat", "corgi", "rabbit", "fox", "deer", "bear", "squirrel", "hedgehog",
    # 第 4 行：动物
    "duck", "goose", "pig", "cow", "sheep", "pony", "raccoon", "penguin",
]

LO, HI = 20, 240  # alpha 色阶：<=LO 变全透明，>=HI 变全不透明
PAD = 6


def segments(profile: np.ndarray, min_gap: int, min_len: int, min_mass: float):
    on = profile > 0
    segs, start = [], None
    for i, v in enumerate(on):
        if v and start is None:
            start = i
        elif not v and start is not None:
            segs.append([start, i])
            start = None
    if start is not None:
        segs.append([start, len(on)])
    merged = []
    for s in segs:
        if merged and s[0] - merged[-1][1] < min_gap:
            merged[-1][1] = s[1]
        else:
            merged.append(s)
    return [s for s in merged if s[1] - s[0] >= min_len and profile[s[0]:s[1]].sum() >= min_mass]


def main(src: str, out_dir: str):
    out = Path(out_dir)
    out.mkdir(parents=True, exist_ok=True)

    rgba = np.array(Image.open(src).convert("RGBA")).astype(np.float32)
    alpha = np.clip((rgba[..., 3] - LO) / (HI - LO), 0, 1) * 255
    rgba[..., 3] = alpha
    mask = alpha > 40

    rows = segments(mask.sum(axis=1), min_gap=3, min_len=60, min_mass=2000)
    if len(rows) != 4:
        sys.exit(f"期望 4 行，实际找到 {len(rows)} 行: {rows}")

    figures = []
    cell_w = mask.shape[1] / 8
    for r0, r1 in rows:
        band = mask[r0:r1]
        # 不合并间隙，按片段中心归到 8 个等宽格子里，同一格的片段再合并（花盆、鱼竿之类的小零件）
        cells = [None] * 8
        for c0, c1 in segments(band.sum(axis=0), min_gap=1, min_len=1, min_mass=60):
            i = min(int((c0 + c1) / 2 // cell_w), 7)
            cells[i] = [c0, c1] if cells[i] is None else [min(cells[i][0], c0), max(cells[i][1], c1)]
        if any(c is None for c in cells):
            sys.exit(f"第 {len(figures) // 8 + 1} 行有空格子: {cells}")
        for c0, c1 in cells:
            sub = band[:, c0:c1]
            ys = np.where(sub.any(axis=1))[0]
            y0, y1 = r0 + ys[0], r0 + ys[-1] + 1
            figures.append((max(c0 - PAD, 0), max(y0 - PAD, 0), c1 + PAD, y1 + PAD))

    img = Image.fromarray(rgba.round().astype(np.uint8))
    for name, box in zip(NAMES, figures):
        crop = img.crop(box)
        crop.save(out / f"{name}.webp", "WEBP", quality=90, method=6)
        print(f"{name:13s} {crop.size}")


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
