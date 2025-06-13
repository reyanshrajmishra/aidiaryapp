// index.js

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Initialize Supabase - replace keys with yours
const supabase = createClient(
  'https://bylkeapkyephshxjhpst.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5bGtlYXBreWVwaHNoeGpocHN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzNjY1MzYsImV4cCI6MjA2NDk0MjUzNn0.wwQGKkPvkFho6fH2zNSCX4Hn5CbAXRDp_SMyDB6AgF4'
);

// DOM elements
const authBox = document.getElementById('auth');
const container = document.querySelector('.container');
const statusMessage = document.getElementById('statusMessage');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const authForm = document.getElementById('authForm');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const btnSwitchToSignUp = document.getElementById('btnSwitchToSignUp');
const btnSwitchToSignIn = document.getElementById('btnSwitchToSignIn');
const btnGoogle = document.getElementById('btnGoogle');
const btnSignOut = document.getElementById('btnSignOut');

const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const deleteBtn = document.getElementById('deleteBtn');
const loadBtn = document.getElementById('loadBtn');
const inputText = document.getElementById('inputText');
const generatedEntry = document.getElementById('generatedEntry');
const datePicker = document.getElementById('datePicker');
const loadedEntry = document.getElementById('loadedEntry');

let authMode = 'signin'; // or 'signup'

function showMessage(message, isError = false) {
  statusMessage.textContent = message;
  statusMessage.style.color = isError ? 'red' : 'green';
  setTimeout(() => {
    statusMessage.textContent = '';
  }, 6000);
}

function updateAuthStatus(email) {
  if (email) {
    // User logged in
    authBox.style.display = 'none';          // Hide auth box
    container.style.display = 'block';       // Show diary container
    btnSignOut.style.display = 'inline-block';  // Show logout button
  } else {
    // User not logged in
    authBox.style.display = 'block';         // Show auth box
    container.style.display = 'none';        // Hide diary container
    btnSignOut.style.display = 'none';       // Hide logout button
  }
  console.log('Auth Status Updated. Email:', email, 'Logout btn display:', btnSignOut.style.display);
}


// Switch between sign in and sign up UI
function switchToSignUp() {
  authMode = 'signup';
  authSubmitBtn.textContent = 'Sign Up';
  btnSwitchToSignUp.style.display = 'none';
  btnSwitchToSignIn.style.display = 'inline-block';
}
function switchToSignIn() {
  authMode = 'signin';
  authSubmitBtn.textContent = 'Sign In';
  btnSwitchToSignUp.style.display = 'inline-block';
  btnSwitchToSignIn.style.display = 'none';
}

// Auth form submit handler
authForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMessage('Please enter both email and password.', true);
    return;
  }

  if (authMode === 'signin') {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return showMessage(error.message, true);
    console.log('Signed in user:', data.user);
    updateAuthStatus(data.user.email);
    showMessage('Logged in successfully.');
  } else {
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) return showMessage(error.message, true);
    showMessage('Check your email to confirm the account.');
  }
});

// Google OAuth
btnGoogle.onclick = async () => {
  const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
  if (error) return showMessage(error.message, true);
  // Redirect happens, no UI update here
};

// Sign out
btnSignOut.onclick = async () => {
  await supabase.auth.signOut();
  updateAuthStatus(null);
  showMessage('Logged out successfully.');
};

// Switch buttons
btnSwitchToSignUp.onclick = switchToSignUp;
btnSwitchToSignIn.onclick = switchToSignIn;

// On load, check session
window.onload = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  console.log('Session on load:', session);
  if (session?.user) {
    updateAuthStatus(session.user.email);
  } else {
    updateAuthStatus(null);
  }
};

// AI diary generation
async function generateDiaryEntry(text) {
  const todayDate = new Date().toLocaleDateString('en-CA'); // yyyy-mm-dd format

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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'
      },
      body: JSON.stringify({
        model: "model: "nousresearch/nous-capybara-7b",
        messages: [{
          role: "user",
          content: `Hey My Name Is Reyansh Raj Mishra and you are integrated in my app for helping me write diary entrys. The date is ${todayDate}. Today I: ${text}`
        }]
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Failed to generate entry:', error);
    return 'Error generating entry. Please try again.';
  }
}

generateBtn.onclick = async () => {
  const text = inputText.value.trim();
  if (!text) return showMessage('Please enter what happened today.', true);
  generatedEntry.textContent = 'Generating...';
  const entry = await generateDiaryEntry(text);
  generatedEntry.textContent = entry;
};

// Save diary entry (local + cloud if logged in)
saveBtn.onclick = async () => {
  const entry = generatedEntry.textContent.trim();
  if (!entry || entry === 'Generating...' || entry.startsWith('Error')) {
    return showMessage('No valid generated entry to save.', true);
  }

  const dateKey = datePicker.value;
  if (!dateKey) return showMessage('Please select a date to save the entry.', true);

  localStorage.setItem(`diary_${dateKey}`, entry);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase.from('entries').upsert({ user_id: user.id, date: dateKey, entry });
    if (error) {
      return showMessage('Error saving entry to cloud: ' + error.message, true);
    }
    showMessage(`Entry saved for ${dateKey} (cloud + local)`);
  } else {
    showMessage(`Entry saved locally for ${dateKey} (not signed in)`);
  }
};

// Delete entry (local + cloud)
deleteBtn.onclick = async () => {
  const dateKey = datePicker.value;
  if (!dateKey) return showMessage('Please select a date to delete.', true);

  localStorage.removeItem(`diary_${dateKey}`);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { error } = await supabase
      .from('entries')
      .delete()
      .eq('user_id', user.id)
      .eq('date', dateKey);

    if (error) {
      return showMessage('Failed to delete entry from cloud: ' + error.message, true);
    }
  }

  generatedEntry.textContent = '';
  loadedEntry.textContent = '';

  showMessage(`Entry for ${dateKey} deleted.`);
};

// Load diary entry
loadBtn.onclick = async () => {
  const dateKey = datePicker.value;
  if (!dateKey) return showMessage('Please select a date.', true);

  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    const { data, error } = await supabase
      .from('entries')
      .select('entry')
      .eq('user_id', user.id)
      .eq('date', dateKey)
      .single();

    loadedEntry.textContent = data?.entry || 'No entry found for this date.';
  } else {
    loadedEntry.textContent = localStorage.getItem(`diary_${dateKey}`) || 'No entry found for this date.';
  }
};
