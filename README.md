# Ethos Tier Maker

A modern tier maker powered by **Ethos credibility scores** for ranking users based on their reputation and trustworthiness.

![Tier Maker Preview](https://via.placeholder.com/800x400/f0f0f0/333333?text=Ethos+Tier+Maker)

## ✨ Features

- **Ethos Integration**: Fetch real user data from Ethos API
- **Score-Based Color Coding**: Visual representation of credibility levels
- **Drag & Drop Interface**: Intuitive tier ranking system
- **Profile Pictures**: Display user avatars with colored reputation rings
- **Individual Management**: Add/remove users with delete mode
- **Responsive Design**: Works on desktop, tablet, and mobile

## 🎨 Credibility Score Colors

| Score Range | Category | Color |
|-------------|----------|-------|
| < 800 | Untrusted | 🔴 Red |
| 800-1199 | Questionable | 🟠 Orange |
| 1200-1399 | Neutral | ⚪ Gray |
| 1400-1599 | Known | 🔵 Light Blue |
| 1600-1799 | Established | 🔵 Blue |
| 1800-1999 | Reputable | 🔵 Dark Blue |
| 2000-2199 | Exemplary | 🟢 Green |
| 2200-2399 | Distinguished | 🟢 Dark Green |
| 2400-2599 | Revered | 🟣 Purple |
| 2600+ | Renowned | 🟣 Dark Purple |

## 🚀 Quick Start

1. **Add Ethos Users**: Enter an Ethos username and click "Add Ethos User"
2. **Drag to Rank**: Drag user cards into S, A, B, C, or D tiers
3. **Manage Users**: Use "Toggle Delete Mode" to remove individual users
4. **Clear/Reset**: Use control buttons to manage your tier list

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: Ethos Network API v2
- **Styling**: High contrast white theme
- **Deployment**: Vercel-ready configuration

## 📦 Deployment

### Deploy to Vercel (Recommended)

1. **Clone/Download** this repository
2. **Install Vercel CLI**:
   \`\`\`bash
   npm install -g vercel
   \`\`\`

3. **Deploy**:
   \`\`\`bash
   vercel
   \`\`\`

4. **Follow the prompts** to connect your project

### Alternative: GitHub + Vercel

1. **Push to GitHub**:
   \`\`\`bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/your-username/ethos-tier-maker
   git push -u origin main
   \`\`\`

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

### Manual Deployment

You can also deploy to any static hosting service:
- Netlify
- GitHub Pages  
- Firebase Hosting
- Surge.sh

## 📁 Project Structure

\`\`\`
ethos-tier-maker/
├── index.html          # Main HTML file
├── styles.css          # Styling and layout
├── script.js           # JavaScript functionality
├── vercel.json         # Vercel configuration
├── package.json        # Project metadata
├── .gitignore          # Git ignore rules
└── README.md           # Documentation
\`\`\`

## 🔧 Configuration

The project is configured for Vercel deployment with:
- Static site optimization
- Security headers
- CORS handling for Ethos API

## 🌐 API Integration

Uses the **Ethos Network API v2**:
- Endpoint: \`https://api.ethos.network/api/v2/user/by/username/{username}\`
- Returns user profile data including:
  - Display name
  - Avatar URL
  - Credibility score
  - Status and statistics

## 🎯 Usage Tips

- **Search Users**: Try usernames like "vitalik", "ethereum", etc.
- **Score Visibility**: Color-coded rings show credibility at a glance
- **Mobile Friendly**: Fully responsive design for all devices
- **Fast Loading**: Optimized for quick user interactions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use and modify for your projects.

## 🔗 Links

- **Ethos Network**: [ethos.network](https://ethos.network)
- **API Documentation**: [developers.ethos.network](https://developers.ethos.network)
- **Vercel Deployment**: [vercel.com](https://vercel.com)

---

**Built with ❤️ for the Ethos community**
