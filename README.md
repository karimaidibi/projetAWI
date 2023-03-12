# Projet AWI

  - Projet AWI : Gestion bénévoles pour le Festival du Jeu
  - Application en ligne ici : https://festivalappkm.onrender.com (version gratuite donc ça prend un peu du temps à charger l'api)

# Prérequis

  - Angular CLI, version utilisée : 14.2.10
  - Node, version utilisée : 16.17.0
  - Package Manager npm, version utilisée :  9.1.3

# Installation
  - Clonez le projet depuis Github : git clone https://github.com/karimaidibi/projetAWI
  - Installez les dépendances du front-end : cd front-end && npm install
  - Installez les dépendances du back-end : cd back-end && npm install

# Utilisation

  - Pour lancer le serveur de développement du front-end : cd front-end && ng serve
  - Pour lancer le serveur de développement du back-end : cd back-end && npm start

# Fonctionnalités

## Droit de Modification

  - Cette application possède un seul compte admin qui permet d'accéder aux droits de gestion (création, mise à jour, et suppression des données).
  - Afin de vous connecter, utiliser le mail et le password suivants : 
  - Email : admin@gmail.com
  - Password : admin
  
## Cas d'utilisation principaux : 

  - Bénévoles : CRUD (prénom, nom, email)
  - Jeux : CRUD (nom, type : enfant, famille, ambiance, initié, expert)
  - Affectation de jeux à une zone
  - Affectation de bénévoles à une zone durant un créneau,
    plusieurs bénévoles peuvent être affectés à une zone durant le
    même créneau
  - Liste des jeux (par nom, par type, par zone)
  - Liste des bénévoles par créneau pour une zone donnée
  - Liste des bénévoles par zone pour un créneau donné

# Auteurs

  Karim AIDIBI & Marwane TOURY - IG4 Polytech Montpellier