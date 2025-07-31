import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  BookOpen, 
  Target, 
  Clock, 
  CheckCircle,
  X,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BarChart3
} from 'lucide-react';

const Study: React.FC = () => {
  const [studyMode, setStudyMode] = useState<'qcm' | 'flashcard'>('qcm');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const qcmQuestions = [
    {
      id: 1,
      question: "Quelle est la fonction principale du système cardiovasculaire ?",
      options: [
        "Transport de l'oxygène et des nutriments",
        "Digestion des aliments",
        "Filtration du sang",
        "Production d'hormones"
      ],
      correctAnswer: 0,
      explanation: "Le système cardiovasculaire a pour fonction principale le transport de l'oxygène et des nutriments vers tous les tissus de l'organisme."
    },
    {
      id: 2,
      question: "Quel est le nom de la valve entre l'oreillette droite et le ventricule droit ?",
      options: [
        "Valve mitrale",
        "Valve tricuspide",
        "Valve aortique",
        "Valve pulmonaire"
      ],
      correctAnswer: 1,
      explanation: "La valve tricuspide se situe entre l'oreillette droite et le ventricule droit du cœur."
    },
    {
      id: 3,
      question: "Qu'est-ce que la systole ?",
      options: [
        "La phase de relaxation du cœur",
        "La phase de contraction du cœur",
        "Le volume de sang éjecté par minute",
        "La fréquence cardiaque au repos"
      ],
      correctAnswer: 1,
      explanation: "La systole correspond à la phase de contraction du cœur, pendant laquelle le sang est éjecté des ventricules."
    }
  ];

  const flashcards = [
    {
      id: 1,
      question: "Qu'est-ce que l'anatomie ?",
      answer: "L'anatomie est la science qui étudie la structure et l'organisation des êtres vivants et de leurs parties."
    },
    {
      id: 2,
      question: "Définissez la physiologie",
      answer: "La physiologie est la science qui étudie le fonctionnement des organes et des systèmes d'un organisme vivant."
    },
    {
      id: 3,
      question: "Qu'est-ce qu'un symptôme ?",
      answer: "Un symptôme est une manifestation subjective d'une maladie, ressentie par le patient (douleur, fatigue, etc.)."
    }
  ];

  const currentQCM = qcmQuestions[currentQuestion];
  const currentFlashcard = flashcards[currentQuestion];

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex.toString());
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;

    const isCorrect = parseInt(selectedAnswer) === currentQCM.correctAnswer;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < qcmQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setIsCompleted(false);
  };

  const getProgressPercentage = () => {
    return ((currentQuestion + 1) / qcmQuestions.length) * 100;
  };

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center"
        >
          <div className="mb-6">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Session terminée !
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Vous avez terminé tous les QCM
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Score</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {score}/{qcmQuestions.length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pourcentage</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round((score / qcmQuestions.length) * 100)}%
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleRestart}
              className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <RotateCcw size={20} />
              <span>Recommencer</span>
            </button>
            <button className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
              <BarChart3 size={20} />
              <span>Voir les stats</span>
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* En-tête */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Mode Révision
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Testez vos connaissances avec des QCM et flashcards
        </p>
      </motion.div>

      {/* Sélecteur de mode */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex space-x-4">
          <button
            onClick={() => setStudyMode('qcm')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors duration-200 ${
              studyMode === 'qcm'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <Brain size={20} />
            <span>QCM</span>
          </button>
          <button
            onClick={() => setStudyMode('flashcard')}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-lg transition-colors duration-200 ${
              studyMode === 'flashcard'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <BookOpen size={20} />
            <span>Flashcards</span>
          </button>
        </div>
      </motion.div>

      {/* Progression */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} sur {qcmQuestions.length}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-500">
              Score: {score}
            </span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Clock size={16} />
            <span>05:30</span>
          </div>
        </div>
        
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 0.5 }}
            className="bg-primary-600 h-2 rounded-full"
          />
        </div>
      </motion.div>

      {/* Question */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8"
      >
        {studyMode === 'qcm' ? (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {currentQCM.question}
            </h2>

            <div className="space-y-3">
              {currentQCM.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !showAnswer && handleAnswerSelect(index)}
                  disabled={showAnswer}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswer === index.toString()
                      ? showAnswer
                        ? index === currentQCM.correctAnswer
                          ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                          : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                        : 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : showAnswer && index === currentQCM.correctAnswer
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === index.toString()
                        ? showAnswer
                          ? index === currentQCM.correctAnswer
                            ? 'border-green-500 bg-green-500'
                            : 'border-red-500 bg-red-500'
                          : 'border-primary-500 bg-primary-500'
                        : 'border-gray-300 dark:border-gray-500'
                    }`}>
                      {selectedAnswer === index.toString() && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4"
              >
                <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
                  Explication :
                </h3>
                <p className="text-blue-800 dark:text-blue-200">
                  {currentQCM.explanation}
                </p>
              </motion.div>
            )}

            <div className="flex justify-between pt-4">
              <button
                onClick={handleRestart}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                <RotateCcw size={16} />
                <span>Recommencer</span>
              </button>

              {!showAnswer ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Valider</span>
                  <ArrowRight size={16} />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>Suivant</span>
                  <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {showAnswer ? 'Réponse' : 'Question'}
              </h2>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 min-h-[200px] flex items-center justify-center">
                <p className="text-lg text-gray-900 dark:text-white">
                  {showAnswer ? currentFlashcard.answer : currentFlashcard.question}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowAnswer(!showAnswer)}
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {showAnswer ? 'Voir la question' : 'Voir la réponse'}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Study;