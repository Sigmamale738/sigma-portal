// This script adds delete functionality to your existing dashboard
const fs = require('fs');

let dashboardContent = fs.readFileSync('dashboard.html', 'utf8');

// Add delete button CSS
const deleteButtonCSS = `
        .delete-btn { 
            background: #dc3545; 
            color: white; 
            border: none; 
            padding: 8px 12px; 
            border-radius: 5px; 
            cursor: pointer; 
            margin-top: 0.5rem; 
            width: 100%; 
            font-size: 0.9em;
        }
        .owner-badge { 
            position: absolute; 
            top: 10px; 
            right: 10px; 
            background: #667eea; 
            color: white; 
            padding: 4px 8px; 
            border-radius: 12px; 
            font-size: 0.8em; 
        }
`;

// Add to existing CSS
dashboardContent = dashboardContent.replace(
    /\.loading.*?}/s,
    `.loading { text-align: center; padding: 2rem; color: #666; }${deleteButtonCSS}`
);

// Add delete button to book cards in public library
dashboardContent = dashboardContent.replace(
    /<button class="download-btn" onclick="downloadBook\('\$\{book\.driveLink\}', '\$\{doc\.id\}'\)">📥 Download eBook<\/button>/g,
    `<button class="download-btn" onclick="downloadBook('\${book.driveLink}', '\${doc.id}')">📥 Download eBook</button>
                            \${isOwner ? \`
                                <button class="delete-btn" onclick="deleteBook('\${doc.id}', '\${book.title}')">
                                    🗑️ Delete This Book
                                </button>
                            \` : ''}`
);

// Add delete button to user's books
dashboardContent = dashboardContent.replace(
    /<button class="download-btn" onclick="downloadBook\('\$\{book\.driveLink\}', '\$\{doc\.id\}'\)">📥 Download \(\$\{book\.downloads \|\| 0\}\)<\/button>/g,
    `<button class="download-btn" onclick="downloadBook('\${book.driveLink}', '\${doc.id}')">📥 Download (\${book.downloads || 0})</button>
                            <button class="delete-btn" onclick="deleteBook('\${doc.id}', '\${book.title}')">
                                🗑️ Delete This Book
                            </button>`
);

// Add owner badge to user's books
dashboardContent = dashboardContent.replace(
    /<div class="book-card">\s*<div class="book-cover">📚<\/div>/g,
    `<div class="book-card">
                            <div class="owner-badge">OWNER</div>
                            <div class="book-cover">📚</div>`
);

// Add owner badge check for public library
dashboardContent = dashboardContent.replace(
    /const book = doc\.data\(\);\s*const uploadDate = new Date\(book\.uploadDate\)\.toLocaleDateString\(\);/g,
    `const book = doc.data();
                    const uploadDate = new Date(book.uploadDate).toLocaleDateString();
                    const isOwner = book.uploadedBy === currentUser;`
);

// Add owner badge to public library cards
dashboardContent = dashboardContent.replace(
    /<div class="book-card">\s*<div class="book-cover">📚<\/div>/g,
    `<div class="book-card">
                            \${isOwner ? '<div class="owner-badge">OWNER</div>' : ''}
                            <div class="book-cover">📚</div>`
);

// Add delete function to JavaScript
const deleteFunction = `
        // Delete book (only for owner)
        async function deleteBook(bookId, bookTitle) {
            if (!confirm(\`Are you sure you want to delete "\${bookTitle}"? This action cannot be undone!\`)) {
                return;
            }

            if (!firebaseReady) {
                alert('Firebase is not ready. Please try again.');
                return;
            }

            try {
                const { deleteDoc, doc } = window.firestoreFunctions;
                await deleteDoc(doc(window.firestore, 'books', bookId));
                
                alert(\`✅ "\${bookTitle}" has been deleted from the public library.\`);
                
                // Refresh displays
                loadPublicBooks();
                loadMyBooks();
                
            } catch (error) {
                alert('Error deleting book: ' + error.message);
                console.error('Delete error:', error);
            }
        }
`;

// Add delete function before logout function
dashboardContent = dashboardContent.replace(
    /\/\/ Logout\s+function logout\(\)/,
    `${deleteFunction}

        // Logout
        function logout()`
);

fs.writeFileSync('dashboard.html', dashboardContent);
console.log('✅ Delete buttons added successfully!');
