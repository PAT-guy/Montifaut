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
    company: "Ipconseil",
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
    access: "À 15 minutes en voiture de la sortie de Salbris (A71) et à 15 minutes de celle de Romorantin-Lanthenay (A85). Grand parking sur place."
  },

  stay: {
    capacity: 10,   // couchages ; des lits d'appoint sont possibles en plus
    bedrooms: 4,
    beds: 7,        // 4 lits simples + 3 lits doubles
    bathrooms: 1,
    toilets: 2,
    surface: 160,   // environ 80 m² par niveau, sur deux niveaux
    checkIn: "à partir de 16h00",
    checkOut: "avant 10h00"
  },

  description: [
    "Une ancienne dépendance en pierre et en brique, rénovée. Le séjour est une grande pièce ouverte, avec un poêle à bois, de hautes baies vitrées sur les arbres et une table pour toute la famille.",
    "Le gîte fait environ 160 m² sur deux niveaux. Le séjour ouvre sur la terrasse et la cuisine est équipée comme pour un grand groupe. Quatre chambres, une salle de bain et deux WC accueillent dix personnes. Un lit bébé est disponible sur demande, et un chenil accueille les chiens.",
    "Dehors, une grande terrasse couverte avec une longue table, un brasero et des fauteuils sur la pelouse. Le jardin est ouvert sur les bois, avec des chemins pour se promener. Table de ping-pong, jeu de pétanque et terrain de tennis avec panier de basket sont sur le terrain du gîte, réservés aux clients, sans réservation."
  ],

  rooms: [
    { title: "Salon et salle à manger", text: "Grande pièce ouverte, poêle à bois, canapés, grande table, baies vitrées sur le jardin." },
    { title: "Cuisine", text: "Four électrique professionnel à 5 feux, lave-vaisselle, deux réfrigérateurs-congélateurs, machine à glaçons, air fryer, grille-pain, bouilloire. Table pour 6 personnes." },
    { title: "Chambre à quatre lits", text: "4 lits simples, pour les enfants ou un groupe d'amis." },
    { title: "Chambres 2, 3 et 4", text: "Chacune avec 1 lit double." },
    { title: "Salle de bain et WC", text: "Une salle de bain et deux WC." }
  ],

  amenities: [
    "Wifi", "Lave-linge", "Chauffage", "Poêle à bois (bois fourni)", "Climatisation réversible", "Arrivée autonome (boîte à clés)", "Chenil", "Terrasse couverte",
    "Brasero", "Plancha", "Machine à glaçons", "Lave-vaisselle", "Terrain de tennis et basket",
    "Table de ping-pong", "Pétanque", "Grand parking", "Draps fournis", "Serviettes fournies",
    "Lit bébé sur demande"
  ],

  photos: [
    { src: "images/terrasse.webp", alt: "La terrasse couverte et son brasero" },
    { src: "images/sejour.webp", alt: "Le séjour et la grande table" },
    { src: "images/salon.webp", alt: "Le salon" },
    { src: "images/cuisine.webp", alt: "La cuisine" },
    { src: "images/tennis.webp", alt: "Le terrain de tennis" },
    { src: "images/chambre4lits-a.webp", alt: "La chambre à quatre lits simples" },
    { src: "images/chambre1.webp", alt: "Une chambre avec un lit double" },
    { src: "images/chambre2.webp", alt: "Une autre chambre avec un lit double" },
    { src: "images/chambre3.webp", alt: "Une troisième chambre avec un lit double" },
    { src: "images/chambre4lits-b.webp", alt: "La chambre à quatre lits, autre vue" }
  ],

  /*
   * TARIFS (par nuit, pour le logement entier).
   * Une saison va de "from" à "to" inclus, au format MM-JJ. Elle peut chevaucher le nouvel an.
   * En dehors de toute saison, defaultNightly s'applique.
   * Pour changer un prix, modifiez simplement le chiffre.
   */
  pricing: {
    /*
     * GRILLE PROVISOIRE, à ajuster avant publication.
     * Prix par nuit pour 4 personnes minimum (facturées même si le groupe est plus petit),
     * plus un supplément par personne et par nuit jusqu'à la capacité du gîte.
     * Draps et serviettes inclus.
     */
    currency: "€",
    defaultName: "Tarif de base",
    defaultNightly: 250,        // toute l'année, sauf les périodes listées plus bas
    minNights: 2,
    baseGuests: 4,              // personnes incluses dans le prix de base
    extraGuestPerNight: 15,     // supplément par personne et par nuit au-delà de baseGuests
    cleaningFee: 0,             // 0 : ménage inclus, aucune ligne dans le devis
    touristTaxPerPersonNight: 1.1, // taxe de séjour, adultes uniquement : fixée par votre commune
    depositPercent: 30,         // acompte affiché dans le devis (0 pour ne pas l'afficher)

    // Coefficient appliqué à l'hébergement (nuits et voyageurs en plus) selon la durée du séjour.
    // coef 1.10 : +10 %, coef 0.90 : -10 %. "to" absent : sans limite. Séjour minimum : 2 nuits.
    durationCoefficients: [
      { from: 2, to: 2, coef: 1.10 },
      { from: 3, to: 4, coef: 1 },
      { from: 5, to: 6, coef: 0.95 },
      { from: 7, coef: 0.90 }
    ],

    // Saisons qui reviennent chaque année (MM-JJ). Une saison peut chevaucher le nouvel an.
    seasons: [
      { name: "Été", from: "07-04", to: "08-28", nightly: 340, minNights: 2 },
      { name: "Noël et nouvel an", from: "12-20", to: "01-04", nightly: 380, minNights: 2 }
    ],

    // Dates exceptionnelles (AAAA-MM-JJ). Elles l'emportent sur les saisons.
    // "from" et "to" sont la première et la dernière NUIT concernées.
    specialDates: [
      { name: "Week-end de Pâques 2027", from: "2027-03-26", to: "2027-03-28", nightly: 320, minNights: 2 },
      { name: "Pont de l'Ascension 2027", from: "2027-05-05", to: "2027-05-08", nightly: 330, minNights: 2 },
      { name: "Week-end de Pentecôte 2027", from: "2027-05-15", to: "2027-05-16", nightly: 330, minNights: 2 }
    ],

    // Options ajoutées au devis. per : "stay" (par séjour) ou "night" (par nuit). max : quantité maximale.
    extras: [
      { id: "chien", label: "Chien (chenil à disposition)", price: 10, per: "stay", max: 3, unit: "par chien et par séjour" },
      { id: "bebe", label: "Lit bébé", price: 0, per: "stay", max: 1, unit: "gratuit" }
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
    { title: "Arrivée et départ", text: "Arrivée autonome avec une boîte à clés : le code vous est envoyé avant votre séjour. Arrivée à partir de 16h, départ avant 10h." },
    { title: "Capacité", text: "10 couchages (4 lits simples et 3 lits doubles). Un lit bébé est disponible sur demande, pas d'autre lit d'appoint pour l'instant. Toute personne supplémentaire doit être annoncée à la réservation." },
    { title: "Chiens", text: "Les chiens sont acceptés sur demande préalable : un chenil est à leur disposition. Le supplément figure dans le devis. Ils ne montent pas sur les lits et les canapés." },
    { title: "Tabac", text: "Il est interdit de fumer à l'intérieur. Un cendrier est à disposition sur la terrasse." },
    { title: "Fêtes et calme", text: "Les anniversaires et les repas de famille sont les bienvenus. Les mariages et les soirées dansantes ne sont pas autorisés. Merci de respecter le voisinage : pas de bruit après 22h." },
    { title: "Poêle à bois, brasero et plancha", text: "Le bois du poêle est fourni. Le poêle, le brasero et la plancha s'utilisent avec précaution et jamais sans surveillance, surtout avec des enfants." },
    { title: "Ménage", text: "Le ménage de fin de séjour est compris dans le prix. Merci de laisser la vaisselle propre et de sortir les poubelles." },
    { title: "Tri des déchets", text: "Des conteneurs de tri se trouvent à l'entrée du hameau. Le calendrier de collecte est affiché dans la cuisine." },
    { title: "Dépôt de garantie", text: "Une caution de 800 € est demandée avant l'arrivée et restituée sous 7 jours, après vérification du gîte à votre départ." },
    { title: "Réservation et annulation", text: "Un acompte de 30 % confirme la réservation. Le solde est dû 14 jours avant l'arrivée. L'annulation est gratuite jusqu'à 14 jours avant le séjour. Au-delà, l'acompte reste acquis." }
  ],

  // Questions fréquentes. Ajoutez, retirez ou reformulez librement.
  faq: [
    { q: "Comment se passe l'arrivée ?", a: "L'arrivée est autonome : une boîte à clés vous attend, et son code vous est envoyé avant votre séjour. Vous n'avez pas besoin de nous attendre sur place." },
    { q: "Combien de personnes peut-on loger ?", a: "Dix personnes : une chambre avec quatre lits simples et trois chambres avec un lit double. Un lit bébé est disponible sur demande. Nous n'avons pas d'autre lit d'appoint pour l'instant." },
    { q: "Les draps et les serviettes sont-ils fournis ?", a: "Oui, les draps et les serviettes sont fournis et compris dans le prix." },
    { q: "Le ménage est-il compris ?", a: "Oui, le ménage de fin de séjour est compris dans le prix : aucun frais de ménage n'est ajouté. Merci de laisser la vaisselle propre et de sortir les poubelles." },
    { q: "Peut-on venir avec des chiens ?", a: "Oui, sur demande préalable. Un chenil est à leur disposition. Le supplément s'ajoute au devis, et les chiens ne montent pas sur les lits ni sur les canapés." },
    { q: "Comment le gîte est-il chauffé et rafraîchi ?", a: "Un poêle à bois chauffe le séjour, avec du bois fourni. Le gîte dispose aussi d'une climatisation réversible, qui chauffe en hiver et rafraîchit en été." },
    { q: "Le tennis, le ping-pong et la pétanque sont-ils accessibles ?", a: "Oui, ils sont sur le terrain du gîte et réservés à nos clients. Vous n'avez pas besoin de réserver." },
    { q: "Comment venir ?", a: "Le gîte est à 15 minutes en voiture de la sortie de Salbris sur l'A71, et à 15 minutes de celle de Romorantin-Lanthenay sur l'A85. Il y a un grand parking sur place." },
    { q: "Peut-on organiser un anniversaire ou un repas de famille ?", a: "Oui, volontiers. En revanche, les mariages et les soirées dansantes ne sont pas autorisés. Merci de respecter le voisinage après 22h." },
    { q: "Quelles sont les conditions d'annulation ?", a: "L'annulation est gratuite jusqu'à 14 jours avant votre arrivée. Au-delà, l'acompte reste acquis." },
    { q: "Comment réserver ?", a: "Choisissez vos dates dans le calendrier : le devis se calcule tout de suite, avec les options. Envoyez ensuite votre demande. Nous confirmons après vérification, puis un acompte bloque les dates." },
    { q: "Une caution est-elle demandée ?", a: "Oui, une caution de 800 € est demandée avant l'arrivée. Elle vous est rendue sous 7 jours après la vérification du gîte à votre départ." }
  ]
};
