import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

img_dir = "img"
os.makedirs(img_dir, exist_ok=True)

def apply_3d_border(draw, w, h):
    # Classic Windows 98/2000 outset border
    draw.line([(0, 0), (w, 0)], fill=(255, 255, 255), width=2)
    draw.line([(0, 0), (0, h)], fill=(255, 255, 255), width=2)
    draw.line([(0, h-1), (w, h-1)], fill=(64, 64, 64), width=2)
    draw.line([(w-1, 0), (w-1, h)], fill=(64, 64, 64), width=2)

def create_avatar_nikitka(filename="photo-nikitka.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (0, 0, 128))
    draw = ImageDraw.Draw(img)

    # 1. Background gradient & CRT scanlines
    for y in range(h):
        r = int(0 + (y / h) * 20)
        g = int(0 + (y / h) * 40)
        b = int(128 - (y / h) * 60)
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    for y in range(0, h, 3):
        draw.line([(0, y), (w, y)], fill=(0, 0, 0))

    # Matrix chars
    font = ImageFont.load_default()
    draw.text((10, 10), "XP", fill=(0, 220, 100), font=font)
    draw.text((90, 15), "SP3", fill=(0, 220, 100), font=font)
    draw.text((15, 70), "BSOD", fill=(0, 220, 100), font=font)
    draw.text((85, 80), "1337", fill=(0, 220, 100), font=font)

    # Body / Hoodie
    draw.ellipse([20, 75, 100, 140], fill=(25, 30, 40), outline=(100, 110, 130), width=2)
    draw.polygon([(50, 80), (70, 80), (64, 115), (56, 115)], fill=(40, 45, 60), outline=(180, 190, 210))
    draw.line([(60, 80), (60, 115)], fill=(220, 220, 220), width=2)

    # Orange headphones around neck
    draw.arc([25, 55, 95, 95], 0, 180, fill=(180, 180, 190), width=4)
    draw.ellipse([22, 70, 38, 90], fill=(255, 120, 0), outline=(80, 80, 80), width=1)
    draw.ellipse([82, 70, 98, 90], fill=(255, 120, 0), outline=(80, 80, 80), width=1)

    # Head & Neck
    draw.rectangle([48, 65, 72, 85], fill=(240, 195, 160))
    draw.ellipse([36, 25, 84, 75], fill=(255, 205, 165), outline=(180, 130, 100), width=1)

    # Spiky brown hair
    spikes = [
        [(35, 35), (28, 18), (43, 26)],
        [(40, 26), (34, 10), (48, 22)],
        [(46, 22), (44, 6), (56, 20)],
        [(54, 20), (60, 4), (66, 20)],
        [(64, 20), (74, 6), (72, 22)],
        [(70, 22), (84, 10), (78, 28)],
        [(76, 28), (90, 20), (83, 38)],
    ]
    for sp in spikes:
        draw.polygon(sp, fill=(70, 40, 20), outline=(40, 20, 10))

    # Matrix narrow sunglasses
    draw.polygon([(40, 42), (58, 42), (56, 52), (42, 52)], fill=(15, 15, 20), outline=(255, 255, 255))
    draw.polygon([(62, 42), (80, 42), (78, 52), (64, 52)], fill=(15, 15, 20), outline=(255, 255, 255))
    draw.line([(57, 45), (63, 45)], fill=(200, 200, 200), width=1)
    draw.line([(42, 44), (50, 50)], fill=(0, 255, 200), width=1)
    draw.line([(64, 44), (72, 50)], fill=(0, 255, 200), width=1)

    # Smirk & Nose
    draw.arc([52, 55, 68, 65], 10, 160, fill=(140, 60, 40), width=2)
    draw.line([(58, 50), (57, 56), (60, 56)], fill=(200, 140, 110), width=1)

    # CD Disk in hand
    cd_cx, cd_cy = 92, 90
    draw.ellipse([cd_cx-16, cd_cy-16, cd_cx+16, cd_cy+16], fill=(220, 225, 235), outline=(80, 90, 100))
    draw.arc([cd_cx-14, cd_cy-14, cd_cx+14, cd_cy+14], 30, 120, fill=(255, 100, 100), width=3)
    draw.arc([cd_cx-14, cd_cy-14, cd_cx+14, cd_cy+14], 120, 210, fill=(100, 255, 100), width=3)
    draw.arc([cd_cx-14, cd_cy-14, cd_cx+14, cd_cy+14], 210, 300, fill=(100, 100, 255), width=3)
    draw.ellipse([cd_cx-5, cd_cy-5, cd_cx+5, cd_cy+5], fill=(160, 170, 185))

    # Badge
    draw.rectangle([35, 102, 85, 116], fill=(0, 128, 128), outline=(255, 255, 255))
    draw.text((38, 103), "МАСТЕР 07", fill=(255, 255, 0), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_cs(filename="avatar-cs.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (40, 48, 30))
    draw = ImageDraw.Draw(img)

    # Camo pattern background
    font = ImageFont.load_default()
    for x in range(0, w, 20):
        for y in range(0, h, 20):
            if (x+y)%40 == 0:
                draw.rectangle([x, y, x+18, y+18], fill=(60, 70, 45))
            elif (x*y)%30 == 0:
                draw.rectangle([x, y, x+18, y+18], fill=(30, 35, 20))

    # Scanlines
    for y in range(0, h, 3):
        draw.line([(0, y), (w, y)], fill=(0, 0, 0))

    # CT Helmet Character
    # Shoulders
    draw.ellipse([20, 75, 100, 130], fill=(25, 30, 25), outline=(100, 120, 90), width=2)
    # Head & Helmet
    draw.ellipse([35, 25, 85, 75], fill=(50, 60, 45), outline=(120, 140, 100), width=2)
    # Visor / Goggles
    draw.rectangle([40, 42, 80, 56], fill=(20, 25, 20), outline=(211, 184, 124), width=2)
    draw.line([(44, 45), (55, 53)], fill=(100, 200, 255), width=2)
    # Balaclava / Mouth guard
    draw.rectangle([44, 58, 76, 70], fill=(30, 35, 30))

    # Crosshair HUD
    cx, cy = 60, 49
    draw.ellipse([cx-25, cy-25, cx+25, cy+25], outline=(255, 50, 50), width=1)
    draw.line([(cx-35, cy), (cx-10, cy)], fill=(255, 50, 50), width=2)
    draw.line([(cx+10, cy), (cx+35, cy)], fill=(255, 50, 50), width=2)
    draw.line([(cx, cy-35), (cx, cy-10)], fill=(255, 50, 50), width=2)
    draw.line([(cx, cy+10), (cx, cy+35)], fill=(255, 50, 50), width=2)
    draw.ellipse([cx-2, cy-2, cx+2, cy+2], fill=(255, 50, 50))

    # CS 1.6 PRO Badge
    draw.rectangle([15, 95, 105, 114], fill=(20, 25, 15), outline=(211, 184, 124), width=2)
    draw.text((22, 98), "CS 1.6  [PRO]", fill=(211, 184, 124), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_neo(filename="avatar-neo.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (0, 10, 0))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Matrix digital rain lines
    chars = "01010101101001"
    for col in range(5, w, 12):
        offset = (col * 7) % 40
        for y in range(offset, h, 14):
            ch = chars[(col + y) % len(chars)]
            bright = int(100 + ((y * 3) % 155))
            draw.text((col, y), ch, fill=(0, bright, 50), font=font)

    # Cyber Hacker Silhouette with visor
    draw.ellipse([30, 75, 90, 130], fill=(5, 20, 5), outline=(0, 255, 70), width=1)
    draw.ellipse([38, 25, 82, 75], fill=(10, 30, 10), outline=(0, 255, 70), width=2)
    # Glowing Cyber Visor
    draw.rectangle([40, 42, 80, 54], fill=(0, 255, 100), outline=(255, 255, 255), width=1)
    draw.text((43, 43), "1337", fill=(0, 30, 0), font=font)

    # Hacker Badge
    draw.rectangle([20, 96, 100, 114], fill=(0, 40, 0), outline=(0, 255, 0), width=2)
    draw.text((25, 99), "MATRIX NEO", fill=(0, 255, 128), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_stalker(filename="avatar-stalker.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (25, 20, 15))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Dark metal grid
    for x in range(0, w, 15):
        draw.line([(x, 0), (x, h)], fill=(45, 35, 25))
    for y in range(0, h, 15):
        draw.line([(0, y), (w, y)], fill=(45, 35, 25))

    # Gas Mask Character
    draw.ellipse([25, 75, 95, 130], fill=(40, 35, 30), outline=(255, 150, 0), width=1)
    draw.ellipse([35, 25, 85, 75], fill=(50, 45, 40), outline=(255, 150, 0), width=2)
    # Gas mask glass eyes
    draw.ellipse([42, 40, 56, 54], fill=(255, 180, 0), outline=(30, 20, 10), width=2)
    draw.ellipse([64, 40, 78, 54], fill=(255, 180, 0), outline=(30, 20, 10), width=2)
    draw.ellipse([46, 44, 52, 50], fill=(255, 255, 200))
    draw.ellipse([68, 44, 74, 50], fill=(255, 255, 200))
    # Filter snout
    draw.ellipse([51, 56, 69, 74], fill=(20, 20, 20), outline=(255, 150, 0), width=2)
    draw.line([(54, 65), (66, 65)], fill=(100, 100, 100), width=2)

    # Radiation Warning symbol top right
    rx, ry = 100, 20
    draw.ellipse([rx-12, ry-12, rx+12, ry+12], fill=(255, 165, 0), outline=(0, 0, 0), width=1)
    draw.ellipse([rx-3, ry-3, rx+3, ry+3], fill=(0, 0, 0))

    # Stalker Badge
    draw.rectangle([15, 95, 105, 114], fill=(30, 15, 5), outline=(255, 140, 0), width=2)
    draw.text((22, 98), "S.T.A.L.K.E.R.", fill=(255, 165, 0), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_cat(filename="avatar-cat.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (255, 180, 40))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Retro grid
    for x in range(0, w, 12):
        draw.line([(x, 0), (x, h)], fill=(255, 200, 80))

    # Cat Ears
    draw.polygon([(30, 45), (42, 15), (58, 35)], fill=(210, 100, 20), outline=(100, 40, 0), width=2)
    draw.polygon([(35, 42), (43, 22), (54, 35)], fill=(255, 160, 160))

    draw.polygon([(90, 45), (78, 15), (62, 35)], fill=(210, 100, 20), outline=(100, 40, 0), width=2)
    draw.polygon([(85, 42), (77, 22), (66, 35)], fill=(255, 160, 160))

    # Cat Head
    draw.ellipse([30, 30, 90, 85], fill=(230, 120, 30), outline=(120, 50, 0), width=2)
    # White muzzle
    draw.ellipse([45, 58, 75, 82], fill=(255, 245, 235))
    # Pink Nose & Whiskers
    draw.polygon([(57, 62), (63, 62), (60, 67)], fill=(255, 100, 150))
    draw.line([(35, 66), (48, 66)], fill=(50, 20, 0), width=2)
    draw.line([(35, 72), (47, 70)], fill=(50, 20, 0), width=2)
    draw.line([(85, 66), (72, 66)], fill=(50, 20, 0), width=2)
    draw.line([(85, 72), (73, 70)], fill=(50, 20, 0), width=2)

    # 8-bit Deal With It Sunglasses!
    draw.rectangle([34, 44, 86, 58], fill=(0, 0, 0))
    draw.rectangle([37, 46, 43, 50], fill=(255, 255, 255))
    draw.rectangle([63, 46, 69, 50], fill=(255, 255, 255))

    # Headphones
    draw.arc([22, 20, 98, 70], 180, 360, fill=(50, 50, 50), width=5)
    draw.ellipse([20, 45, 34, 70], fill=(220, 0, 0), outline=(0, 0, 0), width=2)
    draw.ellipse([86, 45, 100, 70], fill=(220, 0, 0), outline=(0, 0, 0), width=2)

    # Badge
    draw.rectangle([20, 95, 100, 114], fill=(180, 70, 0), outline=(255, 255, 255), width=2)
    draw.text((27, 98), "COOL CAT 07", fill=(255, 255, 0), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_emo(filename="avatar-emo.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (20, 20, 20))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Pink & black zebra pattern background
    for y in range(0, h, 16):
        draw.polygon([(0, y), (w, y+16), (w, y+8), (0, y-8)], fill=(255, 20, 147))

    # Emo Character Body
    draw.ellipse([25, 75, 95, 135], fill=(30, 30, 35), outline=(255, 20, 147), width=2)

    # Face
    draw.ellipse([38, 28, 82, 76], fill=(255, 225, 210), outline=(150, 100, 90), width=1)
    # Emo Makeup / Eyes
    draw.ellipse([43, 44, 55, 54], fill=(20, 20, 20))
    draw.ellipse([65, 44, 77, 54], fill=(20, 20, 20))
    draw.ellipse([46, 46, 50, 50], fill=(255, 255, 255))
    draw.ellipse([68, 46, 72, 50], fill=(255, 255, 255))

    # Side-swept Emo Bangs (Black with pink streaks)
    draw.polygon([(34, 30), (75, 20), (85, 40), (45, 60)], fill=(15, 15, 15))
    draw.polygon([(40, 28), (70, 22), (65, 48), (48, 52)], fill=(255, 20, 147))
    draw.polygon([(32, 28), (55, 15), (88, 25), (84, 45)], fill=(15, 15, 15))

    # Emo Skull Heart badge
    draw.rectangle([20, 95, 100, 114], fill=(0, 0, 0), outline=(255, 20, 147), width=2)
    draw.text((28, 98), "EMO 2007 <3", fill=(255, 105, 180), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_bliss(filename="avatar-bliss.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (0, 153, 255))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Windows XP Bliss Landscape
    # Sky gradient
    for y in range(0, 65):
        r = int(0 + (y / 65) * 80)
        g = int(140 + (y / 65) * 60)
        b = 255
        draw.line([(0, y), (w, y)], fill=(r, g, b))

    # Fluffy cloud
    draw.ellipse([20, 15, 55, 35], fill=(255, 255, 255))
    draw.ellipse([40, 10, 75, 32], fill=(255, 255, 255))

    # Green Hill curve
    for x in range(w):
        hill_y = int(60 + math.sin(x / 20.0) * 8)
        draw.line([(x, hill_y), (x, h)], fill=(40, 180, 20))
        draw.line([(x, hill_y), (x, hill_y+4)], fill=(120, 220, 30))

    # Sun top right
    draw.ellipse([85, 10, 110, 35], fill=(255, 235, 50))

    # Windows XP Logo flag
    wx, wy = 60, 78
    draw.rectangle([wx-16, wy-16, wx, wy], fill=(242, 80, 34))    # Red
    draw.rectangle([wx, wy-16, wx+16, wy], fill=(127, 186, 0))   # Green
    draw.rectangle([wx-16, wy, wx, wy+16], fill=(0, 164, 239))   # Blue
    draw.rectangle([wx, wy, wx+16, wy+16], fill=(255, 185, 0))   # Yellow

    # Badge
    draw.rectangle([15, 96, 105, 114], fill=(0, 80, 180), outline=(255, 255, 255), width=2)
    draw.text((26, 99), "XP BLISS SP2", fill=(255, 255, 255), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_admin(filename="avatar-admin.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (10, 20, 50))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Server rack grid & LEDs
    for y in range(10, h, 16):
        draw.line([(0, y), (w, y)], fill=(30, 50, 90))
        draw.ellipse([8, y-4, 14, y+2], fill=(0, 255, 0))
        draw.ellipse([18, y-4, 24, y+2], fill=(255, 200, 0))
        draw.ellipse([100, y-4, 106, y+2], fill=(0, 255, 0))

    # Tux Penguin Body
    draw.ellipse([35, 30, 85, 90], fill=(20, 20, 20), outline=(200, 200, 200), width=1)
    # White Tummy
    draw.ellipse([45, 48, 75, 85], fill=(245, 245, 245))
    # Eyes
    draw.ellipse([46, 38, 56, 50], fill=(255, 255, 255))
    draw.ellipse([64, 38, 74, 50], fill=(255, 255, 255))
    draw.ellipse([50, 42, 54, 46], fill=(0, 0, 0))
    draw.ellipse([66, 42, 70, 46], fill=(0, 0, 0))
    # Yellow Beak & feet
    draw.polygon([(54, 48), (66, 48), (60, 56)], fill=(255, 160, 0))
    # Admin Wrench in hand
    draw.line([(75, 60), (95, 45)], fill=(180, 180, 190), width=4)
    draw.ellipse([90, 40, 100, 50], outline=(180, 180, 190), width=3)

    # Badge
    draw.rectangle([15, 95, 105, 114], fill=(180, 0, 0), outline=(255, 255, 0), width=2)
    draw.text((22, 98), "SYSADMIN ROOT", fill=(255, 255, 255), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_winamp(filename="avatar-winamp.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (15, 15, 25))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Equalizer bars (Green, Yellow, Red)
    for col_idx, x in enumerate(range(10, 110, 8)):
        bar_h = int(20 + math.sin(col_idx * 0.8) * 18 + ((col_idx*5)%25))
        for y in range(80, 80 - bar_h, -4):
            if y < 45:
                c = (255, 50, 50)
            elif y < 60:
                c = (255, 220, 0)
            else:
                c = (50, 255, 50)
            draw.rectangle([x, y-3, x+6, y-1], fill=c)

    # Lightning Bolt
    draw.polygon([(65, 10), (45, 40), (58, 40), (40, 75), (75, 32), (58, 32)], fill=(255, 230, 0), outline=(255, 255, 255))

    # Silver Headphones icon
    draw.arc([25, 25, 95, 80], 180, 360, fill=(200, 200, 220), width=4)
    draw.ellipse([20, 50, 34, 75], fill=(100, 100, 120), outline=(255, 255, 255), width=2)
    draw.ellipse([86, 50, 100, 75], fill=(100, 100, 120), outline=(255, 255, 255), width=2)

    # Winamp Badge
    draw.rectangle([15, 95, 105, 114], fill=(40, 40, 60), outline=(255, 200, 0), width=2)
    draw.text((20, 98), "WINAMP  2.91", fill=(255, 230, 0), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_skater(filename="avatar-skater.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (80, 30, 20))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Brick wall background
    for y in range(0, h, 14):
        draw.line([(0, y), (w, y)], fill=(120, 50, 35))
        offset = 12 if (y // 14) % 2 == 1 else 0
        for x in range(offset, w, 24):
            draw.line([(x, y), (x, y+14)], fill=(120, 50, 35))

    # Skater Body
    draw.ellipse([25, 70, 95, 130], fill=(20, 20, 25), outline=(200, 50, 50), width=2)

    # Sideways Cap
    draw.ellipse([35, 20, 85, 50], fill=(200, 30, 30), outline=(255, 255, 255), width=2)
    draw.polygon([(75, 32), (105, 38), (80, 48)], fill=(150, 20, 20)) # Visor visor

    # Face & Bandana Mask
    draw.ellipse([40, 32, 80, 72], fill=(240, 190, 150))
    draw.polygon([(40, 50), (80, 50), (75, 74), (45, 74)], fill=(20, 20, 20)) # Skull Bandana
    draw.text((50, 54), "SK8", fill=(255, 255, 255), font=font)

    # Skateboard Deck on back
    draw.rectangle([15, 25, 27, 85], fill=(255, 140, 0), outline=(0, 0, 0), width=2)
    draw.ellipse([18, 30, 24, 36], fill=(50, 50, 50))
    draw.ellipse([18, 74, 24, 80], fill=(50, 50, 50))

    # Badge
    draw.rectangle([15, 95, 105, 114], fill=(180, 30, 30), outline=(255, 255, 255), width=2)
    draw.text((24, 98), "SKATE PUNK 07", fill=(255, 255, 255), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_anime(filename="avatar-anime.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (255, 235, 245))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Starry background
    for (sx, sy) in [(15, 15), (100, 20), (20, 80), (105, 75)]:
        draw.text((sx, sy), "★", fill=(255, 105, 180), font=font)

    # Nekomimi Cat Ears
    draw.polygon([(30, 35), (42, 12), (58, 30)], fill=(140, 40, 140))
    draw.polygon([(35, 33), (43, 18), (52, 30)], fill=(255, 182, 193))
    draw.polygon([(90, 35), (78, 12), (62, 30)], fill=(140, 40, 140))
    draw.polygon([(85, 33), (77, 18), (68, 30)], fill=(255, 182, 193))

    # Chibi Face
    draw.ellipse([35, 28, 85, 76], fill=(255, 230, 220), outline=(200, 140, 160), width=1)

    # Purple Hair
    draw.polygon([(32, 30), (55, 18), (88, 30), (84, 52), (75, 38), (45, 38), (36, 52)], fill=(140, 40, 140))

    # Big Sparkling Anime Eyes
    draw.ellipse([42, 42, 56, 58], fill=(60, 20, 120))
    draw.ellipse([64, 42, 78, 58], fill=(60, 20, 120))
    draw.ellipse([45, 44, 51, 50], fill=(255, 255, 255))
    draw.ellipse([67, 44, 73, 50], fill=(255, 255, 255))

    # Blushing cheeks & mouth
    draw.ellipse([39, 54, 47, 59], fill=(255, 150, 180))
    draw.ellipse([73, 54, 81, 59], fill=(255, 150, 180))
    draw.arc([56, 56, 64, 63], 0, 180, fill=(200, 50, 100), width=2)

    # Sailor Collar
    draw.polygon([(30, 75), (90, 75), (75, 110), (45, 110)], fill=(40, 40, 120))
    draw.polygon([(55, 75), (65, 75), (60, 90)], fill=(255, 50, 100)) # Red Ribbon

    # Badge
    draw.rectangle([15, 95, 105, 114], fill=(180, 50, 150), outline=(255, 255, 255), width=2)
    draw.text((25, 98), "KAWAII  NEKO", fill=(255, 255, 255), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def create_avatar_icq(filename="avatar-icq.png"):
    w, h = 120, 120
    img = Image.new('RGB', (w, h), (0, 80, 40))
    draw = ImageDraw.Draw(img)

    font = ImageFont.load_default()
    # Retro gradient background
    for y in range(h):
        g = int(60 + (y / h) * 80)
        draw.line([(0, y), (w, y)], fill=(0, g, 40))

    # ICQ Flower (Green center, 8 green petals + 1 red petal)
    cx, cy = 60, 45
    r_petal = 14
    # Petals around center
    angles = [0, 40, 80, 120, 160, 200, 240, 280, 320]
    for i, a in enumerate(angles):
        rad = math.radians(a)
        px = cx + math.cos(rad) * 18
        py = cy + math.sin(rad) * 18
        color = (255, 30, 30) if i == 0 else (50, 230, 50)
        draw.ellipse([px-7, py-7, px+7, py+7], fill=color, outline=(0, 50, 0), width=1)

    # Flower Center
    draw.ellipse([cx-10, cy-10, cx+10, cy+10], fill=(255, 220, 0), outline=(100, 100, 0), width=1)

    # QIP Chat Bubble
    draw.rectangle([15, 68, 105, 90], fill=(245, 245, 245), outline=(0, 100, 0), width=2)
    draw.text((20, 72), "UIN: 777-404-00", fill=(0, 80, 0), font=font)

    # Badge
    draw.rectangle([15, 95, 105, 114], fill=(0, 120, 50), outline=(255, 255, 255), width=2)
    draw.text((24, 98), "ICQ 2007  [O-OH!]", fill=(255, 255, 255), font=font)

    apply_3d_border(draw, w, h)
    img.save(os.path.join(img_dir, filename))

def generate_all_avatars():
    create_avatar_nikitka("photo-nikitka.png")
    create_avatar_cs("avatar-cs.png")
    create_avatar_neo("avatar-neo.png")
    create_avatar_stalker("avatar-stalker.png")
    create_avatar_cat("avatar-cat.png")
    create_avatar_emo("avatar-emo.png")
    create_avatar_bliss("avatar-bliss.png")
    create_avatar_admin("avatar-admin.png")
    create_avatar_winamp("avatar-winamp.png")
    create_avatar_skater("avatar-skater.png")
    create_avatar_anime("avatar-anime.png")
    create_avatar_icq("avatar-icq.png")
    print("All 12 retro avatars generated successfully!")

if __name__ == "__main__":
    generate_all_avatars()
