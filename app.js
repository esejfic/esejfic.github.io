if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW:', e));
}

const firebaseConfig = {
  apiKey: "AIzaSyCu8kwpBMc7zxesOAdG9uBPMPvtrMGPb6E",
  authDomain: "studio-3733247372-de271.firebaseapp.com",
  projectId: "studio-3733247372-de271",
  storageBucket: "studio-3733247372-de271.appspot.com",
  messagingSenderId: "251230499261",
  appId: "1:251230499261:web:7f8e46d989296df521e2d4"
};
const appId = 'secure-messenger-v2';

// Firebase Imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInAnonymously,
  EmailAuthProvider, linkWithCredential, sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore, setDoc, getDoc, doc, collection, onSnapshot,
  serverTimestamp, query, orderBy, runTransaction, writeBatch, updateDoc,
  getDocs, startAfter, limit, where
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

// =============================================================================
// TRANSLATION SYSTEM
// =============================================================================
const translations = {
  en: {
    // Auth View
    appTitle: "🔒 Secure Messenger",
    appSubtitle: "End-to-end encrypted",
    usernamePlaceholder: "Choose username (3-20 characters)",
    initializeSession: "Initialize Session",
    orRestoreBackup: "Or restore backup:",
    importBackup: "Import Backup",
    keysLocalInfo: "Your keys are generated locally and never sent to the server.",
    
    // Loading
    loading: "Loading...",
    connecting: "Connecting...",
    openingChat: "Opening chat...",
    decryptingBackup: "Decrypting backup...",
    encryptingAndUploading: "Encrypting and uploading image...",
    signingOut: "Signing out...",
    initializingSession: "Initializing session...",
    generatingKeys: "Generating keys...",
    savingProfile: "Saving profile...",
    loadingSession: "Loading session...",
    searchingUser: "Searching for user...",
    linkingAccount: "Linking account...",
    
    // Sidebar
    profile: "Profile",
    logout: "Logout",
    copyUserId: "Copy",
    copied: "✓ Copied",
    chats: "Chats",
    newChat: "+ New",
    noChats: "No chats available",
    settings: "⚙️ Settings",
    createBackup: "💾 Create Backup",
    
    // Chat Window
    welcome: "Welcome!",
    welcomeText: "Select a chat or start a new one.",
    typing: "typing...",
    info: "ℹ️ Info",
    messageInput: "Type a message...",
    send: "Send",
    loadOlder: "Load older messages",
    loadingMsg: "Loading...",
    
    // Messages
    now: "Now",
    minutesAgo: "min ago",
    hoursAgo: "h ago",
    yesterday: "Yesterday",
    daysAgo: "d ago",
    messageDeleted: "[Message deleted]",
    decryptionFailed: "[Decryption failed]",
    imageLoadFailed: "Image could not be loaded",
    clickToDelete: "Click to delete",
    
    // Modals
    ok: "OK",
    cancel: "Cancel",
    error: "Error",
    invalid: "Invalid",
    tooShort: "Too short",
    tooLong: "Too long",
    notFound: "Not found",
    
    usernameInvalid: "Username must be 3-20 characters long.",
    usernameTooLong: "Username too long (max 20 characters).",
    usernameExists: "Username already taken.",
    notAuthenticated: "Not authenticated. Please reload the page.",
    
    loginError: "Login Error",
    privateKeyNotFound: "Local key not found. Please initialize session or restore backup.",
    userDataNotFound: "User data not found.",
    
    createBackupTitle: "Create Backup",
    createBackupText: "Strong password (min. 12 characters):",
    passwordPlaceholder: "••••••••",
    confirmPassword: "Confirm",
    repeatPassword: "Repeat password:",
    passwordsNoMatch: "Passwords don't match",
    noPasswordEntered: "No password entered",
    minCharactersRequired: "At least 12 characters required.",
    backupSuccess: "Success",
    backupSuccessText: "Backup has been downloaded. Please keep it safe!",
    
    restoreBackupTitle: "Restore Backup",
    restoreBackupText: "This will replace the current session. Continue?",
    enterBackupPassword: "Password",
    enterBackupPasswordText: "Enter backup password:",
    incompatibleBackup: "Incompatible backup format",
    wrongPassword: "Wrong password",
    restoreSuccess: "Backup restored!",
    
    notAvailable: "Not available",
    backupOnlyAfterInit: "Backup only available after initialization or restore.",
    
    newChatTitle: "New Chat",
    newChatText: "Partner's username:",
    userDataNotLoaded: "User data not yet loaded.",
    cannotChatYourself: "You cannot start a chat with yourself.",
    userNotFound: "User not found.",
    
    deleteMessageTitle: "Delete message?",
    deleteMessageText: "This message will be deleted for everyone.",
    
    tooFast: "Too fast",
    rateLimitMsg: "Please wait. Limit: {limit} messages/minute.",
    pleaseWait: "Please wait a moment.",
    
    maxCharsPerMessage: "Maximum 5000 characters per message.",
    invalidFileType: "Please select an image.",
    fileTooLarge: "Too large",
    maxFileSize: "Maximum 10 MB per image.",
    
    settingsTitle: "Settings",
    sendReadReceipts: "Send read receipts",
    showTypingIndicators: "Show typing indicators",
    linkEmailAccount: "Link Email",
    restoreBackupBtn: "Restore Backup",
    
    linkAccountTitle: "Link Account",
    enterEmail: "Enter email address:",
    emailPlaceholder: "name@example.com",
    validEmailRequired: "Please enter a valid email.",
    choosePassword: "Password",
    choosePasswordText: "Choose strong password (min. 12 characters):",
    accountLinked: "Account has been linked. Please confirm email.",
    emailAlreadyInUse: "This email is already registered.",
    credentialInUse: "These credentials are already in use.",
    invalidEmail: "Email address is invalid.",
    
    chatInfoTitle: "Chat with {username}",
    security: "Security",
    yourFingerprint: "Your fingerprint:",
    partnerFingerprint: "Partner fingerprint:",
    copy: "Copy",
    compareFingerprints: "Compare fingerprints",
    compareFingerprintsText: "Compare these fingerprints with your partner over a secure channel (e.g., in person, phone). If they match exactly, the connection is secure.",
    
    createBackupNow: "Create a backup of your keys now!",
    
    connectionError: "Connection Error",
    couldNotConnect: "Could not establish connection.",
    criticalError: "Critical error:",
    messagesLoadFailed: "Messages could not be loaded.",
    messageNotSent: "Message could not be sent.",
    chatsLoadFailed: "Chats could not be loaded.",
    chatCreationFailed: "Chat creation failed",
    imageUploadFailed: "Image upload failed",
    loadingFailed: "Loading failed",
    deletionFailed: "Deletion failed",

    
  },
  de: {
    // Auth View
    appTitle: "🔒 Sicherer Messenger",
    appSubtitle: "Ende-zu-Ende verschlüsselt",
    usernamePlaceholder: "Benutzername wählen (3-20 Zeichen)",
    initializeSession: "Sitzung initialisieren",
    orRestoreBackup: "Oder Backup wiederherstellen:",
    importBackup: "Backup importieren",
    keysLocalInfo: "Ihre Schlüssel werden lokal generiert und niemals an den Server gesendet.",
    
    // Loading
    loading: "Lade...",
    connecting: "Verbinde...",
    openingChat: "Öffne Chat...",
    decryptingBackup: "Entschlüssele Backup...",
    encryptingAndUploading: "Verschlüssele und lade Bild hoch...",
    signingOut: "Melde ab...",
    initializingSession: "Initialisiere Sitzung...",
    generatingKeys: "Generiere Schlüssel...",
    savingProfile: "Speichere Profil...",
    loadingSession: "Lade Sitzung...",
    searchingUser: "Suche Benutzer...",
    linkingAccount: "Verknüpfe Account...",
    
    // Sidebar
    profile: "Profil",
    logout: "Abmelden",
    copyUserId: "Kopieren",
    copied: "✓ Kopiert",
    chats: "Chats",
    newChat: "+ Neu",
    noChats: "Keine Chats vorhanden",
    settings: "⚙️ Einstellungen",
    createBackup: "💾 Backup erstellen",
    
    // Chat Window
    welcome: "Willkommen!",
    welcomeText: "Wählen Sie einen Chat aus oder starten Sie einen neuen.",
    typing: "schreibt...",
    info: "ℹ️ Info",
    messageInput: "Nachricht eingeben...",
    send: "Senden",
    loadOlder: "Ältere Nachrichten laden",
    loadingMsg: "Lade...",
    
    // Messages
    now: "Jetzt",
    minutesAgo: "min",
    hoursAgo: "h",
    yesterday: "Gestern",
    daysAgo: "d",
    messageDeleted: "[Nachricht gelöscht]",
    decryptionFailed: "[Entschlüsselung fehlgeschlagen]",
    imageLoadFailed: "Bild konnte nicht geladen werden",
    clickToDelete: "Klicken zum Löschen",
    
    // Modals
    ok: "OK",
    cancel: "Abbrechen",
    error: "Fehler",
    invalid: "Ungültig",
    tooShort: "Zu kurz",
    tooLong: "Zu lang",
    notFound: "Nicht gefunden",
    
    usernameInvalid: "Benutzername muss 3-20 Zeichen lang sein.",
    usernameTooLong: "Benutzername zu lang (max. 20 Zeichen).",
    usernameExists: "Benutzername bereits vergeben.",
    notAuthenticated: "Nicht authentifiziert. Bitte Seite neu laden.",
    
    loginError: "Login-Fehler",
    privateKeyNotFound: "Lokaler Schlüssel nicht gefunden. Bitte Sitzung initialisieren oder Backup wiederherstellen.",
    userDataNotFound: "Benutzerdaten nicht gefunden.",
    
    createBackupTitle: "Backup erstellen",
    createBackupText: "Starkes Passwort (mind. 12 Zeichen):",
    passwordPlaceholder: "••••••••",
    confirmPassword: "Bestätigen",
    repeatPassword: "Passwort wiederholen:",
    passwordsNoMatch: "Passwörter stimmen nicht überein",
    noPasswordEntered: "Kein Passwort eingegeben",
    minCharactersRequired: "Mindestens 12 Zeichen erforderlich.",
    backupSuccess: "Erfolgreich",
    backupSuccessText: "Backup wurde heruntergeladen. Bitte sicher aufbewahren!",
    
    restoreBackupTitle: "Backup wiederherstellen",
    restoreBackupText: "Dies ersetzt die aktuelle Sitzung. Fortfahren?",
    enterBackupPassword: "Passwort",
    enterBackupPasswordText: "Backup-Passwort eingeben:",
    incompatibleBackup: "Inkompatibles Backup-Format",
    wrongPassword: "Falsches Passwort",
    restoreSuccess: "Backup wiederhergestellt!",
    
    notAvailable: "Nicht verfügbar",
    backupOnlyAfterInit: "Backup nur nach Initialisierung oder Wiederherstellung möglich.",
    
    newChatTitle: "Neuer Chat",
    newChatText: "Benutzername des Partners:",
    userDataNotLoaded: "Benutzerdaten noch nicht geladen.",
    cannotChatYourself: "Sie können keinen Chat mit sich selbst starten.",
    userNotFound: "Benutzer nicht gefunden.",
    
    deleteMessageTitle: "Nachricht löschen?",
    deleteMessageText: "Diese Nachricht wird für alle gelöscht.",
    
    tooFast: "Zu schnell",
    rateLimitMsg: "Bitte warten. Limit: {limit} Nachrichten/Minute.",
    pleaseWait: "Bitte warten Sie einen Moment.",
    
    maxCharsPerMessage: "Maximal 5000 Zeichen pro Nachricht.",
    invalidFileType: "Bitte ein Bild auswählen.",
    fileTooLarge: "Zu groß",
    maxFileSize: "Maximal 10 MB pro Bild.",
    
    settingsTitle: "Einstellungen",
    sendReadReceipts: "Lesebestätigungen senden",
    showTypingIndicators: "Tippindikatoren anzeigen",
    linkEmailAccount: "E-Mail verknüpfen",
    restoreBackupBtn: "Backup wiederherstellen",
    
    linkAccountTitle: "Account verknüpfen",
    enterEmail: "E-Mail-Adresse eingeben:",
    emailPlaceholder: "name@example.com",
    validEmailRequired: "Bitte gültige E-Mail eingeben.",
    choosePassword: "Passwort",
    choosePasswordText: "Starkes Passwort wählen (min. 12 Zeichen):",
    accountLinked: "Account wurde verknüpft. Bitte E-Mail bestätigen.",
    emailAlreadyInUse: "Diese E-Mail ist bereits registriert.",
    credentialInUse: "Diese Zugangsdaten sind bereits in Verwendung.",
    invalidEmail: "E-Mail-Adresse ist ungültig.",
    chatInfoTitle: "Chat mit {username}",
    security: "Sicherheit",
    yourFingerprint: "Ihr Fingerabdruck:",
    partnerFingerprint: "Partner-Fingerabdruck:",
    copy: "Kopieren",
    compareFingerprints: "Fingerabdrücke vergleichen",
    compareFingerprintsText: "Vergleichen Sie diese Fingerabdrücke mit Ihrem Partner über einen sicheren Kanal (z.B. persönlich, Telefon). Wenn sie exakt übereinstimmen, ist die Verbindung sicher.",
    
    createBackupNow: "Erstellen Sie jetzt ein Backup Ihrer Schlüssel!",
    chatsLoadFailed: "Chats konnten nicht geladen werden.",
    chatCreationFailed: "Chat-Erstellung fehlgeschlagen",
    imageUploadFailed: "Bild-Upload fehlgeschlagen",
    loadingFailed: "Laden fehlgeschlagen",
    deletionFailed: "Löschen fehlgeschlagen",
    connectionError: "Verbindungsfehler",
    couldNotConnect: "Konnte keine Verbindung herstellen.",
    criticalError: "Kritischer Fehler:",
    messagesLoadFailed: "Nachrichten konnten nicht geladen werden.",
    messageNotSent: "Nachricht konnte nicht gesendet werden.",
  }
};

// Current language state
let currentLanguage = localStorage.getItem('appLanguage') || 'de';

// Translation helper function
function t(key) {
  return translations[currentLanguage]?.[key] || key;
}

// Switch language
function switchLanguage(lang) {
  currentLanguage = lang;
  localStorage.setItem('appLanguage', lang);
  updateAllText();
}

// Update all visible text on the page
function updateAllText() {
  // Update HTML lang attribute
  document.documentElement.lang = currentLanguage;
  
  // Update static HTML elements
  document.title = t('appTitle').replace('🔒 ', '');
  
  // Auth view
  const authTitle = document.querySelector('#auth-view h1');
  const authSubtitle = document.querySelector('#auth-view p');
  if (authTitle) authTitle.textContent = t('appTitle');
  if (authSubtitle) authSubtitle.textContent = t('appSubtitle');
  if (usernameInput) usernameInput.placeholder = t('usernamePlaceholder');
  if (registerButton) registerButton.textContent = t('initializeSession');
  if (restoreBtnAuth?.previousElementSibling) {
    restoreBtnAuth.previousElementSibling.textContent = t('orRestoreBackup');
  }
  if (restoreBtnAuth) restoreBtnAuth.textContent = t('importBackup');
  
  // Sidebar
  const profileTitle = document.querySelector('#app-view h2');
  if (profileTitle) profileTitle.textContent = t('profile');
  if (logoutButton) logoutButton.textContent = t('logout');
  if (copyIdButton && copyIdButton.textContent !== t('copied')) {
    copyIdButton.textContent = t('copyUserId');
  }
  const chatsTitle = document.querySelector('#app-view h3');
  if (chatsTitle) chatsTitle.textContent = t('chats');
  if (addChatButton) addChatButton.textContent = t('newChat');
  if (settingsBtn) settingsBtn.textContent = t('settings');
  if (backupBtn) backupBtn.textContent = t('createBackup');
  
  // Welcome screen
  const welcomeTitle = document.querySelector('#welcome-screen h2');
  const welcomeText = document.querySelector('#welcome-screen p');
  if (welcomeTitle) welcomeTitle.textContent = t('welcome');
  if (welcomeText) welcomeText.textContent = t('welcomeText');
  
  // Chat window
  if (chatInfoBtn) chatInfoBtn.textContent = t('info');
  if (messageInput) messageInput.placeholder = t('messageInput');
  if (sendButton) sendButton.textContent = t('send');
  if (loadOlderBtn && loadOlderBtn.textContent !== t('loadingMsg')) {
    loadOlderBtn.textContent = t('loadOlder');
  }
  
  // Language button
  const langText = document.getElementById('language-text');
  if (langText) {
    langText.textContent = currentLanguage === 'en' ? 'Deutsch' : 'English';
  }
  
  // Modal buttons (only if modal is not active)
  if (!modal.overlay.classList.contains('flex')) {
    if (modal.okBtn) modal.okBtn.textContent = t('ok');
    if (modal.cancelBtn) modal.cancelBtn.textContent = t('cancel');
  }
  
  // Update chat list
  const noChatMsg = chatList.querySelector('.text-gray-500');
  if (noChatMsg) noChatMsg.textContent = t('noChats');
}

// DOM Elements
const landingPage = document.getElementById('landing-page');
const appContainer = document.getElementById('app-container');
const banner = document.getElementById('security-banner');
const bannerMessage = document.getElementById('banner-message');
const bannerClose = document.getElementById('banner-close');
const loadingOverlay = document.getElementById('loading-overlay');
const loadingText = document.getElementById('loading-text');
const authView = document.getElementById('auth-view');
const appView = document.getElementById('app-view');
const usernameInput = document.getElementById('username-input');
const registerButton = document.getElementById('register-button');
const currentUsernameDisplay = document.getElementById('current-username-display');
const userIdDisplay = document.getElementById('user-id-display');
const copyIdButton = document.getElementById('copy-id-button');
const addChatButton = document.getElementById('add-chat-button');
const chatList = document.getElementById('chat-list');
const logoutButton = document.getElementById('logout-button');
const welcomeScreen = document.getElementById('welcome-screen');
const chatWindow = document.getElementById('chat-window');
const chatHeaderName = document.getElementById('chat-header-name');
const typingIndicator = document.getElementById('typing-indicator');
const messageList = document.getElementById('message-list');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const imageUpload = document.getElementById('image-upload');
const attachButton = document.getElementById('attach-button');
const backupBtn = document.getElementById('backup-button');
const restoreBtnAuth = document.getElementById('restore-button-auth');
const loadOlderBtn = document.getElementById('load-older');
const settingsBtn = document.getElementById('settings-button');
const chatInfoBtn = document.getElementById('chat-info-button');

// App State
let app, auth, db, storage;
let currentUser = null;
let currentUsername = null;
let userKeys = null;
let activeChat = null;
let sharedSecrets = {};
let sessionKeys = {};
const userDataCache = new Map();
let chatUnsubscribes = {};
let typingTimeout = null;

// User Settings
let userSettings = {
  readReceipts: true,
  typingIndicators: true
};

// =============================================================================
// CHAT DATA HELPERS
// =============================================================================
// Merge: unify signature + robust chat creation (works with members-map & participants-array)
async function createOrJoinChat(myUid, partnerUid, chatId, additionalData = {}) {
  const chatRef = doc(db, 'artifacts', appId, 'public', 'data', 'chats', chatId);
  const now = serverTimestamp();

  await setDoc(
    chatRef,
    {
      // support both membership models
      members: { [myUid]: true, [partnerUid]: true },
      participants: [myUid, partnerUid],

      owner: myUid,
      createdAt: now,
      updatedAt: now,
      ...additionalData,
    },
    { merge: true }
  );

  return chatRef;
}

async function fetchMyChats(myUid) {
  const chatsCol = collection(db, 'artifacts', appId, 'public', 'data', 'chats');
  // unified query name and consistent ordering
  const q = query(chatsCol, where(`members.${myUid}`, '==', true), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);

  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

async function loadMessages(chatId, onError) {
  try {
    const msgsCol = collection(db, 'artifacts', appId, 'public', 'data', 'chats', chatId, 'messages');
    // merge: use consistent variable name and configurable message limit
    const q = query(msgsCol, orderBy('createdAt', 'asc'), limit(initialMessageLimit || 50));
    const snap = await getDocs(q);

    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (e) {
    if (e?.code === 'permission-denied') {
      onError?.('Du bist kein Mitglied dieses Chats.');
    } else {
      onError?.('Nachrichten konnten nicht geladen werden.');
    }
    return [];
  }
}

export async function sendMessageWithOptionalMedia({
  db,
  storage: storageInstance,
  chatId,
  senderId,
  ciphertext,
  nonce,
  version,
  file,
  messageId = crypto.randomUUID(),
  storagePath
}) {
  let media;

  if (file) {
    if (!file.type?.startsWith('image/')) throw new Error('Invalid file type');
    const safeName = (file.name || 'image').replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80) || 'image';
    const resolvedPath = storagePath || `chatMedia/${chatId}/${messageId}/${safeName}`;
    const storageRef = ref(storageInstance, resolvedPath);
    await uploadBytes(storageRef, file, { contentType: file.type });
    media = { path: resolvedPath, size: file.size, contentType: file.type };
  }

  const now = serverTimestamp();
  const msgRef = doc(collection(db, 'artifacts', appId, 'public', 'data', 'chats', chatId, 'messages'), messageId);
  await setDoc(msgRef, {
    senderId, ciphertext, nonce, version,
    createdAt: now, timestamp: now, read: false,
    ...(media ? { media } : {})
  });

  return { messageId, media };
}


function ensureChatSelectedOrEmptyState(currentChatId, showEmpty) {
  if (!currentChatId) {
    showEmpty?.('Kein Chat ausgewählt. Erstelle einen neuen Chat oder wähle einen bestehenden.');
    return false;
  }
  return true;
}

// Rate Limiting
const rateLimiter = {
  messages: [],
  maxPerMinute: 30,
  canSend() {
    const now = Date.now();
    this.messages = this.messages.filter(t => now - t < 60000);
    return this.messages.length < this.maxPerMinute;
  },
  record() { this.messages.push(Date.now()); }
};

// Pagination
const pageSize = 30;
const initialMessageLimit = 50;
const lastDocByChat = {};
const loadedAllByChat = {};

// =============================================================================
// INDEXEDDB
// =============================================================================
const idb = {
  db: null,
  async open() {
    if (this.db) return this.db;
    return new Promise((resolve, reject) => {
      const req = indexedDB.open('secure-messenger-db', 3);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains('keys')) {
          db.createObjectStore('keys', { keyPath: 'uid' });
        }
        if (!db.objectStoreNames.contains('sessionKeys')) {
          db.createObjectStore('sessionKeys', { keyPath: 'chatId' });
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };
      req.onsuccess = () => { this.db = req.result; resolve(this.db); };
      req.onerror = () => reject(req.error);
    });
  },
  async putKey(uid, privateKey) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('keys', 'readwrite');
      tx.objectStore('keys').put({ uid, privateKey });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
  async getKey(uid) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('keys', 'readonly');
      const req = tx.objectStore('keys').get(uid);
      req.onsuccess = () => resolve(req.result?.privateKey || null);
      req.onerror = () => reject(req.error);
    });
  },
  async deleteKey(uid) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('keys', 'readwrite');
      tx.objectStore('keys').delete(uid);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
  async putSessionKey(chatId, sessionKey) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sessionKeys', 'readwrite');
      tx.objectStore('sessionKeys').put({ chatId, sessionKey, timestamp: Date.now() });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
  async getSessionKey(chatId) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('sessionKeys', 'readonly');
      const req = tx.objectStore('sessionKeys').get(chatId);
      req.onsuccess = () => resolve(req.result?.sessionKey || null);
      req.onerror = () => reject(req.error);
    });
  },
  async putSetting(key, value) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readwrite');
      tx.objectStore('settings').put({ key, value });
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  },
  async getSetting(key, defaultValue) {
    await this.open();
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction('settings', 'readonly');
      const req = tx.objectStore('settings').get(key);
      req.onsuccess = () => resolve(req.result?.value ?? defaultValue);
      req.onerror = () => reject(req.error);
    });
  }
};

// =============================================================================
// MODAL SYSTEM
// =============================================================================
const modal = {
  overlay: document.getElementById('modal-overlay'),
  box: document.getElementById('modal-box'),
  title: document.getElementById('modal-title'),
  text: document.getElementById('modal-text'),
  input: document.getElementById('modal-input'),
  okBtn: document.getElementById('modal-ok'),
  cancelBtn: document.getElementById('modal-cancel'),
  extra: document.getElementById('modal-extra'),
  
  show(config) {
    return new Promise((resolve) => {
      this.title.textContent = config.title || '';
      this.text.textContent = config.text || '';
      this.input.value = '';
      this.input.type = config.inputType || 'text';
      this.input.placeholder = config.placeholder || '';
      this.input.classList.toggle('hidden', config.type !== 'prompt');
      this.cancelBtn.classList.toggle('hidden', config.type === 'alert');
      
      // FIXED: Only clear extra content if explicitly provided
      if (config.extraHtml !== undefined) {
        this.extra.innerHTML = config.extraHtml;
      }
      // If extraHtml is undefined, don't touch this.extra at all
      
      // Update button text with translations
      this.okBtn.textContent = t('ok');
      this.cancelBtn.textContent = t('cancel');
      
      this.overlay.classList.remove('hidden');
      this.overlay.classList.add('flex');
      setTimeout(() => this.box.classList.add('active'), 10);
      
      if (config.type === 'prompt') setTimeout(() => this.input.focus(), 250);
      
      const close = (value) => {
        this.box.classList.remove('active');
        setTimeout(() => {
          this.overlay.classList.add('hidden');
          this.overlay.classList.remove('flex');
          this.okBtn.onclick = null;
          this.cancelBtn.onclick = null;
          this.input.value = '';
          // Don't clear extra here - other functions might need it
          resolve(value);
        }, 200);
      };
      
      this.okBtn.onclick = () => {
        if (config.type === 'prompt') {
          const val = this.input.value.trim();
          if (config.validator && !config.validator(val)) return;
          close(val);
        } else {
          close(true);
        }
      };
      
      this.cancelBtn.onclick = () => close(false);
      
      if (config.type === 'prompt') {
        this.input.onkeydown = (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            this.okBtn.click();
          }
        };
      }
    });
  },
  
  alert(title, text) { return this.show({ title, text, type: 'alert' }); },
  confirm(title, text) { return this.show({ title, text, type: 'confirm' }); },
  prompt(title, text, placeholder, inputType = 'text', validator = null) {
    return this.show({ title, text, type: 'prompt', placeholder, inputType, validator });
  }
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================
const showLoading = (txt = null) => {
  loadingText.textContent = txt || t('loading');
  loadingOverlay.classList.remove('hidden');
  loadingOverlay.classList.add('flex');
};

const hideLoading = () => {
  loadingOverlay.classList.add('hidden');
  loadingOverlay.classList.remove('flex');
};

const showBanner = (msg) => {
  bannerMessage.textContent = msg;
  banner.classList.remove('hidden');
};

const arrayBufferToBase64 = b => btoa(String.fromCharCode(...new Uint8Array(b)));
const base64ToArrayBuffer = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0)).buffer;

async function sha256Bytes(data) {
  const encoded = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoded));
}

function groupString(str, group = 4, sep = '-') {
  const out = [];
  for (let i = 0; i < str.length; i += group) out.push(str.slice(i, i + group));
  return out.join(sep);
}

async function fingerprintFromPublicRawB64(publicRawB64) {
  const bytes = new Uint8Array(base64ToArrayBuffer(publicRawB64));
  const hash = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return groupString(hex.slice(0, 40).toUpperCase(), 4, '-');
}

function sanitizeUsername(username) {
  return username.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 20);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function makeTimeString(ts) {
  try {
    const d = ts?.toDate ? ts.toDate() : (ts?.seconds ? new Date(ts.seconds * 1000) : null);
    if (!d) return '';
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return t('now');
    if (diffMins < 60) return `${t('minutesAgo').replace('min', diffMins + 'min')}`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${t('hoursAgo').replace('h', diffHours + 'h')}`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return t('yesterday');
    if (diffDays < 7) return `${t('daysAgo').replace('d', diffDays + 'd')}`;
    return d.toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' });
  } catch {
    return '';
  }
}

// =============================================================================
// CRYPTO MODULE
// =============================================================================
const cryptoModule = {
  async createKeyPairNonExportable_withBackupHandle() {
    const tmp = await crypto.subtle.generateKey(
      { name: "ECDH", namedCurve: "P-256" },
      true,
      ["deriveBits", "deriveKey"]
    );
    const rawPub = await crypto.subtle.exportKey("raw", tmp.publicKey);
    const rawPublicKey = arrayBufferToBase64(rawPub);
    const jwkPriv = await crypto.subtle.exportKey("jwk", tmp.privateKey);
    
    const privateKey = await crypto.subtle.importKey(
      "jwk",
      jwkPriv,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      ["deriveBits", "deriveKey"]
    );
    
    const publicKey = await crypto.subtle.importKey(
      "raw",
      rawPub,
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );
    
    return {
      keyPair: { privateKey, publicKey },
      rawPublicKey,
      jwkPrivForBackup: jwkPriv
    };
  },

  async deriveSharedSecret(privateKey, partnerRawPublicKey, chatId) {
    const partnerPublicKey = await crypto.subtle.importKey(
      "raw",
      base64ToArrayBuffer(partnerRawPublicKey),
      { name: "ECDH", namedCurve: "P-256" },
      false,
      []
    );
    
    const ecdhBits = await crypto.subtle.deriveBits(
      { name: "ECDH", public: partnerPublicKey },
      privateKey,
      256
    );
    
    const salt = (await sha256Bytes("salt:" + chatId)).slice(0, 16);
    const info = new TextEncoder().encode("secure-messenger-v2:" + chatId);
    
    const hkdfKey = await crypto.subtle.importKey(
      "raw",
      ecdhBits,
      "HKDF",
      false,
      ["deriveKey"]
    );
    
    return await crypto.subtle.deriveKey(
      { name: "HKDF", hash: "SHA-256", salt, info },
      hkdfKey,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"]
    );
  },

  async generateSessionKey() {
    return await crypto.subtle.generateKey(
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  },

  async exportSessionKey(sessionKey) {
    const raw = await crypto.subtle.exportKey("raw", sessionKey);
    return arrayBufferToBase64(raw);
  },

  async importSessionKey(rawB64) {
    return await crypto.subtle.importKey(
      "raw",
      base64ToArrayBuffer(rawB64),
      { name: "AES-GCM", length: 256 },
      true,
      ["encrypt", "decrypt"]
    );
  },

  async encrypt(key, data) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded);
    return {
      ciphertext: arrayBufferToBase64(new Uint8Array(ct)),
      nonce: arrayBufferToBase64(iv),
      version: 'v1'
    };
  },

  async decrypt(key, encryptedPayload) {
    try {
      if (!encryptedPayload) throw new Error('Missing payload');

      let iv;
      let ciphertextBytes;

      if (typeof encryptedPayload === 'string') {
        const full = new Uint8Array(base64ToArrayBuffer(encryptedPayload));
        iv = full.slice(0, 12);
        ciphertextBytes = full.slice(12);
      } else {
        const { ciphertext, nonce } = encryptedPayload || {};
        if (!ciphertext || !nonce) {
          throw new Error('Invalid payload');
        }
        iv = new Uint8Array(base64ToArrayBuffer(nonce));
        ciphertextBytes = new Uint8Array(base64ToArrayBuffer(ciphertext));
      }

      const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertextBytes);
      return JSON.parse(new TextDecoder().decode(pt));
    } catch (e) {
      console.error("Decryption failed:", e);
      return { type: 'error', content: t('decryptionFailed') };
    }
  },

  async encryptFile(file) {
    const key = await this.generateSessionKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const fileData = await file.arrayBuffer();
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      key,
      fileData
    );
    
    const fullData = new Uint8Array(iv.length + encrypted.byteLength);
    fullData.set(iv);
    fullData.set(new Uint8Array(encrypted), iv.length);
    
    const exportedKey = await this.exportSessionKey(key);
    return {
      encryptedBlob: new Blob([fullData]),
      key: exportedKey,
      originalType: file.type,
      originalName: file.name
    };
  },

  async decryptFile(encryptedBlob, keyB64) {
    try {
      const key = await this.importSessionKey(keyB64);
      const data = await encryptedBlob.arrayBuffer();
      const fullData = new Uint8Array(data);
      const iv = fullData.slice(0, 12);
      const ct = fullData.slice(12);
      
      const decrypted = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        key,
        ct
      );
      return decrypted;
    } catch (e) {
      console.error("File decryption failed:", e);
      return null;
    }
  }
};

// =============================================================================
// BACKUP/RESTORE
// =============================================================================
async function deriveKeyFromPassword(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt, iterations: 500000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

async function encryptBackup(jwkPriv, publicRawB64, username) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
  const pass1 = await modal.prompt(
    t('createBackupTitle'),
    t('createBackupText'),
    t('passwordPlaceholder'),
    "password",
    (val) => {
      if (val.length < 12) {
        modal.alert(t('tooShort'), t('minCharactersRequired'));
        return false;
      }
      return true;
    }
  );
  
  if (!pass1) throw new Error(t('noPasswordEntered'));
  
  const pass2 = await modal.prompt(
    t('confirmPassword'),
    t('repeatPassword'),
    t('passwordPlaceholder'),
    "password"
  );
  
  if (pass1 !== pass2) throw new Error(t('passwordsNoMatch'));
  
  const aesKey = await deriveKeyFromPassword(pass1, salt);
  const payload = JSON.stringify({
    jwkPriv,
    publicRawB64,
    username,
    timestamp: Date.now(),
    version: 2
  });
  const ct = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    aesKey,
    new TextEncoder().encode(payload)
  );
  
  return {
    v: 2,
    kdf: 'PBKDF2-SHA256-500k',
    salt: arrayBufferToBase64(salt),
    iv: arrayBufferToBase64(iv),
    ct: arrayBufferToBase64(ct)
  };
}

async function decryptBackup(backupObj, password) {
  const salt = base64ToArrayBuffer(backupObj.salt);
  const iv = base64ToArrayBuffer(backupObj.iv);
  const aesKey = await deriveKeyFromPassword(password, new Uint8Array(salt));
  const pt = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: new Uint8Array(iv) },
    aesKey,
    base64ToArrayBuffer(backupObj.ct)
  );
  return JSON.parse(new TextDecoder().decode(pt));
}

async function openBackupExport() {
  if (!userKeys?.jwkPrivForBackup) {
    return modal.alert(
      t('notAvailable'),
      t('backupOnlyAfterInit')
    );
  }
  
  try {
    const backupObj = await encryptBackup(
      userKeys.jwkPrivForBackup,
      userKeys.rawPublicKey,
      currentUsername
    );
    
    const blob = new Blob([JSON.stringify(backupObj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    a.href = url;
    a.download = `messenger-backup_${currentUsername}_${timestamp}.smbackup`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    
    await modal.alert(t('backupSuccess'), t('backupSuccessText'));
  } catch (e) {
    console.error(e);
    modal.alert(t('error'), e.message);
  }
}

async function openBackupRestore() {
  const confirm = await modal.confirm(
    t('restoreBackupTitle'),
    t('restoreBackupText')
  );
  if (!confirm) return;
  
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.smbackup,application/json';
  
  const fileChosen = await new Promise(res => {
    input.onchange = () => res(input.files[0] || null);
    input.click();
  });
  
  if (!fileChosen) return;
  
  try {
    showLoading(t('decryptingBackup'));
    const text = await fileChosen.text();
    const obj = JSON.parse(text);
    
    if (obj.v !== 2) {
      throw new Error(t('incompatibleBackup'));
    }
    
    const pass = await modal.prompt(
      t('enterBackupPassword'),
      t('enterBackupPasswordText'),
      t('passwordPlaceholder'),
      "password"
    );
    
    if (!pass) {
      hideLoading();
      return;
    }
    
    const { jwkPriv, publicRawB64, username } = await decryptBackup(obj, pass);
    
    const privateKey = await crypto.subtle.importKey(
      "jwk",
      jwkPriv,
      { name: "ECDH", namedCurve: "P-256" },
      false,
      ["deriveBits", "deriveKey"]
    );
    
    const publicKey = await crypto.subtle.importKey(
      "raw",
      base64ToArrayBuffer(publicRawB64),
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );
    
    await idb.putKey(auth.currentUser.uid, privateKey);
    
    const userData = await firestoreModule.getUserData(auth.currentUser.uid);
    if (!userData || userData.publicKey !== publicRawB64) {
      await setDoc(
        doc(db, `artifacts/${appId}/public/data/users`, auth.currentUser.uid),
        { publicKey: publicRawB64, username },
        { merge: true }
      );
    }
    
    userKeys = {
      keyPair: { privateKey, publicKey },
      rawPublicKey: publicRawB64,
      jwkPrivForBackup: jwkPriv
    };
    
    currentUsername = username;
    localStorage.setItem(`username_${auth.currentUser.uid}`, username);
    
    hideLoading();
    await modal.alert(t('backupSuccess'), t('restoreSuccess'));
    window.location.reload();
  } catch (e) {
    console.error(e);
    hideLoading();
    if (e.message.includes('decrypt')) {
      modal.alert(t('error'), t('wrongPassword'));
    } else {
      modal.alert(t('error'), e.message);
    }
  }
}

// =============================================================================
// FIRESTORE MODULE
// =============================================================================
const firestoreModule = {
  async getUserData(userId) {
    try {
      const userDoc = await getDoc(doc(db, `artifacts/${appId}/public/data/users`, userId));
      return userDoc.exists() ? userDoc.data() : null;
    } catch (e) {
      console.error("Error getting user data:", e);
      return null;
    }
  },

  async findUserByUsername(username) {
    try {
      const usernameRef = doc(db, `artifacts/${appId}/public/data/usernames`, username.toLowerCase());
      const usernameDoc = await getDoc(usernameRef);
      if (!usernameDoc.exists()) return null;
      const userId = usernameDoc.data().userId;
      const userData = await this.getUserData(userId);
      return { id: userId, ...userData };
    } catch (e) {
      console.error("Error finding user:", e);
      return null;
    }
  },

  listenToChats(userId, callback) {
    const chatsRef = collection(db, `artifacts/${appId}/public/data/chats`);
    const qy = query(chatsRef, where(`members.${userId}`, '==', true), orderBy('createdAt', 'desc'));
    return onSnapshot(
      qy,
      async () => {
        try {
          const chatDocs = await fetchMyChats(userId);
          const hydrated = await Promise.all(chatDocs.map(async (chat) => {
            const members = chat.members || {};
            const partnerId = Object.keys(members).find(id => id !== userId && members[id]);
            if (!partnerId) return null;

            let partnerUsername = chat.participantUsernames?.[partnerId];
            if (!partnerUsername) {
              let cached = userDataCache.get(partnerId);
              if (!cached) {
                cached = await firestoreModule.getUserData(partnerId);
                if (cached) userDataCache.set(partnerId, cached);
              }
              partnerUsername = cached?.username || '';
            }

            if (partnerUsername) {
              const cached = userDataCache.get(partnerId) || {};
              if (cached.username !== partnerUsername) {
                userDataCache.set(partnerId, { ...cached, username: partnerUsername });
              }
            }

            return {
              id: partnerId,
              partnerId,
              partnerUsername: partnerUsername || 'Unknown',
              chatMetaId: chat.id,
              ...chat
            };
          }));

          callback(hydrated.filter(Boolean));
        } catch (err) {
          console.error('Error resolving chats:', err);
          modal.alert(t('error'), t('chatsLoadFailed'));
        }
      },
      error => {
        console.error("Error listening to chats:", error);
        modal.alert(t('error'), t('chatsLoadFailed'));
      }
    );
  },

  async setTypingStatus(chatId, isTyping) {
    if (!userSettings.typingIndicators) return;
    try {
      const typingRef = doc(db, `artifacts/${appId}/public/data/typing`, chatId);
      await setDoc(typingRef, {
        isTyping,
        who: isTyping ? auth.currentUser?.uid : null,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Error setting typing status:", e);
    }
  },

  listenToTypingStatus(chatId, callback) {
    if (!userSettings.typingIndicators) {
      callback(null);
      return () => {};
    }
    const typingRef = doc(db, `artifacts/${appId}/public/data/typing`, chatId);
    return onSnapshot(
      typingRef,
      callback,
      error => console.error("Error listening to typing:", error)
    );
  },

  listenToMessagesFirstPage(chatId, onChange) {
    if (chatUnsubscribes[chatId]) {
      try { chatUnsubscribes[chatId](); } catch {}
      delete chatUnsubscribes[chatId];
    }
    
    const qy = query(
      collection(db, `artifacts/${appId}/public/data/chats/${chatId}/messages`),
      orderBy("createdAt", "desc"),
      limit(pageSize)
    );
    
    const unsub = onSnapshot(
      qy,
      (snap) => {
        lastDocByChat[chatId] = snap.docs[snap.docs.length - 1] || null;
        loadedAllByChat[chatId] = snap.size < pageSize;
        onChange(snap);
      },
      (error) => {
        console.error("Error listening to messages:", error);
        modal.alert(t('error'), t('messagesLoadFailed'));
      }
    );
    
    chatUnsubscribes[chatId] = unsub;
    return unsub;
  },

  async loadOlder(chatId) {
    if (loadedAllByChat[chatId]) return { docs: [] };
    const cursor = lastDocByChat[chatId];
    if (!cursor) return { docs: [] };
    
    try {
      const qy = query(
        collection(db, `artifacts/${appId}/public/data/chats/${chatId}/messages`),
        orderBy("createdAt", "desc"),
        startAfter(cursor),
        limit(pageSize)
      );
      
      const snap = await getDocs(qy);
      lastDocByChat[chatId] = snap.docs[snap.docs.length - 1] || lastDocByChat[chatId];
      if (snap.size < pageSize) loadedAllByChat[chatId] = true;
      
      return { docs: snap.docs };
    } catch (e) {
      console.error("Error loading older messages:", e);
      return { docs: [] };
    }
  },

  async updateMessage(chatId, msgId, newEncryptedContent) {
    try {
      const msgRef = doc(db, `artifacts/${appId}/public/data/chats/${chatId}/messages`, msgId);
      await updateDoc(msgRef, {
        ciphertext: newEncryptedContent.ciphertext,
        nonce: newEncryptedContent.nonce,
        version: newEncryptedContent.version,
        updatedAt: serverTimestamp()
      });
    } catch (e) {
      console.error("Error updating message:", e);
      throw e;
    }
  },

  async markMessagesAsRead(chatId, messageIds) {
    if (!userSettings.readReceipts || !messageIds.length) return;
    try {
      const batch = writeBatch(db);
      messageIds.forEach(id => {
        const msgRef = doc(db, `artifacts/${appId}/public/data/chats/${chatId}/messages`, id);
        batch.update(msgRef, { read: true });
      });
      await batch.commit();
    } catch (e) {
      console.error("Error marking messages as read:", e);
    }
  }
};

// UI MODULE
// =============================================================================
const uiModule = {
  switchToAppView() {
    try {
      sessionStorage.setItem('appRequested', 'true');
    } catch {}
    if (appContainer) appContainer.style.display = 'block';
    if (landingPage) landingPage.style.display = 'none';
    authView.style.display = 'none';
    appView.style.display = 'flex';
  },

  switchToAuthView() {
    hideLoading();
    if (appContainer) appContainer.style.display = 'block';
    if (landingPage) landingPage.style.display = 'none';
    appView.style.display = 'none';
    authView.style.display = 'flex';
  },

  updateUserProfile(username, userId) {
    currentUsernameDisplay.textContent = username;
    userIdDisplay.value = userId;
  },

  renderChatList(chats) {
    chatList.innerHTML = '';
    if (!chats || !chats.length) {
      chatList.innerHTML = `<p class="text-gray-500 text-sm p-3">${t('noChats')}</p>`;
      return;
    }
    
    chats.forEach(chat => {
      const el = document.createElement('div');
      const isActive = activeChat && activeChat.partnerId === chat.id;
      el.className = `p-3 rounded-lg cursor-pointer hover:bg-gray-700 transition ${isActive ? 'bg-blue-800' : 'bg-gray-800/50'}`;
      el.dataset.chatPartnerId = chat.id;
      
      const nameP = document.createElement('p');
      nameP.className = 'font-semibold truncate text-sm text-white';
      nameP.textContent = chat.partnerUsername || 'Unknown';
      el.appendChild(nameP);
      
      el.onclick = () => this.openChat({ partnerId: chat.id, partnerUsername: chat.partnerUsername });
      chatList.appendChild(el);
    });
  },

  async openChat(chat) {
    if (activeChat && activeChat.partnerId === chat.partnerId) return;

    document.querySelectorAll('#chat-list > div').forEach(el => {
      el.classList.toggle('bg-blue-800', el.dataset.chatPartnerId === chat.partnerId);
      el.classList.toggle('bg-gray-800/50', el.dataset.chatPartnerId !== chat.partnerId);
    });
    
    showLoading(t('openingChat'));
    const previous = activeChat;
    const chatId = [auth.currentUser?.uid, chat.partnerId].sort().join('_');
    
    if (previous?.chatId && chatUnsubscribes[previous.chatId]) {
      try { chatUnsubscribes[previous.chatId](); } catch {}
      delete chatUnsubscribes[previous.chatId];
    }
    if (chatUnsubscribes['typing']) {
      try { chatUnsubscribes['typing'](); } catch {}
      delete chatUnsubscribes['typing'];
    }
    
    activeChat = { ...chat, chatId };
    messageList.innerHTML = '';
    messageInput.value = '';
    
    const partnerData = await firestoreModule.getUserData(chat.partnerId);
    if (!partnerData?.publicKey) {
      await modal.alert(t('error'), t('userDataNotFound'));
      hideLoading();
      return;
    }
    userDataCache.set(chat.partnerId, partnerData);

    const resolvedPartnerUsername = partnerData.username || chat.partnerUsername || 'Unknown';
    const participantUsernames = { [chat.partnerId]: resolvedPartnerUsername };
    if (auth.currentUser?.uid && currentUsername) {
      participantUsernames[auth.currentUser.uid] = currentUsername;
    }
    const participants = [auth.currentUser?.uid, chat.partnerId].filter(Boolean);
    if (auth.currentUser?.uid) {
      await createOrJoinChat(auth.currentUser.uid, chat.partnerId, chatId, {
        participants,
        participantUsernames
      });
    }
    
    activeChat.partnerUsername = resolvedPartnerUsername;

    sharedSecrets[chat.partnerId] = await cryptoModule.deriveSharedSecret(
      userKeys.keyPair.privateKey,
      partnerData.publicKey,
      chatId
    );
    
    let sessionKey = await idb.getSessionKey(chatId);
    if (!sessionKey) {
      sessionKey = await cryptoModule.generateSessionKey();
      await idb.putSessionKey(chatId, sessionKey);
    }
    sessionKeys[chatId] = sessionKey;
    
    try {
      const partnerFpr = await fingerprintFromPublicRawB64(partnerData.publicKey);
      activeChat.partnerFingerprint = partnerFpr;
    } catch {}
    
    welcomeScreen.classList.add('hidden');
    chatWindow.classList.remove('hidden');
    chatWindow.classList.add('flex');
    chatHeaderName.textContent = resolvedPartnerUsername || '';

    const initialMessages = await loadMessages(chatId, async (errorMessage) => {
      if (errorMessage) {
        await modal.alert(t('error'), errorMessage);
      }
    });

    for (const msg of initialMessages) {
      const encryptedPayload = msg.ciphertext ? {
        ciphertext: msg.ciphertext,
        nonce: msg.nonce,
        version: msg.version
      } : msg.content;
      const decrypted = await cryptoModule.decrypt(sharedSecrets[chat.partnerId], encryptedPayload);
      await this.renderMessage(
        msg.id,
        decrypted,
        msg,
        msg.senderId === auth.currentUser?.uid,
        'prepend'
      );
    }

    loadOlderBtn.classList.toggle('hidden', initialMessages.length < initialMessageLimit);

    chatUnsubscribes['typing'] = firestoreModule.listenToTypingStatus(chatId, (docSnap) => {
      const d = docSnap?.exists() ? docSnap.data() : null;
      typingIndicator.textContent = (d && d.isTyping && d.who === chat.partnerId) ? t('typing') : "";
    });

    firestoreModule.listenToMessagesFirstPage(chatId, async (snapshot) => {
      loadOlderBtn.classList.toggle('hidden', snapshot.size < pageSize || snapshot.empty);

      for (const change of snapshot.docChanges()) {
        const docSnap = change.doc;
        const msgData = docSnap.data();

        if (change.type === "added") {
          if (document.getElementById(`msg-${docSnap.id}`)) continue;
          const encryptedPayload = msgData.ciphertext ? {
            ciphertext: msgData.ciphertext,
            nonce: msgData.nonce,
            version: msgData.version
          } : msgData.content;
          const decrypted = await cryptoModule.decrypt(sharedSecrets[chat.partnerId], encryptedPayload);
          this.renderMessage(docSnap.id, decrypted, msgData, msgData.senderId === auth.currentUser?.uid, 'prepend');
        }

        if (change.type === "modified") {
          const encryptedPayload = msgData.ciphertext ? {
            ciphertext: msgData.ciphertext,
            nonce: msgData.nonce,
            version: msgData.version
          } : msgData.content;
          const decrypted = await cryptoModule.decrypt(sharedSecrets[chat.partnerId], encryptedPayload);
          this.updateMessage(docSnap.id, decrypted, msgData);
        }
      }

      const unread = [];
      snapshot.forEach(d => {
        const data = d.data();
        if (data.senderId === activeChat.partnerId && !data.read) unread.push(d.id);
      });
      if (unread.length) firestoreModule.markMessagesAsRead(chatId, unread);
    });
    
    hideLoading();
    messageInput.focus();
  },

  updateMessage(msgId, message, msgData) {
    const bubble = document.querySelector(`#msg-${msgId} .message-bubble`);
    if (!bubble) return;
    
    if (message.type === 'deleted' || message.type === 'error') {
      bubble.classList.remove('bg-blue-600', 'bg-gray-700');
      bubble.classList.add('bg-gray-800');
      bubble.replaceChildren();
      const p = document.createElement('p');
      p.className = 'text-gray-400 italic text-sm';
      p.textContent = message.content || t('messageDeleted');
      bubble.appendChild(p);
      bubble.style.cursor = 'default';
      bubble.onclick = null;
    }
    
    const statusSpan = document.querySelector(`#status-${msgId}`);
    if (statusSpan && userSettings.readReceipts) {
      statusSpan.style.color = msgData.read ? '#60a5fa' : '#9ca3af';
      statusSpan.textContent = msgData.read ? '✓✓' : '✓';
    }
  },

 async renderMessage(msgId, message, msgData, isSender, position = 'prepend') {
  const wrapper = document.createElement('div');
  wrapper.id = `msg-${msgId}`;
  wrapper.className = `w-full flex mb-3 ${isSender ? 'justify-end' : 'justify-start'}`;

  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'flex flex-col max-w-[70%]';

  const bubble = document.createElement('div');
  bubble.className = 'message-bubble p-3 rounded-lg break-words';
  bubble.style.minWidth = '120px';          // <-- Fix: Mindestbreite
  bubble.style.maxWidth = '70%';
  bubble.style.wordBreak = 'break-word';
  bubble.style.whiteSpace = 'pre-wrap';

  if (message.type === 'deleted' || message.type === 'error') {
    bubble.classList.add('bg-gray-800');
    const p = document.createElement('p');
    p.className = 'text-gray-400 italic text-sm';
    p.textContent = message.content || t('messageDeleted');
    bubble.appendChild(p);
  } else {
    bubble.classList.add(isSender ? 'bg-blue-600' : 'bg-gray-700');
  }
    
    if (message.type === 'text') {
      const p = document.createElement('p');
      p.className = 'text-white text-sm whitespace-pre-wrap';
      p.textContent = message.content || '';
      bubble.appendChild(p);
    } else if (message.type === 'image') {
      const img = document.createElement('img');
      img.className = 'max-w-full rounded-lg cursor-pointer';
      img.alt = 'Image';
      img.loading = 'lazy';

      const storagePath = msgData?.media?.path || message.storagePath;
      let loadedFromStorage = false;

      if (storagePath) {
        try {
          const downloadUrl = await getDownloadURL(ref(storage, storagePath));
          img.src = downloadUrl;
          loadedFromStorage = true;
        } catch (e) {
          console.error('Image load error:', e);
          bubble.classList.add('bg-red-900');
          const errP = document.createElement('p');
          errP.className = 'text-red-300 text-xs';
          errP.textContent = t('imageLoadFailed');
          bubble.appendChild(errP);
        }
      }

      if (!loadedFromStorage && message.encryptedUrl && message.key) {
        try {
          const response = await fetch(message.encryptedUrl);
          const encryptedBlob = await response.blob();
          const decryptedData = await cryptoModule.decryptFile(encryptedBlob, message.key);

          if (decryptedData) {
            const blob = new Blob([decryptedData], { type: message.originalType || 'image/jpeg' });
            img.src = URL.createObjectURL(blob);
          } else {
            throw new Error('Decryption failed');
          }
        } catch (e) {
          console.error('Image decryption error:', e);
          bubble.classList.add('bg-red-900');
          const errP = document.createElement('p');
          errP.className = 'text-red-300 text-xs';
          errP.textContent = t('imageLoadFailed');
          bubble.appendChild(errP);
        }
      }

      if (!img.src) {
        img.src = message.url || message.content || '';
      }

      img.onclick = () => {
        if (img.src.startsWith('blob:') || img.src.startsWith('http')) {
          window.open(img.src, '_blank');
        }
      };

      if (img.src) {
        bubble.appendChild(img);
      }
    }
    
    const time = makeTimeString(msgData.timestamp || msgData.createdAt);
    const statusIndicator = isSender && userSettings.readReceipts ? 
      `<span id="status-${msgId}" class="ml-1 inline-block" style="color: ${msgData.read ? '#60a5fa' : '#9ca3af'}">${msgData.read ? '✓✓' : '✓'}</span>` : '';
    
    const metaWrapper = document.createElement('div');
    metaWrapper.className = `flex items-center mt-1 text-xs text-gray-500 ${isSender ? 'justify-end' : 'justify-start'}`;
    metaWrapper.innerHTML = `<span>${time}</span>${statusIndicator}`;
    
    if (isSender && message.type !== 'deleted' && message.type !== 'error') {
      bubble.onclick = () => handleDeleteMessage(msgId);
      bubble.style.cursor = 'pointer';
      bubble.title = t('clickToDelete');
    }
    
    contentWrapper.appendChild(bubble);
    if (message.type !== 'deleted' && message.type !== 'error') {
      contentWrapper.appendChild(metaWrapper);
    }
    wrapper.appendChild(contentWrapper);
    
    if (position === 'append') {
      messageList.appendChild(wrapper);
    } else {
      messageList.prepend(wrapper);
    }
    
    if (isSender && position === 'prepend') {
      setTimeout(() => {
        const container = document.getElementById('message-list-container');
        container.scrollTop = container.scrollHeight;
      }, 100);
    }
  }
};

// =============================================================================
// SESSION INITIALIZATION & AUTHENTICATION
// =============================================================================
async function handleInitializeSession() {
  const username = sanitizeUsername(usernameInput.value.trim());
  
  if (!username || username.length < 3) {
    return modal.alert(t('invalid'), t('usernameInvalid'));
  }
  
  if (username.length > 20) {
    return modal.alert(t('invalid'), t('usernameTooLong'));
  }

  showLoading(t('initializingSession'));
  
  try {
    const user = auth.currentUser;
    if (!user) throw new Error(t('notAuthenticated'));

    await runTransaction(db, async (tx) => {
      const usernameRef = doc(db, `artifacts/${appId}/public/data/usernames`, username.toLowerCase());
      const usernameDoc = await tx.get(usernameRef);
      
      if (usernameDoc.exists() && usernameDoc.data().userId !== user.uid) {
        throw new Error(t('usernameExists'));
      }

      showLoading(t('generatingKeys'));
      const kp = await cryptoModule.createKeyPairNonExportable_withBackupHandle();

      showLoading(t('savingProfile'));
      const userRef = doc(db, `artifacts/${appId}/public/data/users`, user.uid);
      tx.set(userRef, { publicKey: kp.rawPublicKey, username });
      tx.set(usernameRef, { userId: user.uid });

      await idb.putKey(user.uid, kp.keyPair.privateKey);
      userKeys = kp;
    });

    localStorage.setItem(`username_${user.uid}`, username);
    
    showBanner(t('createBackupNow'));
    
    await handleLogin(user);
  } catch (error) {
    console.error("Registration failed:", error);
    hideLoading();
    modal.alert(t('error'), error.message);
  }
}

async function handleLogin(user) {
  try {
    showLoading(t('loadingSession'));

    let privateKey = await idb.getKey(user.uid);
    if (!privateKey) {
      throw new Error(t('privateKeyNotFound'));
    }

    const userData = await firestoreModule.getUserData(user.uid);
    if (!userData?.publicKey || !userData?.username) {
      throw new Error(t('userDataNotFound'));
    }

    const publicKey = await crypto.subtle.importKey(
      "raw",
      base64ToArrayBuffer(userData.publicKey),
      { name: "ECDH", namedCurve: "P-256" },
      true,
      []
    );
    
    userKeys = {
      keyPair: { privateKey, publicKey },
      rawPublicKey: userData.publicKey
    };
    
    currentUsername = userData.username;
    localStorage.setItem(`username_${user.uid}`, currentUsername);

    userSettings.readReceipts = await idb.getSetting('readReceipts', true);
    userSettings.typingIndicators = await idb.getSetting('typingIndicators', true);

    uiModule.switchToAppView();
    uiModule.updateUserProfile(currentUsername, user.uid);
    firestoreModule.listenToChats(user.uid, uiModule.renderChatList.bind(uiModule));

    hideLoading();
  } catch (error) {
    console.error("Login failed:", error);
    hideLoading();
    await modal.alert(t('loginError'), error.message);
    await handleLogout();
  }
}

async function handleLogout() {
  showLoading(t('signingOut'));
  
  Object.values(chatUnsubscribes).forEach(unsub => {
    try { unsub(); } catch {}
  });
  chatUnsubscribes = {};
  
  activeChat = null;
  sharedSecrets = {};
  sessionKeys = {};
  userKeys = null;
  currentUsername = null;
  userDataCache.clear();

  if (auth.currentUser) {
    localStorage.removeItem(`username_${auth.currentUser.uid}`);
  }
  
  try {
    await auth.signOut();
  } catch (e) {
    console.error("Sign out failed:", e);
  }
  
  hideLoading();
}

// =============================================================================
// MESSAGE HANDLING
// =============================================================================
async function handleSendMessage() {
  if (!ensureChatSelectedOrEmptyState(activeChat?.chatId, (message) => modal.alert(t('info'), message))) {
    return;
  }

  const text = messageInput.value.trim();
  if (!text) return;

  if (text.length > 5000) {
    return modal.alert(t('tooLong'), t('maxCharsPerMessage'));
  }

  if (!rateLimiter.canSend()) {
    return modal.alert(t('tooFast'), t('rateLimitMsg').replace('{limit}', rateLimiter.maxPerMinute));
  }

  messageInput.value = '';
  firestoreModule.setTypingStatus(activeChat.chatId, false);
  
  try {
    await encryptAndSendMessage({ type: 'text', content: text });
    rateLimiter.record();
  } catch (e) {
    console.error("Send failed:", e);
    modal.alert(t('error'), t('messageNotSent'));
  }
}

async function encryptAndSendMessage(message, options = {}) {
  const sharedKey = sharedSecrets[activeChat.partnerId];
  if (!sharedKey) {
    throw new Error("No secure channel");
  }

  const encrypted = await cryptoModule.encrypt(sharedKey, message);

  return await sendMessageWithOptionalMedia({

    db,
    storage,
    chatId: activeChat.chatId,
    senderId: auth.currentUser?.uid,
    ciphertext: encrypted.ciphertext,
    nonce: encrypted.nonce,
    version: encrypted.version,
    file: options.file || null,
    messageId: options.messageId,
    storagePath: options.storagePath
  });

async function handleDeleteMessage(msgId) {
  try {
    const confirmed = await modal.confirm(
      t('deleteMessageTitle'),
      t('deleteMessageText')
    );
    if (!confirmed) return;
    
    const message = { type: 'deleted', content: t('messageDeleted') };
    const sharedKey = sharedSecrets[activeChat.partnerId];
    const encrypted = await cryptoModule.encrypt(sharedKey, message);
    await firestoreModule.updateMessage(activeChat.chatId, msgId, encrypted);
  } catch (e) {
    console.error("Delete failed:", e);
    modal.alert(t('error'), t('deletionFailed'));
  }
}

function handleTyping() {
  if (!activeChat || !userSettings.typingIndicators) return;
  clearTimeout(typingTimeout);
  firestoreModule.setTypingStatus(activeChat.chatId, true);
  typingTimeout = setTimeout(() => {
    firestoreModule.setTypingStatus(activeChat.chatId, false);
  }, 2000);
}

async function handleImageSend(event) {
  const file = event.target.files[0];
  event.target.value = '';

  if (!file) return;

  if (!ensureChatSelectedOrEmptyState(activeChat?.chatId, (message) => modal.alert(t('info'), message))) {
    return;
  }

  if (!file.type.startsWith('image/')) {
    return modal.alert(t('invalid'), t('invalidFileType'));
  }

  if (file.size > 10 * 1024 * 1024) {
    return modal.alert(t('fileTooLarge'), t('maxFileSize'));
  }

  if (!rateLimiter.canSend()) {
    return modal.alert(t('tooFast'), t('pleaseWait'));
  }

  showLoading(t('encryptingAndUploading'));

  try {
    // generate safe messageId and storage path for image uploads
    const messageId = crypto.randomUUID();
    const safeName = (file.name || 'image')
      .replace(/[^a-zA-Z0-9._-]/g, '_')
      .slice(0, 80) || 'image';
    const storagePath = `chatMedia/${activeChat.chatId}/${messageId}/${safeName}`;
    await encryptAndSendMessage({
      type: 'image',
      storagePath,
      originalName: file.name || safeName,
      originalType: file.type,
      size: file.size
    }, {
      file,
      messageId,
      storagePath
    });

    rateLimiter.record();
  } catch (err) {
    console.error(err);
    modal.alert(t('error'), t('imageUploadFailed'));
  } finally {
    hideLoading();
  }


async function handleAddNewChat() {
  try {
    if (!auth.currentUser || !currentUsername) {
      return modal.alert(t('error'), t('userDataNotLoaded'));
    }

    const partnerUsername = await modal.prompt(
      t('newChatTitle'),
      t('newChatText'),
      "username"
    );

    if (!partnerUsername || partnerUsername.trim() === '') return;

    const sanitized = sanitizeUsername(partnerUsername);
    if (!sanitized || sanitized.length < 3) {
      return modal.alert(t('invalid'), t('usernameInvalid'));
    }
    if (sanitized.toLowerCase() === currentUsername.toLowerCase()) {
      return modal.alert(t('invalid'), t('cannotChatYourself'));
    }

    showLoading(t('searchingUser'));
    const partner = await firestoreModule.findUserByUsername(sanitized);

    if (!partner) {
      hideLoading();
      return modal.alert(t('notFound'), t('userNotFound'));
    }

    const partnerId = partner.id;
    if (partner.username) {
      userDataCache.set(partnerId, partner);
    }
    const chatId = [auth.currentUser.uid, partnerId].sort().join('_');
    const participantUsernames = {
      [auth.currentUser.uid]: currentUsername,
      [partnerId]: partner.username || sanitized
    };

    await createOrJoinChat(auth.currentUser.uid, partnerId, chatId, {
      participants: [auth.currentUser.uid, partnerId],
      participantUsernames
    });


    hideLoading();
    uiModule.openChat({ partnerId, partnerUsername: partner.username || sanitized });
  } catch (error) {
    console.error("Error adding chat:", error);
    hideLoading();
    modal.alert(t('error'), t('chatCreationFailed'));
  }
}

async function handleLoadOlderMessages() {
  if (!ensureChatSelectedOrEmptyState(activeChat?.chatId, (message) => modal.alert(t('info'), message))) {
    return;
  }

  loadOlderBtn.disabled = true;
  loadOlderBtn.textContent = t('loadingMsg');

  try {
    const { docs } = await firestoreModule.loadOlder(activeChat.chatId);

    for (const d of docs) {
      if (document.getElementById(`msg-${d.id}`)) continue;
      const msgData = d.data();
      const encryptedPayload = msgData.ciphertext ? {
        ciphertext: msgData.ciphertext,
        nonce: msgData.nonce,
        version: msgData.version
      } : msgData.content;
      const decrypted = await cryptoModule.decrypt(
        sharedSecrets[activeChat.partnerId],
        encryptedPayload
      );
      uiModule.renderMessage(
        d.id,
        decrypted,
        msgData,
        msgData.senderId === auth.currentUser?.uid,
        'append'
      );
    }
    
    if (loadedAllByChat[activeChat.chatId]) {
      loadOlderBtn.classList.add('hidden');
    }
  } catch (e) {
    console.error("Load older failed:", e);
    modal.alert(t('error'), t('loadingFailed'));
  } finally {
    loadOlderBtn.disabled = false;
    loadOlderBtn.textContent = t('loadOlder');
  }
}
// =============================================================================
// SETTINGS MODAL
// =============================================================================
async function openSettingsModal() {
  console.log('Opening settings modal...');
  
  const template = document.getElementById('settings-template');
  console.log('Template found:', template);
  
  if (!template) {
    console.error('Settings template not found!');
    return;
  }
  
  const content = template.content.cloneNode(true);
  console.log('Content cloned:', content);
  
  // Clear any existing content first
  modal.extra.innerHTML = '';
  modal.extra.appendChild(content);
  
  console.log('Content appended to modal.extra');
  console.log('modal.extra HTML:', modal.extra.innerHTML);
  
  // Get elements AFTER they're in the DOM
  const readReceiptsCheckbox = modal.extra.querySelector('#setting-read-receipts');
  const typingIndicatorsCheckbox = modal.extra.querySelector('#setting-typing-indicators');
  const linkAccountBtn = modal.extra.querySelector('#link-account-button');
  const restoreBtn = modal.extra.querySelector('#restore-button');
  const languageBtn = modal.extra.querySelector('#language-button');
  
  console.log('Elements found:', {
    readReceiptsCheckbox,
    typingIndicatorsCheckbox,
    linkAccountBtn,
    restoreBtn,
    languageBtn
  });
  
  // Set current values
  if (readReceiptsCheckbox) readReceiptsCheckbox.checked = userSettings.readReceipts;
  if (typingIndicatorsCheckbox) typingIndicatorsCheckbox.checked = userSettings.typingIndicators;
  
  // Update button labels with translations
  const labels = modal.extra.querySelectorAll('label');
  if (labels[0]) labels[0].textContent = t('sendReadReceipts');
  if (labels[1]) labels[1].textContent = t('showTypingIndicators');
  
  if (linkAccountBtn) {
    linkAccountBtn.textContent = t('linkEmailAccount');
    linkAccountBtn.onclick = () => {
      modal.overlay.classList.add('hidden');
      modal.overlay.classList.remove('flex');
      setTimeout(() => handleLinkAccountEmail(), 100);
    };
  }
  
  if (languageBtn) {
    const langText = languageBtn.querySelector('#language-text');
    if (langText) {
      langText.textContent = currentLanguage === 'en' ? 'Deutsch' : 'English';
    }
  }
  
  if (restoreBtn) {
    restoreBtn.textContent = t('restoreBackupBtn');
    restoreBtn.onclick = () => {
      modal.overlay.classList.add('hidden');
      modal.overlay.classList.remove('flex');
      setTimeout(() => openBackupRestore(), 100);
    };
  }
  
  // Event handlers for checkboxes
  if (readReceiptsCheckbox) {
    readReceiptsCheckbox.onchange = async () => {
      userSettings.readReceipts = readReceiptsCheckbox.checked;
      await idb.putSetting('readReceipts', userSettings.readReceipts);
    };
  }
  
  if (typingIndicatorsCheckbox) {
    typingIndicatorsCheckbox.onchange = async () => {
      userSettings.typingIndicators = typingIndicatorsCheckbox.checked;
      await idb.putSetting('typingIndicators', userSettings.typingIndicators);
    };
  }
  
  // Show the modal
  console.log('About to show modal...');
  await modal.show({
    title: t('settingsTitle'),
    text: '',
    type: 'alert'
  });
}

// =============================================================================
// CHAT INFO MODAL
// =============================================================================
async function openChatInfoModal() {
  if (!activeChat) return;
  
  const template = document.getElementById('chat-info-template');
  const content = template.content.cloneNode(true);
  
  try {
    const selfFpr = await fingerprintFromPublicRawB64(userKeys.rawPublicKey);
    content.querySelector('#fingerprint-self').textContent = selfFpr;
  } catch {
    content.querySelector('#fingerprint-self').textContent = '—';
  }
  
  const partnerFpr = activeChat.partnerFingerprint || '—';
  content.querySelector('#fingerprint-partner').textContent = partnerFpr;
  
  modal.extra.appendChild(content);
  
  const copySelfBtn = modal.extra.querySelector('#copy-fpr-self');
  const copyPartnerBtn = modal.extra.querySelector('#copy-fpr-partner');
  const verifyBtn = modal.extra.querySelector('#verify-fpr-btn');
  
  copySelfBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(modal.extra.querySelector('#fingerprint-self').textContent);
      copySelfBtn.textContent = `✓ ${t('copied')}`;
      setTimeout(() => copySelfBtn.textContent = t('copy'), 1500);
    } catch {}
  };
  
  copyPartnerBtn.onclick = async () => {
    try {
      await navigator.clipboard.writeText(modal.extra.querySelector('#fingerprint-partner').textContent);
      copyPartnerBtn.textContent = `✓ ${t('copied')}`;
      setTimeout(() => copyPartnerBtn.textContent = t('copy'), 1500);
    } catch {}
  };
  
  verifyBtn.onclick = async () => {
    modal.overlay.classList.add('hidden');
    await modal.alert(
      t('compareFingerprints'),
      t('compareFingerprintsText')
    );
  };
  
  await modal.show({
    title: t('chatInfoTitle').replace('{username}', activeChat.partnerUsername),
    text: '',
    type: 'alert',
    extraHtml: ''
  });
}

// =============================================================================
// ACCOUNT LINKING
// =============================================================================
async function handleLinkAccountEmail() {
  const user = auth.currentUser;
  if (!user) return modal.alert(t('error'), t('noActiveSession'));
  
  const email = await modal.prompt(
    t('linkAccountTitle'),
    t('enterEmail'),
    t('emailPlaceholder'),
    "email",
    (val) => {
      if (!validateEmail(val)) {
        modal.alert(t('invalid'), t('validEmailRequired'));
        return false;
      }
      return true;
    }
  );
  
  if (!email) return;
  
  const pw = await modal.prompt(
    t('choosePassword'),
    t('choosePasswordText'),
    t('passwordPlaceholder'),
    "password",
    (val) => {
      if (val.length < 12) {
        modal.alert(t('tooShort'), t('minCharactersRequired'));
        return false;
      }
      return true;
    }
  );
  
  if (!pw) return;
  
  try {
    showLoading(t('linkingAccount'));
    const cred = EmailAuthProvider.credential(email.trim(), pw);
    const res = await linkWithCredential(user, cred);
    await sendEmailVerification(res.user, {
      url: `${window.location.origin}/?verified=1`,
      handleCodeInApp: false
    });
    hideLoading();
    await modal.alert(
      t('backupSuccess'),
      t('accountLinked')
    );
  } catch (e) {
    hideLoading();
    if (e.code === 'auth/email-already-in-use') {
      return modal.alert(t('error'), t('emailAlreadyInUse'));
    }
    if (e.code === 'auth/credential-already-in-use') {
      return modal.alert(t('error'), t('credentialInUse'));
    }
    if (e.code === 'auth/invalid-email') {
      return modal.alert(t('invalid'), t('invalidEmail'));
    }
    console.error(e);
    modal.alert(t('error'), e.message);
  }
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================
function wireUI() {
  registerButton.addEventListener('click', handleInitializeSession);
  restoreBtnAuth.addEventListener('click', openBackupRestore);
  logoutButton.addEventListener('click', handleLogout);
  
  addChatButton.addEventListener('click', handleAddNewChat);
  sendButton.addEventListener('click', handleSendMessage);
  loadOlderBtn.addEventListener('click', handleLoadOlderMessages);
  
  messageInput.addEventListener('input', () => {
    handleTyping();
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 128) + 'px';
  });
  
  messageInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  });
  
  attachButton.addEventListener('click', () => imageUpload.click());
  imageUpload.addEventListener('change', handleImageSend);
  
  settingsBtn.addEventListener('click', openSettingsModal);
  chatInfoBtn.addEventListener('click', openChatInfoModal);
  backupBtn.addEventListener('click', openBackupExport);
  
  copyIdButton.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(userIdDisplay.value);
      copyIdButton.textContent = t('copied');
    } catch {
      userIdDisplay.select();
      document.execCommand('copy');
      copyIdButton.textContent = t('copied');
    } finally {
      setTimeout(() => { copyIdButton.textContent = t('copyUserId'); }, 2000);
    }
  });
  
  bannerClose.addEventListener('click', () => banner.classList.add('hidden'));
  
  // Language switcher - delegated event
  document.addEventListener('click', (e) => {
    if (e.target.id === 'language-button' || e.target.closest('#language-button')) {
      const newLang = currentLanguage === 'de' ? 'en' : 'de';
      switchLanguage(newLang);
    }
  });
  
  window.addEventListener('beforeunload', () => {
    if (activeChat) {
      try {
        firestoreModule.setTypingStatus(activeChat.chatId, false);
      } catch {}
    }
  });
}

// =============================================================================
// APP INITIALIZATION
// =============================================================================
async function startApp() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app, 'echat');
    storage = getStorage(app);

    wireUI();
    updateAllText();
    
    showLoading(t('connecting'));
    
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        currentUser = user;
        let privateKey = await idb.getKey(user.uid);

        if (privateKey) {
          try {
            sessionStorage.setItem('appRequested', 'true');
          } catch {}
          if (landingPage) landingPage.style.display = 'none';
          if (appContainer) appContainer.style.display = 'block';
          await handleLogin(user);
        } else {
          const appRequested = (() => {
            try {
              return sessionStorage.getItem('appRequested') === 'true';
            } catch {
              return false;
            }
          })();

          if (appRequested) {
            if (appContainer) appContainer.style.display = 'block';
            if (landingPage) landingPage.style.display = 'none';
            authView.style.display = 'flex';
          } else {
            if (landingPage) landingPage.style.display = 'block';
            if (appContainer) appContainer.style.display = 'none';
            authView.style.display = 'none';
          }
          appView.style.display = 'none';
          hideLoading();
        }
      } else {
        signInAnonymously(auth).catch(error => {
          console.error("Anonymous sign-in failed:", error);
          hideLoading();
          modal.alert(t('connectionError'), t('couldNotConnect'));
        });
      }
    });
  } catch (error) {
    console.error("Critical error:", error);
    hideLoading();
    document.body.innerHTML = `<div class="text-red-500 text-center p-8">${t('criticalError')} ${error.message}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', startApp);
