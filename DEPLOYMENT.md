# GitHub Pages Deployment Guide

## Overview

This repository uses GitHub Actions to automatically deploy the site to GitHub Pages whenever changes are pushed to the `main` branch.

## Setup Instructions

### 1. Enable GitHub Pages in Repository Settings

1. Navigate to your repository on GitHub
2. Click on **Settings** (gear icon)
3. In the left sidebar, click **Pages**
4. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
   - This allows the GitHub Actions workflow to deploy the site

### 2. Merge the Pull Request

Once this PR is merged to `main`, the deployment workflow will automatically run.

### 3. Verify Deployment

After the workflow completes:
1. Go to the **Actions** tab in your repository
2. You should see a "Deploy to GitHub Pages" workflow run
3. Once it's complete (green checkmark), your site will be live at:
   - https://esejfic.github.io/
   - https://e-chat.me/ (custom domain)

## Manual Deployment

If you need to manually trigger a deployment:

1. Go to the **Actions** tab
2. Click on "Deploy to GitHub Pages" workflow
3. Click **Run workflow** button
4. Select the `main` branch
5. Click **Run workflow**

## Custom Domain Configuration

The repository includes a `CNAME` file with the custom domain `e-chat.me`. To configure the custom domain:

1. In your domain registrar's DNS settings, add:
   - A record pointing to GitHub Pages IP addresses:
     - 185.199.108.153
     - 185.199.109.153
     - 185.199.110.153
     - 185.199.111.153
   - Or CNAME record pointing to `esejfic.github.io`

2. In GitHub repository Settings → Pages:
   - Enter `e-chat.me` in the "Custom domain" field
   - Click **Save**
   - Wait for DNS check to complete (may take a few minutes)
   - Enable "Enforce HTTPS" once DNS is verified

## Troubleshooting

### Deployment Fails

- Check the workflow logs in the Actions tab
- Verify that GitHub Pages is enabled in Settings → Pages
- Ensure the workflow has proper permissions (defined in deploy.yml)

### Site Not Loading

- Wait 5-10 minutes after first deployment
- Clear browser cache
- Check that all referenced files exist in the repository

### Custom Domain Issues

- Verify DNS records are correctly configured
- DNS propagation can take up to 48 hours
- Use `dig e-chat.me` or online DNS checkers to verify DNS records

## Files Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── index.html                  # Main application page
├── app.js                      # Application JavaScript
├── sw.js                       # Service Worker for PWA
├── offline.html                # Offline fallback page
├── manifest.webmanifest        # PWA manifest
├── CNAME                       # Custom domain configuration
├── README.md                   # Project documentation
└── .gitignore                  # Git ignore rules
```

## Support

For issues or questions about deployment, please open an issue in the repository.
