// Example usage of Firebase configuration in user and admin panels
// This file demonstrates how to use the Firebase setup

import { auth, db, storage } from '../../firebase';
import {
  FirestoreUtils,
  StorageUtils,
  AuthUtils,
  FirebaseHelpers
} from './firebase-utils';

// Example: User Panel Usage
export class UserFirebaseExample {
  // Authentication examples
  static async userSignIn(email: string, password: string) {
    try {
      const userCredential = await AuthUtils.signIn(email, password);
      console.log('User signed in:', userCredential.user.email);
      return userCredential;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  }

  static async userSignUp(email: string, password: string) {
    try {
      const userCredential = await AuthUtils.signUp(email, password);
      console.log('User created:', userCredential.user.email);
      return userCredential;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  }

  // Firestore examples for user data
  static async saveUserProfile(userId: string, profileData: any) {
    return FirestoreUtils.setDocument('users', userId, profileData);
  }

  static async getUserProfile(userId: string) {
    return FirestoreUtils.getDocument('users', userId);
  }

  static async updateUserPreferences(userId: string, preferences: any) {
    return FirestoreUtils.updateDocument('users', userId, { preferences });
  }

  // Storage examples for user uploads
  static async uploadUserAvatar(userId: string, file: File) {
    const path = `avatars/${userId}/avatar.jpg`;
    return StorageUtils.uploadFile(file, path);
  }

  static async getUserAvatar(userId: string) {
    const path = `avatars/${userId}/avatar.jpg`;
    return StorageUtils.getFileURL(path);
  }
}

// Example: Admin Panel Usage
export class AdminFirebaseExample {
  // Admin authentication
  static async adminSignIn(email: string, password: string) {
    try {
      const userCredential = await AuthUtils.signIn(email, password);
      // Check if user has admin role
      const userDoc = await FirestoreUtils.getDocument('admins', userCredential.user.uid);
      if (!userDoc) {
        await AuthUtils.signOutUser();
        throw new Error('Unauthorized: Admin access required');
      }
      return userCredential;
    } catch (error) {
      console.error('Admin sign in error:', error);
      throw error;
    }
  }

  // Admin Firestore operations
  static async getAllUsers() {
    return FirestoreUtils.queryDocuments('users', [
      FirebaseHelpers.orderBy('createdAt', 'desc')
    ]);
  }

  static async updateUserRole(userId: string, role: string) {
    return FirestoreUtils.updateDocument('users', userId, { role });
  }

  static async deleteUser(userId: string) {
    // Delete user data and auth account
    await FirestoreUtils.deleteDocument('users', userId);
    // Note: You'd need to call Firebase Admin SDK to delete auth user
  }

  // Content management
  static async getAllContent() {
    return FirestoreUtils.queryDocuments('content', [
      FirebaseHelpers.orderBy('createdAt', 'desc')
    ]);
  }

  static async moderateContent(contentId: string, status: 'approved' | 'rejected') {
    return FirestoreUtils.updateDocument('content', contentId, {
      status,
      moderatedAt: FirebaseHelpers.serverTimestamp()
    });
  }

  // Analytics
  static async getUserAnalytics() {
    // Example of complex query
    const users = await FirestoreUtils.queryDocuments('users', [
      FirebaseHelpers.where('lastActive', '>', new Date(Date.now() - 24 * 60 * 60 * 1000)) // Last 24 hours
    ]);
    return {
      totalUsers: users.length,
      activeUsers: users.length,
      // Add more analytics calculations
    };
  }
}

// Example: Real-time listeners
export class RealtimeExample {
  static listenToUserProfile(userId: string, callback: (data: any) => void) {
    return FirestoreUtils.onDocumentSnapshot('users', userId, callback);
  }

  static listenToAllUsers(callback: (users: any[]) => void) {
    return FirestoreUtils.onCollectionSnapshot('users', [
      FirebaseHelpers.orderBy('createdAt', 'desc'),
      FirebaseHelpers.limit(50)
    ], callback);
  }
}

// Example: Batch operations
export class BatchExample {
  static async batchUpdateUsers(userUpdates: Array<{userId: string, data: any}>) {
    const operations = userUpdates.map(({userId, data}) => ({
      type: 'update' as const,
      collection: 'users',
      docId: userId,
      data
    }));

    return FirestoreUtils.batchWrite(operations);
  }
}

export default {
  UserFirebaseExample,
  AdminFirebaseExample,
  RealtimeExample,
  BatchExample
};