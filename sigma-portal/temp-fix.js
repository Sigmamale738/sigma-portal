// Fixed upload function that saves to Firebase
async function uploadBook(event) {
    event.preventDefault();
    
    if (!firebaseReady) {
        alert('Firebase not ready yet. Please wait...');
        return;
    }

    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const description = document.getElementById('bookDescription').value;
    const category = document.getElementById('bookCategory').value;
    const fileInput = document.getElementById('bookFile');

    if (!fileInput.files[0]) {
        alert('Please select a PDF file');
        return;
    }

    try {
        const { collection, addDoc } = window.firestoreFunctions;
        
        await addDoc(collection(window.firestore, 'books'), {
            title: title,
            author: author,
            description: description,
            category: category,
            fileName: fileInput.files[0].name,
            fileSize: (fileInput.files[0].size / 1024 / 1024).toFixed(2) + ' MB',
            uploadedBy: currentUser,
            uploadDate: new Date(),
            downloads: 0,
            totalRating: 0,
            ratingCount: 0,
            averageRating: 0,
            reviews: []
        });

        // Clear form
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        document.getElementById('bookDescription').value = '';
        document.getElementById('bookFile').value = '';

        alert('✅ Book uploaded successfully to Firebase!');
        loadEnhancedBooks();
        
    } catch (error) {
        console.error('Error uploading book:', error);
        alert('Error uploading book. Please try again.');
    }
}

// Fixed rating system
async function rateBook(bookId, rating) {
    if (!firebaseReady) return;
    
    try {
        const { doc, updateDoc, getDoc, increment } = window.firestoreFunctions;
        const bookRef = doc(window.firestore, 'books', bookId);
        const bookDoc = await getDoc(bookRef);
        const bookData = bookDoc.data();
        
        const currentTotal = bookData.totalRating || 0;
        const currentCount = bookData.ratingCount || 0;
        const newTotal = currentTotal + rating;
        const newCount = currentCount + 1;
        const newAverage = newTotal / newCount;
        
        await updateDoc(bookRef, {
            totalRating: newTotal,
            ratingCount: newCount,
            averageRating: newAverage
        });
        
        alert(`Thanks for your ${rating} star rating!`);
        loadEnhancedBooks();
        
    } catch (error) {
        console.error('Error rating book:', error);
        alert('Error submitting rating. Please try again.');
    }
}

// Fixed review system
async function addReview(bookId) {
    if (!firebaseReady) return;
    
    const reviewInput = document.getElementById(`review-${bookId}`);
    const reviewText = reviewInput.value.trim();
    
    if (!reviewText) {
        alert('Please enter a review first.');
        return;
    }
    
    try {
        const { doc, updateDoc, arrayUnion } = window.firestoreFunctions;
        const bookRef = doc(window.firestore, 'books', bookId);
        
        await updateDoc(bookRef, {
            reviews: arrayUnion({
                user: currentUser,
                text: reviewText,
                date: new Date()
            })
        });
        
        alert('Review added successfully!');
        reviewInput.value = '';
        loadEnhancedBooks();
        
    } catch (error) {
        console.error('Error adding review:', error);
        alert('Error adding review. Please try again.');
    }
}

// Fixed download function
function downloadBook(bookId) {
    if (firebaseReady && bookId) {
        const { doc, updateDoc, increment } = window.firestoreFunctions;
        updateDoc(doc(window.firestore, 'books', bookId), {
            downloads: increment(1)
        }).catch(error => console.error('Error updating download count:', error));
    }
    // For now, just show success message since we don't have actual file storage
    alert('Download started! In a real app, this would download the file.');
}

// Fixed delete function
async function deleteBook(bookId) {
    if (!firebaseReady) return;
    
    if (confirm('Are you sure you want to delete this book?')) {
        try {
            const { doc, deleteDoc } = window.firestoreFunctions;
            await deleteDoc(doc(window.firestore, 'books', bookId));
            alert('Book deleted successfully!');
            loadMyBooks();
            loadEnhancedBooks();
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Error deleting book. Please try again.');
        }
    }
}

// Fixed display to show real ratings
function displayEnhancedBooks(books) {
    const grid = document.getElementById('publicLibraryGrid');
    if (books.length === 0) {
        grid.innerHTML = '<div class="loading">No books found matching your criteria.</div>';
        return;
    }

    grid.innerHTML = books.map(book => {
        const uploadDate = book.uploadDate ? new Date(book.uploadDate.seconds * 1000).toLocaleDateString() : 'Unknown date';
        const isOwner = book.uploadedBy === currentUser;
        const averageRating = book.averageRating || 0;
        const stars = '⭐'.repeat(Math.floor(averageRating)) + '☆'.repeat(5 - Math.floor(averageRating));

        return `
            <div class="book-card">
                ${isOwner ? '<div class="owner-badge">OWNER</div>' : ''}
                <div class="book-cover">📚</div>
                <div class="book-title" style="font-weight: bold; font-size: 1.1em;">${book.title}</div>
                <div class="book-author" style="color: #666; margin: 0.5rem 0;">By ${book.author}</div>
                <div class="rating-stars" title="${averageRating.toFixed(1)}/5 stars">
                    ${stars} <small style="color: #666;">(${averageRating.toFixed(1)})</small>
                </div>
                <div style="color: #888; font-size: 0.9em; margin: 0.5rem 0;">
                    ${book.category} • ${book.downloads || 0} downloads
                </div>
                <div style="color: #999; font-size: 0.8em;">
                    Uploaded by ${book.uploadedBy} • ${uploadDate}
                </div>
                <button class="download-btn" onclick="downloadBook('${book.id}')">
                    📥 Download eBook
                </button>
                <div class="review-section">
                    <div class="star-rating">
                        <span style="cursor: pointer;" onclick="rateBook('${book.id}', 1)">★</span>
                        <span style="cursor: pointer;" onclick="rateBook('${book.id}', 2)">★</span>
                        <span style="cursor: pointer;" onclick="rateBook('${book.id}', 3)">★</span>
                        <span style="cursor: pointer;" onclick="rateBook('${book.id}', 4)">★</span>
                        <span style="cursor: pointer;" onclick="rateBook('${book.id}', 5)">★</span>
                    </div>
                    ${book.reviews && book.reviews.length > 0 ? 
                        `<div style="max-height: 100px; overflow-y: auto; margin: 10px 0;">
                            ${book.reviews.map(review => 
                                `<div style="padding: 5px; border-bottom: 1px solid #eee;">
                                    <strong>${review.user}:</strong> ${review.text}
                                </div>`
                            ).join('')}
                        </div>` : ''
                    }
                    <input type="text" class="review-input" placeholder="Add a review..." id="review-${book.id}">
                    <button onclick="addReview('${book.id}')" style="background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 5px; width: 100%; cursor: pointer;">
                        💬 Add Review
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Fixed logout function
function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}
