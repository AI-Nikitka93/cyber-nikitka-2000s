import os
from PIL import Image, ImageDraw, ImageFont

img_dir = "img"
os.makedirs(img_dir, exist_ok=True)

def create_hd_tg_banner():
    # Supersampled 4x size (352x124) then resized to (88x31) or saved high quality
    w, h = 352, 124
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Background gradient cyan/blue
    for y in range(h):
        r = int(0 + (0 - 0) * (y / h))
        g = int(136 + (100 - 136) * (y / h))
        b = int(204 + (180 - 204) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))

    # Outer 3D Bevel Box
    draw.rectangle([0, 0, w-1, h-1], outline=(0, 220, 255, 255), width=4)
    draw.line([(0, 0), (w-1, 0)], fill=(255, 255, 255, 255), width=6)
    draw.line([(0, 0), (0, h-1)], fill=(255, 255, 255, 255), width=6)
    draw.line([(w-1, 0), (w-1, h-1)], fill=(0, 60, 100, 255), width=6)
    draw.line([(0, h-1), (w-1, h-1)], fill=(0, 60, 100, 255), width=6)

    # Paper Plane Logo
    # Draw vector paper airplane
    poly = [(32, 60), (96, 28), (80, 92), (64, 72), (56, 88), (56, 72)]
    draw.polygon(poly, fill=(255, 255, 255, 255))
    draw.polygon([(56, 72), (96, 28), (64, 72)], fill=(210, 235, 250, 255))

    # Fonts
    try:
        font_large = ImageFont.truetype("arialbd.ttf", 36)
        font_small = ImageFont.truetype("arialbd.ttf", 32)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()

    # Text shadow & text
    draw.text((114, 18), "TELEGRAM", fill=(0, 40, 70, 255), font=font_large)
    draw.text((112, 16), "TELEGRAM", fill=(255, 255, 255, 255), font=font_large)

    draw.text((114, 66), "@Ai_nikitka93", fill=(0, 0, 0, 255), font=font_small)
    draw.text((112, 64), "@Ai_nikitka93", fill=(255, 255, 0, 255), font=font_small)

    # Resize back down to 88x31 with high quality LANCZOS filter
    final_img = img.resize((88, 31), Image.Resampling.LANCZOS)
    final_img.save(os.path.join(img_dir, "banner-telegram.png"), quality=100)
    print("Created high-res crisp img/banner-telegram.png!")

create_hd_tg_banner()
