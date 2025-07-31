import { AIGeneratedContent, QCM, Flashcard, GlossaryTerm, CourseOutline, AIPrompt } from '../types';
import { db } from './database';

export class AIService {
  private static instance: AIService;
  private isProcessing = false;

  private constructor() {}

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  /**
   * Génère du contenu IA à partir du texte d'un document
   */
  async generateContent(documentText: string, documentId: string): Promise<AIGeneratedContent> {
    if (this.isProcessing) {
      throw new Error('Un traitement IA est déjà en cours');
    }

    this.isProcessing = true;

    try {
      console.log('Début de la génération IA pour le document:', documentId);

      // Récupérer les prompts par défaut
      const prompts = await db.aiPrompts.where('isDefault').equals(true).toArray();

      // Générer le contenu en parallèle
      const [qcm, flashcards, summary, glossary, outline] = await Promise.all([
        this.generateQCM(documentText, prompts.find(p => p.category === 'qcm')),
        this.generateFlashcards(documentText, prompts.find(p => p.category === 'flashcard')),
        this.generateSummary(documentText, prompts.find(p => p.category === 'summary')),
        this.generateGlossary(documentText, prompts.find(p => p.category === 'glossary')),
        this.generateOutline(documentText)
      ]);

      const aiGeneratedContent: AIGeneratedContent = {
        qcm,
        flashcards,
        summary,
        glossary,
        outline
      };

      console.log('Génération IA terminée:', {
        qcmCount: qcm.length,
        flashcardCount: flashcards.length,
        summaryLength: summary.length,
        glossaryCount: glossary.length
      });

      return aiGeneratedContent;

    } catch (error) {
      console.error('Erreur lors de la génération IA:', error);
      throw error;
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Génère des QCM
   */
  private async generateQCM(text: string, prompt?: AIPrompt): Promise<QCM[]> {
    try {
      // Simulation de génération de QCM
      const qcmData = await this.simulateAIGeneration('qcm', text, prompt);
      
      return qcmData.questions.map((q: any, index: number) => ({
        id: `qcm-${Date.now()}-${index}`,
        question: q.question,
        options: q.options.map((opt: string, optIndex: number) => ({
          id: `opt-${index}-${optIndex}`,
          text: opt,
          isCorrect: opt === q.correctAnswer
        })),
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: this.determineDifficulty(q.question),
        tags: this.extractTags(q.question),
        documentId: '',
        createdAt: new Date(),
        stats: {
          attempts: 0,
          correctAnswers: 0,
          averageTime: 0
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la génération des QCM:', error);
      return this.generateFallbackQCM(text);
    }
  }

  /**
   * Génère des flashcards
   */
  private async generateFlashcards(text: string, prompt?: AIPrompt): Promise<Flashcard[]> {
    try {
      const flashcardData = await this.simulateAIGeneration('flashcard', text, prompt);
      
      return flashcardData.flashcards.map((fc: any, index: number) => ({
        id: `flashcard-${Date.now()}-${index}`,
        question: fc.question,
        answer: fc.answer,
        documentId: '',
        createdAt: new Date(),
        stats: {
          reviews: 0,
          knownCount: 0,
          unknownCount: 0
        }
      }));
    } catch (error) {
      console.error('Erreur lors de la génération des flashcards:', error);
      return this.generateFallbackFlashcards(text);
    }
  }

  /**
   * Génère un résumé
   */
  private async generateSummary(text: string, prompt?: AIPrompt): Promise<string> {
    try {
      const summaryData = await this.simulateAIGeneration('summary', text, prompt);
      return summaryData.summary || this.generateFallbackSummary(text);
    } catch (error) {
      console.error('Erreur lors de la génération du résumé:', error);
      return this.generateFallbackSummary(text);
    }
  }

  /**
   * Génère un glossaire
   */
  private async generateGlossary(text: string, prompt?: AIPrompt): Promise<GlossaryTerm[]> {
    try {
      const glossaryData = await this.simulateAIGeneration('glossary', text, prompt);
      
      return glossaryData.terms.map((term: any) => ({
        term: term.term,
        definition: term.definition,
        context: term.context || '',
        pageNumber: term.pageNumber || undefined
      }));
    } catch (error) {
      console.error('Erreur lors de la génération du glossaire:', error);
      return this.generateFallbackGlossary(text);
    }
  }

  /**
   * Génère un plan de cours
   */
  private async generateOutline(text: string): Promise<CourseOutline> {
    try {
      // Extraire les titres et sous-titres du texte
      const lines = text.split('\n');
      const headings = lines.filter(line => {
        const trimmed = line.trim();
        return trimmed.length > 3 && 
               trimmed.length < 100 && 
               (trimmed.match(/^[A-Z\s\d]+$/) || 
                trimmed.match(/^\d+\.\s/) ||
                trimmed.match(/^[IVX]+\.\s/));
      });

      const sections = headings.slice(0, 10).map(heading => ({
        title: heading.trim(),
        subsections: [],
        pageNumbers: []
      }));

      return {
        title: 'Plan du cours',
        sections
      };
    } catch (error) {
      console.error('Erreur lors de la génération du plan:', error);
      return {
        title: 'Plan du cours',
        sections: []
      };
    }
  }

  /**
   * Simulation de génération IA (remplacera l'IA locale réelle)
   */
  private async simulateAIGeneration(type: string, text: string, prompt?: AIPrompt): Promise<any> {
    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

    const words = text.split(' ').filter(word => word.length > 3);
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);

    switch (type) {
      case 'qcm':
        return {
          questions: Array.from({ length: 10 }, (_, i) => ({
            question: `Question ${i + 1} basée sur le contenu du document ?`,
            options: [
              `Option A pour la question ${i + 1}`,
              `Option B pour la question ${i + 1}`,
              `Option C pour la question ${i + 1}`,
              `Option D pour la question ${i + 1}`
            ],
            correctAnswer: `Option A pour la question ${i + 1}`,
            explanation: `Explication pour la question ${i + 1}`
          }))
        };

      case 'flashcard':
        return {
          flashcards: Array.from({ length: 15 }, (_, i) => ({
            question: `Question flashcard ${i + 1} ?`,
            answer: `Réponse flashcard ${i + 1}`
          }))
        };

      case 'summary':
        return {
          summary: `Résumé généré automatiquement basé sur le contenu du document. Ce résumé contient les points essentiels et la structure logique du cours. ${sentences.slice(0, 3).join(' ')}`
        };

      case 'glossary':
        return {
          terms: Array.from({ length: 10 }, (_, i) => ({
            term: `Terme médical ${i + 1}`,
            definition: `Définition du terme médical ${i + 1}`,
            context: `Contexte d'utilisation du terme ${i + 1}`
          }))
        };

      default:
        throw new Error(`Type de génération non supporté: ${type}`);
    }
  }

  /**
   * Détermine la difficulté d'une question
   */
  private determineDifficulty(question: string): 'easy' | 'medium' | 'hard' {
    const wordCount = question.split(' ').length;
    if (wordCount < 10) return 'easy';
    if (wordCount < 20) return 'medium';
    return 'hard';
  }

  /**
   * Extrait des tags d'une question
   */
  private extractTags(question: string): string[] {
    const tags = [];
    const words = question.toLowerCase().split(' ');
    
    // Tags basés sur des mots-clés médicaux
    const medicalKeywords = ['anatomie', 'physiologie', 'pathologie', 'diagnostic', 'traitement', 'symptôme'];
    medicalKeywords.forEach(keyword => {
      if (words.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return tags;
  }

  /**
   * QCM de secours en cas d'erreur
   */
  private generateFallbackQCM(text: string): QCM[] {
    return Array.from({ length: 5 }, (_, i) => ({
      id: `fallback-qcm-${i}`,
      question: `Question de secours ${i + 1} basée sur le contenu du document ?`,
      options: [
        { id: `opt-${i}-0`, text: 'Option A', isCorrect: true },
        { id: `opt-${i}-1`, text: 'Option B', isCorrect: false },
        { id: `opt-${i}-2`, text: 'Option C', isCorrect: false },
        { id: `opt-${i}-3`, text: 'Option D', isCorrect: false }
      ],
      correctAnswer: 'Option A',
      explanation: 'Explication de secours',
      difficulty: 'medium',
      tags: ['fallback'],
      documentId: '',
      createdAt: new Date(),
      stats: {
        attempts: 0,
        correctAnswers: 0,
        averageTime: 0
      }
    }));
  }

  /**
   * Flashcards de secours en cas d'erreur
   */
  private generateFallbackFlashcards(text: string): Flashcard[] {
    return Array.from({ length: 10 }, (_, i) => ({
      id: `fallback-flashcard-${i}`,
      question: `Question flashcard de secours ${i + 1} ?`,
      answer: `Réponse flashcard de secours ${i + 1}`,
      documentId: '',
      createdAt: new Date(),
      stats: {
        reviews: 0,
        knownCount: 0,
        unknownCount: 0
      }
    }));
  }

  /**
   * Résumé de secours en cas d'erreur
   */
  private generateFallbackSummary(text: string): string {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    return `Résumé automatique du document. ${sentences.slice(0, 5).join(' ')}`;
  }

  /**
   * Glossaire de secours en cas d'erreur
   */
  private generateFallbackGlossary(text: string): GlossaryTerm[] {
    return Array.from({ length: 5 }, (_, i) => ({
      term: `Terme de secours ${i + 1}`,
      definition: `Définition de secours pour le terme ${i + 1}`,
      context: 'Contexte de secours'
    }));
  }

  /**
   * Vérifie si l'IA est en cours de traitement
   */
  isProcessing(): boolean {
    return this.isProcessing;
  }

  /**
   * Annule le traitement en cours
   */
  cancelProcessing(): void {
    this.isProcessing = false;
  }
}

export const aiService = AIService.getInstance();