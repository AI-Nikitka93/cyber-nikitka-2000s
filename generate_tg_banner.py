import os
from PIL import Image, ImageDraw

img_dir = "img"
os.makedirs(img_dir, exist_ok=True)

def create_tg_banner():
    # 88x31 badge
    img = Image.new("RGB", (88, 31), color="#0088CC")
    draw = ImageDraw.Draw(img)

    # 3D Outset border
    draw.rectangle([0, 0, 87, 30], outline="#00C8FF", width=1)
    draw.rectangle([0, 0, 87, 0], fill="#FFFFFF")
    draw.rectangle([0, 0, 0, 30], fill="#FFFFFF")
    draw.rectangle([87, 0, 87, 30], fill="#004466")
    draw.rectangle([0, 30, 87, 30], fill="#004466")

    # Paper plane logo icon
    draw.polygon([(8, 15), (24, 7), (20, 23), (16, 18), (14, 22), (14, 18)], fill="#FFFFFF")
    draw.polygon([(14, 18), (24, 7), (16, 18)], fill="#D0E8F5")

    # Text
    draw.text((28, 4), "TELEGRAM", fill="#FFFFFF")
    draw.text((28, 16), "@Ai_nikitka93", fill="#FFFF00")

    img.save(os.path.join(img_dir, "banner-telegram.png"))
    print("Created img/banner-telegram.png!")

create_tg_banner()
