// Shared Firebase utilities for both user and admin panels
// This file provides common Firebase operations and helpers

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  setDoc,
  writeBatch,
  increment,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
  uploadBytesResumable,
  getMetadata,
  updateMetadata
} from 'firebase/storage';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { db, auth, storage } from '../../firebase';

// Type definitions
export type DocumentData = Record<string, any>;
export type QueryConstraint = any;

// Firestore utilities
export class FirestoreUtils {
  // Generic document operations
  static async getDocument(collectionName: string, docId: string) {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }

  static async setDocument(collectionName: string, docId: string, data: DocumentData) {
    const docRef = doc(db, collectionName, docId);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() });
    return docRef.id;
  }

  static async addDocument(collectionName: string, data: DocumentData) {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  }

  static async updateDocument(collectionName: string, docId: string, data: DocumentData) {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  }

  static async deleteDocument(collectionName: string, docId: string) {
    await deleteDoc(doc(db, collectionName, docId));
  }

  // Query operations
  static async queryDocuments(
    collectionName: string,
    constraints: QueryConstraint[] = []
  ) {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // Batch operations
  static async batchWrite(operations: Array<{
    type: 'set' | 'update' | 'delete';
    collection: string;
    docId: string;
    data?: DocumentData;
  }>) {
    const batch = writeBatch(db);

    operations.forEach(op => {
      const docRef = doc(db, op.collection, op.docId);
      switch (op.type) {
        case 'set':
          batch.set(docRef, { ...op.data, updatedAt: serverTimestamp() });
          break;
        case 'update':
          batch.update(docRef, { ...op.data, updatedAt: serverTimestamp() });
          break;
        case 'delete':
          batch.delete(docRef);
          break;
      }
    });

    await batch.commit();
  }

  // Real-time listeners
  static onDocumentSnapshot(
    collectionName: string,
    docId: string,
    callback: (data: DocumentData | null) => void
  ) {
    const docRef = doc(db, collectionName, docId);
    return onSnapshot(docRef, (docSnap) => {
      callback(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null);
    });
  }

  static onCollectionSnapshot(
    collectionName: string,
    constraints: QueryConstraint[],
    callback: (data: DocumentData[]) => void
  ) {
    const q = query(collection(db, collectionName), ...constraints);
    return onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(documents);
    });
  }
}

// Storage utilities
export class StorageUtils {
  static async uploadFile(
    file: File | Blob,
    path: string,
    metadata?: Record<string, string>
  ) {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file, { customMetadata: metadata });
    return getDownloadURL(snapshot.ref);
  }

  static async uploadFileResumable(
    file: File | Blob,
    path: string,
    onProgress?: (progress: number) => void,
    metadata?: Record<string, string>
  ) {
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file, { customMetadata: metadata });

    return new Promise<string>((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }

  static async getFileURL(path: string) {
    const storageRef = ref(storage, path);
    return getDownloadURL(storageRef);
  }

  static async deleteFile(path: string) {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  }

  static async listFiles(path: string) {
    const storageRef = ref(storage, path);
    const result = await listAll(storageRef);
    return {
      files: result.items,
      prefixes: result.prefixes
    };
  }

  static async getFileMetadata(path: string) {
    const storageRef = ref(storage, path);
    return getMetadata(storageRef);
  }

  static async updateFileMetadata(path: string, metadata: Record<string, string>) {
    const storageRef = ref(storage, path);
    await updateMetadata(storageRef, { customMetadata: metadata });
  }
}

// Authentication utilities
export class AuthUtils {
  static async signIn(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  static async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  static async signOutUser() {
    return signOut(auth);
  }

  static async resetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  static async updateUserProfile(updates: { displayName?: string; photoURL?: string }) {
    const user = auth.currentUser;
    if (user) {
      return updateProfile(user, updates);
    }
    throw new Error('No authenticated user');
  }

  static onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static getCurrentUser() {
    return auth.currentUser;
  }
}

// Utility functions for common operations
export const FirebaseHelpers = {
  // Timestamp utilities
  serverTimestamp,
  timestampToDate: (timestamp: Timestamp) => timestamp.toDate(),

  // Field value utilities
  increment: (n: number) => increment(n),
  arrayUnion: (value: any) => arrayUnion(value),
  arrayRemove: (value: any) => arrayRemove(value),

  // Query constraint helpers
  where: (field: string, operator: any, value: any) => where(field, operator, value),
  orderBy: (field: string, direction: 'asc' | 'desc' = 'asc') => orderBy(field, direction),
  limit: (count: number) => limit(count),

  // Collection references
  collection: (name: string) => collection(db, name),
  doc: (collectionName: string, docId: string) => doc(db, collectionName, docId),
};

export default {
  FirestoreUtils,
  StorageUtils,
  AuthUtils,
  FirebaseHelpers
};