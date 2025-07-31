import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Brain, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';

interface ImportedFile {
  id: string;
  name: string;
  content: string;
  subject: string;
  processing: boolean;
  processed: boolean;
  error?: string;
}

const Import: React.FC = () => {
  const [files, setFiles] = useState<ImportedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addCourse } = useStudy();

  const subjects = [
    'Anatomie',
    'Physiologie',
    'Biochimie',
    'Histologie',
    'Embryologie',
    'Immunologie',
    'Microbiologie',
    'Pharmacologie',
    'Pathologie',
    'Sémiologie',
    'Autre'
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles: ImportedFile[] = [];
    
    for (let i = 0; i < uploadedFiles.length; i++) {
      const file = uploadedFiles[i];
      if (file.type === 'application/pdf') {
        newFiles.push({
          id: Date.now() + i.toString(),
          name: file.name,
          content: '',
          subject: '',
          processing: false,
          processed: false
        });
      }
    }

    setFiles(prev => [...prev, ...newFiles]);
    
    // Traiter chaque fichier
    for (let i = 0; i < newFiles.length; i++) {
      await processFile(newFiles[i].id, uploadedFiles[i]);
    }
  };

  const processFile = async (fileId: string, file: File) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, processing: true } : f
    ));

    try {
      // Simuler l'extraction de texte PDF (dans un vrai projet, utiliser pdfjs-dist)
      const content = await extractTextFromPDF(file);
      
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, content, processing: false } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          processing: false, 
          error: 'Erreur lors de l\'extraction du texte' 
        } : f
      ));
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    // Simulation de l'extraction PDF
    // Dans un vrai projet, utiliser pdfjs-dist
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Contenu extrait du fichier ${file.name}. Ceci est une simulation du contenu PDF qui serait extrait par pdfjs-dist. Dans une vraie implémentation, le texte serait extrait du PDF et analysé par l'IA locale pour générer des QCM et flashcards.`);
      }, 2000);
    });
  };

  const generateContent = async (fileId: string) => {
    setIsProcessing(true);
    
    try {
      const file = files.find(f => f.id === fileId);
      if (!file) return;

      // Simuler la génération IA locale
      await new Promise(resolve => setTimeout(resolve, 3000));

      const generatedQCM = generateMockQCM(file.content);
      const generatedFlashcards = generateMockFlashcards(file.content);
      const summary = generateMockSummary(file.content);

      // Ajouter le cours
      addCourse({
        name: file.name.replace('.pdf', ''),
        subject: file.subject,
        content: file.content,
        summary,
        qcm: generatedQCM,
        flashcards: generatedFlashcards
      });

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, processed: true } : f
      ));
    } catch (error) {
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          error: 'Erreur lors de la génération du contenu' 
        } : f
      ));
    } finally {
      setIsProcessing(false);
    }
  };

  const generateMockQCM = (content: string) => {
    return [
      {
        id: '1',
        question: 'Quelle est la fonction principale du système cardiovasculaire ?',
        options: [
          'Transport de l\'oxygène et des nutriments',
          'Digestion des aliments',
          'Production d\'hormones',
          'Filtration du sang'
        ],
        correctAnswer: 0,
        explanation: 'Le système cardiovasculaire a pour fonction principale le transport de l\'oxygène et des nutriments vers les tissus.'
      },
      {
        id: '2',
        question: 'Quel est le muscle principal du cœur ?',
        options: [
          'Le myocarde',
          'Le péricarde',
          'L\'endocarde',
          'Le septum'
        ],
        correctAnswer: 0,
        explanation: 'Le myocarde est le muscle principal du cœur responsable de la contraction cardiaque.'
      }
    ];
  };

  const generateMockFlashcards = (content: string) => {
    return [
      {
        id: '1',
        question: 'Qu\'est-ce que le système cardiovasculaire ?',
        answer: 'Le système cardiovasculaire est un système d\'organes qui permet la circulation du sang dans le corps.'
      },
      {
        id: '2',
        question: 'Quels sont les composants principaux du système cardiovasculaire ?',
        answer: 'Le cœur, les vaisseaux sanguins (artères, veines, capillaires) et le sang.'
      }
    ];
  };

  const generateMockSummary = (content: string) => {
    return 'Le système cardiovasculaire est responsable du transport de l\'oxygène, des nutriments et des hormones dans tout le corps. Il comprend le cœur qui pompe le sang, et un réseau de vaisseaux sanguins qui distribuent le sang vers tous les organes. Ce système est essentiel pour maintenir l\'homéostasie et assurer le bon fonctionnement de tous les tissus de l\'organisme.';
  };

  const updateSubject = (fileId: string, subject: string) => {
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, subject } : f
    ));
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Importer des cours
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Importez vos cours PDF et générez automatiquement des QCM, flashcards et résumés
          </p>
        </div>

        {/* Upload Zone */}
        <div className="card p-8">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Glissez vos fichiers PDF ici
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              ou cliquez pour sélectionner des fichiers
            </p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="btn-primary"
              disabled={isProcessing}
            >
              Sélectionner des fichiers
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>
        </div>

        {/* Files List */}
        {files.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Fichiers importés ({files.length})
            </h3>
            
            {files.map((file) => (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {file.name}
                      </h4>
                      {file.error && (
                        <p className="text-sm text-red-600 dark:text-red-400">
                          {file.error}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {file.processing && (
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Loader className="w-4 h-4 animate-spin" />
                        <span>Extraction...</span>
                      </div>
                    )}
                    
                    {file.processed && (
                      <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                        <CheckCircle className="w-4 h-4" />
                        <span>Traité</span>
                      </div>
                    )}
                    
                    <button
                      onClick={() => removeFile(file.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>

                {!file.processing && !file.error && (
                  <div className="space-y-4">
                    {/* Subject Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Matière
                      </label>
                      <select
                        value={file.subject}
                        onChange={(e) => updateSubject(file.id, e.target.value)}
                        className="input"
                      >
                        <option value="">Sélectionner une matière</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Content Preview */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Aperçu du contenu
                      </label>
                      <div className="max-h-32 overflow-y-auto p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">
                        {file.content.substring(0, 200)}...
                      </div>
                    </div>

                    {/* Generate Button */}
                    {file.subject && !file.processed && (
                      <button
                        onClick={() => generateContent(file.id)}
                        disabled={isProcessing}
                        className="btn-primary flex items-center space-x-2"
                      >
                        <Brain className="w-4 h-4" />
                        <span>
                          {isProcessing ? 'Génération en cours...' : 'Générer QCM et Flashcards'}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {/* Info */}
        <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Traitement local
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Tous les traitements sont effectués localement dans votre navigateur. 
                Aucune donnée n'est envoyée vers des serveurs externes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Import;