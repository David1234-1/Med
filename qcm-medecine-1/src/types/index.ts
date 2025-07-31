// Types de base
export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: Date;
  points: number;
  studyTime: number;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'focus' | 'exam';
  fontSize: 'small' | 'medium' | 'large';
  notifications: boolean;
  autoSave: boolean;
}

// Types pour les cours
export interface Course {
  id: string;
  title: string;
  subject: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  documents: Document[];
  progress: CourseProgress;
  tags: string[];
}

export interface Document {
  id: string;
  title: string;
  filename: string;
  fileSize: number;
  uploadedAt: Date;
  processedAt?: Date;
  status: 'pending' | 'processing' | 'completed' | 'error';
  content: DocumentContent;
  aiGenerated: AIGeneratedContent;
}

export interface DocumentContent {
  text: string;
  pages: Page[];
  metadata: DocumentMetadata;
}

export interface Page {
  pageNumber: number;
  text: string;
  images?: string[];
}

export interface DocumentMetadata {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  pageCount: number;
}

export interface AIGeneratedContent {
  qcm: QCM[];
  flashcards: Flashcard[];
  summary: string;
  glossary: GlossaryTerm[];
  outline: CourseOutline;
}

// Types pour les QCM
export interface QCM {
  id: string;
  question: string;
  options: QCMOption[];
  correctAnswer: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  documentId: string;
  createdAt: Date;
  stats: QCMStats;
}

export interface QCMOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface QCMStats {
  attempts: number;
  correctAnswers: number;
  averageTime: number;
  lastAttempted?: Date;
}

// Types pour les flashcards
export interface Flashcard {
  id: string;
  question: string;
  answer: string;
  documentId: string;
  createdAt: Date;
  stats: FlashcardStats;
}

export interface FlashcardStats {
  reviews: number;
  knownCount: number;
  unknownCount: number;
  lastReviewed?: Date;
  nextReview?: Date;
}

// Types pour le glossaire
export interface GlossaryTerm {
  term: string;
  definition: string;
  context?: string;
  pageNumber?: number;
}

// Types pour le plan de cours
export interface CourseOutline {
  title: string;
  sections: OutlineSection[];
}

export interface OutlineSection {
  title: string;
  subsections?: OutlineSection[];
  pageNumbers?: number[];
}

// Types pour les sessions d'étude
export interface StudySession {
  id: string;
  userId: string;
  type: 'qcm' | 'flashcard' | 'reading' | 'summary';
  courseId?: string;
  documentId?: string;
  startTime: Date;
  endTime?: Date;
  duration: number;
  score?: number;
  questionsAnswered?: number;
  correctAnswers?: number;
}

// Types pour les statistiques
export interface CourseProgress {
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  studyTime: number;
  lastStudied?: Date;
  completionPercentage: number;
}

export interface UserStats {
  totalStudyTime: number;
  totalPoints: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  streakDays: number;
  averageScore: number;
  favoriteSubjects: string[];
  studyHistory: StudySession[];
}

// Types pour l'IA conversationnelle
export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  context?: {
    courseId?: string;
    documentId?: string;
    relatedContent?: string[];
  };
}

export interface ChatSession {
  id: string;
  userId: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les prompts IA
export interface AIPrompt {
  id: string;
  name: string;
  description: string;
  category: 'qcm' | 'flashcard' | 'summary' | 'glossary' | 'outline';
  prompt: string;
  variables: PromptVariable[];
  isDefault: boolean;
}

export interface PromptVariable {
  name: string;
  description: string;
  defaultValue: string;
  required: boolean;
}

// Types pour les objectifs et gamification
export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  target: number;
  current: number;
  unit: 'questions' | 'minutes' | 'points' | 'sessions';
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlockedAt?: Date;
  criteria: AchievementCriteria;
}

export interface AchievementCriteria {
  type: 'questions' | 'time' | 'streak' | 'score' | 'subjects';
  value: number;
  condition: 'gte' | 'lte' | 'eq';
}

// Types pour les notifications
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: Date;
  actionUrl?: string;
}

// Types pour les erreurs
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

// Types pour les paramètres de l'application
export interface AppSettings {
  aiModel: string;
  processingTimeout: number;
  maxFileSize: number;
  allowedFileTypes: string[];
  autoBackup: boolean;
  backupInterval: number;
}