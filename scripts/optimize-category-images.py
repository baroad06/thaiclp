"""Generate responsive WebP category covers without modifying original photos."""
import json
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
output = ROOT / 'public/images/optimized/categories'
output.mkdir(parents=True, exist_ok=True)
manifest = {}
original_bytes = optimized_bytes = 0
for source in sorted((ROOT / 'public/images/catalog').glob('*/cover.jpg')):
    image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
    variants = []
    for width in (480, 960, 1440):
        if width > image.width:
            continue
        height = round(image.height * width / image.width)
        resized = image.resize((width, height), Image.Resampling.LANCZOS)
        destination = output / f'{source.parent.name}-{width}.webp'
        resized.save(destination, 'WEBP', quality=84, method=6)
        variants.append({'url': '/' + str(destination.relative_to(ROOT / 'public')), 'width': width, 'height': height})
    default = next(item for item in variants if item['width'] == 960)
    manifest[source.parent.name] = {'src': default['url'], 'width': default['width'], 'height': default['height'], 'srcset': ', '.join(f"{item['url']} {item['width']}w" for item in variants)}
    original_bytes += source.stat().st_size
    optimized_bytes += (ROOT / 'public' / default['url'].lstrip('/')).stat().st_size
(ROOT / 'seo/image-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(f'Original category covers: {original_bytes:,} bytes; 960px WebP covers: {optimized_bytes:,} bytes ({100*(1-optimized_bytes/original_bytes):.1f}% smaller).')
