/*
 * TOUT LE CONTENU DU SITE SE MODIFIE ICI.
 * Les textes, photos, prix, règlement et coordonnées ci-dessous sont des exemples.
 */
window.GITE_CONFIG = {
  // Thème visuel : "domaine", "sologne", "chasse", "tradition" ou "champetre"
  theme: "sologne",
  // Polices : "" (actuelles) ou "charte" (Cinzel, Josefin Sans, comme dans les logos). Test : ajouter ?police=charte à l'adresse.
  font: "",

  name: "Gîte des Communs de Montifaut",
  shortName: "Les Communs de Montifaut",   // affiché dans l'en-tête
  titleLight: "Gîte des Communs de",      // titre d'accueil du thème Domaine : partie légère
  titleStrong: "Montifaut",               // et partie en gras
  tagline: "Les anciens communs du château de Montifaut, relais de chasse en Sologne, pour 10 personnes",
  // Quatre atouts affichés sous la photo d'accueil (thème Domaine). Icônes : tree, house, compass, key
  highlights: [
    { icon: "tree", light: "Un cadre", strong: "préservé", text: "Les anciens communs d'un château, au calme, avec un jardin ouvert sur les bois." },
    { icon: "house", light: "Une maison", strong: "tout équipée", text: "Quatre chambres, une salle de bain, une cuisine pour grand groupe et une terrasse couverte de 20 places." },
    { icon: "compass", light: "Des sorties", strong: "à proximité", text: "Tennis, ping-pong et pétanque sur place, circuits de randonnée à Selles-Saint-Denis, Chambord et Cheverny tout près." },
    { icon: "key", light: "Un contact", strong: "direct", text: "Vous échangez avec Isabelle, de votre demande jusqu'à votre arrivée." }
  ],

  heroImage: "images/terrasse.webp",

  contact: {
    phone: "06 48 48 11 13",
    whatsapp: "33648481113",            // même numéro, au format international sans le +
    email: "ipconseils@orange.fr",
    owner: "Isabelle",
    company: "IP Conseils",
    responseTime: "48 heures",
    languages: "français, anglais et allemand",
    // Pour recevoir les demandes par mail sans serveur : créez un formulaire sur
    // https://formspree.io et collez ici son adresse (https://formspree.io/f/xxxx).
    // Laissé vide, le bouton ouvre le logiciel de messagerie du visiteur.
    formEndpoint: ""
  },

  location: {
    address: "Les Communs de Montifaut, 1802 route de Mennetou, 41300 Selles-Saint-Denis",
    lat: 47.365495,
    lng: 1.905041,
    access: "À 15 minutes en voiture de la sortie de Salbris (A71) et de celle de Romorantin-Lanthenay (A85). Gare de Selles-Saint-Denis à 3,5 km. Grand parking sur place."
  },

  stay: {
    capacity: 10,   // couchages (pas de lit d'appoint, un lit bébé sur demande)
    bedrooms: 4,
    beds: 7,        // 4 lits simples + 3 lits doubles
    bathrooms: 1,
    toilets: 2,
    surface: 160,   // environ 80 m² par niveau, sur deux niveaux
    checkIn: "à partir de 17h00",
    checkOut: "avant 11h00"
  },

  description: [
    "Le gîte occupe les anciens communs du château de Montifaut, en pierre et en brique, rénovés. Le séjour est une grande pièce ouverte, avec un poêle à bois, de hautes baies vitrées sur les arbres et une table pour toute la famille.",
    "Il fait environ 160 m² sur deux niveaux. Le séjour et la cuisine, équipée comme pour un grand groupe, ouvrent sur la terrasse. Les quatre chambres sont à l'étage : trois avec un lit double, une avec quatre lits simples. Une salle de bain avec baignoire et double vasque, deux WC. Lit bébé, chaise haute et baignoire bébé sont disponibles sur demande.",
    "Dehors, une terrasse couverte de 20 places à table, un brasero, une plancha et des fauteuils sur la pelouse. Le jardin est partiellement clos et ouvert sur les bois. Table de ping-pong, pétanque, molki et terrain de tennis avec panier de basket sont sur le terrain du gîte, réservés aux clients. Un box du chenil accueille les chiens."
  ],

  rooms: [
    { title: "Séjour et salle à manger", text: "Grande pièce ouverte avec poêle à bois et climatisation réversible, télévision, canapés, grande table et baies vitrées. Jeux de société, table de poker, livres et bandes dessinées." },
    { title: "Cuisine", text: "Four traiteur à 5 feux, lave-vaisselle, deux grands réfrigérateurs avec congélateur, micro-ondes, appareil à raclette, air fryer, deux cafetières, grille-pain, bouilloire. Table pour 6 personnes, chauffage central." },
    { title: "Chambre à quatre lits", text: "4 lits simples, à l'étage, pour les enfants ou un groupe d'amis." },
    { title: "Chambres 2, 3 et 4", text: "Chacune avec 1 lit double, à l'étage." },
    { title: "Salle de bain et WC", text: "Une salle de bain avec baignoire et double vasque, et deux WC. Sèche-cheveux à disposition." }
  ],

  amenities: [
    "Wifi", "Télévision", "Poêle à bois (bois fourni)", "Climatisation réversible dans le séjour", "Chauffage central (cuisine et chambres)",
    "Arrivée autonome (boîte à clés)", "Grand parking", "Draps fournis", "Serviettes fournies",
    "Terrasse couverte de 20 places", "Brasero", "Plancha", "Four traiteur 5 feux", "Lave-vaisselle",
    "Deux réfrigérateurs-congélateurs", "Micro-ondes", "Air fryer", "Deux cafetières", "Grille-pain", "Bouilloire", "Appareil à raclette",
    "Sèche-cheveux", "Aspirateur", "Fer et table à repasser",
    "Terrain de tennis et panier de basket", "Table de ping-pong", "Pétanque et molki",
    "Jeux de société et table de poker", "Jeux d'enfants", "Livres et bandes dessinées",
    "Box pour chien (chenil), sur accord", "Lit bébé, chaise haute et baignoire bébé (sur demande)"
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
    defaultNightly: 250,        // toute l'année, sauf aux dates exceptionnelles plus bas
    minNights: 2,
    baseGuests: 4,              // personnes incluses dans le prix de base
    extraGuestPerNight: 15,     // supplément par personne et par nuit au-delà de baseGuests
    cleaningFee: 0,             // 0 : ménage inclus, aucune ligne dans le devis
    touristTaxPerPersonNight: 1.1, // taxe de séjour, adultes uniquement : fixée par votre commune
    depositPercent: 30,
    securityDeposit: 500,       // caution demandée avant l'arrivée
    balanceDue: "à l'arrivée",  // moment du paiement du solde         // acompte affiché dans le devis (0 pour ne pas l'afficher)

    // Coefficient appliqué à l'hébergement (nuits et voyageurs en plus) selon la durée du séjour.
    // coef 1.10 : +10 %, coef 0.90 : -10 %. "to" absent : sans limite. Séjour minimum : 2 nuits.
    durationCoefficients: [
      { from: 2, to: 2, coef: 1.10 },
      { from: 3, to: 4, coef: 1 },
      { from: 5, to: 6, coef: 0.95 },
      { from: 7, to: 13, coef: 0.90, label: "1 semaine" },
      { from: 14, to: 29, coef: 0.85, label: "2 semaines et plus" },
      { from: 30, coef: 0.80, label: "1 mois et plus" }
    ],

    // Pas de saisons : le tarif de base s'applique toute l'année, sauf aux dates exceptionnelles ci-dessous.
    // (Pour remettre une saison récurrente, ajoutez { name, from: "MM-JJ", to: "MM-JJ", nightly, minNights } ici.)
    seasons: [],

    // Jours fériés français : calculés automatiquement chaque année, il n'y a rien à renouveler.
    // Les nuits concernées sont celles du week-end ou du pont qui entoure le jour férié.
    // Noël (nuits des 24 et 25 décembre) et le nouvel an (nuits des 30 et 31 décembre) ont leur propre fenêtre.
    holidayPricing: {
      nightly: 300,             // autres ponts de jours fériés (1er mai, 8 mai, 14 juillet, 15 août, Toussaint, 11 novembre)
      minNights: 2,
      byName: {                 // prix particulier pour certains jours fériés
        "Noël": 350, "Jour de l'an": 350, "Lundi de Pâques": 300, "Ascension": 300, "Lundi de Pentecôte": 300
      }
    },

    // Autres dates exceptionnelles (événements locaux, vacances, etc.), en AAAA-MM-JJ.
    // "from" et "to" sont la première et la dernière NUIT concernées. Elles l'emportent sur les jours fériés.
    // Exemple : { name: "Fête du village", from: "2027-06-18", to: "2027-06-20", nightly: 300, minNights: 2 }
    specialDates: [],

    // Options ajoutées au devis. per : "stay" (par séjour) ou "night" (par nuit). max : quantité maximale.
    extras: [
      { id: "chien", label: "Chien (sur accord préalable, un seul box)", price: 10, per: "stay", max: 2, unit: "par chien et par séjour, après accord" },
      { id: "bebe", label: "Matériel bébé (lit, chaise haute, baignoire)", price: 0, per: "stay", max: 1, unit: "gratuit" },
      { id: "tard", label: "Départ tardif", price: null, per: "stay", max: 1, unit: "tarif sur demande" },
      { id: "tot", label: "Arrivée anticipée", price: null, per: "stay", max: 1, unit: "tarif sur demande" }
    ]
  },

  activities: [
    { title: "Tennis et basket", distance: "Sur place", text: "Terrain de tennis grillagé avec panier de basket et ballon, sur le terrain du gîte. Raquettes à disposition, réservé aux clients." },
    { title: "Ping-pong, pétanque et molki", distance: "Sur place", text: "Table de ping-pong avec raquettes, boules de pétanque et jeu de molki, sur le terrain du gîte, réservés aux clients." },
    { title: "Circuits de randonnée", distance: "Selles-Saint-Denis", text: "Deux circuits de randonnée, avec 18 km de sentiers." },
    { title: "Étang communal", distance: "Selles-Saint-Denis", text: "Pêche et observation de la nature autour de l'étang de la commune." },
    { title: "Fitness, city stade et boulodrome", distance: "Selles-Saint-Denis", text: "Aire de fitness en plein air, city stade pour les jeux de ballon et boulodrome." },
    { title: "Golf indoor", distance: "Selles-Saint-Denis", text: "Golf en salle au centre MB Centre." }
  ],

  visits: [
    { title: "Château de Chambord", distance: "Val de Loire", text: "Le plus grand des châteaux de la Loire, au cœur d'un parc forestier." },
    { title: "Château de Cheverny", distance: "Val de Loire", text: "Château encore meublé, avec son chenil et ses jardins." },
    { title: "Zoo de Beauval", distance: "50 min en voiture", text: "L'un des grands parcs animaliers d'Europe." },
    { title: "Blois et son château", distance: "Blois", text: "Ville d'histoire, château royal et centre ancien." },
    { title: "Château de La Ferté-Imbault", distance: "La Ferté-Imbault", text: "À voir lors d'une promenade en Sologne." },
    { title: "Circuit de karting", distance: "Salbris", text: "Circuit de karting à Salbris." },
    { title: "Concours hippiques et Game Fair", distance: "Lamotte-Beuvron", text: "Grands rendez-vous de la Sologne, à consulter selon les dates." },
    { title: "Sologne Shooting Club", distance: "Lamotte-Beuvron", text: "Le Sologne Shooting Club, à Lamotte-Beuvron." }
  ],

  shops: [
    { title: "Supermarchés", distance: "Salbris et Romorantin", text: "Grandes surfaces pour les courses du séjour." },
    { title: "Boulangeries", distance: "La Ferté-Imbault et Selles-Saint-Denis", text: "Les boulangeries du secteur." },
    { title: "Boucherie", distance: "Selles-Saint-Denis", text: "La boucherie du village." },
    { title: "Épiceries", distance: "Selles-Saint-Denis et La Ferté-Imbault", text: "Les épiceries du secteur." },
    { title: "Pharmacie", distance: "La Ferté-Imbault", text: "Pharmacie de La Ferté-Imbault." }
  ],

  restaurants: [
    { title: "Auberge du Cheval Blanc", distance: "Selles-Saint-Denis", text: "Notre adresse recommandée, au village." },
    { title: "Le Lion d'Or", distance: "Romorantin-Lanthenay", text: "Restaurant de Romorantin." },
    { title: "Domaine de Valaudran", distance: "Salbris", text: "Restaurant à Salbris." },
    { title: "Les Copains d'abord", distance: "Salbris", text: "Restaurant à Salbris." }
  ],

  rules: [
    { title: "Arrivée et départ", text: "Arrivée autonome avec une boîte à clés : le code vous est envoyé avant votre séjour. Arrivée à partir de 17h, y compris tard le soir. Départ avant 11h." },
    { title: "Capacité", text: "10 couchages (4 lits simples et 3 lits doubles). Un lit bébé est disponible sur demande, pas d'autre lit d'appoint pour l'instant. Toute personne supplémentaire doit être annoncée à la réservation." },
    { title: "Chiens", text: "Les chiens ne sont acceptés qu'avec notre accord préalable : le chenil n'a qu'un seul box, le nombre de chiens est donc limité. Le supplément figure dans le devis. Ils ne montent pas sur les lits ni sur les canapés." },
    { title: "Tabac", text: "Il est interdit de fumer à l'intérieur. Fumer est autorisé dehors." },
    { title: "Fêtes et invités", text: "Les anniversaires et les repas de famille sont possibles avec notre accord préalable. Les mariages et les soirées dansantes ne sont pas autorisés. Les invités extérieurs au séjour sont acceptés en petit nombre, avec notre accord." },
    { title: "Calme", text: "Merci de respecter le voisinage : pas de bruit après 22h." },
    { title: "Poêle à bois, brasero et plancha", text: "Le bois du poêle est fourni. Le poêle, le brasero et la plancha s'utilisent avec précaution et jamais sans surveillance, surtout avec des enfants." },
    { title: "Tennis, ping-pong, pétanque et molki", text: "Ces équipements sont sur le terrain du gîte et réservés aux clients. Raquettes et boules sont à disposition." },
    { title: "Ménage", text: "Le ménage de fin de séjour est compris dans le prix. Merci de laisser la vaisselle propre et de sortir les poubelles." },
    { title: "Tri des déchets", text: "Le verre se dépose dans la poubelle verte, près du chenil. Les ordures ménagères et les déchets recyclables vont dans les poubelles marron et jaunes, à l'entrée du chemin." },
    { title: "Dépôt de garantie", text: "Une caution de 500 € est demandée avant l'arrivée et restituée sous 7 jours, après vérification du gîte à votre départ." },
    { title: "Réservation et annulation", text: "Un acompte de 30 % confirme la réservation. Le solde est à régler à l'arrivée. L'annulation est gratuite jusqu'à 14 jours avant le séjour. Au-delà, l'acompte reste acquis." }
  ],

  // Questions fréquentes. Ajoutez, retirez ou reformulez librement.
  faq: [
    { group: "Avant de réserver", q: "Comment réserver ?", a: "Choisissez vos dates dans le calendrier : le devis se calcule tout de suite, avec les options. Répondez ensuite aux questions de la page suivante et envoyez votre demande. Nous répondons sous 48 heures. Un acompte de 30 % confirme la réservation, et le solde se règle à l'arrivée." },
    { group: "Avant de réserver", q: "Quel est le séjour minimum ?", a: "Deux nuits, toute l'année. Il n'y a pas de jour d'arrivée imposé." },
    { group: "Avant de réserver", q: "Combien de personnes minimum et maximum ?", a: "Le tarif de base couvre 4 personnes, facturées même si vous êtes moins nombreux. Au-delà, 15 € par personne et par nuit s'ajoutent. Le gîte accueille 10 personnes au maximum." },
    { group: "Avant de réserver", q: "Que comprend le prix ?", a: "Les prix sont TTC. Ils comprennent les draps, les serviettes, le bois du poêle et le ménage de fin de séjour. La taxe de séjour (1,10 € par adulte et par nuit) et les options s'ajoutent." },
    { group: "Avant de réserver", q: "Y a-t-il des réductions pour les longs séjours ?", a: "Oui : 5 % de moins pour 5 à 6 nuits, 10 % pour 7 à 13 nuits, 15 % à partir de 14 nuits et 20 % à partir de 30 nuits. Un séjour de 2 nuits est majoré de 10 %." },
    { group: "Avant de réserver", q: "Comment payer ?", a: "Un acompte de 30 % à la réservation, puis le solde à l'arrivée. Nous acceptons le virement, le chèque, les espèces (dans la limite légale de 1 000 €) et les chèques-vacances ANCV." },
    { group: "Avant de réserver", q: "Quelles sont les conditions d'annulation ?", a: "L'annulation est gratuite jusqu'à 14 jours avant votre arrivée. Au-delà, l'acompte reste acquis." },
    { group: "Avant de réserver", q: "Une caution est-elle demandée ?", a: "Oui, une caution de 500 € est demandée avant l'arrivée. Elle vous est rendue sous 7 jours après la vérification du gîte à votre départ." },
    { group: "Avant de réserver", q: "Comment vous joindre, et en quelles langues ?", a: "Par téléphone ou WhatsApp au 06 48 48 11 13, ou par mail. Nous répondons sous 48 heures et nous parlons français, anglais et allemand." },
    { group: "Le logement", q: "Combien de personnes peut-on loger ?", a: "Dix personnes : une chambre avec quatre lits simples et trois chambres avec un lit double. Un lit bébé est disponible sur demande, avec une chaise haute et une baignoire bébé. Nous n'avons pas d'autre lit d'appoint pour l'instant." },
    { group: "Le logement", q: "Comment la cuisine est-elle équipée ?", a: "Four traiteur à 5 feux, lave-vaisselle, deux grands réfrigérateurs avec congélateur, micro-ondes, appareil à raclette, air fryer, deux cafetières, grille-pain et bouilloire. Une table pour 6 personnes est dans la cuisine. Dehors, une plancha et un brasero." },
    { group: "Le logement", q: "Les draps et les serviettes sont-ils fournis ?", a: "Oui, les draps et les serviettes sont fournis et compris dans le prix." },
    { group: "Le logement", q: "Le ménage est-il compris ?", a: "Oui, le ménage de fin de séjour est compris dans le prix : aucun frais de ménage n'est ajouté. Merci de laisser la vaisselle propre et de sortir les poubelles." },
    { group: "Le logement", q: "Y a-t-il le wifi et la télévision ?", a: "Oui, le gîte a le wifi (connexion ADSL ou 4G) et une télévision." },
    { group: "Le logement", q: "Comment le gîte est-il chauffé et rafraîchi ?", a: "Le séjour a un poêle à bois (bois fourni) et une climatisation réversible, qui chauffe en hiver et rafraîchit en été. La cuisine et les chambres ont un chauffage central." },
    { group: "Le logement", q: "Y a-t-il un lave-linge ?", a: "Non, le gîte n'a ni lave-linge ni sèche-linge. Un fer et une table à repasser sont à disposition." },
    { group: "Le logement", q: "Que prévoyez-vous pour les bébés ?", a: "Un lit bébé, une chaise haute et une baignoire bébé sont disponibles sur demande, sans supplément." },
    { group: "Le logement", q: "Le gîte est-il accessible aux personnes à mobilité réduite ?", a: "Non, les chambres sont à l'étage et le gîte n'est pas adapté aux personnes à mobilité réduite." },
    { group: "Le logement", q: "Peut-on fumer ?", a: "Fumer est interdit à l'intérieur et autorisé dehors." },
    { group: "Le logement", q: "Le jardin est-il clos ?", a: "Il est partiellement clos et ouvert sur les bois. Les jeunes enfants restent sous votre surveillance." },
    { group: "Le séjour", q: "Comment se passe l'arrivée ?", a: "L'arrivée est autonome : une boîte à clés vous attend, et son code vous est envoyé avant votre séjour. Vous pouvez arriver à partir de 17h. Le départ se fait avant 11h." },
    { group: "Le séjour", q: "Peut-on arriver tard le soir ?", a: "Oui, c'est toujours possible grâce à la boîte à clés. Indiquez votre heure d'arrivée prévue lors de la réservation." },
    { group: "Le séjour", q: "Peut-on arriver plus tôt ou partir plus tard ?", a: "Sur demande, avec notre accord. Le tarif est convenu avec vous au moment de la demande." },
    { group: "Le séjour", q: "Où se garer ?", a: "Il y a un grand parking sur place." },
    { group: "Le séjour", q: "Quels jeux et loisirs sont à disposition ?", a: "Sur le terrain du gîte : un terrain de tennis avec raquettes, un panier de basket avec ballon, une table de ping-pong avec raquettes, des boules de pétanque et un jeu de molki. Ils sont réservés à nos clients, sans réservation. Dans la maison : jeux de société, table de poker, jeux d'enfants, livres et bandes dessinées." },
    { group: "Le séjour", q: "Peut-on venir avec un chien ?", a: "Seulement avec notre accord préalable : le chenil n'a qu'un seul box, le nombre de chiens est donc limité. Le supplément s'ajoute au devis. Les chiens ne montent pas sur les lits ni sur les canapés." },
    { group: "Le séjour", q: "Peut-on organiser un anniversaire ou un repas de famille ?", a: "Oui, avec notre accord préalable. Les invités extérieurs sont acceptés en petit nombre. Les mariages et les soirées dansantes ne sont pas autorisés. Merci de respecter le voisinage après 22h." },
    { group: "Le séjour", q: "Accueillez-vous des chasseurs ?", a: "Oui, le gîte est un relais de chasse : les chasseurs et leurs week-ends de chasse sont les bienvenus. Nous n'organisons pas de chasse nous-mêmes." },
    { group: "Le séjour", q: "Comment fonctionnent le poêle, le brasero et la plancha ?", a: "Le bois du poêle est fourni. Le poêle, le brasero et la plancha s'utilisent avec précaution et jamais sans surveillance, surtout avec des enfants." },
    { group: "Le séjour", q: "Où jeter les déchets ?", a: "Le verre va dans la poubelle verte, près du chenil. Les ordures ménagères et les déchets recyclables vont dans les poubelles marron et jaunes, à l'entrée du chemin." },
    { group: "Alentours", q: "Comment venir ?", a: "Le gîte est à 15 minutes en voiture de la sortie de Salbris sur l'A71, et à 15 minutes de celle de Romorantin-Lanthenay sur l'A85. La gare de Selles-Saint-Denis est à 3,5 km." },
    { group: "Alentours", q: "Où faire ses courses ?", a: "Les supermarchés sont à Salbris et à Romorantin-Lanthenay. Les boulangeries sont à La Ferté-Imbault et à Selles-Saint-Denis, la boucherie à Selles-Saint-Denis, les épiceries à Selles-Saint-Denis et à La Ferté-Imbault. La pharmacie est à La Ferté-Imbault." },
    { group: "Alentours", q: "Où manger ?", a: "Nous recommandons l'Auberge du Cheval Blanc à Selles-Saint-Denis, Le Lion d'Or à Romorantin-Lanthenay, le Domaine de Valaudran et Les Copains d'abord à Salbris." },
    { group: "Alentours", q: "Que visiter ?", a: "Les châteaux de Chambord, de Cheverny, de Blois et de La Ferté-Imbault, et le zoo de Beauval à 50 minutes en voiture. À Salbris, un circuit de karting. À Lamotte-Beuvron, les concours hippiques, le Game Fair et le Sologne Shooting Club." },
    { group: "Alentours", q: "Que faire à pied ou près de l'eau ?", a: "À Selles-Saint-Denis : deux circuits de randonnée avec 18 km de sentiers, l'étang communal pour la pêche et l'observation de la nature, une aire de fitness en plein air, un city stade et un boulodrome." }
  ]
};
