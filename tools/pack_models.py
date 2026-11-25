r"""
Pack Buildit3D's own CAD models into a small binary for the 3D hero (dev tool, not part of the site build).

  py tools/pack_models.py <stl> <name> <target_triangles> [<stl> <name> <tris> ...]

Format (little endian): uint32 nVerts, uint32 nTris, float32 min[3], float32 max[3],
uint16 positions[nVerts*3] (quantised to the bounding box), uint32 indices[nTris*3]. Z up, mm.
Needs: trimesh, fast_simplification.
"""
import struct, sys
from pathlib import Path
import numpy as np, trimesh

OUT = Path(__file__).resolve().parent.parent / "client" / "public" / "models"

def pack(src, name, target):
    m = trimesh.load(src, force="mesh")
    m.merge_vertices()
    if len(m.faces) > target:
        import fast_simplification
        v, f = fast_simplification.simplify(m.vertices, m.faces, target_reduction=1 - target / len(m.faces))
        m = trimesh.Trimesh(v, f, process=True)
    lo, hi = m.bounds
    q = np.round((m.vertices - lo) / np.maximum(hi - lo, 1e-9) * 65535).astype("<u2")
    data = struct.pack("<II6f", len(m.vertices), len(m.faces), *lo, *hi) + q.tobytes() + m.faces.astype("<u4").tobytes()
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / f"{name}.bin").write_bytes(data)
    print(f"{name}: {len(m.faces)} tris, {len(data)//1024} KB, size {np.round(hi-lo,1)} mm")

if __name__ == "__main__":
    a = sys.argv[1:]
    for i in range(0, len(a), 3):
        pack(a[i], a[i + 1], int(a[i + 2]))
