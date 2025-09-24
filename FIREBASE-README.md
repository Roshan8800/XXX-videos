# Firebase Configuration Setup

This document explains how to use the Firebase configuration in your PlayNite application.

## Files Created

1. **`firebase.ts`** - Main Firebase configuration file in the root directory
2. **`shared/utils/firebase-utils.ts`** - Shared Firebase utilities for common operations
3. **`shared/utils/firebase-example.ts`** - Usage examples for both user and admin panels

## Quick Start

### Import Firebase Services

```typescript
// In any component or screen
import { auth, db, storage } from '../firebase';
import { FirestoreUtils, AuthUtils, StorageUtils } from '../shared/utils/firebase-utils';
```

### Authentication

```typescript
// Sign in user
const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await AuthUtils.signIn(email, password);
    console.log('User signed in:', userCredential.user.email);
  } catch (error) {
    console.error('Sign in error:', error);
  }
};

// Sign up new user
const signUpUser = async (email: string, password: string) => {
  try {
    const userCredential = await AuthUtils.signUp(email, password);
    console.log('User created:', userCredential.user.email);
  } catch (error) {
    console.error('Sign up error:', error);
  }
};

// Sign out
const signOutUser = async () => {
  await AuthUtils.signOutUser();
};
```

### Firestore Operations

```typescript
// Get a document
const userProfile = await FirestoreUtils.getDocument('users', userId);

// Add a new document
const newDocId = await FirestoreUtils.addDocument('users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Update a document
await FirestoreUtils.updateDocument('users', userId, {
  lastLogin: new Date()
});

// Query documents
const users = await FirestoreUtils.queryDocuments('users', [
  FirebaseHelpers.where('status', '==', 'active'),
  FirebaseHelpers.orderBy('createdAt', 'desc'),
  FirebaseHelpers.limit(10)
]);
```

### Storage Operations

```typescript
// Upload a file
const uploadFile = async (file: File, path: string) => {
  const downloadURL = await StorageUtils.uploadFile(file, path);
  return downloadURL;
};

// Get file URL
const fileURL = await StorageUtils.getFileURL('avatars/user123/avatar.jpg');

// Delete a file
await StorageUtils.deleteFile('avatars/user123/avatar.jpg');
```

### Real-time Listeners

```typescript
// Listen to document changes
const unsubscribe = FirestoreUtils.onDocumentSnapshot(
  'users',
  userId,
  (data) => {
    console.log('User data updated:', data);
  }
);

// Listen to collection changes
const unsubscribe = FirestoreUtils.onCollectionSnapshot(
  'users',
  [FirebaseHelpers.orderBy('createdAt', 'desc')],
  (users) => {
    console.log('Users updated:', users);
  }
);

// Don't forget to unsubscribe when component unmounts
// unsubscribe();
```

### Batch Operations

```typescript
// Perform multiple operations atomically
await FirestoreUtils.batchWrite([
  {
    type: 'update',
    collection: 'users',
    docId: 'user1',
    data: { lastActive: new Date() }
  },
  {
    type: 'update',
    collection: 'users',
    docId: 'user2',
    data: { lastActive: new Date() }
  }
]);
```

## Usage in User Panel

```typescript
// Example: User profile screen
import { useEffect, useState } from 'react';
import { FirestoreUtils, AuthUtils } from '../shared/utils/firebase-utils';

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const currentUser = AuthUtils.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = FirestoreUtils.onDocumentSnapshot(
        'users',
        currentUser.uid,
        (data) => setUserProfile(data)
      );
      return unsubscribe;
    }
  }, [currentUser]);

  const updateProfile = async (data) => {
    if (currentUser) {
      await FirestoreUtils.updateDocument('users', currentUser.uid, data);
    }
  };

  return (
    // Your component JSX
  );
};
```

## Usage in Admin Panel

```typescript
// Example: Admin user management
import { useEffect, useState } from 'react';
import { FirestoreUtils, AuthUtils } from '../../shared/utils/firebase-utils';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = FirestoreUtils.onCollectionSnapshot(
      'users',
      [FirebaseHelpers.orderBy('createdAt', 'desc')],
      (userList) => setUsers(userList)
    );
    return unsubscribe;
  }, []);

  const updateUserRole = async (userId, newRole) => {
    await FirestoreUtils.updateDocument('users', userId, { role: newRole });
  };

  return (
    // Your admin component JSX
  );
};
```

## Firebase Services Available

- **Authentication** (`auth`) - User authentication
- **Firestore** (`db`) - NoSQL database
- **Storage** (`storage`) - File storage

## Environment Configuration

The Firebase configuration is set up with the following project:
- **Project ID**: streamr-2f1c1
- **Auth Domain**: streamr-2f1c1.firebaseapp.com
- **Storage Bucket**: streamr-2f1c1.firebasestorage.app

## Security Notes

1. Never commit Firebase configuration files with real API keys to version control
2. Use Firebase Security Rules to control access to your database and storage
3. Implement proper authentication checks in your admin functions
4. Consider using Firebase App Check for additional security

## Additional Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Firestore Best Practices](https://firebase.google.com/docs/firestore/best-practices)