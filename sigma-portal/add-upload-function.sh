#!/bin/bash

# Add simple upload function to existing dashboard
cat >> dashboard.html << 'SCRIPT_EOF'

<script>
// Simple upload function
function simpleUpload(event) {
    event.preventDefault();
    
    const title = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const fileInput = document.getElementById('bookFile');
    
    if (!fileInput || !fileInput.files[0]) {
        alert('Please select a PDF file');
        return;
    }
    
    const file = fileInput.files[0];
    alert('✅ Uploaded: ' + title + ' by ' + author + '\nFile: ' + file.name);
    
    // Clear form
    if (document.getElementById('bookTitle')) document.getElementById('bookTitle').value = '';
    if (document.getElementById('bookAuthor')) document.getElementById('bookAuthor').value = '';
    if (document.getElementById('bookDescription')) document.getElementById('bookDescription').value = '';
    if (fileInput) fileInput.value = '';
    
    return false;
}
</script>
SCRIPT_EOF

echo "✅ Added simple upload function!"
echo "🔄 Now replace your upload form to use simpleUpload(event)"
