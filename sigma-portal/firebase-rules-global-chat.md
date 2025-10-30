## 🔥 FIREBASE RULES UPDATE REQUIRED

Add these collections to your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Books collection
    match /books/{bookId} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null;
    }
    
    // Online users collection
    match /onlineUsers/{userId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // GLOBAL CHAT - Free Fire Style
    match /globalMessages/{messageId} {
      allow read: if true;        // Everyone can read
      allow write: if request.auth != null;  // Only logged in users can write
    }
  }
}


