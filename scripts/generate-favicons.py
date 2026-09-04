import os
from PIL import Image, ImageDraw
import numpy as np

def generate_favicons():
    # Load source star
    src_path = 'public/images/logo/seven-spices-favicon.png'
    src = Image.open(src_path).convert('RGBA')
    bbox = src.getbbox()
    star_crop = src.crop(bbox)

    base_size = 512
    badge = Image.new('RGBA', (base_size, base_size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(badge)

    # Squircle parameters
    corner_r = int(base_size * 0.20)
    bg_color = (87, 0, 19, 255) # Brand Maroon #570013
    border_color = (252, 204, 56, 240) # Brand Golden Accent #fccc38

    # Outer rounded rect badge filling almost entire canvas
    margin = 12
    draw.rounded_rectangle(
        [margin, margin, base_size - margin, base_size - margin],
        radius=corner_r,
        fill=bg_color,
        outline=border_color,
        width=14
    )

    # Recolor star to bright warm gold #fccc38 for maximum contrast & brand alignment
    star_w = int(base_size * 0.72)
    star_h = int(base_size * 0.72)
    star_resized = star_crop.resize((star_w, star_h), Image.Resampling.LANCZOS)

    star_arr = np.array(star_resized)
    mask = star_arr[:, :, 3] > 25
    star_arr[mask, 0] = 252 # R
    star_arr[mask, 1] = 204 # G
    star_arr[mask, 2] = 56  # B

    recolored_star = Image.fromarray(star_arr)
    offset_x = (base_size - star_w) // 2
    offset_y = (base_size - star_h) // 2
    badge.alpha_composite(recolored_star, (offset_x, offset_y))

    # Output targets
    os.makedirs('public', exist_ok=True)
    os.makedirs('app', exist_ok=True)

    # 1. High-res PNGs
    badge.save('public/favicon.png')
    badge.save('app/icon.png')
    badge.save('public/android-chrome-512x512.png')

    badge.resize((192, 192), Image.Resampling.LANCZOS).save('public/android-chrome-192x192.png')
    badge.resize((180, 180), Image.Resampling.LANCZOS).save('public/apple-touch-icon.png')
    badge.resize((180, 180), Image.Resampling.LANCZOS).save('app/apple-icon.png')
    badge.resize((32, 32), Image.Resampling.LANCZOS).save('public/favicon-32x32.png')
    badge.resize((16, 16), Image.Resampling.LANCZOS).save('public/favicon-16x16.png')

    # 2. Multi-resolution favicon.ico container (16, 32, 48, 64, 128, 256)
    ico_sizes = [(16, 16), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)]
    badge.save('public/favicon.ico', format='ICO', sizes=ico_sizes)

    print("All favicon assets generated successfully!")

if __name__ == '__main__':
    generate_favicons()
