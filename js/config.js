/*
 * TOUT LE CONTENU DU SITE SE MODIFIE ICI.
 * Les textes, photos, prix, règlement et coordonnées ci-dessous sont des exemples.
 */
window.GITE_CONFIG = {
  // Thème visuel : "domaine", "sologne", "chasse", "tradition" ou "champetre"
  theme: "domaine",

  name: "Gîte de Montifaut",
  titleLight: "Gîte de",      // titre d'accueil du thème Domaine : partie légère
  titleStrong: "Montifaut",   // et partie en gras
  tagline: "Une maison de campagne en pierre, au calme, pour 10 personnes",
  // Quatre atouts affichés sous la photo d'accueil (thème Domaine). Icônes : tree, house, compass, key
  highlights: [
    { icon: "tree", light: "Un cadre", strong: "préservé", text: "Une maison de campagne au calme, avec un jardin ouvert sur les bois." },
    { icon: "house", light: "Une maison", strong: "tout équipée", text: "Quatre chambres, une salle de bain, une vraie cuisine et une grande terrasse couverte." },
    { icon: "compass", light: "Des sorties", strong: "à proximité", text: "Tennis, ping-pong et pétanque sur le terrain du gîte, promenades dans les bois, sites à visiter à moins de 30 km." },
    { icon: "key", light: "Un contact", strong: "direct", text: "Vous échangez avec nous, de votre demande jusqu'à votre arrivée." }
  ],

  heroImage: "images/terrasse.webp",

  contact: {
    phone: "+33 6 00 00 00 00",
    email: "contact@exemple.fr",
    owner: "Votre nom",
    // Pour recevoir les demandes par mail sans serveur : créez un formulaire sur
    // https://formspree.io et collez ici son adresse (https://formspree.io/f/xxxx).
    // Laissé vide, le bouton ouvre le logiciel de messagerie du visiteur.
    formEndpoint: ""
  },

  location: {
    address: "Lieu-dit Montifaut, 00000 Commune",
    // Coordonnées d'exemple : remplacez par celles du gîte (clic droit sur Google Maps).
    lat: 47.0,
    lng: 2.0,
    access: "À 5 minutes du village et de ses commerces. Parking sur place. Gare la plus proche à 20 km."
  },

  stay: {
    capacity: 10,   // couchages ; des lits d'appoint sont possibles en plus
    bedrooms: 4,
    beds: 7,        // 4 lits simples + 3 lits doubles
    bathrooms: 1,
    toilets: 2,
    surface: 110,
    checkIn: "16h00 à 19h00",
    checkOut: "avant 10h00"
  },

  description: [
    "Une ancienne dépendance en pierre et en brique, rénovée. Le séjour est une grande pièce ouverte, avec un poêle à bois, de hautes baies vitrées sur les arbres et une table pour toute la famille.",
    "Au rez-de-chaussée, le salon de 35 m² ouvre sur une cuisine entièrement équipée et sur la terrasse. Quatre chambres, une salle de bain et deux WC accueillent dix personnes, et des lits d'appoint sont possibles.",
    "Dehors, une grande terrasse couverte avec une longue table, un brasero et des fauteuils sur la pelouse. Le jardin est ouvert sur les bois, avec des chemins pour se promener. Table de ping-pong, jeu de pétanque et terrain de tennis avec panier de basket sont sur le terrain du gîte, réservés aux clients, sans réservation."
  ],

  rooms: [
    { title: "Salon et salle à manger", text: "Grande pièce ouverte, poêle à bois, canapés, grande table, baies vitrées sur le jardin." },
    { title: "Cuisine", text: "Lave-vaisselle, four, plaques à induction, cafetière, bouilloire, grille-pain, raclette." },
    { title: "Chambre à quatre lits", text: "4 lits simples, pour les enfants ou un groupe d'amis." },
    { title: "Chambres 2, 3 et 4", text: "Chacune avec 1 lit double. Des lits d'appoint peuvent être ajoutés sur demande." },
    { title: "Salle de bain et WC", text: "Une salle de bain et deux WC." }
  ],

  amenities: [
    "Wifi fibre", "Lave-linge", "Chauffage central", "Cheminée", "Terrasse couverte",
    "Brasero", "Terrain de tennis et basket", "Table de ping-pong", "Pétanque", "Parking", "Linge de lit fourni", "Linge de toilette fourni",
    "Lits d'appoint sur demande", "Lit bébé sur demande", "Animaux acceptés sur demande"
  ],

  photos: [
    { src: "images/terrasse.webp", alt: "La terrasse couverte et son brasero" },
    { src: "images/sejour.webp", alt: "Le séjour et la grande table" },
    { src: "images/salon.webp", alt: "Le salon" },
    { src: "images/cuisine.webp", alt: "La cuisine" },
    { src: "images/chambre1.webp", alt: "Une chambre" },
    { src: "images/chambre2.webp", alt: "Une autre chambre" },
    { src: "images/tennis.webp", alt: "Le terrain de tennis" }
  ],

  /*
   * TARIFS (par nuit, pour le logement entier).
   * Une saison va de "from" à "to" inclus, au format MM-JJ. Elle peut chevaucher le nouvel an.
   * En dehors de toute saison, defaultNightly s'applique.
   * Pour changer un prix, modifiez simplement le chiffre.
   */
  pricing: {
    currency: "€",
    defaultNightly: 110,
    minNights: 2,
    baseGuests: 4,              // personnes incluses dans le prix
    extraGuestPerNight: 15,     // supplément par personne au-delà de baseGuests
    cleaningFee: 60,
    touristTaxPerPersonNight: 1.2, // taxe de séjour, adultes uniquement : à ajuster selon votre commune
    seasons: [
      { name: "Haute saison (été)", from: "07-04", to: "08-28", nightly: 160, minNights: 7 },
      { name: "Vacances de Noël et nouvel an", from: "12-20", to: "01-04", nightly: 150, minNights: 3 },
      { name: "Printemps et ponts", from: "04-15", to: "07-03", nightly: 125, minNights: 2 },
      { name: "Automne", from: "08-29", to: "11-02", nightly: 115, minNights: 2 }
    ]
  },

  activities: [
    { title: "Tennis et basket", distance: "Sur place", text: "Terrain de tennis grillagé avec un panier de basket, sur le terrain du gîte et réservé aux clients." },
    { title: "Ping-pong et pétanque", distance: "Sur place", text: "Une table de ping-pong et un terrain de pétanque, sur le terrain du gîte et réservés aux clients." },
    { title: "Promenade dans les bois", distance: "Sur place", text: "Le jardin est ouvert sur les bois : chemins pour se promener à pied, directement depuis le gîte." },
    { title: "Randonnées au départ du gîte", distance: "Sur place", text: "Trois boucles balisées de 6 à 18 km traversent bois et prairies. Cartes disponibles dans le gîte." },
    { title: "Vélo et VTT", distance: "Sur place", text: "Chemins ruraux peu fréquentés. Local fermé pour ranger les vélos." },
    { title: "Pêche en rivière", distance: "3 km", text: "Rivière de première catégorie. Carte de pêche en vente au village." },
    { title: "Baignade au lac", distance: "12 km", text: "Plage surveillée l'été, pédalos et paddles à la location." },
    { title: "Marché du village", distance: "5 km", text: "Producteurs locaux tous les samedis matin." },
    { title: "Équitation", distance: "8 km", text: "Balades à cheval et poney pour les enfants, sur réservation." }
  ],

  visits: [
    { title: "Château médiéval", distance: "9 km", text: "Visites guidées de mars à novembre, spectacle de fauconnerie l'été." },
    { title: "Village de caractère", distance: "14 km", text: "Ruelles pavées, église romane et ateliers d'artisans." },
    { title: "Abbaye cistercienne", distance: "22 km", text: "Cloître, jardins et boutique de produits monastiques." },
    { title: "Grottes et gouffres", distance: "30 km", text: "Parcours souterrain d'une heure, température constante de 12 °C." },
    { title: "Ville historique", distance: "35 km", text: "Cathédrale, musées, restaurants et centre piéton." }
  ],

  rules: [
    { title: "Arrivée et départ", text: "Arrivée entre 16h et 19h, départ avant 10h. Pour une arrivée plus tardive, prévenez-nous à l'avance." },
    { title: "Capacité", text: "10 couchages (4 lits simples et 3 lits doubles), lits d'appoint possibles sur demande. Toute personne supplémentaire doit être annoncée à la réservation." },
    { title: "Animaux", text: "Les animaux sont acceptés sur demande préalable, avec un supplément de 10 € par séjour. Ils ne montent pas sur les lits et canapés." },
    { title: "Tabac", text: "Il est interdit de fumer à l'intérieur. Un cendrier est à disposition sur la terrasse." },
    { title: "Calme", text: "Merci de respecter le voisinage : pas de bruit après 22h, ni de fête ou d'événement sans accord écrit." },
    { title: "Cheminée et barbecue", text: "Le bois est fourni en quantité raisonnable. Le barbecue ne s'utilise qu'à l'emplacement prévu, jamais sans surveillance." },
    { title: "Ménage", text: "Le ménage de fin de séjour est inclus (frais de ménage). Merci de laisser la vaisselle propre et de vider la poubelle." },
    { title: "Tri des déchets", text: "Des conteneurs de tri se trouvent à l'entrée du hameau. Le calendrier de collecte est affiché dans la cuisine." },
    { title: "Dépôt de garantie", text: "Une caution de 300 € est demandée à l'arrivée et restituée sous 7 jours, après l'état des lieux de sortie." },
    { title: "Réservation et annulation", text: "Un acompte de 30 % confirme la réservation. Le solde est dû 30 jours avant l'arrivée. Annulation gratuite jusqu'à 30 jours avant le séjour." }
  ]
};
