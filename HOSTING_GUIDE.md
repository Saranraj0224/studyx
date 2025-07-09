# STUDYX Hosting Guide

## Database Setup (Supabase)

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Create a new organization or use existing
4. Create a new project
5. Choose a database password and region

### 2. Configure Database
1. Go to SQL Editor in your Supabase dashboard
2. Copy and paste the contents of `supabase/migrations/20250708165833_smooth_lagoon.sql`
3. Run the SQL commands to create tables and policies

### 3. Get API Keys
1. Go to Settings > API in your Supabase dashboard
2. Copy the Project URL and anon public key
3. Update your `.env` file:
```env
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Configure Authentication (CRITICAL)
1. Go to Authentication > Settings in Supabase
2. **DISABLE email confirmation**:
   - Scroll down to "Email Confirmation"
   - Turn OFF "Enable email confirmations"
   - This allows immediate login after registration
3. Set Site URL to your domain (e.g., `https://yourdomain.com`)
4. Add redirect URLs:
   - `https://yourdomain.com`
   - `https://yourdomain.com/auth/callback`
   - `http://localhost:5173` (for development)

### 5. Test Authentication
1. Try creating a new account
2. You should be immediately logged in without email confirmation
3. If you get stuck on the login page, check:
   - Email confirmation is disabled
   - Database tables are created properly
   - Environment variables are correct

## Hosting Options

### Option 1: Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. Deploy

### Option 2: Netlify
1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag and drop the `dist` folder
4. Add environment variables in site settings
5. Set up continuous deployment with GitHub

### Option 3: Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build: `npm run build`
5. Deploy: `firebase deploy`

## Environment Variables

Make sure to set these environment variables in your hosting platform:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Domain Configuration

### Custom Domain Setup
1. Purchase a domain from a registrar
2. Configure DNS settings to point to your hosting provider
3. Set up SSL certificate (usually automatic)
4. Update Supabase redirect URLs to use your custom domain

### Supabase Redirect URLs
Add these URLs in Supabase Authentication settings:
- `https://yourdomain.com`
- `https://yourdomain.com/auth/callback`
- `http://localhost:5173` (for development)

## Performance Optimization

### 1. Build Optimization
- The project is already configured with Vite for optimal builds
- Uses code splitting and tree shaking automatically
- Tailwind CSS is purged in production

### 2. Database Optimization
- Indexes are already created for common queries
- Row Level Security is enabled for data protection
- Connection pooling is handled by Supabase

### 3. Caching
- Static assets are cached by hosting providers
- API responses can be cached using React Query (optional upgrade)

## Monitoring and Analytics

### 1. Supabase Dashboard
- Monitor database usage and performance
- View authentication metrics
- Check API usage and limits

### 2. Hosting Analytics
- Vercel/Netlify provide built-in analytics
- Monitor page views, performance, and errors

### 3. Error Tracking (Optional)
- Add Sentry for error tracking
- Monitor user experience and performance

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use different keys for development and production
- Rotate keys regularly

### 2. Database Security
- Row Level Security is enabled
- All queries are filtered by user authentication
- Regular security updates through Supabase

### 3. Authentication
- Email confirmation can be enabled for production
- Consider adding 2FA for enhanced security
- Monitor for suspicious login attempts

## Backup and Recovery

### 1. Database Backups
- Supabase provides automatic daily backups
- Manual backups can be created in the dashboard
- Export data regularly for additional safety

### 2. Code Backups
- Use Git for version control
- Keep multiple deployment environments
- Document all configuration changes

## Scaling Considerations

### 1. Database Scaling
- Supabase handles automatic scaling
- Monitor usage and upgrade plan as needed
- Consider read replicas for high traffic

### 2. Frontend Scaling
- CDN is handled by hosting providers
- Consider implementing service workers for offline support
- Optimize images and assets

## Troubleshooting

### Common Issues
1. **Authentication stuck on login page**: 
   - Disable email confirmation in Supabase
   - Check database tables are created
   - Verify environment variables
2. **Database connection errors**: Verify Supabase URL and keys
3. **Build failures**: Ensure all dependencies are installed
4. **Email confirmation loop**: Disable email confirmation in Supabase settings

### Support Resources
- Supabase Documentation: [supabase.com/docs](https://supabase.com/docs)
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- React Documentation: [react.dev](https://react.dev)

## Maintenance

### Regular Tasks
1. Update dependencies monthly
2. Monitor database usage and performance
3. Review and rotate API keys quarterly
4. Backup critical data regularly
5. Test authentication flows periodically

### Updates
- The application will automatically use the latest data from the database
- Frontend updates require redeployment
- Database schema changes need careful migration planning

## Quick Fix Checklist

If authentication isn't working:
- [ ] Email confirmation is disabled in Supabase
- [ ] Database migration has been run
- [ ] Environment variables are set correctly
- [ ] Site URL is configured in Supabase
- [ ] User can create account and login immediately