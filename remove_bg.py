import sys
from PIL import Image

def process(in_path, out_path):
    img = Image.open(in_path).convert("RGBA")
    
    # We will replace all pixels that are within a small distance of bg_color with transparent.
    data = img.getdata()
    new_data = []
    
    # Get top-left pixel color as the background
    bg_color = data[0]
    
    for r, g, b, a in data:
        # Check if it's very close to background color
        if abs(r - bg_color[0]) < 30 and abs(g - bg_color[1]) < 30 and abs(b - bg_color[2]) < 30:
            new_data.append((0, 0, 0, 0))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    img.save(out_path, "PNG")
    print("Saved", out_path)

files = [
    (r"C:\Users\CHINMAY MISHRA\.gemini\antigravity-ide\brain\9d9f1723-cc7d-4c2f-8648-d0a471753022\m24_green_1782548209700.png", r"c:\Users\CHINMAY MISHRA\chinmayos\public\assets\sniper\gun_m24.png"),
    (r"C:\Users\CHINMAY MISHRA\.gemini\antigravity-ide\brain\9d9f1723-cc7d-4c2f-8648-d0a471753022\vss_green_1782548220764.png", r"c:\Users\CHINMAY MISHRA\chinmayos\public\assets\sniper\gun_vss.png"),
    (r"C:\Users\CHINMAY MISHRA\.gemini\antigravity-ide\brain\9d9f1723-cc7d-4c2f-8648-d0a471753022\awm_green_1782548230137.png", r"c:\Users\CHINMAY MISHRA\chinmayos\public\assets\sniper\gun_awm.png"),
    (r"C:\Users\CHINMAY MISHRA\.gemini\antigravity-ide\brain\9d9f1723-cc7d-4c2f-8648-d0a471753022\dsr1_green_1782548240007.png", r"c:\Users\CHINMAY MISHRA\chinmayos\public\assets\sniper\gun_dsr1.png")
]

for inf, outf in files:
    process(inf, outf)
