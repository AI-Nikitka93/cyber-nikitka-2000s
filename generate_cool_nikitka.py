import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

def create_cool_nikitka():
    w, h = 200, 200
    img = Image.new('RGB', (w, h), (0, 0, 128))
    draw = ImageDraw.Draw(img)

    # 1. Background: CRT / Matrix retro gradient
    for y in range(h):
        r = int(0 + (y / h) * 20)
        g = int(0 + (y / h) * 40)
        b = int(128 - (y / h) * 60)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Grid background (CRT scanlines)
    for y in range(0, h, 4):
        draw.line([(0, y), (w, y)], fill=(0, 0, 0, 40))
    for x in range(0, w, 16):
        draw.line([(x, 0), (x, h)], fill=(0, 255, 128, 20))

    # Floating matrix numbers in background
    font_sm = ImageFont.load_default()
    matrix_chars = ["0", "1", "XP", "SP3", "BSOD", "3D", "AGP", "CD", "101.7"]
    coords = [(15, 20), (160, 25), (20, 60), (165, 75), (10, 110), (170, 120)]
    for idx, (cx, cy) in enumerate(coords):
        draw.text((cx, cy), matrix_chars[idx % len(matrix_chars)], fill=(0, 220, 100), font=font_sm)

    # 2. Body / Hoodie (Dark Gray / Black with Teal/Green circuit lines)
    # Shoulders & Chest
    draw.ellipse([30, 130, 170, 250], fill=(25, 30, 40), outline=(100, 110, 130), width=2)
    # Hoodie Collar / Zipper
    draw.polygon([(85, 140), (115, 140), (105, 195), (95, 195)], fill=(40, 45, 60), outline=(180, 190, 210))
    draw.line([(100, 140), (100, 195)], fill=(220, 220, 220), width=2)

    # Circuit lines on hoodie
    draw.line([(45, 160), (70, 160), (80, 175)], fill=(0, 255, 128), width=2)
    draw.ellipse([78, 173, 82, 177], fill=(0, 255, 128))
    draw.line([(155, 160), (130, 160), (120, 175)], fill=(0, 255, 128), width=2)
    draw.ellipse([118, 173, 122, 177], fill=(0, 255, 128))

    # Badge on Hoodie: "МАСТЕР 2007"
    draw.rectangle([65, 175, 135, 195], fill=(0, 128, 128), outline=(255, 255, 255), width=2)
    draw.text((70, 178), "МАСТЕР 2007", fill=(255, 255, 0), font=font_sm)

    # 3. Headphones around neck
    # Band
    draw.arc([40, 90, 160, 155], 0, 180, fill=(180, 180, 190), width=6)
    # Ear pads (Orange retro foam!)
    draw.ellipse([35, 115, 60, 145], fill=(255, 120, 0), outline=(80, 80, 80), width=2)
    draw.ellipse([140, 115, 165, 145], fill=(255, 120, 0), outline=(80, 80, 80), width=2)
    # Silver metal caps
    draw.ellipse([42, 120, 53, 140], fill=(200, 200, 210))
    draw.ellipse([147, 120, 158, 140], fill=(200, 200, 210))

    # 4. Neck & Face
    # Neck
    draw.rectangle([82, 110, 118, 142], fill=(240, 195, 160), outline=(180, 130, 100))
    # Neck shadow
    draw.polygon([(82, 130), (118, 130), (118, 142), (82, 142)], fill=(210, 160, 125))

    # Face Oval
    draw.ellipse([60, 45, 140, 125], fill=(255, 205, 165), outline=(180, 130, 100), width=2)

    # Ears
    draw.ellipse([54, 75, 66, 95], fill=(240, 190, 150), outline=(180, 130, 100))
    draw.ellipse([134, 75, 146, 95], fill=(240, 190, 150), outline=(180, 130, 100))

    # 5. Cool 2000s Spiky Hair (Brown / Chestnut spiky gamer hair)
    spikes = [
        [(58, 60), (45, 35), (68, 48)],
        [(65, 48), (55, 22), (78, 42)],
        [(75, 42), (70, 15), (90, 38)],
        [(88, 38), (95, 12), (105, 38)],
        [(102, 38), (118, 15), (122, 42)],
        [(120, 42), (135, 22), (132, 50)],
        [(130, 50), (148, 35), (138, 62)],
    ]
    for sp in spikes:
        draw.polygon(sp, fill=(70, 40, 20), outline=(40, 20, 10))
    # Hair bang fringe
    draw.polygon([(65, 52), (80, 62), (72, 50)], fill=(85, 50, 25))
    draw.polygon([(82, 50), (98, 64), (90, 48)], fill=(85, 50, 25))
    draw.polygon([(100, 48), (118, 62), (110, 50)], fill=(85, 50, 25))

    # 6. Cool Matrix-style Narrow Dark Sunglasses
    # Glasses frame
    draw.polygon([(66, 72), (97, 72), (94, 86), (70, 86)], fill=(15, 15, 20), outline=(255, 255, 255), width=1)
    draw.polygon([(103, 72), (134, 72), (130, 86), (106, 86)], fill=(15, 15, 20), outline=(255, 255, 255), width=1)
    # Bridge
    draw.line([(96, 76), (104, 76)], fill=(200, 200, 200), width=2)
    # Glass glare (white sheen line)
    draw.line([(70, 74), (82, 84)], fill=(0, 255, 200), width=2)
    draw.line([(107, 74), (119, 84)], fill=(0, 255, 200), width=2)

    # 7. Cool Smirk / Smile
    draw.arc([88, 92, 114, 108], 10, 160, fill=(140, 60, 40), width=2)
    # Smirk dimple
    draw.line([(113, 98), (117, 95)], fill=(140, 60, 40), width=2)

    # Nose
    draw.line([(98, 86), (96, 93), (100, 93)], fill=(200, 140, 110), width=2)

    # 8. Holding a Shiny Iridescent CD-ROM Disk in Hand!
    # Hand / Fingers (Right side)
    draw.ellipse([135, 140, 165, 170], fill=(240, 190, 150), outline=(180, 130, 100))
    # CD Disk
    cd_cx, cd_cy = 150, 145
    draw.ellipse([cd_cx-25, cd_cy-25, cd_cx+25, cd_cy+25], fill=(220, 225, 235), outline=(100, 110, 120), width=2)
    # Rainbow sheen on CD
    draw.arc([cd_cx-22, cd_cy-22, cd_cx+22, cd_cy+22], 30, 120, fill=(255, 100, 100), width=4)
    draw.arc([cd_cx-22, cd_cy-22, cd_cx+22, cd_cy+22], 120, 210, fill=(100, 255, 100), width=4)
    draw.arc([cd_cx-22, cd_cy-22, cd_cx+22, cd_cy+22], 210, 300, fill=(100, 100, 255), width=4)
    # CD Center hole
    draw.ellipse([cd_cx-8, cd_cy-8, cd_cx+8, cd_cy+8], fill=(160, 170, 185), outline=(80, 90, 100))
    draw.ellipse([cd_cx-4, cd_cy-4, cd_cx+4, cd_cy+4], fill=(0, 0, 128)) # Transparent background hole

    # 9. Outer 3D Window Border (Windows 98 Outset Border)
    draw.line([(0, 0), (w, 0)], fill=(255, 255, 255), width=3)
    draw.line([(0, 0), (0, h)], fill=(255, 255, 255), width=3)
    draw.line([(0, h-2), (w, h-2)], fill=(64, 64, 64), width=3)
    draw.line([(w-2, 0), (w-2, h)], fill=(64, 64, 64), width=3)

    img.save('img/photo-nikitka.png')
    print("Successfully generated cool Master Nikita avatar -> img/photo-nikitka.png")

if __name__ == '__main__':
    create_cool_nikitka()
