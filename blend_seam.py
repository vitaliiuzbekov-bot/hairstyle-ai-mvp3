from PIL import Image, ImageFilter
import sys

def blend_seam(input_path, output_path, seam_x, blend_width=10):
    img = Image.open(input_path).convert("RGB")
    width, height = img.size
    
    # Crop the center strip
    box = (seam_x - blend_width, 0, seam_x + blend_width, height)
    center_strip = img.crop(box)
    
    # Apply a horizontal blur (we can just use Gaussian blur on the strip)
    blurred_strip = center_strip.filter(ImageFilter.GaussianBlur(radius=3))
    
    # Paste it back
    img.paste(blurred_strip, (seam_x - blend_width, 0))
    img.save(output_path, quality=95)
    print(f"Blended seam and saved to {output_path}")

blend_seam("public/split-left.jpg", "public/split-left-blended.jpg", 384, 8)
blend_seam("public/split-right.jpg", "public/split-right-blended.jpg", 384, 8)
