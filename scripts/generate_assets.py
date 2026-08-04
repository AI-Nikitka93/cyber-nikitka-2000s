import os
from PIL import Image, ImageDraw, ImageFont

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), 'img')
os.makedirs(OUTPUT_DIR, exist_ok=True)

def get_font(size=12, bold=False):
    font_paths = [
        "C:\\Windows\\Fonts\\tahomabd.ttf" if bold else "C:\\Windows\\Fonts\\tahoma.ttf",
        "C:\\Windows\\Fonts\\verdanab.ttf" if bold else "C:\\Windows\\Fonts\\verdana.ttf",
        "C:\\Windows\\Fonts\\arialbd.ttf" if bold else "C:\\Windows\\Fonts\\arial.ttf"
    ]
    for p in font_paths:
        if os.path.exists(p):
            try:
                return ImageFont.truetype(p, size)
            except Exception:
                pass
    return ImageFont.load_default()

# 8. ПОРТРЕТ МАСТЕРА НИКИКТИ (photo-nikitka.png / .svg)
def generate_nikitka_photo():
    img = Image.new('RGB', (100, 100), (0, 0, 128))
    draw = ImageDraw.Draw(img)
    
    # 3D Рамка
    draw.rectangle([(0, 0), (99, 99)], outline=(255, 255, 255), width=2)
    draw.rectangle([(2, 2), (97, 97)], outline=(128, 128, 128))
    
    # Иконка мастера (Ретро аватар 2000-х)
    draw.ellipse([(25, 20), (75, 70)], fill=(255, 220, 180), outline=(0, 0, 0)) # Голова
    draw.rectangle([(15, 70), (85, 95)], fill=(0, 128, 128), outline=(0, 0, 0)) # Плечи
    draw.rectangle([(35, 30), (65, 45)], fill=(0, 0, 0)) # Очки мастера
    
    font = get_font(9, bold=True)
    draw.text((22, 80), "НИКИТКА", font=font, fill=(255, 255, 0))
    
    img.save(os.path.join(OUTPUT_DIR, 'photo-nikitka.png'))

    svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
  <rect width="100" height="100" fill="#000080" stroke="#FFFFFF" stroke-width="2"/>
  <rect x="2" y="2" width="96" height="96" fill="none" stroke="#808080"/>
  <circle cx="50" cy="45" r="25" fill="#FFDCE0" stroke="#000000" stroke-width="2"/>
  <rect x="20" y="70" width="60" height="25" fill="#008080" stroke="#000000" stroke-width="2"/>
  <rect x="35" y="35" width="30" height="12" fill="#000000"/>
  <text x="50" y="87" font-family="Tahoma" font-size="10" font-weight="bold" fill="#FFFF00" text-anchor="middle">МАСТЕР</text>
</svg>'''
    with open(os.path.join(OUTPUT_DIR, 'photo-nikitka.svg'), 'w', encoding='utf-8') as f:
        f.write(svg)

# 9. СТОПКА ДИСКОВ (photo-disks.png / .svg)
def generate_disks_photo():
    img = Image.new('RGB', (160, 100), (240, 240, 240))
    draw = ImageDraw.Draw(img)
    
    draw.rectangle([(0, 0), (159, 99)], outline=(0, 0, 128), width=2)
    
    colors = [(255, 0, 0), (0, 128, 0), (0, 0, 255), (255, 215, 0), (128, 0, 128)]
    for i, color in enumerate(colors):
        y = 20 + i * 14
        draw.rectangle([(20, y), (140, y + 10)], fill=color, outline=(0, 0, 0))
        
    font = get_font(10, bold=True)
    draw.text((25, 5), "КОЛЛЕКЦИЯ CD/DVD", font=font, fill=(0, 0, 128))
    
    img.save(os.path.join(OUTPUT_DIR, 'photo-disks.png'))

    svg = '''<svg xmlns="http://www.w3.org/2000/svg" width="160" height="100">
  <rect width="160" height="100" fill="#F0F4F8" stroke="#000080" stroke-width="2"/>
  <text x="80" y="16" font-family="Tahoma" font-size="10" font-weight="bold" fill="#000080" text-anchor="middle">КОЛЛЕКЦИЯ CD/DVD</text>
  <rect x="20" y="25" width="120" height="10" fill="#FF0000" stroke="#000"/>
  <rect x="20" y="38" width="120" height="10" fill="#008000" stroke="#000"/>
  <rect x="20" y="51" width="120" height="10" fill="#0000FF" stroke="#000"/>
  <rect x="20" y="64" width="120" height="10" fill="#FFD700" stroke="#000"/>
  <rect x="20" y="77" width="120" height="10" fill="#800080" stroke="#000"/>
</svg>'''
    with open(os.path.join(OUTPUT_DIR, 'photo-disks.svg'), 'w', encoding='utf-8') as f:
        f.write(svg)

# 10. ФАВИКОН И ИКОНКИ (favicon.ico / icon-cd.png)
def generate_icons():
    img = Image.new('RGBA', (32, 32), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    draw.ellipse([(2, 2), (29, 29)], fill=(200, 200, 200), outline=(0, 0, 128))
    draw.ellipse([(11, 11), (20, 20)], fill=(0, 0, 128), outline=(255, 255, 255))
    
    img.save(os.path.join(os.path.dirname(__file__), 'favicon.ico'))
    img.save(os.path.join(OUTPUT_DIR, 'icon-cd.png'))

if __name__ == '__main__':
    generate_nikitka_photo()
    generate_disks_photo()
    generate_icons()
    print("Дополнительные ретро-ассеты и favicon.ico созданы!")
