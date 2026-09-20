"""Shrink site/assets to what the page actually displays.

Filenames and extensions are left alone so index.html and privacy.html keep
working untouched - only the pixels inside each file change. Targets come from
the widths the browser reported at 1920/1440/820/390px, doubled for high-DPI
screens, so nothing that is sharp today goes soft.

Also converts common-meal.jpg out of CMYK. CMYK JPEG is a print colour space:
browsers render it with wrong colours or refuse it outright.
"""
import os
import sys
from PIL import Image

SITE = sys.argv[1] if len(sys.argv) > 1 else 'site'
ASSETS = os.path.join(SITE, 'assets')

# Widest the browser ever draws each one, from the measurement pass.
DISPLAY = {
    'hero-village.png': 1959, 'hero-village-2.png': 1920, 'hero-village-4.png': 1920,
    'members-group.jpg': 1000, 'six-elements-v2.png': 940, 'map-figure-v2.png': 940,
    'event-session-visual-v2.png': 940, 'philosophy-diagram-v3.png': 860,
    'reading-circle.png': 770, 'common-meal.jpg': 770, 'site-visit.png': 770,
    'tomoiki-house.png': 722, 'tomoiki-center.png': 722, 'purpose-house.png': 460,
    'tomoiki-mark.png': 448, 'book-robin.png': 250, 'sketch-family.png': 245,
    'logo-color.png': 156, 'logo-mark.png': 58, 'icon-mail.png': 22, 'icon-phone.png': 20,
    'member-takahashi.jpg': 374, 'member-tsumura.jpg': 374, 'member-ueda.jpg': 374,
    'member-inoue.jpg': 374, 'member-sagesaka.jpg': 374, 'member-sadakata.jpg': 374,
}
DPR = 2          # retina
FLOOR = 640      # never take a full-bleed image below this
JPEG_Q = 86


def main():
    before = after = 0
    rows = []
    for name in sorted(os.listdir(ASSETS)):
        path = os.path.join(ASSETS, name)
        if not os.path.isfile(path):
            continue
        size0 = os.path.getsize(path)
        before += size0
        im = Image.open(path)
        w0, h0 = im.size
        note = []

        # CMYK and palette images have to become RGB before anything else.
        if im.mode == 'CMYK':
            im = im.convert('RGB'); note.append('CMYK→RGB')
        has_alpha = im.mode in ('RGBA', 'LA') or (im.mode == 'P' and 'transparency' in im.info)
        if im.mode == 'P':
            im = im.convert('RGBA' if has_alpha else 'RGB')

        target = DISPLAY.get(name, w0) * DPR
        if name in DISPLAY and DISPLAY[name] >= 700:
            target = max(target, FLOOR)
        if w0 > target:
            im = im.resize((target, round(h0 * target / w0)), Image.LANCZOS)
            note.append(f'{w0}→{target}px')

        if path.lower().endswith(('.jpg', '.jpeg')):
            im.convert('RGB').save(path, 'JPEG', quality=JPEG_Q, optimize=True,
                                   progressive=True, subsampling=1)
        else:
            # Keep PNG (the diagrams carry fine text); quantise when it is safe.
            out = im
            if not has_alpha and im.mode == 'RGB':
                q = im.quantize(colors=256, method=Image.MEDIANCUT, dither=Image.FLOYDSTEINBERG)
                out = q
                note.append('256色')
            out.save(path, 'PNG', optimize=True)

        size1 = os.path.getsize(path)
        after += size1
        if size1 != size0 or note:
            rows.append((size0, size1, name, ' / '.join(note) or '再圧縮'))

    for s0, s1, name, note in sorted(rows, key=lambda r: r[0] - r[1], reverse=True)[:14]:
        print(f'{s0 // 1024:6d}KB → {s1 // 1024:5d}KB  {name:32s} {note}')
    print(f'\n合計 {before / 1048576:.1f}MB → {after / 1048576:.1f}MB '
          f'（{(1 - after / before) * 100:.0f}% 削減）')


if __name__ == '__main__':
    main()
