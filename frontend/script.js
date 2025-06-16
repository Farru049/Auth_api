let token = localStorage.getItem('authToken') || "";
const loadingElement = document.getElementById("loading");
const outputElement = document.getElementById("output");
const fileInfoElement = document.getElementById("fileInfo");
const fileInput = document.getElementById("fileInput");
const imagePreview = document.getElementById("imagePreview");
const imagePreviewContainer = document.getElementById("imagePreviewContainer");

// Tab navigation
document.addEventListener('DOMContentLoaded', () => {
  // Setup tab navigation
  const tabButtons = document.querySelectorAll('.tab-btn');
  const sections = document.querySelectorAll('.section');
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const sectionId = button.getAttribute('data-section');
      
      // Remove active class from all buttons and sections
      tabButtons.forEach(btn => btn.classList.remove('active'));
      sections.forEach(section => section.classList.remove('active'));
      
      // Add active class to clicked button and corresponding section
      button.classList.add('active');
      document.getElementById(sectionId).classList.add('active');
    });
  });
    // File input change handler
  fileInput.addEventListener('change', () => {
    if (fileInput.files.length > 0) {
      const file = fileInput.files[0];
      const fileSize = (file.size / 1024).toFixed(2);
      fileInfoElement.textContent = `Selected: ${file.name} (${fileSize} KB)`;
      
      // Check if the file is an image
      if (file.type.startsWith('image/')) {
        // Show image preview
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreviewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        // Hide image preview for non-image files
        imagePreviewContainer.style.display = 'none';
      }
    } else {
      fileInfoElement.textContent = "No file selected";
      imagePreviewContainer.style.display = 'none';
    }
  });
  
  // Check if user is already logged in
  if (token) {
    showMessage("You are already logged in", "success");
    // Activate upload tab
    tabButtons.forEach(btn => btn.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));
    
    document.querySelector('[data-section="upload-section"]').classList.add('active');
    document.getElementById('upload-section').classList.add('active');
  }
});

function showLoading(show = true) {
  loadingElement.style.display = show ? "block" : "none";
}

function showMessage(message, type = "success") {
  // Clear any previous child elements
  while (outputElement.firstChild) {
    outputElement.removeChild(outputElement.firstChild);
  }
  
  outputElement.innerText = message;
  outputElement.className = type === "error" ? "error" : "";
  outputElement.style.display = "block";
  
  // Auto-hide message after 5 seconds if it's a success message
  if (type === "success") {
    setTimeout(() => {
      // Don't hide if there are child elements (like the URL link)
      if (outputElement.childNodes.length <= 1) {
        outputElement.style.display = "none";
      }
    }, 5000);
  }
}

async function signup() {
  const email = document.getElementById("signupEmail").value;
  const password = document.getElementById("signupPassword").value;
  
  // Simple validation
  if (!email || !password) {
    showMessage("Please enter both email and password", "error");
    return;
  }
  
  if (password.length < 6) {
    showMessage("Password must be at least 6 characters long", "error");
    return;
  }

  showLoading(true);
  showMessage("");
  
  try {
    const res = await fetch('http://localhost:3000/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (res.ok) {
      if (data.token) {
        token = data.token;
        localStorage.setItem('authToken', token);
        showMessage("Account created successfully! You are now logged in.", "success");
        
        // Switch to upload tab
        document.querySelector('[data-section="upload-section"]').click();
        
        document.getElementById("signupEmail").value = "";
        document.getElementById("signupPassword").value = "";
      }
    } else {
      showMessage(data.message || "Signup failed. Please try again.", "error");
    }
  } catch (error) {
    showMessage("Connection error. Please check your internet connection.", "error");
  } finally {
    showLoading(false);
  }
}

async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  // Simple validation
  if (!email || !password) {
    showMessage("Please enter both email and password", "error");
    return;
  }

  showLoading(true);
  showMessage("");
  
  try {
    const res = await fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    
    if (res.ok && data.token) {
      token = data.token;
      localStorage.setItem('authToken', token);
      showMessage("Logged in successfully!", "success");
      
      // Switch to upload tab
      document.querySelector('[data-section="upload-section"]').click();
      
      document.getElementById("loginEmail").value = "";
      document.getElementById("loginPassword").value = "";
    } else {
      showMessage(data.message || data.error || "Login failed. Please check your credentials.", "error");
    }
  } catch (error) {
    showMessage("Connection error. Please check your internet connection.", "error");
  } finally {
    showLoading(false);
  }
}

async function uploadFile() {
  const file = fileInput.files[0];
  
  if (!file) {
    showMessage("Please select a file to upload", "error");
    return;
  }
  
  if (!token) {
    showMessage("Please log in to upload files", "error");
    document.querySelector('[data-section="login-section"]').click();
    return;
  }

  showLoading(true);
  showMessage("");
  
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await fetch("http://localhost:3000/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    const data = await res.json();
    
    if (res.ok) {
      showMessage(`File uploaded successfully: ${file.name}`, "success");
      
      // Keep the image preview visible after successful upload
      if (!file.type.startsWith('image/')) {
        // Hide image preview for non-image files
        imagePreviewContainer.style.display = 'none';
      }
      
      // Update upload success information with the URL if available
      if (data.url) {
        // Create a clickable link to the uploaded file
        const urlLink = document.createElement('div');
        urlLink.innerHTML = `<div class="upload-success">
          <p>File available at: <a href="${data.url}" target="_blank">${data.url}</a></p>
        </div>`;
        outputElement.appendChild(urlLink);
      }
      
      fileInput.value = "";
      fileInfoElement.textContent = "No file selected";
    } else {
      showMessage(data.message || data.error || "Upload failed", "error");
      
      // If token expired
      if (res.status === 401 || res.status === 403) {
        token = "";
        localStorage.removeItem('authToken');
        document.querySelector('[data-section="login-section"]').click();
      }
    }
  } catch (error) {
    showMessage("Connection error. Please check your internet connection.", "error");
  } finally {
    showLoading(false);
  }
}

// Logout function
function logout() {
  token = "";
  localStorage.removeItem('authToken');
  showMessage("You have been logged out.", "success");
  document.querySelector('[data-section="login-section"]').click();
}
