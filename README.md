# StudyHub - Plateforme de Révision Médicale

Une plateforme web moderne et intelligente pour les étudiants en médecine, permettant de transformer automatiquement des cours PDF en QCM, flashcards et résumés grâce à l'IA locale.

## 🚀 Fonctionnalités

### 📚 Gestion des cours
- **Import PDF** : Glisser-déposer ou sélection de fichiers PDF
- **Traitement automatique** : Extraction du texte et génération de contenu IA
- **Organisation** : Classement par matière avec tags et recherche
- **Édition manuelle** : Possibilité de modifier les QCM et flashcards générés

### 🧠 Intelligence Artificielle Locale
- **Génération automatique** :
  - 10 QCM uniques par document
  - 15 flashcards question/réponse
  - Résumé synthétique (300 mots max)
  - Glossaire des termes importants
  - Plan structuré du cours
- **Prompts configurables** : Profils de génération personnalisables
- **Assistant conversationnel** : IA intégrée pour répondre aux questions

### 🎯 Outils d'apprentissage
- **QCM interactifs** : Feedback immédiat, explications, statistiques
- **Flashcards** : Navigation fluide, système de révision espacée
- **Résumés** : Lecture audio, export PDF
- **Glossaire** : Recherche et navigation contextuelle

### 🏆 Gamification
- **Système de points** : Récompenses pour les bonnes réponses
- **Statistiques détaillées** : Progression, temps d'étude, performances
- **Objectifs personnalisés** : Défis quotidiens et hebdomadaires
- **Badges et achievements** : Motivation et engagement

### ⚙️ Fonctionnalités avancées
- **Mode hors-ligne** : Fonctionnement complet sans connexion
- **Thèmes multiples** : Clair, sombre, focus, examen
- **Accessibilité** : Navigation clavier, tailles de police ajustables
- **Sauvegarde locale** : Export/import des données
- **Mode invité** : Test sans inscription

## 🛠️ Technologies utilisées

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et le développement
- **Tailwind CSS** pour le styling
- **Framer Motion** pour les animations
- **React Router** pour la navigation
- **Lucide React** pour les icônes

### Backend & Stockage
- **IndexedDB** (via Dexie.js) pour la base de données locale
- **LocalStorage** pour les préférences utilisateur
- **pdfjs-dist** pour le traitement des PDF

### Sécurité & Authentification
- **bcryptjs** pour le hachage des mots de passe
- **Authentification locale** sans serveur externe

### IA & Traitement
- **Service IA simulé** (prêt pour intégration LLaMA.cpp)
- **Prompts configurables** en JSON
- **Traitement asynchrone** avec feedback en temps réel

## 📦 Installation

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation locale

```bash
# Cloner le repository
git clone https://github.com/votre-username/medical-study-platform.git
cd medical-study-platform

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Ouvrir http://localhost:5173
```

### Build pour production

```bash
# Construire l'application
npm run build

# Prévisualiser le build
npm run preview
```

## 🚀 Déploiement

### Netlify (recommandé)

1. Connectez votre repository GitHub à Netlify
2. Configurez les paramètres de build :
   - **Build command** : `npm run build`
   - **Publish directory** : `dist`
3. Déployez !

### GitHub Pages

```bash
# Ajouter le script de déploiement dans package.json
npm run build
npm run deploy
```

### Vercel

1. Importez votre projet sur Vercel
2. Les paramètres par défaut fonctionnent automatiquement
3. Déployez !

## 🏗️ Architecture

```
src/
├── components/          # Composants React réutilisables
│   ├── layout/         # Header, Sidebar, Navigation
│   └── ui/             # Composants UI de base
├── contexts/           # Contextes React (Auth, Theme)
├── lib/                # Services et utilitaires
│   ├── auth.ts         # Service d'authentification
│   ├── database.ts     # Configuration IndexedDB
│   ├── pdfProcessor.ts # Traitement des PDF
│   └── aiService.ts    # Service IA (simulé)
├── pages/              # Pages principales
├── types/              # Types TypeScript
└── App.tsx             # Composant racine
```

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
VITE_APP_NAME=StudyHub
VITE_APP_VERSION=1.0.0
VITE_MAX_FILE_SIZE=52428800
```

### Configuration Tailwind

Le fichier `tailwind.config.js` contient :
- Thèmes personnalisés (clair, sombre, focus, examen)
- Animations CSS personnalisées
- Composants utilitaires

## 📱 Fonctionnalités PWA (à venir)

- Installation sur l'écran d'accueil
- Notifications push
- Synchronisation hors-ligne
- Cache intelligent

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

- **Documentation** : [Wiki du projet](https://github.com/votre-username/medical-study-platform/wiki)
- **Issues** : [GitHub Issues](https://github.com/votre-username/medical-study-platform/issues)
- **Discussions** : [GitHub Discussions](https://github.com/votre-username/medical-study-platform/discussions)

## 🗺️ Roadmap

### Version 1.1
- [ ] Intégration LLaMA.cpp pour l'IA locale
- [ ] Mode PWA complet
- [ ] Synchronisation cloud optionnelle
- [ ] Export vers Anki

### Version 1.2
- [ ] Mode collaboratif
- [ ] Chat entre utilisateurs
- [ ] Notifications avancées
- [ ] API REST pour extensions

### Version 2.0
- [ ] Support multi-langues
- [ ] IA conversationnelle avancée
- [ ] Intégration avec LMS
- [ ] Analytics détaillés

## 🙏 Remerciements

- [React](https://reactjs.org/) pour le framework
- [Tailwind CSS](https://tailwindcss.com/) pour le styling
- [Framer Motion](https://www.framer.com/motion/) pour les animations
- [Dexie.js](https://dexie.org/) pour IndexedDB
- [pdfjs-dist](https://mozilla.github.io/pdf.js/) pour le traitement PDF

---

**StudyHub** - Transformez vos cours en révisions intelligentes ! 🧠📚