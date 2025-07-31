import Dexie, { Table } from 'dexie';
import {
  User,
  Course,
  Document,
  QCM,
  Flashcard,
  StudySession,
  ChatSession,
  Goal,
  Achievement,
  Notification,
  AIPrompt,
  UserStats,
  AppSettings
} from '../types';

export class MedicalStudyDatabase extends Dexie {
  // Tables
  users!: Table<User>;
  courses!: Table<Course>;
  documents!: Table<Document>;
  qcm!: Table<QCM>;
  flashcards!: Table<Flashcard>;
  studySessions!: Table<StudySession>;
  chatSessions!: Table<ChatSession>;
  goals!: Table<Goal>;
  achievements!: Table<Achievement>;
  notifications!: Table<Notification>;
  aiPrompts!: Table<AIPrompt>;
  userStats!: Table<UserStats>;
  settings!: Table<AppSettings>;

  constructor() {
    super('MedicalStudyDatabase');
    
    this.version(1).stores({
      users: 'id, email, username',
      courses: 'id, subject, createdAt',
      documents: 'id, courseId, status, uploadedAt',
      qcm: 'id, documentId, difficulty, createdAt',
      flashcards: 'id, documentId, createdAt',
      studySessions: 'id, userId, type, startTime',
      chatSessions: 'id, userId, createdAt',
      goals: 'id, userId, type, completed',
      achievements: 'id, unlockedAt',
      notifications: 'id, userId, read, createdAt',
      aiPrompts: 'id, category, isDefault',
      userStats: 'userId',
      settings: 'id'
    });

    // Indexes pour améliorer les performances
    this.version(2).stores({
      courses: 'id, subject, createdAt, updatedAt',
      documents: 'id, courseId, status, uploadedAt, processedAt',
      qcm: 'id, documentId, difficulty, createdAt, tags',
      flashcards: 'id, documentId, createdAt, lastReviewed',
      studySessions: 'id, userId, type, startTime, courseId',
    });
  }
}

export const db = new MedicalStudyDatabase();

// Fonctions utilitaires pour la base de données
export const databaseUtils = {
  // Initialisation de la base de données avec des données par défaut
  async initializeDatabase() {
    try {
      // Vérifier si la base de données est déjà initialisée
      const settingsCount = await db.settings.count();
      if (settingsCount > 0) return;

      // Créer les paramètres par défaut
      await db.settings.add({
        id: 'app-settings',
        aiModel: 'llama-2-7b',
        processingTimeout: 300000, // 5 minutes
        maxFileSize: 50 * 1024 * 1024, // 50MB
        allowedFileTypes: ['.pdf'],
        autoBackup: true,
        backupInterval: 24 * 60 * 60 * 1000 // 24 heures
      });

      // Créer les prompts IA par défaut
      await this.createDefaultPrompts();

      console.log('Base de données initialisée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la base de données:', error);
    }
  },

  // Créer les prompts IA par défaut
  async createDefaultPrompts() {
    const defaultPrompts: AIPrompt[] = [
      {
        id: 'qcm-synthetic',
        name: 'QCM Synthétique',
        description: 'Génère des QCM concis et directs',
        category: 'qcm',
        prompt: `Génère 10 QCM basés sur le contenu suivant. Chaque question doit avoir 4 options avec une seule bonne réponse. Format JSON:
        {
          "questions": [
            {
              "question": "Question text",
              "options": ["A", "B", "C", "D"],
              "correctAnswer": "A",
              "explanation": "Explication courte"
            }
          ]
        }
        
        Contenu: {content}`,
        variables: [
          {
            name: 'content',
            description: 'Contenu du document',
            defaultValue: '',
            required: true
          }
        ],
        isDefault: true
      },
      {
        id: 'flashcard-basic',
        name: 'Flashcards Basiques',
        description: 'Génère des flashcards question/réponse simples',
        category: 'flashcard',
        prompt: `Crée 15 flashcards basées sur le contenu suivant. Format JSON:
        {
          "flashcards": [
            {
              "question": "Question claire et concise",
              "answer": "Réponse précise"
            }
          ]
        }
        
        Contenu: {content}`,
        variables: [
          {
            name: 'content',
            description: 'Contenu du document',
            defaultValue: '',
            required: true
          }
        ],
        isDefault: true
      },
      {
        id: 'summary-concise',
        name: 'Résumé Concis',
        description: 'Génère un résumé de 300 mots maximum',
        category: 'summary',
        prompt: `Résume le contenu suivant en maximum 300 mots, en gardant les points essentiels et la structure logique:
        
        {content}`,
        variables: [
          {
            name: 'content',
            description: 'Contenu du document',
            defaultValue: '',
            required: true
          }
        ],
        isDefault: true
      },
      {
        id: 'glossary-medical',
        name: 'Glossaire Médical',
        description: 'Extrait les termes médicaux importants',
        category: 'glossary',
        prompt: `Extrais 10 termes médicaux importants du contenu suivant avec leurs définitions. Format JSON:
        {
          "terms": [
            {
              "term": "Terme médical",
              "definition": "Définition claire et précise"
            }
          ]
        }
        
        Contenu: {content}`,
        variables: [
          {
            name: 'content',
            description: 'Contenu du document',
            defaultValue: '',
            required: true
          }
        ],
        isDefault: true
      }
    ];

    for (const prompt of defaultPrompts) {
      await db.aiPrompts.add(prompt);
    }
  },

  // Sauvegarde de la base de données
  async exportDatabase(): Promise<string> {
    const data = {
      users: await db.users.toArray(),
      courses: await db.courses.toArray(),
      documents: await db.documents.toArray(),
      qcm: await db.qcm.toArray(),
      flashcards: await db.flashcards.toArray(),
      studySessions: await db.studySessions.toArray(),
      chatSessions: await db.chatSessions.toArray(),
      goals: await db.goals.toArray(),
      achievements: await db.achievements.toArray(),
      notifications: await db.notifications.toArray(),
      userStats: await db.userStats.toArray(),
      settings: await db.settings.toArray(),
      exportDate: new Date().toISOString()
    };

    return JSON.stringify(data, null, 2);
  },

  // Restauration de la base de données
  async importDatabase(jsonData: string): Promise<void> {
    try {
      const data = JSON.parse(jsonData);
      
      // Vider la base de données existante
      await db.transaction('rw', db.tables, async () => {
        await db.users.clear();
        await db.courses.clear();
        await db.documents.clear();
        await db.qcm.clear();
        await db.flashcards.clear();
        await db.studySessions.clear();
        await db.chatSessions.clear();
        await db.goals.clear();
        await db.achievements.clear();
        await db.notifications.clear();
        await db.userStats.clear();
        await db.settings.clear();

        // Importer les nouvelles données
        if (data.users) await db.users.bulkAdd(data.users);
        if (data.courses) await db.courses.bulkAdd(data.courses);
        if (data.documents) await db.documents.bulkAdd(data.documents);
        if (data.qcm) await db.qcm.bulkAdd(data.qcm);
        if (data.flashcards) await db.flashcards.bulkAdd(data.flashcards);
        if (data.studySessions) await db.studySessions.bulkAdd(data.studySessions);
        if (data.chatSessions) await db.chatSessions.bulkAdd(data.chatSessions);
        if (data.goals) await db.goals.bulkAdd(data.goals);
        if (data.achievements) await db.achievements.bulkAdd(data.achievements);
        if (data.notifications) await db.notifications.bulkAdd(data.notifications);
        if (data.userStats) await db.userStats.bulkAdd(data.userStats);
        if (data.settings) await db.settings.bulkAdd(data.settings);
      });

      console.log('Base de données restaurée avec succès');
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      throw error;
    }
  },

  // Nettoyage de la base de données
  async cleanupDatabase(): Promise<void> {
    try {
      // Supprimer les sessions d'étude de plus de 30 jours
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      await db.studySessions
        .where('startTime')
        .below(thirtyDaysAgo)
        .delete();

      // Supprimer les notifications lues de plus de 7 jours
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      
      await db.notifications
        .where('read')
        .equals(true)
        .and(notification => notification.createdAt < sevenDaysAgo)
        .delete();

      console.log('Nettoyage de la base de données terminé');
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
    }
  }
};