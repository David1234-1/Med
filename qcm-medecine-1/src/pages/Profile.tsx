import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  LogIn, 
  UserPlus, 
  LogOut,
  Guest,
  Settings,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useStudy } from '../contexts/StudyContext';

const Profile: React.FC = () => {
  const { user, isGuest, login, register, logout, loginAsGuest } = useAuth();
  const { getStudyStats } = useStudy();
  const stats = getStudyStats();

  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLoginMode) {
      // Login
      const success = await login(formData.email, formData.password);
      if (success) {
        setSuccess('Connexion réussie !');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      } else {
        setError('Email ou mot de passe incorrect');
      }
    } else {
      // Register
      if (formData.password !== formData.confirmPassword) {
        setError('Les mots de passe ne correspondent pas');
        return;
      }

      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        setSuccess('Inscription réussie !');
        setFormData({ name: '', email: '', password: '', confirmPassword: '' });
        setIsLoginMode(true);
      } else {
        setError('Cet email est déjà utilisé');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleGuestLogin = () => {
    loginAsGuest();
    setSuccess('Mode invité activé');
  };

  if (user || isGuest) {
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
              Profil
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Gérez votre compte et vos préférences
            </p>
          </div>

          {/* User Info */}
          <div className="card p-6">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {user ? user.name : 'Utilisateur invité'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {user ? user.email : 'Mode invité - Données locales uniquement'}
                </p>
                {user && (
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Membre depuis {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Cours importés
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalCourses}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Sessions d'étude
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.totalSessions}
                </p>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Score moyen
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.averageScore > 0 ? `${Math.round(stats.averageScore)}%` : 'N/A'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button
                onClick={logout}
                className="btn-secondary flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Se déconnecter</span>
              </button>
              
              {isGuest && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Shield className="w-4 h-4" />
                  <span>Mode invité - Données locales</span>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                  Données locales
                </h4>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Toutes vos données (cours, sessions d'étude, messages) sont stockées localement 
                  dans votre navigateur. Elles ne sont jamais envoyées vers des serveurs externes.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mb-4">
            <User className="w-8 h-8 text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isLoginMode ? 'Connexion' : 'Inscription'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isLoginMode 
              ? 'Connectez-vous à votre compte' 
              : 'Créez votre compte pour commencer'
            }
          </p>
        </div>

        {/* Auth Form */}
        <div className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required={!isLoginMode}
                  className="input"
                  placeholder="Votre nom"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="input"
                placeholder="votre@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="input"
                placeholder="Votre mot de passe"
              />
            </div>

            {!isLoginMode && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required={!isLoginMode}
                  className="input"
                  placeholder="Confirmez votre mot de passe"
                />
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                <p className="text-sm text-green-600 dark:text-green-400">{success}</p>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              {isLoginMode ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Se connecter</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>S'inscrire</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleGuestLogin}
              className="w-full btn-secondary flex items-center justify-center space-x-2"
            >
              <Guest className="w-4 h-4" />
              <span>Continuer en mode invité</span>
            </button>
          </div>
        </div>

        {/* Toggle Mode */}
        <div className="text-center">
          <button
            onClick={() => {
              setIsLoginMode(!isLoginMode);
              setError('');
              setSuccess('');
              setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            }}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm"
          >
            {isLoginMode 
              ? "Pas encore de compte ? S'inscrire" 
              : "Déjà un compte ? Se connecter"
            }
          </button>
        </div>

        {/* Info */}
        <div className="card p-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                Données sécurisées
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Toutes les données sont stockées localement dans votre navigateur. 
                Aucune information n'est envoyée vers des serveurs externes.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;