# Vercel Deployment Guide for Arckana Frontend

Complete guide to deploy Arckana's Next.js frontend to Vercel.

---

## 🚀 Quick Deploy (Recommended)

### Option 1: Deploy via GitHub Integration

1. **Push code to GitHub** (already done ✅)
   ```bash
   git push origin main
   ```

2. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Git Repository"
   - Select: `carlos-israelj/Arckana`
   - Select: `frontend` as root directory

3. **Configure Project**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `frontend`
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)

4. **Add Environment Variables** (see below)

5. **Deploy!**
   - Click "Deploy"
   - Wait ~2-3 minutes
   - Your site will be live at: `https://arcana-*.vercel.app`

---

## 📋 Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

### Required Variables

| Variable | Value | Where to Get |
|----------|-------|--------------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Your WalletConnect ID | https://cloud.walletconnect.com/app |
| `NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS` | 0x... | From contract deployment |
| `NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS` | 0x... | From contract deployment |
| `NEXT_PUBLIC_PAYMASTER_ADDRESS` | 0x... | From contract deployment |
| `NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS` | 0x... | From contract deployment |
| `NEXT_PUBLIC_IAPP_ADDRESS` | 0x... | From iApp deployment |
| `NEXT_PUBLIC_RPC_URL` | https://sepolia-rollup.arbitrum.io/rpc | Public RPC |
| `NEXT_PUBLIC_IEXEC_CHAIN_ID` | 421614 | Arbitrum Sepolia |

### Copy-Paste Template for Vercel

```env
# Wallet Connection
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here

# Smart Contracts (Arbitrum Sepolia)
NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS=0x
NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS=0x
NEXT_PUBLIC_PAYMASTER_ADDRESS=0x
NEXT_PUBLIC_PAYMENT_TOKEN_ADDRESS=0x

# iExec iApp
NEXT_PUBLIC_IAPP_ADDRESS=0x

# Network Configuration
NEXT_PUBLIC_RPC_URL=https://sepolia-rollup.arbitrum.io/rpc
NEXT_PUBLIC_IEXEC_CHAIN_ID=421614
```

### How to Add in Vercel

**Via Dashboard:**
1. Go to your project in Vercel
2. Settings → Environment Variables
3. Add each variable:
   - Key: `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - Value: `your_value`
   - Environment: **Production**, **Preview**, **Development** (all)
4. Click "Save"

**Via Vercel CLI:**
```bash
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID
# Paste your value when prompted
# Select: Production, Preview, Development
```

---

## 🔧 Option 2: Deploy via Vercel CLI

### 1. Install Vercel CLI

```bash
npm install -g vercel
```

### 2. Login to Vercel

```bash
vercel login
```

### 3. Navigate to Frontend Directory

```bash
cd frontend
```

### 4. Deploy

```bash
# Development deployment
vercel

# Production deployment
vercel --prod
```

### 5. Set Environment Variables

```bash
# Add each variable
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID production
vercel env add NEXT_PUBLIC_ARCANA_TOKEN_ADDRESS production
vercel env add NEXT_PUBLIC_DIVIDEND_POOL_ADDRESS production
# ... etc
```

Or pull from .env.local:
```bash
# If you have .env.local configured
vercel env pull .env.vercel.local
```

---

## 📁 Project Structure for Vercel

Vercel will automatically detect:

```
Arckana/
└── frontend/              # Root directory in Vercel settings
    ├── package.json       # Dependencies
    ├── next.config.js     # Next.js configuration
    ├── tsconfig.json      # TypeScript config
    ├── tailwind.config.js # Tailwind CSS
    ├── src/
    │   ├── app/           # Next.js App Router
    │   ├── components/    # React components
    │   ├── hooks/         # Custom hooks
    │   ├── lib/           # Utilities
    │   └── providers/     # Context providers
    └── public/            # Static assets
```

---

## ⚙️ Build Configuration

### vercel.json (Already Created)

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "regions": ["iad1"]
}
```

### Next.js Config

Already configured in `next.config.js`:
```javascript
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    config.externals.push('pino-pretty', 'lokijs', 'encoding');
    return config;
  },
}
```

---

## 🔍 Post-Deployment Checklist

After deployment:

### 1. Verify Deployment
- [ ] Site loads at Vercel URL
- [ ] No build errors in Vercel logs
- [ ] All environment variables are set

### 2. Test Wallet Connection
- [ ] Connect MetaMask
- [ ] Switch to Arbitrum Sepolia
- [ ] Wallet connection persists on refresh

### 3. Test DataProtector
- [ ] Can protect balance
- [ ] Status updates appear
- [ ] Protected data address received
- [ ] Grant access works

### 4. Test Contract Integration
- [ ] Can read distribution status
- [ ] Current round displays
- [ ] Merkle root shows when available

### 5. Test UI/UX
- [ ] Responsive on mobile
- [ ] Tabs navigation works
- [ ] Loading states display
- [ ] Error messages show properly

---

## 🌐 Custom Domain (Optional)

### Add Custom Domain

1. **Buy Domain** (e.g., arcana.app)

2. **Add to Vercel**
   - Project Settings → Domains
   - Add: `arcana.app` and `www.arcana.app`

3. **Configure DNS**

   For `arcana.app`:
   ```
   Type: A
   Name: @
   Value: 76.76.21.21
   ```

   For `www.arcana.app`:
   ```
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

4. **Wait for SSL** (~24 hours max)

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you:

### Production Deployments
- Push to `main` branch
- Merge PR to `main`

### Preview Deployments
- Push to any other branch
- Open a PR

### Deploy Hooks (Manual)
Create a deploy hook for manual triggers:

1. Settings → Git → Deploy Hooks
2. Create Hook: "Manual Deploy"
3. Copy URL
4. Trigger: `curl -X POST [DEPLOY_HOOK_URL]`

---

## 🐛 Troubleshooting

### Build Fails

**Error: Module not found**
```bash
# Solution: Check package.json dependencies
npm install
npm run build  # Test locally first
```

**Error: Environment variable not found**
```bash
# Solution: Add to Vercel dashboard
# Must start with NEXT_PUBLIC_ to be available in browser
```

**Error: Type errors**
```bash
# Solution: Check TypeScript configuration
npm run build  # Fix all type errors locally first
```

### Runtime Errors

**Error: Hydration mismatch**
```bash
# Solution: Ensure no browser-only code in SSR
# Use 'use client' directive properly
```

**Error: RPC errors**
```bash
# Solution: Check RPC URL is correct
# Verify Arbitrum Sepolia RPC is working
```

**Error: DataProtector initialization failed**
```bash
# Solution: Check allowExperimentalNetworks is true
# Verify wallet is connected
# Ensure on Arbitrum Sepolia network
```

---

## 📊 Vercel Dashboard Features

### Analytics
- Go to: Analytics tab
- View: Page views, visitors, performance

### Logs
- Go to: Deployments → [Deployment] → View Function Logs
- Real-time logs for debugging

### Speed Insights
- Enable: Settings → Speed Insights
- Monitor: Core Web Vitals

---

## 🔐 Security Best Practices

### Environment Variables
- ✅ Never commit `.env.local` to Git
- ✅ Use Vercel environment variables for secrets
- ✅ All public variables start with `NEXT_PUBLIC_`
- ✅ Private variables (API keys) have NO prefix

### HTTPS
- ✅ Vercel provides automatic SSL
- ✅ All traffic is HTTPS by default
- ✅ HTTP automatically redirects to HTTPS

---

## 💰 Pricing

**Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Automatic SSL
- ✅ Preview deployments
- ✅ Git integration
- ✅ Analytics

**Perfect for hackathon and demo!** 🎉

---

## 📝 Deployment Commands Summary

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from frontend directory)
cd frontend
vercel              # Preview
vercel --prod       # Production

# Add env variables
vercel env add NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

# Pull env variables
vercel env pull

# View logs
vercel logs [deployment-url]

# List deployments
vercel ls

# Remove deployment
vercel rm [deployment-url]
```

---

## 🎯 After Successful Deployment

1. **Update README.md**
   ```markdown
   ## 🌐 Live Demo

   **Frontend**: https://arcana-xyz.vercel.app
   ```

2. **Share Links**
   - Demo URL: `https://your-project.vercel.app`
   - GitHub: `https://github.com/carlos-israelj/Arckana`

3. **Test Everything**
   - Go through full user flow
   - Test on mobile device
   - Share with team for feedback

---

## 🔗 Useful Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Vercel Docs**: https://vercel.com/docs
- **Next.js on Vercel**: https://vercel.com/docs/frameworks/nextjs
- **Environment Variables**: https://vercel.com/docs/concepts/projects/environment-variables

---

## ✅ Quick Checklist

Before deploying:
- [ ] All code committed and pushed to GitHub
- [ ] Environment variables documented
- [ ] WalletConnect project ID obtained
- [ ] Contracts deployed and addresses saved
- [ ] iApp deployed and address saved
- [ ] Build works locally (`npm run build`)
- [ ] No TypeScript errors
- [ ] No ESLint errors

During deployment:
- [ ] Import GitHub repository to Vercel
- [ ] Set root directory to `frontend`
- [ ] Add all environment variables
- [ ] Deploy to production

After deployment:
- [ ] Test live site
- [ ] Verify all features work
- [ ] Update documentation with URL
- [ ] Share with team/judges

---

**Ready to deploy!** 🚀

Your Arckana frontend will be live in ~3 minutes on Vercel!
