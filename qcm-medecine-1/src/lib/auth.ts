import bcrypt from 'bcryptjs';
import { User, UserPreferences } from '../types';
import { db } from './database';

export class AuthService {
  private static instance: AuthService;
  private currentUser: User | null = null;

  private constructor() {
    this.loadCurrentUser();
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  /**
   * Charge l'utilisateur actuel depuis le localStorage
   */
  private loadCurrentUser(): void {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        // Convertir les dates string en objets Date
        user.createdAt = new Date(user.createdAt);
        this.currentUser = user;
      }
    } catch (error) {
      console.error('Erreur lors du chargement de l\'utilisateur:', error);
      this.currentUser = null;
    }
  }

  /**
   * Sauvegarde l'utilisateur actuel dans le localStorage
   */
  private saveCurrentUser(user: User): void {
    try {
      localStorage.setItem('currentUser', JSON.stringify(user));
      this.currentUser = user;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de l\'utilisateur:', error);
    }
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  async register(email: string, username: string, password: string): Promise<User> {
    try {
      // Vérifier si l'email existe déjà
      const existingUser = await db.users.where('email').equals(email).first();
      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Vérifier si le nom d'utilisateur existe déjà
      const existingUsername = await db.users.where('username').equals(username).first();
      if (existingUsername) {
        throw new Error('Ce nom d\'utilisateur est déjà pris');
      }

      // Hasher le mot de passe
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Créer les préférences par défaut
      const defaultPreferences: UserPreferences = {
        theme: 'light',
        fontSize: 'medium',
        notifications: true,
        autoSave: true
      };

      // Créer l'utilisateur
      const user: User = {
        id: this.generateId(),
        email,
        username,
        createdAt: new Date(),
        points: 0,
        studyTime: 0,
        preferences: defaultPreferences
      };

      // Sauvegarder dans la base de données
      await db.users.add(user);

      // Sauvegarder l'utilisateur actuel
      this.saveCurrentUser(user);

      console.log('Utilisateur créé avec succès:', user.id);
      return user;

    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  /**
   * Connexion d'un utilisateur
   */
  async login(email: string, password: string): Promise<User> {
    try {
      // Trouver l'utilisateur par email
      const user = await db.users.where('email').equals(email).first();
      if (!user) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, user.password || '');
      if (!isPasswordValid) {
        throw new Error('Email ou mot de passe incorrect');
      }

      // Sauvegarder l'utilisateur actuel
      this.saveCurrentUser(user);

      console.log('Connexion réussie:', user.id);
      return user;

    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  /**
   * Déconnexion
   */
  logout(): void {
    try {
      localStorage.removeItem('currentUser');
      this.currentUser = null;
      console.log('Déconnexion réussie');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Obtenir l'utilisateur actuel
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Mettre à jour les préférences de l'utilisateur
   */
  async updatePreferences(preferences: Partial<UserPreferences>): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      const updatedUser = {
        ...this.currentUser,
        preferences: {
          ...this.currentUser.preferences,
          ...preferences
        }
      };

      await db.users.update(this.currentUser.id, updatedUser);
      this.saveCurrentUser(updatedUser);

      console.log('Préférences mises à jour');
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour les points de l'utilisateur
   */
  async updatePoints(points: number): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      const updatedUser = {
        ...this.currentUser,
        points: this.currentUser.points + points
      };

      await db.users.update(this.currentUser.id, updatedUser);
      this.saveCurrentUser(updatedUser);

      console.log('Points mis à jour:', updatedUser.points);
    } catch (error) {
      console.error('Erreur lors de la mise à jour des points:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le temps d'étude
   */
  async updateStudyTime(minutes: number): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      const updatedUser = {
        ...this.currentUser,
        studyTime: this.currentUser.studyTime + minutes
      };

      await db.users.update(this.currentUser.id, updatedUser);
      this.saveCurrentUser(updatedUser);

      console.log('Temps d\'étude mis à jour:', updatedUser.studyTime);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du temps d\'étude:', error);
      throw error;
    }
  }

  /**
   * Changer le mot de passe
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      // Vérifier l'ancien mot de passe
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, this.currentUser.password || '');
      if (!isCurrentPasswordValid) {
        throw new Error('Mot de passe actuel incorrect');
      }

      // Hasher le nouveau mot de passe
      const saltRounds = 12;
      const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

      // Mettre à jour le mot de passe
      await db.users.update(this.currentUser.id, { password: hashedNewPassword });

      console.log('Mot de passe changé avec succès');
    } catch (error) {
      console.error('Erreur lors du changement de mot de passe:', error);
      throw error;
    }
  }

  /**
   * Supprimer le compte
   */
  async deleteAccount(password: string): Promise<void> {
    if (!this.currentUser) {
      throw new Error('Utilisateur non connecté');
    }

    try {
      // Vérifier le mot de passe
      const isPasswordValid = await bcrypt.compare(password, this.currentUser.password || '');
      if (!isPasswordValid) {
        throw new Error('Mot de passe incorrect');
      }

      // Supprimer l'utilisateur et toutes ses données
      await db.transaction('rw', db.tables, async () => {
        await db.users.delete(this.currentUser!.id);
        await db.courses.where('userId').equals(this.currentUser!.id).delete();
        await db.studySessions.where('userId').equals(this.currentUser!.id).delete();
        await db.goals.where('userId').equals(this.currentUser!.id).delete();
        await db.notifications.where('userId').equals(this.currentUser!.id).delete();
        await db.userStats.where('userId').equals(this.currentUser!.id).delete();
      });

      // Déconnecter l'utilisateur
      this.logout();

      console.log('Compte supprimé avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression du compte:', error);
      throw error;
    }
  }

  /**
   * Générer un ID unique
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Mode invité
   */
  createGuestUser(): User {
    const guestUser: User = {
      id: 'guest-' + this.generateId(),
      email: 'guest@example.com',
      username: 'Invité',
      createdAt: new Date(),
      points: 0,
      studyTime: 0,
      preferences: {
        theme: 'light',
        fontSize: 'medium',
        notifications: false,
        autoSave: true
      }
    };

    this.saveCurrentUser(guestUser);
    return guestUser;
  }
}

export const authService = AuthService.getInstance();