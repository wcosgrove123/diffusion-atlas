"""Pipeline tests: python -m pytest tests (from the repo root)."""
import json
import subprocess
import sys
from pathlib import Path

import pytest
import yaml

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))

import export_taxonomy  # noqa: E402
from modules import load_frame, view_box  # noqa: E402

TAX = yaml.safe_load((ROOT / "data/taxonomy.yaml").read_text(encoding="utf-8"))
MODULES = list(yaml.safe_load((ROOT / "data/modules.yaml").read_text(encoding="utf-8"))["modules"])


def test_validator_reports_no_errors():
    r = subprocess.run([sys.executable, str(ROOT / "tools/validate.py")], capture_output=True, text=True,
                       encoding="utf-8")
    assert r.returncode == 0, r.stdout + r.stderr


@pytest.mark.parametrize("module", MODULES)
def test_every_module_has_a_research_folder_and_a_sane_frame(module):
    f = load_frame(module)
    assert (ROOT / "data/research" / module).is_dir()
    w, s, e, n = f["bbox"]
    assert -180 <= w < e <= 180 and -85 <= s < n <= 85
    assert f["start"] < f["end"]


def test_taxonomy_export_keeps_every_value():
    out = export_taxonomy.export()
    for key in ("relation", "share", "basis"):
        assert out["religion"][key] == TAX["religion"][key]
    assert out["diffusion"] == TAX["diffusion"]
    assert out["lenses"] == TAX["lenses"]
    assert out["ap_topics"] == {str(k): v for k, v in TAX["ap_topics"].items()}
    assert set(out["ap_topics"]) >= {"1.2", "1.5", "2.4"}


def test_taxonomy_export_flattens_traditions():
    trad = export_taxonomy.export()["traditions"]
    fams = TAX["religion"]["families"]
    expected = {t for f in fams.values() for t in f["traditions"]}
    assert set(trad) == expected
    assert trad["islam"]["family"] == "abrahamic"
    assert "sufi" in trad["islam"]["overlays"]
    assert "indigenous" in trad


@pytest.mark.parametrize("module", MODULES)
def test_base_geometry_stays_inside_the_view_box(module):
    bdir = ROOT / "data/geometry/base" / module
    if not bdir.exists():
        pytest.skip(f"no base geometry for {module}; run tools/extract_base.py {module}")
    w, s, e, n = view_box(load_frame(module))

    def coords(g):
        c = g["coordinates"]
        while isinstance(c[0][0], list):
            c = [p for part in c for p in part]
        return c

    for name in ("land", "rivers", "lakes", "playas"):
        fc = json.loads((bdir / f"{name}.geojson").read_text(encoding="utf-8"))
        assert fc["features"], name
        for f in fc["features"]:
            for x, y in coords(f["geometry"]):
                assert w - 1e-6 <= x <= e + 1e-6 and s - 1e-6 <= y <= n + 1e-6, (name, x, y)


def test_base_lakes_drop_reservoirs_and_use_historic_lake_chad():
    fc = json.loads((ROOT / "data/geometry/base/africa/lakes.geojson").read_text(encoding="utf-8"))
    names = [f["properties"].get("name") for f in fc["features"]]
    assert "Lake Nasser" not in names and "Lake Volta" not in names
    chad = [f for f in fc["features"] if f["properties"].get("name") == "Lake Chad"]
    assert len(chad) == 1 and chad[0]["properties"].get("historic") is True


@pytest.mark.parametrize("module", MODULES)
def test_land_has_no_seam_along_the_module_bbox(module):
    """Land is detailed inside the bbox and coarse outside. The two must merge cleanly: the app draws the land
    outline as the coastline, so any edge left along the bbox shows as a straight line across the map."""
    from shapely.geometry import shape
    path = ROOT / "data/geometry/base" / module / "land.geojson"
    if not path.exists():
        pytest.skip("no base geometry")
    w, s, e, n = load_frame(module)["bbox"]
    seams = []
    for f in json.loads(path.read_text(encoding="utf-8"))["features"]:
        g = shape(f["geometry"])
        for poly in getattr(g, "geoms", [g]):
            for ring in [poly.exterior, *poly.interiors]:
                c = list(ring.coords)
                for (x1, y1), (x2, y2) in zip(c, c[1:]):
                    for v in (s, n):
                        if abs(y1 - v) < 0.02 and abs(y2 - v) < 0.02 and abs(x2 - x1) > 0.3:
                            seams.append(((x1, y1), (x2, y2)))
                    for v in (w, e):
                        if abs(x1 - v) < 0.02 and abs(x2 - v) < 0.02 and abs(y2 - y1) > 0.3:
                            seams.append(((x1, y1), (x2, y2)))
    assert seams == []


# ---- Phase 1: polity polygons (tools/build_geometry.py, data/geometry/polity-shapes.yaml) ----

SHAPES = yaml.safe_load((ROOT / "data/geometry/polity-shapes.yaml").read_text(encoding="utf-8"))
POLITY_FILES = sorted((ROOT / "data/geometry/polities").glob("*.geojson"))


def _research_places(module):
    places = {}
    for f in (ROOT / "data/research" / module).glob("[!_]*.yaml"):
        for p in (yaml.safe_load(f.read_text(encoding="utf-8")) or {}).get("places") or []:
            places[p["id"]] = p
    return places


def test_polity_files_match_the_shape_spec():
    """The committed polygons are what build_geometry.py makes from polity-shapes.yaml (rebuild after editing it)."""
    assert {p.stem for p in POLITY_FILES} == set(SHAPES["polities"])
    for path in POLITY_FILES:
        feats = json.loads(path.read_text(encoding="utf-8"))["features"]
        assert len(feats) == len(SHAPES["polities"][path.stem]), path.name


@pytest.mark.parametrize("path", POLITY_FILES, ids=lambda p: p.stem)
def test_polity_features_carry_method_basis_and_years(path):
    from shapely.geometry import shape
    places = _research_places(SHAPES["module"])
    w, s, e, n = load_frame(SHAPES["module"])["view_bbox"]
    feats = json.loads(path.read_text(encoding="utf-8"))["features"]
    assert path.stem in places and places[path.stem]["kind"] in ("polity", "people")
    spans = []
    for f in feats:
        p = f["properties"]
        assert p["place_id"] == path.stem
        assert p["method"] in ("A", "E", "H")
        assert len(p["basis"]) > 40, "basis cites the geometry_note or the aourednik source"
        assert p["year_to"] is None or p["year_from"] < p["year_to"]
        g = shape(f["geometry"])
        assert g.is_valid and not g.is_empty
        assert all(poly.exterior.is_ccw for poly in getattr(g, "geoms", [g])), "outer rings counter-clockwise"
        x0, y0, x1, y1 = g.bounds
        assert w <= x0 and x1 <= e and s <= y0 and y1 <= n
        spans.append((p["year_from"], p["year_to"]))
    spans.sort()
    for (a0, a1), (b0, _) in zip(spans, spans[1:]):
        assert a1 is not None and a1 <= b0, f"{path.stem}: shapes overlap in time"


def test_polity_shapes_are_clipped_to_land():
    from shapely.geometry import shape
    from shapely.ops import unary_union
    from shapely import make_valid
    land = unary_union([make_valid(shape(f["geometry"])) for f in json.loads(
        (ROOT / "data/geometry/base" / SHAPES["module"] / "land.geojson").read_text(encoding="utf-8"))["features"]])
    for path in POLITY_FILES:
        for f in json.loads(path.read_text(encoding="utf-8"))["features"]:
            g = shape(f["geometry"])
            # simplification after clipping can wander a little past the coast; allow 2% of the area
            assert g.difference(land).area <= 0.02 * g.area, path.stem


def test_phase1_polities_have_shapes():
    """docs/build-plan.md Phase 1: Mali (E) and the hand-drawn West African zones (H)."""
    methods = {pid: {s["method"] for s in specs} for pid, specs in SHAPES["polities"].items()}
    assert "E" in methods["pl-mali"]
    for pid in ("pl-sosso", "pl-jolof", "pl-takrur", "pl-songhay-gao", "pl-mossi", "pl-bono"):
        assert methods[pid] == {"H"}, pid
    assert all(s.get("review") in ("draft", "approved") for specs in SHAPES["polities"].values() for s in specs)


@pytest.mark.parametrize("module", MODULES)
def test_module_regions_name_research_files(module):
    f = load_frame(module)
    ids = [r["id"] for r in f["regions"]]
    assert set(f["shown_regions"]) <= set(ids)
    for r in ids:
        assert (ROOT / "data/research" / module / f"{r}.yaml").exists()
