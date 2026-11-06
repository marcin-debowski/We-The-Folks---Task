"""Cuts variant-b/source/bg-big.jpg into the three fireplace backgrounds.

The parts sit side by side with a 4 px gap (8 px in the 2x asset):
left 320 + 4 + top 1032 + 4 + right 320 = 1680 CSS px = 3360 px in bg-big.jpg.
Cutting one continuous photo keeps the moss continuous across the seams.
"""
from pathlib import Path

from PIL import Image

VARIANT_B = Path(__file__).resolve().parent.parent / "variant-b"
SOURCE = VARIANT_B / "source" / "bg-big.jpg"
OUT_DIR = VARIANT_B / "assets" / "bg"
QUALITY = 80

# (left, top, right, bottom) in bg-big.jpg pixels
CROPS = {
    "left": (0, 0, 640, 1950),
    "top": (648, 0, 2712, 500),
    "right": (2720, 0, 3360, 1950),
}


def main():
    source = Image.open(SOURCE).convert("RGB")
    OUT_DIR.mkdir(exist_ok=True)

    for name, box in CROPS.items():
        path = OUT_DIR / f"{name}.jpg"
        source.crop(box).save(path, quality=QUALITY, optimize=True, progressive=True)
        print(f"{path.name}: {path.stat().st_size / 1024:.0f} KB")


if __name__ == "__main__":
    main()
