# Personal Profile Website with Admin Panel

A single-file React (.jsx) personal profile website featuring a fully functional admin panel with persistent storage, built entirely with Tailwind CSS.

## ✨ Features Implemented

### Public Profile View
- **Hero Section**: Full name (monospace font), title, bio, animated glowing avatar, and social links (GitHub, LinkedIn, Twitter, Email)
- **About Section**: Long-form description about yourself
- **Skills Section**: Tag-style chips organized by category (Frontend, Backend, Tools)
- **Projects Section**: Responsive card grid with title, description, tags, and links
- **Experience Section**: Timeline entries with company, role, date range, and description
- **Contact Section**: Email, location, and contact button
- **Animations**: Scroll-triggered fade-in effects on all sections using IntersectionObserver

### Admin Panel
- **Password Protection**: Default password is `admin123` (stored in localStorage)
- **Six Management Tabs**:
  1. **Profile** - Edit name, title, bio, avatar URL, social links, and about section
  2. **Skills** - Add/remove skills with category assignment (Frontend/Backend/Tools/Other)
  3. **Projects** - Full CRUD for project cards (title, description, tags, URL, image)
  4. **Experience** - Full CRUD for experience entries (company, role, date range, description)
  5. **Contact** - Edit email and location
  6. **Settings** - Reset all data to defaults

### Storage & Persistence
- **window.storage API**: Custom persistent key-value storage using localStorage
- All profile data is automatically saved when changes are made
- Data persists across browser sessions
- Default data is provided for initial load

### Design Features
- **Color Scheme**: 
  - Dark slate background (#0F172A)
  - Electric indigo accents (#6366F1)
  - Zinc neutrals for text
- **Typography**: 
  - Monospace font for the name (distinctive coder aesthetic)
  - Sans-serif for body text
- **Visual Effects**:
  - Animated gradient glow on avatar
  - Hover effects on project cards (lift animation)
  - Smooth scrolling throughout
  - Responsive design (mobile-first)

### Technical Stack
- **React 19**: Functional components with hooks only
- **Tailwind CSS 4**: Via CDN with custom configuration
- **Pure JavaScript**: No external UI libraries
- **localStorage**: For persistent data storage
- **IntersectionObserver**: For scroll animations

## 🚀 Getting Started

### Installation
```bash
cd profilechuyenvientrienkhai
npm install
npm start
```

The app will open on `http://localhost:3001` (or next available port)

### Default Credentials
- **Admin Password**: `admin123`

## 📝 Usage

### Accessing the Admin Panel
1. Click the **⚙️** (settings) button in the bottom-right corner
2. Enter the password: `admin123`
3. Edit your profile content using the tabs
4. Click "Save Changes" to persist all modifications
5. Changes are immediately saved to storage

### Editing Profile Content
- **Profile Tab**: Update your personal information, bio, and social links
- **Skills Tab**: Add/remove skills and assign them to categories
- **Projects Tab**: Create, edit, or delete project cards with descriptions and links
- **Experience Tab**: Manage your work experience entries
- **Contact Tab**: Update contact information
- **Settings Tab**: View default password or reset all data

### Customization
To change the default password:
1. Open DevTools Console
2. Run: `localStorage.setItem('__admin_password__', 'your_new_password')`

## 🎨 Design Highlights

### Color System
```css
--slate-dark: #0F172A (background)
--indigo-electric: #6366F1 (accents)
--zinc-neutrals: text colors
```

### Responsive Breakpoints
- Mobile-first design
- Fully responsive from 320px to 2560px+
- Optimized layouts for all screen sizes

### Accessibility
- Semantic HTML structure
- Keyboard navigable
- Clear visual hierarchy
- Sufficient color contrast

## 📦 Project Structure

```
src/
├── App.jsx              # Main application file (single-file component)
├── index.js             # React entry point
├── index.css            # Global styles + animations
└── setupTests.js

public/
├── index.html           # HTML with Tailwind CDN
└── manifest.json
```

## 🔒 Security Notes

- Default password is stored in localStorage
- For production, implement proper backend authentication
- Never store sensitive data in localStorage
- Consider adding HTTPS-only cookies for authentication

## 🌐 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📱 Features Summary

| Feature | Status |
|---------|--------|
| Single-file React component | ✅ |
| Tailwind CSS styling | ✅ |
| Persistent storage | ✅ |
| Admin password protection | ✅ |
| Full CRUD for projects | ✅ |
| Full CRUD for experience | ✅ |
| Skill categorization | ✅ |
| Scroll animations | ✅ |
| Responsive design | ✅ |
| Social links integration | ✅ |
| Animated avatar glow | ✅ |

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Update Tailwind for Production
Before deployment, install Tailwind CSS build tools:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss -i ./src/index.css -o ./src/output.css
```

## 💡 Tips for Customization

1. **Change Avatar**: Update the avatar URL in the Profile tab of Admin Panel
2. **Add Social Links**: Edit social media URLs in the Profile tab
3. **Customize Colors**: Modify the Tailwind config in `public/index.html`
4. **Add More Skills**: Use the "+ Add Skill" button in the Skills tab
5. **Create Project Portfolio**: Add projects using the "+ Add Project" button

## 📞 Support

For issues or questions:
1. Check browser console for errors (F12)
2. Verify localStorage is enabled
3. Clear cache and reload (Ctrl+Shift+R)
4. Reset data using the Settings tab

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-12  
**Built with**: React 19 + Tailwind CSS 4 + localStorage
