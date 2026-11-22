#!/usr/bin/env python3
"""
Carte du secteur servi : toutes les communes à 40 km de Metz ou moins (#R60, Rémy 22/11/2026 :
« pourquoi les autres villes ne sont pas mises en vert ? » ; modèle : carte de SOS Chauffage Metz).

Usage : python3 scripts/carte-secteur.py   (écrit components/sections/carte-secteur-data.ts)
Source : geo.api.gouv.fr, contours IGN Admin Express, départements 57, 54 et 55.
Règles :
  - servie = toute commune qui touche le cercle de 40 km autour de l'hôtel de ville de Metz
    (jamais de gris dans le cercle, #R60) ;
  - plus les communes qui ont leur page (content/zones), servies quoi qu'il arrive ;
  - plus toute commune non servie entourée de communes servies (aucun trou gris) ;
  - fond = communes voisines qui entrent dans la carte ronde de 46 km de rayon ;
  - noms écrits : en gras les communes qui ont leur page, puis les autres par population
    décroissante, tant qu'il reste de la place sans chevauchement.
Les contours (833 communes) partent dans deux images statiques, chargées à l'approche :
public/carte/secteur-gris.svg (tout le fond) et public/carte/secteur-vert.svg (les communes
servies), que le composant révèle en cercle depuis Metz. Le code de la page ne garde que
les communes qui ont leur page (cliquables) et les noms : la page reste légère.
Dépendances : shapely, Pillow (largeur des noms mesurée avec Arial, plus large qu'Asap : marge sûre).
"""
import glob, json, math, random, re, urllib.request
from pathlib import Path
from PIL import ImageFont
from shapely.geometry import Point, Polygon, shape
from shapely.ops import transform, unary_union
from shapely.prepared import prep

RACINE = Path(__file__).resolve().parent.parent
METZ = (6.1757, 49.1197)  # hôtel de ville
# Rayon et atelier lus dans config/site.config.ts (une seule source, relecture du 22/11/2026).
_CFG = (RACINE / "config/site.config.ts").read_text()
RAYON_KM = int(re.search(r"radiusKm:\s*(\d+)", _CFG).group(1))
_m = re.search(r"^\s*atelier:\s*(null|\{[^}]*\})", _CFG, re.M)  # ligne de réglage, jamais le commentaire
ATELIER = None if _m.group(1) == "null" else (
    float(re.search(r"\blon:\s*([0-9.]+)", _m.group(1)).group(1)),
    float(re.search(r"\blat:\s*([0-9.]+)", _m.group(1)).group(1)),
)
CADRE_KM = 46  # rayon de la carte ronde (le composant la rogne en cercle)
DEPARTEMENTS = ["57", "54", "55"]
POP_MIN = 900  # en dessous, une commune servie n'a pas son nom (elle reste en vert)

K = math.cos(math.radians(METZ[1]))
KM_LON, KM_LAT = 111.32 * K, 110.57


def km(lon, lat):
    """Coordonnées en km autour de Metz (x vers l'est, y vers le sud)."""
    return ((lon - METZ[0]) * KM_LON, (METZ[1] - lat) * KM_LAT)


def dist(c):
    return math.hypot(*km(*c["centre"]["coordinates"]))


def charger():
    # Cache local (dossier temporaire du Mac) : la passe suivante ne retélécharge pas les contours.
    import tempfile
    cache = Path(tempfile.gettempdir()) / f"carte-secteur-{'-'.join(DEPARTEMENTS)}.json"
    if cache.exists():
        return json.loads(cache.read_text())
    communes = []
    for d in DEPARTEMENTS:
        url = f"https://geo.api.gouv.fr/departements/{d}/communes?fields=nom,code,centre,contour,population&format=json&geometry=contour"
        with urllib.request.urlopen(url, timeout=90) as r:
            communes += [c for c in json.load(r) if c.get("contour") and c.get("centre")]
    cache.write_text(json.dumps(communes))
    return communes


def anneaux(c):
    g = c["contour"]
    return g["coordinates"] if g["type"] == "Polygon" else [r for p in g["coordinates"] for r in p]


def touche_la_carte(c):
    return any(Polygon([km(x, y) for x, y in r]).buffer(0).distance(Point(0, 0)) <= CADRE_KM for r in anneaux(c))


communes = [c for c in charger() if dist(c) <= CADRE_KM + 8]
zones = {}
for f in sorted(glob.glob(str(RACINE / "content/zones/*.json"))):
    z = json.load(open(f))
    zones[z["name"].lower()] = z["slug"]
page = {}
for c in communes:
    if c["code"].startswith("57") and c["nom"].lower() in zones:
        page[c["code"]] = zones[c["nom"].lower()]
manquantes = set(zones.values()) - set(page.values())
assert not manquantes, f"pages sans commune : {manquantes}"

geom = {c["code"]: shape(c["contour"]).buffer(0) for c in communes}


def touche_le_cercle(c):
    return any(Polygon([km(x, y) for x, y in r]).buffer(0).distance(Point(0, 0)) < RAYON_KM for r in anneaux(c))


servie = {c["code"]: c["code"] in page or touche_le_cercle(c) for c in communes}
for c in communes:
    if not servie[c["code"]] and dist(c) <= RAYON_KM + 4:
        g = geom[c["code"]]
        voisins = [o for o in communes if o["code"] != c["code"] and g.buffer(1e-4).intersects(geom[o["code"]])]
        if voisins and all(servie[o["code"]] for o in voisins):
            servie[c["code"]] = True
            print("trou comblé :", c["nom"])
union = unary_union([geom[k] for k, v in servie.items() if v])
trous = sum(len(p.interiors) for p in getattr(union, "geoms", [union]))
assert trous == 0, f"{trous} trou(s) gris dans le secteur"

W = H = 1000
ECHELLE = W / (2 * CADRE_KM)


def proj(lon, lat):
    x, y = km(lon, lat)
    return ((x + CADRE_KM) * ECHELLE, (y + CADRE_KM) * ECHELLE)


def dp(P, eps):
    if len(P) < 3:
        return P
    (ax, ay), (bx, by) = P[0], P[-1]
    L = math.hypot(bx - ax, by - ay) or 1e-9
    i, dm = 0, 0
    for j in range(1, len(P) - 1):
        dd = abs((bx - ax) * (ay - P[j][1]) - (ax - P[j][0]) * (by - ay)) / L
        if dd > dm:
            i, dm = j, dd
    return dp(P[: i + 1], eps)[:-1] + dp(P[i:], eps) if dm > eps else [P[0], P[-1]]


def chemin(c, eps):
    """Tracé SVG en coordonnées relatives (plus court) ; les écarts sont pris entre points arrondis, sans dérive."""
    out = ""
    for r in anneaux(c):
        Q = [proj(x, y) for x, y in r][:-1]
        h = len(Q) // 2
        P = dp(Q[: h + 1], eps)[:-1] + dp(Q[h:] + [Q[0]], eps)[:-1]
        P = [(round(x), round(y)) for x, y in P]
        P = [p for k, p in enumerate(P) if k == 0 or p != P[k - 1]]
        if len(P) < 3:
            continue
        out += f"M{P[0][0]} {P[0][1]}" + "".join(f"l{x - px} {y - py}" for (px, py), (x, y) in zip(P, P[1:])) + "z"
    return out.replace(" -", "-")


garder = [c for c in communes if servie[c["code"]] or touche_la_carte(c)]
fond = [c for c in garder if not servie[c["code"]]]
avec_page = [c for c in garder if c["code"] in page]
sans_page = [c for c in garder if servie[c["code"]] and c["code"] not in page]

# ----------------------------- noms écrits sur la carte -----------------------------
POLICES_PAGE = [18, 15, 13, 11.5]  # pages serrées autour de Metz : plus petit si la commune est étroite
MARGE_PAGE = 3.6  # une page peut déborder un peu plus : son nom doit être écrit
POLICE = 14
POLICES_SANS_PAGE = [POLICE, POLICE * 0.86]
POLICE_CENTRE = 34
MARGE = 1.2
POLICES = {False: ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial.ttf", 100),
           True: ImageFont.truetype("/System/Library/Fonts/Supplemental/Arial Bold.ttf", 100)}


def lignes_du_nom(nom):
    if len(nom) <= 11 or not any(ch in nom for ch in "- "):
        return [nom]
    k = min((k for k, ch in enumerate(nom) if ch in "- "), key=lambda k: abs(k - len(nom) / 2))
    return [nom[:k], nom[k + 1:]] if nom[k] == " " else [nom[: k + 1], nom[k + 1:]]


def boite(nom, x, y, police, gras):
    w = max(POLICES[gras].getlength(l) for l in lignes_du_nom(nom)) / 100 * police + police * 0.3
    h = len(lignes_du_nom(nom)) * police * 1.12 + police * 0.15
    return (x - w / 2, y - h / 2, x + w / 2, y + h / 2)


def chevauche(a, b):
    return a[0] < b[2] and b[0] < a[2] and a[1] < b[3] and b[1] < a[3]


contour = {c["code"]: transform(lambda x, y, z=None: proj(x, y), geom[c["code"]]) for c in garder}
cx0, cy0 = proj(*METZ)
R_DEDANS = CADRE_KM * ECHELLE - 10
metz = next(c for c in garder if c["code"] == "57463")
bx, by = proj(*metz["centre"]["coordinates"])
w_b = POLICES[True].getlength("Metz") / 100 * POLICE_CENTRE / 2 + 6
RESERVE = [(bx - w_b, by - 30 - POLICE_CENTRE * 0.62, bx + w_b, by - 30 + POLICE_CENTRE * 0.62), (bx - 16, by - 16, bx + 16, by + 16)]
# Le point lumineux de l'atelier (Rémy 22/11/2026), lu dans config/site.config.ts : aucun nom dessus.
if ATELIER:
    ax_, ay_ = proj(*ATELIER)
    RESERVE.append((ax_ - 18, ay_ - 18, ax_ + 18, ay_ + 18))
a = -math.pi / 4
r40x, r40y = cx0 + RAYON_KM * ECHELLE * math.cos(a), cy0 + RAYON_KM * ECHELLE * math.sin(a)
w40 = POLICES[True].getlength("40 km") / 100 * 28 / 2 + 8
RESERVE.append((r40x - w40, r40y - 22, r40x + w40, r40y + 22))


def candidats(c, gras):
    g = contour[c["code"]]
    out = []
    for police in (POLICES_PAGE if gras else POLICES_SANS_PAGE):
        dedans = prep(g.buffer(police * (MARGE_PAGE if gras else MARGE)))
        pas = police * 0.4
        n = 12 if gras else 8
        decal = sorted({(dx * pas, dy * pas) for dx in range(-n, n + 1) for dy in range(-n * 3 // 4, n * 3 // 4 + 1)}, key=lambda d: math.hypot(*d))
        for ox, oy in ((g.representative_point().x, g.representative_point().y), (g.centroid.x, g.centroid.y)):
            for dx, dy in decal:
                x, y = ox + dx, oy + dy
                if not dedans.contains(Point(x, y)):
                    continue
                b = boite(c["nom"], x, y, police, gras)
                if all(math.hypot(px - cx0, py - cy0) < R_DEDANS for px in b[::2] for py in b[1::2]):
                    out.append((x, y, police, b))
    return out


def libre(b, place):
    return not any(chevauche(b, q) for q in RESERVE) and not any(chevauche(b, v[3]) for v in place.values())


a_nommer = sorted((c for c in sans_page if c is not metz and (c.get("population") or 0) >= POP_MIN), key=lambda c: -(c.get("population") or 0))
CAND = {}
# Les noms des pages d'abord : plusieurs ordres essayés (tirages fixés, carte identique à chaque passe).
hasard = random.Random(57)
pages_a_placer = sorted((c for c in avec_page), key=lambda c: contour[c["code"]].area)
for tirage in range(300):
    ordre = pages_a_placer if tirage == 0 else hasard.sample(pages_a_placer, len(pages_a_placer))
    place, omis_pages = {}, []
    for c in ordre:
        cc = next((x for x in CAND.setdefault(c["code"], candidats(c, True)) if libre(x[3], place)), None)
        if cc:
            place[c["code"]] = cc
        else:
            omis_pages.append(c["nom"])
    if not omis_pages:
        break
assert not omis_pages, f"pages sans place pour leur nom : {omis_pages}"
omis = []
for c in a_nommer:
    cc = next((x for x in CAND.setdefault(c["code"], candidats(c, False)) if libre(x[3], place)), None)
    if cc:
        place[c["code"]] = cc
    else:
        omis.append(c["nom"])
print(f"noms : {len(place)} écrits ({len(avec_page)} pages), {len(omis)} sans place sur {len(a_nommer)} communes de {POP_MIN} habitants ou plus")


def etiquette(c):
    if c["code"] not in place:
        return "null"
    x, y, t, _ = place[c["code"]]
    return f"{{ x: {round(x)}, y: {round(y)}, taille: {round(t, 1):g}, lignes: {json.dumps(lignes_du_nom(c['nom']), ensure_ascii=False)} }}"


nb_servies = sum(1 for c in garder if servie[c["code"]])
CLIP = f'<clipPath id="c"><circle cx="{round(cx0)}" cy="{round(cy0)}" r="{round(CADRE_KM * ECHELLE)}"/></clipPath>'


def image(nom, d, remplissage, socle=""):
    (RACINE / "public/carte").mkdir(parents=True, exist_ok=True)
    f = RACINE / "public/carte" / nom
    f.write_text(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}"><defs>{CLIP}</defs><g clip-path="url(#c)">{socle}'
                 f'<path d="{d}" fill="{remplissage}" stroke="#fff" stroke-width="1.3" stroke-linejoin="round"/></g></svg>\n')
    return f.stat().st_size // 1024


servies_d = "".join(chemin(c, 2.0) for c in garder if servie[c["code"]])
ko_gris = image("secteur-gris.svg", "".join(chemin(c, 3.0) for c in fond) + servies_d, "#E6E3DE",
                f'<circle cx="{round(cx0)}" cy="{round(cy0)}" r="{round(CADRE_KM * ECHELLE)}" fill="#F3F1ED"/>')
ko_vert = image("secteur-vert.svg", servies_d, "#C4DFB9")
L = [
    "/**",
    f" * Secteur servi : toutes les communes qui touchent le cercle de {RAYON_KM} km autour de Metz, plus celles",
    " * qui ont leur page, sans aucun trou gris (#R60, Rémy 22/11/2026). Contours : public/carte/secteur-*.svg.",
    f" * Source : geo.api.gouv.fr (contours IGN Admin Express, départements {', '.join(DEPARTEMENTS)}),",
    f" * projection équirectangulaire centrée sur Metz, carte ronde de {CADRE_KM} km de rayon, simplifiée.",
    " * Généré par scripts/carte-secteur.py : ne pas éditer à la main.",
    " */",
    f"export const CARTE = {{ w: {W}, h: {H}, cx: {round(cx0)}, cy: {round(cy0)}, rayon: {round(RAYON_KM * ECHELLE)}, cadre: {round(CADRE_KM * ECHELLE)}, km: {RAYON_KM}, servies: {nb_servies}, metz: {{ x: {round(bx)}, y: {round(by)} }}, atelier: {f'{{ x: {round(ax_)}, y: {round(ay_)} }}' if ATELIER else 'null'} }}",
    "",
    "type Etiquette = { x: number; y: number; taille: number; lignes: string[] }",
    "",
    "/** Communes qui ont leur page : cliquables vers /zones/<slug>. */",
    "export const PAGES: { slug: string; nom: string; km: number; x: number; y: number; etiquette: Etiquette | null; d: string }[] = [",
]
for c in sorted(avec_page, key=dist):
    x, y = proj(*c["centre"]["coordinates"])
    L.append(f"  {{ slug: '{page[c['code']]}', nom: {json.dumps(c['nom'], ensure_ascii=False)}, km: {round(dist(c), 1)}, x: {round(x)}, y: {round(y)}, etiquette: {etiquette(c)}, d: '{chemin(c, 1.4)}' }},")
L += ["]", "", "/** Noms des autres communes servies (les plus peuplées, tant qu'il y a la place). */",
      "export const NOMS: { nom: string; etiquette: Etiquette }[] = ["]
for c in a_nommer:
    if c["code"] in place:
        L.append(f"  {{ nom: {json.dumps(c['nom'], ensure_ascii=False)}, etiquette: {etiquette(c)} }},")
L.append("]")
sortie = RACINE / "components/sections/carte-secteur-data.ts"
sortie.write_text("\n".join(L) + "\n")
print(f"{len(garder)} communes dessinées, {nb_servies} servies, {len(fond)} en fond ; données {sortie.stat().st_size // 1024} Ko, images {ko_gris} + {ko_vert} Ko")
