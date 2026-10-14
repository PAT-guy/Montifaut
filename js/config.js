/*
 * TOUT LE CONTENU DU SITE SE MODIFIE ICI.
 * Les textes, photos, prix, règlement et coordonnées ci-dessous sont des exemples.
 */
window.GITE_CONFIG = {
  name: "Gîte de Montifaut",
  tagline: "Une maison de campagne en pierre, au calme, pour 6 personnes",
  heroImage: "images/facade.svg",

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
    access: "À 5 minutes du village et de ses commerces. Parking privé devant la maison. Gare la plus proche à 20 km."
  },

  stay: {
    capacity: 6,
    bedrooms: 3,
    beds: 4,
    bathrooms: 2,
    surface: 110,
    checkIn: "16h00 à 19h00",
    checkOut: "avant 10h00"
  },

  description: [
    "Entièrement rénovée, cette ancienne ferme en pierre allie le charme de l'ancien et le confort moderne. Les poutres apparentes, la grande cheminée et les larges fenêtres donnent au séjour une atmosphère chaleureuse en toute saison.",
    "Au rez-de-chaussée, le salon de 35 m² ouvre sur une cuisine entièrement équipée et sur la terrasse. À l'étage, trois chambres lumineuses et deux salles d'eau accueillent jusqu'à six personnes.",
    "Dehors, un jardin clos de 2 000 m² avec terrasse couverte, barbecue et salon de jardin. Les enfants peuvent y jouer en sécurité, et le calme est total le soir."
  ],

  rooms: [
    { title: "Salon et salle à manger", text: "Cheminée avec insert, canapé convertible, télévision, jeux de société." },
    { title: "Cuisine", text: "Lave-vaisselle, four, plaques à induction, cafetière, bouilloire, grille-pain, raclette." },
    { title: "Chambre parentale", text: "1 lit double 160 cm, dressing, accès à la salle de bain privée." },
    { title: "Chambre 2", text: "1 lit double 140 cm, vue sur le jardin." },
    { title: "Chambre 3", text: "2 lits simples 90 cm, adaptée aux enfants. Lit bébé et chaise haute sur demande." },
    { title: "Salles d'eau", text: "Une salle de bain avec baignoire, une salle d'eau avec douche italienne. Deux WC." }
  ],

  amenities: [
    "Wifi fibre", "Lave-linge", "Chauffage central", "Cheminée", "Terrasse couverte",
    "Barbecue", "Jardin clos", "Parking privé", "Linge de lit fourni", "Linge de toilette fourni",
    "Lit bébé sur demande", "Animaux acceptés sur demande"
  ],

  photos: [
    { src: "images/facade.svg", alt: "Façade du gîte" },
    { src: "images/salon.svg", alt: "Le salon" },
    { src: "images/cuisine.svg", alt: "La cuisine" },
    { src: "images/chambre1.svg", alt: "La chambre parentale" },
    { src: "images/chambre2.svg", alt: "La chambre des enfants" },
    { src: "images/jardin.svg", alt: "Le jardin et la terrasse" }
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
    { title: "Capacité", text: "6 personnes maximum, bébés compris. Toute personne supplémentaire doit être annoncée à la réservation." },
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
