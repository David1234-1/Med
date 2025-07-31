import * as pdfjsLib from 'pdfjs-dist';
import { DocumentContent, Page, DocumentMetadata } from '../types';

// Configuration de pdfjs-dist pour le web
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export class PDFProcessor {
  private static instance: PDFProcessor;

  private constructor() {}

  static getInstance(): PDFProcessor {
    if (!PDFProcessor.instance) {
      PDFProcessor.instance = new PDFProcessor();
    }
    return PDFProcessor.instance;
  }

  /**
   * Traite un fichier PDF et extrait son contenu
   */
  async processPDF(file: File): Promise<DocumentContent> {
    try {
      console.log('Début du traitement PDF:', file.name);
      
      // Lire le fichier
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      
      // Charger le PDF
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      // Extraire les métadonnées
      const metadata = await this.extractMetadata(pdf, file);
      
      // Extraire le contenu page par page
      const pages: Page[] = [];
      let fullText = '';
      
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const pageContent = await this.extractPageContent(page, pageNum);
        
        pages.push(pageContent);
        fullText += pageContent.text + '\n\n';
      }
      
      // Nettoyer le texte
      const cleanedText = this.cleanText(fullText);
      
      console.log('Traitement PDF terminé:', {
        pages: pages.length,
        textLength: cleanedText.length,
        metadata
      });
      
      return {
        text: cleanedText,
        pages,
        metadata
      };
      
    } catch (error) {
      console.error('Erreur lors du traitement PDF:', error);
      throw new Error(`Impossible de traiter le fichier PDF: ${error.message}`);
    }
  }

  /**
   * Lit un fichier comme ArrayBuffer
   */
  private readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as ArrayBuffer);
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }

  /**
   * Extrait les métadonnées du PDF
   */
  private async extractMetadata(pdf: pdfjsLib.PDFDocumentProxy, file: File): Promise<DocumentMetadata> {
    const info = await pdf.getMetadata();
    const pageCount = pdf.numPages;
    
    return {
      title: info?.info?.Title || file.name.replace('.pdf', ''),
      author: info?.info?.Author || '',
      subject: info?.info?.Subject || '',
      keywords: info?.info?.Keywords ? info.info.Keywords.split(',').map(k => k.trim()) : [],
      pageCount
    };
  }

  /**
   * Extrait le contenu d'une page
   */
  private async extractPageContent(page: pdfjsLib.PDFPageProxy, pageNumber: number): Promise<Page> {
    const viewport = page.getViewport({ scale: 1.0 });
    
    // Extraire le texte
    const textContent = await page.getTextContent();
    let text = '';
    
    for (const item of textContent.items) {
      if ('str' in item) {
        text += item.str + ' ';
      }
    }
    
    // Nettoyer le texte de la page
    const cleanedPageText = this.cleanText(text);
    
    return {
      pageNumber,
      text: cleanedPageText,
      images: [] // Pour l'instant, on ne gère pas les images
    };
  }

  /**
   * Nettoie le texte extrait
   */
  private cleanText(text: string): string {
    return text
      // Supprimer les espaces multiples
      .replace(/\s+/g, ' ')
      // Supprimer les sauts de ligne inutiles
      .replace(/\n\s*\n/g, '\n')
      // Supprimer les caractères de contrôle
      .replace(/[\x00-\x1F\x7F]/g, '')
      // Normaliser les espaces autour de la ponctuation
      .replace(/\s*([.,;:!?])\s*/g, '$1 ')
      // Supprimer les espaces en début et fin
      .trim();
  }

  /**
   * Vérifie si un fichier est un PDF valide
   */
  async validatePDF(file: File): Promise<boolean> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      return pdf.numPages > 0;
    } catch (error) {
      console.error('Fichier PDF invalide:', error);
      return false;
    }
  }

  /**
   * Extrait un aperçu du contenu (premières pages)
   */
  async extractPreview(file: File, maxPages: number = 3): Promise<string> {
    try {
      const arrayBuffer = await this.readFileAsArrayBuffer(file);
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      
      let previewText = '';
      const pagesToExtract = Math.min(maxPages, pdf.numPages);
      
      for (let pageNum = 1; pageNum <= pagesToExtract; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        for (const item of textContent.items) {
          if ('str' in item) {
            previewText += item.str + ' ';
          }
        }
        
        previewText += '\n\n';
      }
      
      return this.cleanText(previewText).substring(0, 1000) + '...';
      
    } catch (error) {
      console.error('Erreur lors de l\'extraction de l\'aperçu:', error);
      return 'Impossible d\'extraire l\'aperçu du document.';
    }
  }

  /**
   * Extrait des informations structurées du PDF
   */
  async extractStructuredContent(file: File): Promise<{
    headings: string[];
    paragraphs: string[];
    lists: string[];
  }> {
    try {
      const content = await this.processPDF(file);
      const text = content.text;
      
      // Extraire les titres (lignes courtes en majuscules ou avec des chiffres)
      const headings = text
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.length > 3 && 
                 trimmed.length < 100 && 
                 (trimmed.match(/^[A-Z\s\d]+$/) || 
                  trimmed.match(/^\d+\.\s/) ||
                  trimmed.match(/^[IVX]+\.\s/));
        })
        .map(line => line.trim())
        .slice(0, 20); // Limiter à 20 titres
      
      // Extraire les paragraphes
      const paragraphs = text
        .split('\n\n')
        .filter(para => para.trim().length > 50)
        .map(para => para.trim())
        .slice(0, 50); // Limiter à 50 paragraphes
      
      // Extraire les listes (lignes commençant par des puces ou des chiffres)
      const lists = text
        .split('\n')
        .filter(line => {
          const trimmed = line.trim();
          return trimmed.match(/^[\-\*•]\s/) || 
                 trimmed.match(/^\d+\.\s/) ||
                 trimmed.match(/^[a-z]\)\s/);
        })
        .map(line => line.trim())
        .slice(0, 100); // Limiter à 100 éléments de liste
      
      return { headings, paragraphs, lists };
      
    } catch (error) {
      console.error('Erreur lors de l\'extraction du contenu structuré:', error);
      return { headings: [], paragraphs: [], lists: [] };
    }
  }
}

export const pdfProcessor = PDFProcessor.getInstance();