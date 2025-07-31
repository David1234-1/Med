import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, BookOpen, Brain } from 'lucide-react';

const Import: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Logique d'import à implémenter
    console.log('Fichiers déposés:', e.dataTransfer.files);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Importer des cours
          </h1>
          <p className="text-gray-600">
            Ajoutez vos documents PDF pour générer des QCM et flashcards
          </p>
        </div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-lg shadow-md border-2 border-dashed border-gray-300 p-8"
        >
          <div
            className={`text-center space-y-4 ${
              isDragging ? 'border-blue-400 bg-blue-50' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Glissez-déposez vos fichiers PDF ici
              </h3>
              <p className="text-gray-600 mb-4">
                ou cliquez pour sélectionner des fichiers
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Sélectionner des fichiers
              </button>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Extraction automatique
                </h3>
                <p className="text-gray-600">
                  Le contenu est automatiquement extrait de vos PDF
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  QCM générés
                </h3>
                <p className="text-gray-600">
                  Des questions à choix multiples sont créées automatiquement
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Flashcards
                </h3>
                <p className="text-gray-600">
                  Des cartes de révision sont générées pour mémoriser
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-blue-50 p-6 rounded-lg border border-blue-200"
        >
          <h3 className="text-lg font-semibold text-blue-900 mb-3">
            Instructions
          </h3>
          <ul className="space-y-2 text-blue-800">
            <li>• Formatez vos PDF pour une meilleure extraction</li>
            <li>• Les fichiers doivent être en français</li>
            <li>• La taille maximale est de 10MB par fichier</li>
            <li>• Le traitement peut prendre quelques minutes</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Import;