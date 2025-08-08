# 🚀 Deployment Guide

This guide shows how to deploy the Taco Apt website to Vercel and Render.

## Deploy to Vercel

### Option 1: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from your project directory**:
   ```bash
   cd taco-apt
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new one
   - Confirm deployment settings
   - Your site will be deployed and you'll get a URL

### Option 2: Using GitHub Integration

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/taco-apt.git
   git push -u origin main
   ```

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up/Login with GitHub
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect it's a static site
   - Click "Deploy"

### Option 3: Drag & Drop

1. **Zip your project**:
   ```bash
   # On Windows
   powershell Compress-Archive -Path . -DestinationPath taco-apt.zip
   
   # On Mac/Linux
   zip -r taco-apt.zip .
   ```

2. **Upload to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Drag and drop your zip file
   - Vercel will deploy automatically

## Deploy to Render

### Option 1: Using GitHub Integration (Recommended)

1. **Push your code to GitHub** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/taco-apt.git
   git push -u origin main
   ```

2. **Connect to Render**:
   - Go to [render.com](https://render.com)
   - Sign up/Login with GitHub
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `taco-apt`
     - **Build Command**: Leave empty (not needed for static sites)
     - **Publish Directory**: `.` (root directory)
   - Click "Create Static Site"

### Option 2: Using Render Dashboard

1. **Go to Render Dashboard**:
   - Visit [render.com](https://render.com)
   - Sign up/Login

2. **Create Static Site**:
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Render will auto-detect the configuration from `render.yaml`

## Configuration Files

### vercel.json
- Configures Vercel deployment
- Sets up routing for SPA behavior
- Adds security headers

### render.yaml
- Configures Render deployment
- Sets up static site configuration
- Defines routing and headers

## Environment Variables

For this static site, no environment variables are needed since:
- All data is mock data in JavaScript
- No API calls or database connections
- Leaflet maps work client-side

## Custom Domains

### Vercel
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### Render
1. Go to your service dashboard
2. Click "Settings" → "Custom Domains"
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring & Analytics

### Vercel Analytics
- Built-in analytics in Vercel dashboard
- Performance monitoring
- Error tracking

### Render Monitoring
- Built-in monitoring in Render dashboard
- Uptime monitoring
- Performance metrics

## Troubleshooting

### Common Issues

1. **Map not loading**:
   - Check browser console for errors
   - Ensure HTTPS (required for some map tiles)
   - Verify Leaflet CDN is accessible

2. **Deployment fails**:
   - Check file structure is correct
   - Ensure all files are committed
   - Verify configuration files are valid

3. **Custom domain issues**:
   - Wait for DNS propagation (up to 48 hours)
   - Check DNS records are correct
   - Verify SSL certificate is active

### Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Render**: [render.com/docs](https://render.com/docs)

## Cost

### Vercel
- **Free tier**: Unlimited static sites, 100GB bandwidth
- **Pro**: $20/month for advanced features

### Render
- **Free tier**: Unlimited static sites, 750 hours/month
- **Paid**: $7/month for dedicated instances

Both platforms offer generous free tiers for static sites like this one.
