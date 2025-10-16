# esejfic.github.io

## Secure Messenger - End-to-End Encrypted Chat Application

A Progressive Web App (PWA) that provides secure, end-to-end encrypted messaging with enhanced security features.

### Features

- 🔐 End-to-end encryption with forward secrecy
- 📱 Progressive Web App (PWA) - installable on mobile and desktop
- 🌐 Bilingual support (English/German)
- 🔒 Media encryption before upload
- ✅ Read receipts and typing indicators
- 🎙️ Voice message support
- 🔔 Push notifications
- 📴 Offline functionality

### Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions.

#### Automatic Deployment

When changes are pushed to the `main` branch, the GitHub Actions workflow automatically:
1. Checks out the code
2. Configures GitHub Pages
3. Uploads the site artifacts
4. Deploys to GitHub Pages

The site will be available at: https://esejfic.github.io/

#### Manual Deployment

You can also trigger a deployment manually:
1. Go to the Actions tab in the GitHub repository
2. Select the "Deploy to GitHub Pages" workflow
3. Click "Run workflow"
4. Select the `main` branch
5. Click "Run workflow"

### Repository Settings

To enable GitHub Pages deployment, ensure the following settings are configured in your repository:
1. Go to Settings → Pages
2. Under "Build and deployment", select "GitHub Actions" as the source

### Local Development

This is a static site that can be run locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/esejfic/esejfic.github.io.git
   cd esejfic.github.io
   ```

2. Serve the files using any local web server, for example:
   ```bash
   python -m http.server 8000
   ```
   or
   ```bash
   npx http-server
   ```

3. Open your browser to `http://localhost:8000`

### Technologies Used

- HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- Firebase (Authentication, Firestore, Storage)
- Web Crypto API for encryption
- Service Workers for offline functionality
- Web App Manifest for PWA capabilities

### Custom Domain

This site uses the custom domain `e-chat.me` as configured in the `CNAME` file.