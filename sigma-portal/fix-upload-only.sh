#!/bin/bash

# Backup current file
cp dashboard.html dashboard-backup-upload.html

# Create the new upload section
NEW_UPLOAD_SECTION='<div id="upload" class="tab-content">
    <h2>📤 Upload eBook</h2>

    <div class="guide-box">
        <h3>🚀 Simple File Upload:</h3>
        <ol>
            <li><strong>Choose PDF file</strong> from your device</li>
            <li>Add book details below</li>
            <li>Click upload</li>
        </ol>
    </div>

    <form onsubmit="simpleUpload(event)">
        <div class="form-group">
            <label>Book Title *</label>
            <input type="text" id="bookTitle" placeholder="Enter book title" required>
        </div>

        <div class="form-group">
            <label>Author Name *</label>
            <input type="text" id="bookAuthor" placeholder="Author name" required>
        </div>

        <div class="form-group">
            <label>Book Description</label>
            <textarea id="bookDescription" placeholder="Brief description about the book" rows="3"></textarea>
        </div>

        <div class="form-group">
            <label>Category</label>
            <select id="bookCategory">
                <option>Programming & Tech</option>
                <option>Science & Education</option>
                <option>Fiction & Literature</option>
                <option>Business & Finance</option>
                <option>Self Development</option>
                <option>Other</option>
            </select>
        </div>

        <div class="form-group">
            <label>Select eBook File (PDF) *</label>
            <input type="file" id="bookFile" accept=".pdf" required style="padding: 1rem; border: 2px dashed #667eea; border-radius: 8px; width: 100%;">
        </div>

        <button type="submit" class="upload-btn">📤 Upload eBook</button>
    </form>
</div>'

# Use sed to replace the upload section
sed -i '/<div id="upload" class="tab-content">/,/<\/div>/c\'"$NEW_UPLOAD_SECTION" dashboard.html

echo "✅ Upload section replaced!"
echo "📁 Backup saved as: dashboard-backup-upload.html"
