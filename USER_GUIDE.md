# STUDYX - User Guide for Code Modifications

## Overview
STUDYX is a modern student dashboard application built with React, TypeScript, and Tailwind CSS. This guide will help you understand the codebase structure and make modifications without coding knowledge.

## Project Structure

### 📁 Main Directories

```
src/
├── components/          # UI components
│   ├── auth/           # Login & signup forms
│   ├── dashboard/      # Main dashboard components
│   ├── timer/          # Study timer functionality
│   ├── checklist/      # Subject & topic management
│   ├── analytics/      # Progress tracking & charts
│   ├── profile/        # User profile & settings
│   ├── layout/         # Navigation & sidebar
│   └── ui/             # Reusable UI components
├── contexts/           # Data management
├── types/              # Type definitions
└── App.tsx             # Main application file
```

## 🎨 Design Customization

### Colors
The app uses a **black and white** color scheme. To modify colors:

**Location:** All component files (look for `className` attributes)

**Key Color Classes:**
- `bg-black` - Pure black background
- `bg-gray-900` - Dark gray background
- `bg-white` - White background
- `text-white` - White text
- `text-gray-300` - Light gray text
- `text-gray-400` - Medium gray text
- `border-white/20` - Semi-transparent white borders

### Glassmorphism Effects
The signature glass effect is controlled by the `GlassCard` component:

**Location:** `src/components/ui/GlassCard.tsx`

**Key Properties:**
- `backdrop-blur-md` - Controls blur intensity
- `bg-white/10` - Background transparency (10% white)
- `border-white/20` - Border transparency (20% white)

### Typography
**Font Sizes:**
- `text-sm` - Small text
- `text-base` - Regular text
- `text-lg` - Large text
- `text-xl` - Extra large text
- `text-2xl` - 2x large text
- `text-3xl` - 3x large text
- `text-4xl` - 4x large text

**Font Weights:**
- `font-normal` - Regular weight
- `font-medium` - Medium weight
- `font-semibold` - Semi-bold weight
- `font-bold` - Bold weight

## 🔧 Component Modifications

### 1. Dashboard Welcome Message
**Location:** `src/components/dashboard/Dashboard.tsx`

**Find this section:**
```typescript
<h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
  {getGreeting()}, {user?.name}
</h1>
```

**To modify:** Change the text or styling classes

### 2. App Title & Branding
**Location:** `src/components/auth/AuthPage.tsx`

**Find this section:**
```typescript
<h1 className="text-4xl font-bold text-white">
  STUDYX
</h1>
```

**To modify:** Change "STUDYX" to your preferred name

### 3. Timer Settings
**Location:** `src/contexts/StudyContext.tsx`

**Find this section:**
```typescript
const [timerSettings, setTimerSettings] = useState<TimerSettings>({
  focusTime: 25,        // Change default focus time
  shortBreak: 5,        // Change default short break
  longBreak: 15,        // Change default long break
  autoStart: false,     // Change auto-start default
  soundEnabled: true,   // Change sound default
});
```

### 4. Navigation Labels
**Location:** `src/components/layout/Navbar.tsx`

**Find this section:**
```typescript
const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: Home },
  { key: 'timer', label: 'Timer', icon: Clock },
  { key: 'analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'profile', label: 'Profile', icon: User },
];
```

## 📱 Responsive Design

### Breakpoints
- **Mobile:** Default styles (< 768px)
- **Tablet:** `md:` prefix (≥ 768px)
- **Desktop:** `lg:` prefix (≥ 1024px)
- **Large Desktop:** `xl:` prefix (≥ 1280px)

### Layout Adjustments
**Grid Layouts:**
- `grid-cols-1` - Single column (mobile)
- `md:grid-cols-2` - Two columns (tablet+)
- `lg:grid-cols-3` - Three columns (desktop+)
- `lg:grid-cols-4` - Four columns (large desktop+)

## 🎯 Common Modifications

### 1. Change Button Colors
**Location:** `src/components/ui/Button.tsx`

**Find the variants object:**
```typescript
const variants = {
  primary: 'bg-white text-black hover:bg-gray-100 shadow-lg',
  secondary: 'bg-black text-white border border-white/20 hover:bg-gray-900',
  ghost: 'bg-transparent text-white border border-white/20 hover:bg-white/10',
};
```

### 2. Modify Progress Bar Colors
**Location:** `src/components/ui/ProgressBar.tsx`

**Find this line:**
```typescript
className="h-2.5 bg-gradient-to-r from-white to-gray-300 rounded-full"
```

### 3. Add New Dashboard Stats
**Location:** `src/components/dashboard/DashboardStats.tsx`

**Find the stats array and add new items:**
```typescript
const stats = [
  // Add new stat object here
  {
    icon: <YourIcon size={24} />,
    label: 'Your Label',
    value: 'Your Value',
    color: 'from-white to-gray-300',
  },
];
```

### 4. Change Animation Durations
**Location:** Any component with `motion.div`

**Find `transition` properties:**
```typescript
transition={{ duration: 0.6 }}  // Change 0.6 to your preferred duration
```

## 🎨 Icon Modifications

### Available Icons
All icons come from `lucide-react`. Common ones include:
- `Home`, `User`, `Settings`, `Clock`, `BarChart3`
- `Plus`, `Minus`, `Edit2`, `Trash2`, `Check`, `X`
- `ArrowLeft`, `ArrowRight`, `ChevronUp`, `ChevronDown`
- `Mail`, `Lock`, `Eye`, `EyeOff`, `Search`

### Adding New Icons
1. Import at the top of the file:
```typescript
import { NewIcon } from 'lucide-react';
```

2. Use in JSX:
```typescript
<NewIcon size={20} className="text-white" />
```

## 🔄 Animation Customization

### Framer Motion Effects
**Common Animation Properties:**
- `initial` - Starting state
- `animate` - End state  
- `transition` - Animation settings
- `whileHover` - Hover effects
- `whileTap` - Click effects

**Example:**
```typescript
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  whileHover={{ scale: 1.05 }}
>
```

### Background Animations
**Location:** Each page component

**Find animated background divs:**
```typescript
<motion.div
  animate={{
    scale: [1, 1.2, 1],
    rotate: [0, 180, 360],
  }}
  transition={{
    duration: 20,        // Animation duration
    repeat: Infinity,    // Repeat forever
    ease: "linear"       // Animation easing
  }}
  className="absolute ... bg-white/5 ..."  // Opacity level
/>
```

## 📊 Data Modifications

### Mock Data
**Location:** `src/contexts/StudyContext.tsx` and `src/contexts/AuthContext.tsx`

The app uses mock data for demonstration. In a real app, this would connect to a backend API.

### Local Storage
User data is stored in browser's local storage with these keys:
- `studyx_user` - User information
- `studyx_subjects` - Subject and topic data
- `studyx_sessions` - Timer session history
- `studyx_settings` - User preferences

## 🚀 Performance Tips

1. **Image Optimization:** Use WebP format for better compression
2. **Animation Performance:** Use `transform` and `opacity` for smooth animations
3. **Component Splitting:** Keep components under 200 lines for maintainability
4. **Lazy Loading:** Consider lazy loading for non-critical components

## 🛠️ Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint

# Preview production build
npm run preview
```

## 📋 Troubleshooting

### Common Issues:

1. **Styles not applying:** Check Tailwind class names are correct
2. **Components not rendering:** Verify import paths
3. **Animations not working:** Ensure Framer Motion is properly imported
4. **Data not persisting:** Check localStorage keys match

### Debug Tips:

1. Use browser dev tools to inspect elements
2. Check console for error messages
3. Verify component props are being passed correctly
4. Test responsive design with different screen sizes

## 🎯 Best Practices

1. **Consistent Naming:** Use descriptive component and function names
2. **Component Structure:** Keep components focused on single responsibilities
3. **Performance:** Avoid inline styles, use Tailwind classes
4. **Accessibility:** Ensure proper ARIA labels and keyboard navigation
5. **Responsive Design:** Test on multiple screen sizes

This guide should help you make common modifications to the STUDYX application without needing extensive coding knowledge. For more complex changes, consider consulting with a developer.