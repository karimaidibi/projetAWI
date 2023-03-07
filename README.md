# Projet AWI

  - Projet AWI : Gestion bénévoles pour le Festival du Jeu

# Prérequis

  - Angular CLI: V14.2.10 au moins
  - Node: V16.17.0 au moins
  - Package Manager: npm V9.1.3 au moins

# Installation
  - Clonez le projet depuis Github : git clone https://github.com/nom_du_projet.git
  - Installez les dépendances du front-end : cd frontend && npm install
  - Installez les dépendances du back-end : cd backend && npm install

# Utilisation

  - Pour lancer le serveur de développement du front-end : cd frontend && ng serve
  - Pour lancer le serveur de développement du back-end : cd backend && npm start

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