#!/bin/bash
# Regenera las tipografías recortadas a los glifos del español (requiere: pip install fonttools brotli).
set -e
U="U+0020-007E,U+00A0-00BF,U+00C1,U+00C9,U+00CD,U+00D1,U+00D3,U+00DA,U+00DC,U+00E1,U+00E9,U+00ED,U+00F1,U+00F3,U+00FA,U+00FC,U+00E7,U+00C7,U+2013,U+2014,U+2018,U+2019,U+201C,U+201D,U+2026,U+2022,U+20AC,U+2190,U+2192"
F=--layout-features='kern,liga,calt,ccmp,locl,mark,mkmk'
pyftsubset node_modules/@fontsource-variable/anybody/files/anybody-latin-standard-normal.woff2 --unicodes="$U" $F --flavor=woff2 --output-file=src/fonts/anybody.woff2
pyftsubset node_modules/@fontsource-variable/schibsted-grotesk/files/schibsted-grotesk-latin-wght-normal.woff2 --unicodes="$U" $F --flavor=woff2 --output-file=src/fonts/schibsted.woff2
# Limitar los ejes variables a los rangos que usa la web
python3 - <<'PY'
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
for name, limits in [("anybody", {"wght": (250, 700), "wdth": (75, 150)}), ("schibsted", {"wght": (400, 700)})]:
    f = TTFont(f"src/fonts/{name}.woff2")
    axes = {a.axisTag: a for a in f["fvar"].axes}
    trip = {k: instancer.AxisTriple(lo, min(max(lo, axes[k].defaultValue), hi), hi) for k, (lo, hi) in limits.items()}
    out = instancer.instantiateVariableFont(f, trip)
    out.flavor = "woff2"
    out.save(f"src/fonts/{name}.woff2")
PY
