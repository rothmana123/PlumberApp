# Deploy to GitHub Pages

This guide will help you deploy your Plumber Search App to GitHub Pages for free hosting.

## Prerequisites

- A GitHub account
- Your project pushed to a GitHub repository
- GitHub Actions enabled on your repository

## Step 1: Push Your Code to GitHub

If you haven't already, push your code to a GitHub repository:

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Plumber Search App"

# Add your GitHub repository as remote
git remote add origin https://github.com/yourusername/your-repo-name.git

# Push to main branch
git push -u origin main
```

## Step 2: Configure GitHub Pages

1. **Go to your repository on GitHub**
2. **Click Settings** (tab at the top)
3. **Scroll down to "Pages"** (in the left sidebar)
4. **Under "Source"**, select **"Deploy from a branch"**
5. **Under "Branch"**, select **"gh-pages"** and **"/(root)"**
6. **Click "Save"**

## Step 3: Enable GitHub Actions

1. **Go to your repository on GitHub**
2. **Click Actions** (tab at the top)
3. **Click "I understand my workflows, go ahead and enable them"**

## Step 4: Update Repository Name (Important!)

**⚠️ Important**: You need to update the base path in `vite.config.ts` to match your repository name.

1. **Find your repository name** on GitHub (e.g., `plumber-search-app`)
2. **Edit `vite.config.ts`** and update the base path:

```typescript
export default defineConfig({
  plugins: [react()],
  base: "/your-repo-name/", // ⬅️ Replace with your actual repo name
  // ... rest of config
});
```

3. **Commit and push the change**:

```bash
git add vite.config.ts
git commit -m "Update base path for GitHub Pages"
git push
```

## Step 5: Monitor Deployment

1. **Go to Actions tab** on GitHub
2. **You should see a workflow running** called "Deploy to GitHub Pages"
3. **Wait for it to complete** (usually 2-3 minutes)
4. **Check the green checkmark** to confirm success

## Step 6: Access Your Live Site

Once deployment is complete, your site will be available at:

```
https://yourusername.github.io/your-repo-name/
```

## Environment Variables for Production

For the app to work with real data in production, you'll need to set up environment variables:

### Option A: Use GitHub Secrets (Recommended)

1. **Go to your repository Settings**
2. **Click "Secrets and variables" → "Actions"**
3. **Click "New repository secret"**
4. **Add your secrets**:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `VITE_YELP_API_KEY`: Your Yelp API key (optional)

### Option B: Use Vercel/Netlify (Alternative)

If you prefer different hosting:

- **Vercel**: Connect your GitHub repo and it will auto-deploy
- **Netlify**: Connect your GitHub repo and it will auto-deploy

## Troubleshooting

### Build Fails

- Check the Actions tab for error messages
- Ensure all dependencies are in `package.json`
- Verify the build script works locally: `npm run build`

### Site Not Loading

- Check the base path in `vite.config.ts` matches your repo name
- Ensure GitHub Pages is enabled and pointing to `gh-pages` branch
- Wait a few minutes for changes to propagate

### Environment Variables Not Working

- Verify secrets are set in GitHub repository settings
- Check that variable names start with `VITE_`
- Re-deploy after adding secrets

### 404 Errors

- This is normal for client-side routing
- Consider adding a `404.html` redirect for SPA routing

## Custom Domain (Optional)

To use a custom domain:

1. **Add a CNAME file** to your `public/` folder
2. **Configure DNS** to point to `yourusername.github.io`
3. **Enable custom domain** in GitHub Pages settings

## Performance Tips

- The app is already optimized with Vite
- Images and assets are automatically optimized
- Consider enabling GitHub Pages caching headers

## Security Notes

- Environment variables in GitHub Secrets are encrypted
- Never commit API keys directly to your repository
- Use `.env.local` for local development only

## Next Steps

After deployment:

1. **Test all features** on the live site
2. **Set up your Supabase database** if not already done
3. **Configure Yelp API** for real data
4. **Share your live URL** with users!

Your plumber search app will now be live and accessible to anyone on the internet! 🎉
