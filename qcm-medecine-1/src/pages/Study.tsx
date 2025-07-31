import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  RotateCcw,
  Play,
  Pause,
  Clock,
  Target,
  Brain
} from 'lucide-react';
import { useStudy } from '../contexts/StudyContext';

interface StudySession {
  courseId: string;
  type: 'qcm' | 'flashcard';
  currentIndex: number;
  answers: number[];
  startTime: Date;
  isActive: boolean;
}

const Study: React.FC = () => {
  const { courses, addStudySession } = useStudy();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [studyType, setStudyType] = useState<'qcm' | 'flashcard'>('qcm');
  const [session, setSession] = useState<StudySession | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);

  const course = selectedCourse ? courses.find(c => c.id === selectedCourse) : null;

  const startSession = () => {
    if (!selectedCourse || !course) return;

    const newSession: StudySession = {
      courseId: selectedCourse,
      type: studyType,
      currentIndex: 0,
      answers: [],
      startTime: new Date(),
      isActive: true
    };

    setSession(newSession);
    setShowAnswer(false);
    setTimeSpent(0);
  };

  const endSession = () => {
    if (!session || !course) return;

    const endTime = new Date();
    const totalTime = Math.round((endTime.getTime() - session.startTime.getTime()) / 1000);

    const items = studyType === 'qcm' ? course.qcm : course.flashcards;
    let score = 0;

    if (studyType === 'qcm') {
      score = session.answers.reduce((acc, answer, index) => {
        const question = course.qcm[index];
        return acc + (answer === question.correctAnswer ? 1 : 0);
      }, 0);
    } else {
      // Pour les flashcards, on compte juste le nombre de cartes vues
      score = session.answers.length;
    }

    addStudySession({
      courseId: selectedCourse,
      type: studyType,
      score,
      totalQuestions: items.length,
      timeSpent: totalTime
    });

    setSession(null);
    setShowAnswer(false);
  };

  const nextQuestion = () => {
    if (!session || !course) return;

    const items = studyType === 'qcm' ? course.qcm : course.flashcards;
    
    if (session.currentIndex < items.length - 1) {
      setSession({
        ...session,
        currentIndex: session.currentIndex + 1
      });
      setShowAnswer(false);
    } else {
      endSession();
    }
  };

  const selectAnswer = (answerIndex: number) => {
    if (!session || !course) return;

    const newAnswers = [...session.answers];
    newAnswers[session.currentIndex] = answerIndex;

    setSession({
      ...session,
      answers: newAnswers
    });
  };

  const toggleFlashcard = () => {
    setShowAnswer(!showAnswer);
  };

  if (!session) {
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
              Réviser
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Choisissez un cours et commencez votre session de révision
            </p>
          </div>

          {/* Course Selection */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Sélectionner un cours
            </h3>
            
            {courses.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  Aucun cours disponible
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Importez d'abord des cours depuis la page d'import
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                      selectedCourse === course.id
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                    }`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                      {course.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {course.subject}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>{course.qcm.length} QCM</span>
                      <span>{course.flashcards.length} Flashcards</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Study Type Selection */}
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Type de révision
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    studyType === 'qcm'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  onClick={() => setStudyType('qcm')}
                >
                  <div className="flex items-center space-x-3">
                    <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        QCM
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Questions à choix multiples
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${
                    studyType === 'flashcard'
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }`}
                  onClick={() => setStudyType('flashcard')}
                >
                  <div className="flex items-center space-x-3">
                    <Brain className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Flashcards
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Questions et réponses
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          {selectedCourse && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <button
                onClick={startSession}
                className="btn-primary flex items-center space-x-2 mx-auto"
              >
                <Play className="w-4 h-4" />
                <span>Commencer la révision</span>
              </button>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  // Session active
  const items = studyType === 'qcm' ? course?.qcm : course?.flashcards;
  const currentItem = items?.[session.currentIndex];

  if (!currentItem) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {course?.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {studyType === 'qcm' ? 'QCM' : 'Flashcards'} - Question {session.currentIndex + 1} sur {items?.length}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}</span>
            </div>
            
            <button
              onClick={endSession}
              className="btn-secondary"
            >
              Terminer
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((session.currentIndex + 1) / (items?.length || 1)) * 100}%` }}
          />
        </div>

        {/* Question/Flashcard */}
        <div className="card p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={session.currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              {studyType === 'qcm' ? (
                // QCM
                <div className="space-y-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {currentItem.question}
                  </h3>
                  
                  <div className="space-y-3">
                    {currentItem.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => selectAnswer(index)}
                        className={`w-full p-4 text-left border rounded-lg transition-all duration-200 ${
                          session.answers[session.currentIndex] === index
                            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                        }`}
                      >
                        <span className="font-medium text-gray-900 dark:text-white">
                          {String.fromCharCode(65 + index)}. {option}
                        </span>
                      </button>
                    ))}
                  </div>

                  {session.answers[session.currentIndex] !== undefined && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                        Explication :
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {currentItem.explanation}
                      </p>
                    </motion.div>
                  )}
                </div>
              ) : (
                // Flashcard
                <div className="space-y-6">
                  <div className="text-center">
                    <button
                      onClick={toggleFlashcard}
                      className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-primary-400 dark:hover:border-primary-500 transition-colors duration-200"
                    >
                      <div className="space-y-4">
                        <RotateCcw className="w-8 h-8 text-gray-400 mx-auto" />
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            {showAnswer ? 'Réponse' : 'Question'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {showAnswer ? currentItem.answer : currentItem.question}
                          </p>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              if (session.currentIndex > 0) {
                setSession({
                  ...session,
                  currentIndex: session.currentIndex - 1
                });
                setShowAnswer(false);
              }
            }}
            disabled={session.currentIndex === 0}
            className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Précédent</span>
          </button>

          <button
            onClick={nextQuestion}
            className="btn-primary flex items-center space-x-2"
          >
            <span>
              {session.currentIndex === (items?.length || 0) - 1 ? 'Terminer' : 'Suivant'}
            </span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Study;