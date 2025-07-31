import React from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Clock, 
  Target, 
  TrendingUp,
  Plus,
  FileText,
  Brain,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStudy } from '../contexts/StudyContext';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { courses, studySessions, getStudyStats } = useStudy();
  const { user, isGuest } = useAuth();
  const stats = getStudyStats();

  const recentCourses = courses.slice(-3);
  const recentSessions = studySessions.slice(-5);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tableau de bord
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {user ? `Bienvenue, ${user.name} !` : isGuest ? 'Mode invité' : 'Connectez-vous pour commencer'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cours importés
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                <BookOpen className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sessions d'étude
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Score moyen
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageScore > 0 ? `${Math.round(stats.averageScore)}%` : 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Temps total
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {Math.round(stats.totalTimeSpent / 60)}h
                </p>
              </div>
              <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions rapides
            </h3>
            <div className="space-y-3">
              <Link
                to="/import"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                  <Plus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Importer un cours
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Ajouter un nouveau PDF
                  </p>
                </div>
              </Link>

              <Link
                to="/study"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
                  <Brain className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Commencer à réviser
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    QCM et flashcards disponibles
                  </p>
                </div>
              </Link>

              <Link
                to="/assistant"
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Assistant IA
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Poser des questions
                  </p>
                </div>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activité récente
            </h3>
            <div className="space-y-3">
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div key={session.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <FileText className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {session.type === 'qcm' ? 'QCM' : 'Flashcards'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Score: {session.score}/{session.totalQuestions} ({Math.round((session.score / session.totalQuestions) * 100)}%)
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(session.completedAt).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  Aucune session récente
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Recent Courses */}
        {recentCourses.length > 0 && (
          <motion.div variants={itemVariants} className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Cours récents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentCourses.map((course) => (
                <div key={course.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;