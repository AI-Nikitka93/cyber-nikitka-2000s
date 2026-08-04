import os
import math
from PIL import Image, ImageDraw, ImageFont

img_dir = os.path.join(os.path.dirname(__file__), '..', 'img')
os.makedirs(img_dir, exist_ok=True)

def draw_icq_flower(draw, cx, cy, radius, petal_r):
    # 7 petals: angle 0 is right (0 rad), angle steps of 2*pi/7
    # Classic ICQ: Top-right petal (~-45 deg or -30 deg) is RED, rest are GREEN
    # Angle offsets in degrees: [-35, -86, -137, -188, -239, -290, -341]
    angles = [-35, 17, 68, 120, 171, 222, 274]
    
    for idx, angle_deg in enumerate(angles):
        rad = math.radians(angle_deg)
        px = cx + radius * math.cos(rad)
        py = cy + radius * math.sin(rad)
        
        # Color: First petal (-35 deg, top right) is bright red, others green
        if idx == 0:
            fill_col = (255, 20, 20, 255)
            outline_col = (150, 0, 0, 255)
        else:
            fill_col = (0, 215, 0, 255)
            outline_col = (0, 100, 0, 255)
            
        bbox = [px - petal_r, py - petal_r, px + petal_r, py + petal_r]
        draw.ellipse(bbox, fill=fill_col, outline=outline_col, width=max(1, int(petal_r*0.2)))
        
    # Yellow center
    c_bbox = [cx - petal_r*0.85, cy - petal_r*0.85, cx + petal_r*0.85, cy + petal_r*0.85]
    draw.ellipse(c_bbox, fill=(255, 230, 0, 255), outline=(160, 120, 0, 255), width=max(1, int(petal_r*0.2)))

def generate_icq_icon():
    # Supersample 4x: 96x96 -> resize to 24x24
    w, h = 96, 96
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    draw_icq_flower(draw, w/2, h/2, 26, 18)
    
    final_24 = img.resize((24, 24), Image.Resampling.LANCZOS)
    final_24.save(os.path.join(img_dir, "icq-icon.png"))
    
    final_16 = img.resize((16, 16), Image.Resampling.LANCZOS)
    final_16.save(os.path.join(img_dir, "icq-icon-16.png"))
    print("Created img/icq-icon.png & icq-icon-16.png")

def generate_icq_logo():
    # 200x50 supersampled 4x (800x200) -> 200x50
    w, h = 800, 200
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Flower on left
    draw_icq_flower(draw, 100, 100, 60, 42)
    
    # Fonts
    try:
        font_icq = ImageFont.truetype("arialbd.ttf", 90)
        font_sub = ImageFont.truetype("tahomabd.ttf", 36)
    except:
        font_icq = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        
    # Text ICQ in classic green & white
    draw.text((224, 34), "ICQ", fill=(0, 50, 0, 255), font=font_icq)
    draw.text((220, 30), "ICQ", fill=(0, 200, 0, 255), font=font_icq)
    
    draw.text((222, 132), "777-200-07 ONLINE", fill=(0, 80, 0, 255), font=font_sub)
    draw.text((220, 130), "777-200-07 ONLINE", fill=(0, 255, 0, 255), font=font_sub)
    
    final_img = img.resize((200, 50), Image.Resampling.LANCZOS)
    final_img.save(os.path.join(img_dir, "icq-logo.png"))
    print("Created img/icq-logo.png")

def generate_banner_icq():
    # 88x31 supersampled 4x (352x124)
    w, h = 352, 124
    img = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Background gradient deep retro green
    for y in range(h):
        r = int(0 + (0 - 0) * (y / h))
        g = int(80 + (40 - 80) * (y / h))
        b = int(0 + (0 - 0) * (y / h))
        draw.line([(0, y), (w, y)], fill=(r, g, b, 255))
        
    # 3D Bevel border
    draw.rectangle([0, 0, w-1, h-1], outline=(0, 255, 0, 255), width=4)
    draw.line([(0, 0), (w-1, 0)], fill=(150, 255, 150, 255), width=6)
    draw.line([(0, 0), (0, h-1)], fill=(150, 255, 150, 255), width=6)
    draw.line([(w-1, 0), (w-1, h-1)], fill=(0, 40, 0, 255), width=6)
    draw.line([(0, h-1), (w-1, h-1)], fill=(0, 40, 0, 255), width=6)
    
    # Flower on left
    draw_icq_flower(draw, 56, 62, 34, 24)
    
    try:
        font_large = ImageFont.truetype("arialbd.ttf", 34)
        font_small = ImageFont.truetype("tahomabd.ttf", 32)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
        
    draw.text((118, 16), "ICQ UIN", fill=(0, 30, 0, 255), font=font_large)
    draw.text((116, 14), "ICQ UIN", fill=(255, 255, 255, 255), font=font_large)
    
    draw.text((118, 66), "777-200-07", fill=(0, 40, 0, 255), font=font_small)
    draw.text((116, 64), "777-200-07", fill=(0, 255, 0, 255), font=font_small)
    
    final_img = img.resize((88, 31), Image.Resampling.LANCZOS)
    final_img.save(os.path.join(img_dir, "banner-icq.png"))
    print("Created img/banner-icq.png")

def generate_svg_files():
    svg_icon = '''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
  <g>
    <!-- 7 Petals: 1 Red top-right, 6 Green -->
    <ellipse cx="16.5" cy="7.5" rx="4" ry="3" transform="rotate(-35 16.5 7.5)" fill="#FF1414" stroke="#A00000" stroke-width="0.7"/>
    <ellipse cx="12" cy="5.2" rx="3" ry="4" fill="#00D700" stroke="#006400" stroke-width="0.7"/>
    <ellipse cx="7.2" cy="7.8" rx="4" ry="3" transform="rotate(30 7.2 7.8)" fill="#00D700" stroke="#006400" stroke-width="0.7"/>
    <ellipse cx="5.5" cy="13.2" rx="4" ry="3" transform="rotate(-20 5.5 13.2)" fill="#00D700" stroke="#006400" stroke-width="0.7"/>
    <ellipse cx="9.2" cy="17.8" rx="3" ry="4" transform="rotate(30 9.2 17.8)" fill="#00D700" stroke="#006400" stroke-width="0.7"/>
    <ellipse cx="15.8" cy="17" rx="4" ry="3" transform="rotate(-40 15.8 17)" fill="#00D700" stroke="#006400" stroke-width="0.7"/>
    <ellipse cx="18.5" cy="12" rx="4" ry="3" transform="rotate(10 18.5 12)" fill="#00D700" stroke="#006400" stroke-width="0.7"/>
    <!-- Yellow Center -->
    <circle cx="12" cy="12" r="3.8" fill="#FFE600" stroke="#B88600" stroke-width="0.8"/>
  </g>
</svg>'''
    with open(os.path.join(img_dir, "icq-icon.svg"), 'w', encoding='utf-8') as f:
        f.write(svg_icon)

    svg_banner = '''<svg xmlns="http://www.w3.org/2000/svg" width="88" height="31" viewBox="0 0 88 31">
  <rect width="88" height="31" fill="#004D00" stroke="#000000" stroke-width="1"/>
  <rect x="1" y="1" width="86" height="29" fill="none" stroke="#00FF00" stroke-width="1"/>
  <!-- ICQ Flower on left -->
  <g transform="translate(14, 15.5) scale(0.75)">
    <ellipse cx="5" cy="-6" rx="4" ry="3" transform="rotate(-35 5 -6)" fill="#FF1414" stroke="#900000" stroke-width="0.6"/>
    <ellipse cx="0" cy="-8" rx="3" ry="4" fill="#00D700" stroke="#006000" stroke-width="0.6"/>
    <ellipse cx="-5" cy="-5" rx="4" ry="3" transform="rotate(30 -5 -5)" fill="#00D700" stroke="#006000" stroke-width="0.6"/>
    <ellipse cx="-6" cy="1" rx="4" ry="3" transform="rotate(-20 -6 1)" fill="#00D700" stroke="#006000" stroke-width="0.6"/>
    <ellipse cx="-2" cy="6" rx="3" ry="4" transform="rotate(30 -2 6)" fill="#00D700" stroke="#006000" stroke-width="0.6"/>
    <ellipse cx="4" cy="5" rx="4" ry="3" transform="rotate(-40 4 5)" fill="#00D700" stroke="#006000" stroke-width="0.6"/>
    <ellipse cx="7" cy="0" rx="4" ry="3" transform="rotate(10 7 0)" fill="#00D700" stroke="#006000" stroke-width="0.6"/>
    <circle cx="0" cy="0" r="3.6" fill="#FFE600" stroke="#A07000" stroke-width="0.6"/>
  </g>
  <text x="27" y="13" font-family="Tahoma, Arial" font-size="9" font-weight="bold" fill="#FFFFFF">ICQ UIN</text>
  <text x="26" y="24" font-family="Courier New, monospace" font-size="9" font-weight="bold" fill="#00FF00">777-200-07</text>
</svg>'''
    with open(os.path.join(img_dir, "banner-icq.svg"), 'w', encoding='utf-8') as f:
        f.write(svg_banner)

    svg_logo = '''<svg xmlns="http://www.w3.org/2000/svg" width="180" height="40" viewBox="0 0 180 40">
  <g transform="translate(20, 20)">
    <ellipse cx="7" cy="-9" rx="6" ry="4.5" transform="rotate(-35 7 -9)" fill="#FF1414" stroke="#900000" stroke-width="0.8"/>
    <ellipse cx="0" cy="-12" rx="4.5" ry="6" fill="#00D700" stroke="#006000" stroke-width="0.8"/>
    <ellipse cx="-7" cy="-8" rx="6" ry="4.5" transform="rotate(30 -7 -8)" fill="#00D700" stroke="#006000" stroke-width="0.8"/>
    <ellipse cx="-9" cy="2" rx="6" ry="4.5" transform="rotate(-20 -9 2)" fill="#00D700" stroke="#006000" stroke-width="0.8"/>
    <ellipse cx="-3" cy="9" rx="4.5" ry="6" transform="rotate(30 -3 9)" fill="#00D700" stroke="#006000" stroke-width="0.8"/>
    <ellipse cx="6" cy="8" rx="6" ry="4.5" transform="rotate(-40 6 8)" fill="#00D700" stroke="#006000" stroke-width="0.8"/>
    <ellipse cx="10" cy="0" rx="6" ry="4.5" transform="rotate(10 10 0)" fill="#00D700" stroke="#006000" stroke-width="0.8"/>
    <circle cx="0" cy="0" r="5.5" fill="#FFE600" stroke="#A07000" stroke-width="0.9"/>
  </g>
  <text x="45" y="24" font-family="Impact, Arial Black" font-size="24" fill="#008000">ICQ</text>
  <text x="44" y="23" font-family="Impact, Arial Black" font-size="24" fill="#00E000">ICQ</text>
  <text x="92" y="24" font-family="Tahoma, sans-serif" font-size="12" font-weight="bold" fill="#006400">777-200-07</text>
  <text x="92" y="35" font-family="Tahoma, sans-serif" font-size="9" font-weight="bold" fill="#00B300">[● В СЕТИ]</text>
</svg>'''
    with open(os.path.join(img_dir, "icq-logo.svg"), 'w', encoding='utf-8') as f:
        f.write(svg_logo)

    print("Created SVG files for ICQ assets!")

if __name__ == '__main__':
    generate_icq_icon()
    generate_icq_logo()
    generate_banner_icq()
    generate_svg_files()
