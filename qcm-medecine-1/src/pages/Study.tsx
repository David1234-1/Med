import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Brain, Target, Clock, CheckCircle } from 'lucide-react';

const Study: React.FC = () => {
  const [selectedMode, setSelectedMode] = useState<'qcm' | 'flashcard'>('qcm');

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">
            Réviser
          </h1>
          <p className="text-gray-600">
            Entraînez-vous avec vos QCM et flashcards
          </p>
        </div>

        {/* Mode Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedMode === 'qcm'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedMode('qcm')}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedMode === 'qcm' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                <Target className={`w-6 h-6 ${
                  selectedMode === 'qcm' ? 'text-blue-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Questions à choix multiples
                </h3>
                <p className="text-gray-600">
                  Testez vos connaissances avec des QCM
                </p>
              </div>
            </div>
          </div>

          <div
            className={`p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
              selectedMode === 'flashcard'
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setSelectedMode('flashcard')}
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg ${
                selectedMode === 'flashcard' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                <Brain className={`w-6 h-6 ${
                  selectedMode === 'flashcard' ? 'text-green-600' : 'text-gray-600'
                }`} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Flashcards
                </h3>
                <p className="text-gray-600">
                  Mémorisez avec des cartes de révision
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Study Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-md border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {selectedMode === 'qcm' ? 'Questions à choix multiples' : 'Flashcards'}
            </h2>
          </div>
          
          <div className="p-6">
            <div className="text-center text-gray-500 py-12">
              <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                Aucun contenu disponible
              </h3>
              <p className="text-gray-600 mb-4">
                {selectedMode === 'qcm' 
                  ? 'Importez des cours pour commencer vos QCM'
                  : 'Importez des cours pour créer des flashcards'
                }
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                Importer des cours
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Sessions complétées
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  0
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Score moyen
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  0%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Target className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Temps d'étude
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  0h
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Study;