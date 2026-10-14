# Gîte de Montifaut : site de location

Site statique (HTML, CSS, JavaScript) sans serveur ni base de données. Hébergement gratuit possible sur GitHub Pages, Netlify ou Cloudflare Pages. Seul le nom de domaine est payant (environ 10 € par an).

Tous les textes, photos, prix et règlements sont des exemples à remplacer.

## Où modifier quoi

| Je veux changer | Fichier |
| --- | --- |
| Description, équipements, photos, activités, visites, règlement, coordonnées, adresse, **prix et saisons** | `js/config.js` |
| Photos | déposer les images dans `images/` puis les déclarer dans `js/config.js` |
| Couleurs et mise en page | `css/style.css` |
| Dates bloquées à la main (séjour hors plateformes) | `data/manual-blocks.json` |

Dans `data/manual-blocks.json`, la date de fin est le jour du départ : `{"start": "2026-08-01", "end": "2026-08-08"}` bloque les nuits du 1er au 7 août.

## Synchronisation avec Airbnb et Booking

Le calendrier se met à jour tout seul toutes les 3 heures grâce à `.github/workflows/sync-ical.yml`.

1. Sur Airbnb et Booking, copiez le lien d'export du calendrier (format iCal, finit souvent par `.ics`).
2. Dans le dépôt GitHub : Settings > Secrets and variables > Actions > New repository secret.
3. Nom : `ICAL_URLS`. Valeur : les liens, un par ligne.
4. Onglet Actions > « Synchronisation du calendrier » > Run workflow pour tester.

Les liens iCal donnent accès à votre planning : ne les écrivez jamais dans un fichier du dépôt.

Limite à connaître : une réservation faite sur ce site n'est pas bloquée automatiquement sur Airbnb et Booking. Après avoir accepté une demande, bloquez les dates à la main sur les plateformes (et dans `data/manual-blocks.json`).

## Recevoir les demandes de réservation

Sans réglage, le bouton ouvre la messagerie du visiteur avec un mail prérempli. Pour recevoir les demandes directement, créez un formulaire gratuit sur formspree.io et collez son adresse dans `contact.formEndpoint` de `js/config.js`.

## Tester en local

```
python3 -m http.server 8000
```

Puis ouvrir http://localhost:8000.

## Publier sur GitHub Pages

Settings > Pages > Source : branche principale, dossier `/ (root)`.
