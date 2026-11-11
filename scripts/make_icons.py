"""生成 App 图标：玫瑰色毛毡布 + 缝线 + 小兔子。

用法: python -I scripts/make_icons.py <项目根目录>
输出:
  public/icons/  —— PWA / 浏览器用的图标
  android/app/src/main/res/mipmap-*  —— 安卓启动图标（android 目录存在时）
"""
import math
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

M = 1024  # 母版尺寸
C1 = np.array([252, 228, 228], dtype=np.float32)  # 左上
C2 = np.array([240, 172, 184], dtype=np.float32)  # 右下
STITCH = (255, 255, 255, 235)
FIGURE = "rabbit"


def fabric(size: int) -> Image.Image:
    """渐变 + 细布纹 + 毛毡颗粒"""
    y, x = np.mgrid[0:size, 0:size].astype(np.float32)
    t = np.clip((x * math.cos(0.7) + y * math.sin(0.7)) / (size * (math.cos(0.7) + math.sin(0.7))), 0, 1)
    rgb = C1[None, None, :] * (1 - t[..., None]) + C2[None, None, :] * t[..., None]
    step = max(size // 340, 1)
    weave = (((y // step) % 3 == 0) * 4.0 - ((x // step) % 3 == 0) * 2.0)[..., None]
    grain = np.random.default_rng(7).normal(0, 3.2, (size, size, 1))
    rgb = np.clip(rgb + weave + grain, 0, 255).astype(np.uint8)
    return Image.fromarray(rgb).convert("RGBA")


def dashed_round_rect(draw: ImageDraw.ImageDraw, box, radius, dash, gap, width, fill):
    """沿圆角矩形画一圈虚线（缝线）"""
    x0, y0, x1, y1 = box
    pts = []
    n_arc = 24
    corners = [
        (x1 - radius, y0 + radius, -90),
        (x1 - radius, y1 - radius, 0),
        (x0 + radius, y1 - radius, 90),
        (x0 + radius, y0 + radius, 180),
    ]
    for cx, cy, a0 in corners:
        for i in range(n_arc + 1):
            a = math.radians(a0 + 90 * i / n_arc)
            pts.append((cx + radius * math.cos(a), cy + radius * math.sin(a)))
    pts.append(pts[0])
    dashed_polyline(draw, pts, dash, gap, width, fill)


def dashed_circle(draw, center, r, dash, gap, width, fill):
    pts = [(center[0] + r * math.cos(2 * math.pi * i / 360), center[1] + r * math.sin(2 * math.pi * i / 360)) for i in range(361)]
    dashed_polyline(draw, pts, dash, gap, width, fill)


def dashed_polyline(draw, pts, dash, gap, width, fill):
    on, left, cur = True, dash, [pts[0]]
    for (ax, ay), (bx, by) in zip(pts, pts[1:]):
        seg = math.hypot(bx - ax, by - ay)
        pos = 0.0
        while pos < seg:
            take = min(left, seg - pos)
            pos += take
            px, py = ax + (bx - ax) * pos / seg, ay + (by - ay) * pos / seg
            if on:
                cur.append((px, py))
            left -= take
            if left <= 1e-6:
                if on and len(cur) > 1:
                    draw.line(cur, fill=fill, width=width, joint="curve")
                on = not on
                left = dash if on else gap
                cur = [(px, py)]
    if on and len(cur) > 1:
        draw.line(cur, fill=fill, width=width, joint="curve")


def figure(root: Path, height: int) -> Image.Image:
    im = Image.open(root / "public" / "figures" / f"{FIGURE}.webp").convert("RGBA")
    w = round(im.width * height / im.height)
    im = im.resize((w, height), Image.LANCZOS)
    return im.filter(ImageFilter.UnsharpMask(radius=2, percent=60, threshold=2))


def with_shadow(fig: Image.Image, blur: int, offset: int, alpha: float) -> Image.Image:
    pad = blur * 3
    out = Image.new("RGBA", (fig.width + pad * 2, fig.height + pad * 2), (0, 0, 0, 0))
    a = np.array(fig.split()[3], dtype=np.float32) * alpha
    shadow = Image.new("RGBA", fig.size, (130, 80, 86, 0))
    shadow.putalpha(Image.fromarray(a.astype(np.uint8)))
    out.alpha_composite(shadow, (pad, pad + offset))
    out = out.filter(ImageFilter.GaussianBlur(blur))
    out.alpha_composite(fig, (pad, pad))
    return out


def paste_center(base: Image.Image, fig: Image.Image, cy: float):
    base.alpha_composite(fig, ((base.width - fig.width) // 2, round(base.height * cy - fig.height / 2)))


def master_full(root: Path, fig_scale: float, stitch_inset: float, circle: bool) -> Image.Image:
    """满版图标：整块布 + 缝线 + 小兔子"""
    img = fabric(M)
    d = ImageDraw.Draw(img)
    if circle:
        dashed_circle(d, (M / 2, M / 2), M * (0.5 - stitch_inset), 26, 18, 10, STITCH)
    else:
        i = M * stitch_inset
        dashed_round_rect(d, (i, i, M - i, M - i), M * 0.17, 26, 18, 10, STITCH)
    paste_center(img, with_shadow(figure(root, round(M * fig_scale)), 14, 10, 0.35), 0.53)
    return img


def rounded(img: Image.Image, radius_ratio: float) -> Image.Image:
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle((0, 0, img.width - 1, img.height - 1), round(img.width * radius_ratio), fill=255)
    out = img.copy()
    out.putalpha(mask)
    return out


def save(img: Image.Image, path: Path, size: int):
    path.parent.mkdir(parents=True, exist_ok=True)
    img.resize((size, size), Image.LANCZOS).save(path)
    print(f"{path}  {size}x{size}")


def main(root_dir: str):
    root = Path(root_dir)
    icons = root / "public" / "icons"

    # 浏览器 / PWA：圆角方形，透明四角
    any_icon = rounded(master_full(root, 0.62, 0.075, circle=False), 0.22)
    save(any_icon, icons / "icon-192.png", 192)
    save(any_icon, icons / "icon-512.png", 512)
    # 可裁切图标 + iOS 主屏：满版，小兔子缩进安全区
    full = master_full(root, 0.52, 0.12, circle=True)
    save(full, icons / "icon-maskable-512.png", 512)
    save(full.convert("RGB"), icons / "apple-touch-icon.png", 180)

    res = root / "android" / "app" / "src" / "main" / "res"
    if not res.exists():
        return
    # 安卓旧版启动图标（方形 / 圆形）
    legacy = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
    square = rounded(master_full(root, 0.6, 0.08, circle=False), 0.2)
    round_icon = master_full(root, 0.56, 0.1, circle=True)
    circle_mask = Image.new("L", (M, M), 0)
    ImageDraw.Draw(circle_mask).ellipse((0, 0, M - 1, M - 1), fill=255)
    round_icon.putalpha(circle_mask)
    for dpi, s in legacy.items():
        save(square, res / f"mipmap-{dpi}" / "ic_launcher.png", s)
        save(round_icon, res / f"mipmap-{dpi}" / "ic_launcher_round.png", s)

    # 自适应图标（Android 8+）：前景 = 缝线圈 + 小兔子，背景 = 布
    fg = Image.new("RGBA", (M, M), (0, 0, 0, 0))
    dashed_circle(ImageDraw.Draw(fg), (M / 2, M / 2), M * 0.3, 20, 14, 8, STITCH)
    paste_center(fg, with_shadow(figure(root, round(M * 0.4)), 12, 8, 0.35), 0.52)
    bg = fabric(M)
    adaptive = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}
    for dpi, s in adaptive.items():
        save(fg, res / f"mipmap-{dpi}" / "ic_launcher_foreground.png", s)
        save(bg.convert("RGB"), res / f"mipmap-{dpi}" / "ic_launcher_background.png", s)


if __name__ == "__main__":
    main(sys.argv[1])
