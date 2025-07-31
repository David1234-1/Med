# QCM Médecine 1

Application web de révision médicale avec IA locale pour étudiants en 1ère année de médecine.

## 🚀 Fonctionnalités

### 📚 Import et analyse de cours
- Import de fichiers PDF
- Extraction automatique du contenu texte
- Attribution de matières aux cours
- Génération automatique de QCM, flashcards et résumés par IA locale

### 🧠 Assistant IA intégré
- Chat contextuel basé sur les cours importés
- Réponses générées localement (aucune API externe)
- Historique des conversations stocké localement

### 📖 Révision interactive
- QCM avec questions à choix multiples
- Flashcards avec système de retournement
- Suivi des scores et temps de révision
- Statistiques de progression

### 🎮 Gamification
- Système de points par bonne réponse
- Suivi du temps total d'étude
- Objectifs journaliers
- Badges et succès à débloquer

### 🔐 Authentification locale
- Inscription/connexion avec données locales
- Mode invité disponible
- Aucune donnée envoyée vers des serveurs externes

## 🛠️ Stack technique

- **Frontend** : React + TypeScript + Vite
- **UI** : TailwindCSS + Framer Motion
- **Parsing PDF** : pdfjs-dist (simulation)
- **IA locale** : Modèles quantisés via WebAssembly (simulation)
- **Stockage** : localStorage + IndexedDB
- **PWA** : Manifest + Service Worker

## 📦 Installation et déploiement

### Déploiement sur Netlify

1. Téléchargez le fichier `QCM Médecine 1.zip`
2. Rendez-vous sur [Netlify](https://netlify.com)
3. Glissez-déposez le fichier ZIP dans la zone de déploiement
4. Votre site sera automatiquement déployé et accessible

### Structure du ZIP

```
QCM Médecine 1.zip
├── index.html
├── _redirects
├── manifest.json
├── assets/
└── ...
```

## 🔧 Configuration

### Modifier les prompts IA

Pour personnaliser les réponses de l'IA, modifiez les fonctions dans :
- `src/pages/Import.tsx` : Génération de QCM et flashcards
- `src/pages/Assistant.tsx` : Réponses du chat

### Ajouter des modèles IA

1. Intégrez un modèle quantisé (LLaMA.cpp, Phi-2) via WebAssembly
2. Remplacez les fonctions de simulation par de vraies inférences
3. Ajustez les prompts selon le modèle choisi

## 🔒 Sécurité et confidentialité

- **100% local** : Aucune donnée n'est envoyée vers des serveurs externes
- **Chiffrement** : Mots de passe hashés avec SHA-256
- **Stockage** : Données stockées dans le navigateur uniquement
- **PWA** : Fonctionne hors-ligne après le premier chargement

## 📱 Compatibilité

- ✅ Navigateurs modernes (Chrome, Firefox, Safari, Edge)
- ✅ Responsive (mobile, tablette, desktop)
- ✅ Mode sombre/clair
- ✅ Accessibilité (clavier, contraste)

## 🎯 Utilisation

1. **Import** : Uploadez vos cours PDF et attribuez une matière
2. **Génération** : L'IA crée automatiquement QCM, flashcards et résumés
3. **Révision** : Entraînez-vous avec les QCM et flashcards générés
4. **Assistant** : Posez des questions à l'IA sur vos cours
5. **Suivi** : Consultez vos statistiques et progression

## 📊 Statistiques

L'application suit automatiquement :
- Nombre de cours importés
- Sessions d'étude complétées
- Scores moyens
- Temps total de révision

## 🔄 Mise à jour

Pour mettre à jour l'application :
1. Téléchargez la nouvelle version du ZIP
2. Redéployez sur Netlify
3. Les données locales sont conservées

## 📞 Support

Pour toute question ou problème :
- Vérifiez que votre navigateur est à jour
- Activez JavaScript
- Consultez les outils de développement pour les erreurs

---

**Note** : Cette version utilise des simulations pour l'IA et l'extraction PDF. Pour une version complète, intégrez de vrais modèles IA et la bibliothèque pdfjs-dist.