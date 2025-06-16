# 🧠 MindCheck - Backend

## 📦 Technologies utilisées
- Node.js
- Express.js
- MongoDB avec Mongoose
- JWT pour l'authentification

---

## 🚀 Lancer le backend en local
```
npm install
node server.js
```
---
## 📬 Endpoints principaux

### 🔐 Authentification
- `POST /api/auth/register`
- `POST /api/auth/login`

### 😊 Mood Log
- `POST /api/moods` : créer ou mettre à jour une humeur
- `GET /api/moods` : récupérer les humeurs par date ou mois
- `PUT /api/moods/:id` : mettre à jour une humeur
- `DELETE /api/moods/:id` : supprimer une humeur

---
