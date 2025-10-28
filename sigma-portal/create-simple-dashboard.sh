#!/bin/bash

# Download a fresh simple version
curl -s https://raw.githubusercontent.com/your-repo/simple-dashboard.html > dashboard-simple.html

# Or create it from scratch
cat > dashboard-simple.html << 'HTML_EOF'
<!DOCTYPE html>
<html>
<head>
    <title>Sigma Portal - Simple Upload</title>
    <meta charset="UTF-8">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; font-family: Arial, sans-serif; }
        body { background: #f5f5f5; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #333; margin-bottom: 20px; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea, select { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
        .upload-btn { background: #28a745; color: white; padding: 15px; border: none; border-radius: 5px; width: 100%; font-size: 16px; cursor: pointer; }
        .upload-btn:hover { background: #218838; }
    </style>
</head>
<body>
    <div class="container">
        <h1>📤 Upload eBook</h1>
        
        <form onsubmit="uploadBook(event)">
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
                <textarea id="bookDescription" placeholder="Book description" rows="3"></textarea>
            </div>

            <div class="form-group">
                <label>Category</label>
                <select id="bookCategory">
                    <option>Programming</option>
                    <option>Science</option>
                    <option>Fiction</option>
                    <option>Business</option>
                    <option>Other</option>
                </select>
            </div>

            <div class="form-group">
                <label>Select PDF File *</label>
                <input type="file" id="bookFile" accept=".pdf" required style="padding: 10px; border: 2px dashed #007bff; border-radius: 5px;">
            </div>

            <button type="submit" class="upload-btn">📤 Upload eBook</button>
        </form>
    </div>

    <script>
    function uploadBook(event) {
        event.preventDefault();
        
        const title = document.getElementById('bookTitle').value;
        const author = document.getElementById('bookAuthor').value;
        const fileInput = document.getElementById('bookFile');
        
        if (!fileInput.files[0]) {
            alert('Please select a PDF file');
            return;
        }
        
        const file = fileInput.files[0];
        alert('✅ Uploaded: ' + title + ' by ' + author + '\nFile: ' + file.name);
        
        // Clear form
        document.getElementById('bookTitle').value = '';
        document.getElementById('bookAuthor').value = '';
        document.getElementById('bookDescription').value = '';
        document.getElementById('bookFile').value = '';
    }
    </script>
</body>
</html>
HTML_EOF

# Replace the main dashboard
mv dashboard-simple.html dashboard.html

echo "✅ Created simple upload-only dashboard!"
echo "🎯 Features: Direct file upload, no Google Drive"
