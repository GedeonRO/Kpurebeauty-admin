# K-Pure Admin Dashboard

Dashboard d'administration pour la plateforme e-commerce K-Pure (Korean Beauty).

## 🚀 Fonctionnalités

### ✅ Implémenté
- **Authentification Admin** - Système de connexion sécurisé avec JWT
- **Dashboard Analytics** - Vue d'ensemble avec statistiques en temps réel:
  - Revenus (jour/semaine/mois) avec croissance
  - Nombre de commandes avec tendances
  - Nombre total de clients
  - Valeur moyenne des commandes
  - Commandes récentes
  - Alerte de stock faible

- **Backend API Complet**:
  - Analytics (statistiques, revenus, produits populaires)
  - Gestion produits (CRUD + gestion stock)
  - Gestion commandes (statuts, paiement, tracking)
  - Gestion clients (liste, stats, actions)
  - Gestion catégories (CRUD)
  - Gestion reviews (approbation/rejet, modération)
  - Gestion promotions (CRUD)

### 🔜 À Développer
Les routes sont prêtes, il reste à créer les interfaces:
- Pages de gestion des **Commandes**
- Pages de gestion des **Produits**
- Pages de gestion des **Clients**
- Pages de gestion des **Catégories**
- Pages de gestion des **Reviews**
- Pages de gestion des **Promotions**

## 📦 Technologies

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v7
- **Icons**: Iconsax React
- **Charts**: Recharts
- **HTTP Client**: Axios

## 🛠️ Installation

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Configurez votre .env avec MongoDB et JWT_SECRET
npm run dev
```

### 2. Dashboard Admin
```bash
cd admin-dashboard
npm install
npm run dev
```

Le dashboard sera accessible sur `http://localhost:5173`

## 🔐 Connexion Admin

Pour vous connecter au dashboard, vous devez créer un utilisateur avec le rôle `admin` dans votre base MongoDB:

```javascript
// Dans MongoDB ou via une route d'inscription
{
  email: "admin@kpure.com",
  password: "hashed_password",
  name: "Admin K-Pure",
  role: "admin"  // Important!
}
```

## 📁 Structure du Projet

```
admin-dashboard/
├── src/
│   ├── app/
│   │   ├── api/           # Services API (auth, analytics, products, etc.)
│   │   ├── hooks/         # Custom hooks (useAuth)
│   │   └── pages/         # Pages de l'application
│   ├── components/
│   │   ├── forms/         # Composants de formulaire (Input, Select, etc.)
│   │   ├── layout/        # Layout (Sidebar, Header)
│   │   └── ui/            # Composants UI réutilisables
│   ├── lib/
│   │   └── utils/         # Utilitaires (formatters, cn)
│   ├── types/             # Types TypeScript
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## 🎨 Composants UI Disponibles

- `Button` - Bouton avec variants (primary, secondary, success, danger, outline, ghost)
- `Card` - Carte avec Header, Content, Footer
- `Badge` - Badge coloré pour statuts
- `Input` - Champ de saisie avec label et erreur
- `Textarea` - Zone de texte
- `Select` - Menu déroulant
- `Table` - Tableau avec Head, Body, Row, Header, Cell
- `StatCard` - Carte de statistique avec icône et tendance
- `Pagination` - Pagination avec numéros de page
- `Loading` - Indicateur de chargement

## 🔌 API Backend

Toutes les routes API sont documentées et fonctionnelles:

### Analytics
- `GET /api/analytics/overview?period=month`
- `GET /api/analytics/revenue?period=month`
- `GET /api/analytics/popular-products?period=month&limit=10`
- `GET /api/analytics/recent-orders?limit=10`
- `GET /api/analytics/low-stock`

### Produits
- `GET /api/products` - Liste avec pagination/filtres
- `GET /api/products/:id`
- `POST /api/products` - Créer
- `PUT /api/products/:id` - Modifier
- `DELETE /api/products/:id`
- `PATCH /api/products/:id/stock` - Gérer stock

### Commandes
- `GET /api/orders` - Liste avec filtres
- `GET /api/orders/:id`
- `PATCH /api/orders/:id/status`
- `PATCH /api/orders/:id/payment-status`
- `PATCH /api/orders/:id/tracking`
- `POST /api/orders/:id/cancel`

### Users (Admin uniquement)
- `GET /api/users` - Liste avec filtres
- `GET /api/users/:id`
- `GET /api/users/:id/stats`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/toggle-status`
- `DELETE /api/users/:id`

### Reviews (Admin)
- `GET /api/reviews/admin/all` - Toutes les reviews
- `GET /api/reviews/admin/pending` - En attente
- `POST /api/reviews/:id/approve`
- `POST /api/reviews/:id/reject`
- `DELETE /api/reviews/:id`

### Catégories
- `GET /api/categories`
- `GET /api/categories/:id`
- `POST /api/categories`
- `PUT /api/categories/:id`
- `DELETE /api/categories/:id`

### Promotions
- `GET /api/promotions`
- `GET /api/promotions/:id`
- `POST /api/promotions`
- `PUT /api/promotions/:id`
- `DELETE /api/promotions/:id`
- `PATCH /api/promotions/:id/toggle`

## 🔒 Sécurité

- Authentification JWT obligatoire
- Middleware `requireAdmin` sur toutes les routes admin
- Vérification du rôle utilisateur
- Protection CORS configurée

## 📝 Variables d'Environnement

### Backend (.env)
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
OPENAI_API_KEY=your_openai_key (pour le chat)
```

### Dashboard (.env.development)
```env
VITE_API_URL=http://localhost:5000/api
```

## 🚀 Prochaines Étapes

1. Créer les pages de gestion (Produits, Commandes, etc.)
2. Ajouter upload d'images pour les produits
3. Implémenter les graphiques de revenus (Recharts)
4. Ajouter filtres avancés et recherche
5. Notifications en temps réel
6. Export de données (CSV/Excel)

## 📄 Licence

MIT
