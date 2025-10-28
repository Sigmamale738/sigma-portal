// Bug Fixes Only - Interface remains exactly the same

// Fix 1: Ensure books are properly initialized
if (!localStorage.getItem('sigmaBooks')) {
    localStorage.setItem('sigmaBooks', JSON.stringify([]));
}

// Fix 2: Proper upload function
function uploadBook(event) {
    event.preventDefault();
    
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const description = document.getElementById('description').value;
    const fileInput = document.getElementById('file');

    if (!fileInput.files[0]) {
        alert('Please select a PDF file');
        return false;
    }

    const books = JSON.parse(localStorage.getItem('sigmaBooks')) || [];
    
    const newBook = {
        id: Date.now().toString(),
        title: title,
        author: author,
        description: description,
        uploadedBy: localStorage.getItem('currentUser') || 'user',
        ratings: [],
        reviews: [],
        fileName: fileInput.files[0].name,
        fileSize: (fileInput.files[0].size / 1024 / 1024).toFixed(2) + ' MB',
        uploadDate: new Date().toLocaleDateString()
    };

    books.push(newBook);
    localStorage.setItem('sigmaBooks', JSON.stringify(books));

    // Clear form
    document.getElementById('title').value = '';
    document.getElementById('author').value = '';
    document.getElementById('description').value = '';
    document.getElementById('file').value = '';

    alert('Book uploaded successfully!');
    showTab('library');
    return false;
}

// Fix 3: Working rating system
function rateBook(bookId, rating) {
    const books = JSON.parse(localStorage.getItem('sigmaBooks')) || [];
    const book = books.find(b => b.id === bookId);
    
    if (book) {
        if (!book.ratings) book.ratings = [];
        book.ratings.push(rating);
        localStorage.setItem('sigmaBooks', JSON.stringify(books));
        displayBooks();
        alert(`Rated ${rating} stars!`);
    }
}

// Fix 4: Working review system
function addReview(bookId) {
    const reviewInput = document.getElementById(`review-${bookId}`);
    const reviewText = reviewInput.value.trim();

    if (!reviewText) {
        alert('Please enter a review');
        return;
    }

    const books = JSON.parse(localStorage.getItem('sigmaBooks')) || [];
    const book = books.find(b => b.id === bookId);
    
    if (book) {
        if (!book.reviews) book.reviews = [];
        book.reviews.push({
            user: localStorage.getItem('currentUser') || 'user',
            text: reviewText,
            date: new Date().toLocaleDateString()
        });
        localStorage.setItem('sigmaBooks', JSON.stringify(books));
        reviewInput.value = '';
        displayBooks();
        alert('Review added!');
    }
}

// Fix 5: Proper book display
function displayBooks() {
    const books = JSON.parse(localStorage.getItem('sigmaBooks')) || [];
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = '';

    if (books.length === 0) {
        booksList.innerHTML = '<p>No books available. Upload the first book!</p>';
        return;
    }

    books.forEach(book => {
        const avgRating = book.ratings && book.ratings.length > 0 
            ? (book.ratings.reduce((a, b) => a + b, 0) / book.ratings.length).toFixed(1)
            : '0';
        
        const stars = '⭐'.repeat(Math.floor(avgRating)) || 'No ratings yet';

        const bookDiv = document.createElement('div');
        bookDiv.className = 'book-card';
        bookDiv.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p>${book.description || 'No description'}</p>
            <div class="stars">${stars} (${avgRating}/5)</div>
            <p><small>Uploaded by: ${book.uploadedBy} • ${book.uploadDate}</small></p>
            
            <div style="margin: 10px 0;">
                <strong>Rate this book:</strong>
                <span onclick="rateBook('${book.id}', 1)" style="cursor: pointer;">⭐</span>
                <span onclick="rateBook('${book.id}', 2)" style="cursor: pointer;">⭐</span>
                <span onclick="rateBook('${book.id}', 3)" style="cursor: pointer;">⭐</span>
                <span onclick="rateBook('${book.id}', 4)" style="cursor: pointer;">⭐</span>
                <span onclick="rateBook('${book.id}', 5)" style="cursor: pointer;">⭐</span>
            </div>

            <div style="margin: 10px 0;">
                <input type="text" id="review-${book.id}" placeholder="Write a review..." style="width: 70%; padding: 5px;">
                <button onclick="addReview('${book.id}')" style="padding: 5px 10px;">Add Review</button>
            </div>

            ${book.reviews && book.reviews.length > 0 ? `
                <div style="margin-top: 10px;">
                    <strong>Reviews:</strong>
                    ${book.reviews.map(review => `
                        <div class="review">
                            <strong>${review.user}:</strong> ${review.text}
                            <div><small>${review.date}</small></div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p><small>No reviews yet</small></p>'}
        `;
        booksList.appendChild(bookDiv);
    });
}

// Fix 6: Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    displayBooks();
});
