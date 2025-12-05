# Flam Tunes - Complete Setup Guide

This guide will walk you through setting up Flam Tunes from scratch.

## Prerequisites

- Node.js 18+ installed
- pnpm installed (`npm install -g pnpm`)
- A Supabase account (free tier works)
- (Optional) Email service API key (Resend, SendGrid, etc.)

## Step 1: Install Dependencies

```bash
pnpm install
```

## Step 2: Set Up Supabase

### 2.1 Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned

### 2.2 Get Your Credentials

1. Go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **service_role** key (SUPABASE_SERVICE_ROLE_KEY) - Keep this secret!

### 2.3 Run Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Copy and paste the contents of `supabase/schema.sql`
3. Click **Run** to execute
4. Verify all tables were created in **Table Editor**

### 2.4 Run Seed Data (Optional)

1. In **SQL Editor**, copy and paste the contents of `supabase/seed.sql`
2. Click **Run** to create sample AI hosts and shows

### 2.5 Create Storage Buckets

1. Go to **Storage** in your Supabase dashboard
2. Create the following buckets (click **New bucket** for each):

   **radio-tracks** (Public)
   - Name: `radio-tracks`
   - Public bucket: ✅ Yes
   - File size limit: 50 MB
   - Allowed MIME types: `audio/*`

   **radio-segments** (Public)
   - Name: `radio-segments`
   - Public bucket: ✅ Yes
   - File size limit: 50 MB
   - Allowed MIME types: `audio/*`

   **radio-assets** (Public)
   - Name: `radio-assets`
   - Public bucket: ✅ Yes
   - File size limit: 10 MB
   - Allowed MIME types: `image/*`

   **artist-submissions** (Private or Public)
   - Name: `artist-submissions`
   - Public bucket: ❌ No (recommended) or ✅ Yes
   - File size limit: 50 MB
   - Allowed MIME types: `audio/*`

## Step 3: Configure Environment Variables

1. Create a `.env.local` file in the project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Icecast Stream URL (optional - set when you have streaming server)
NEXT_PUBLIC_ICECAST_STREAM_URL=https://your-icecast-server.com/stream
ICECAST_STREAM_URL=https://your-icecast-server.com/stream

# Site URL (for email links)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Email Service (for notifications)
# RESEND_API_KEY=your_resend_api_key
# Or use SendGrid, etc.
```

2. Replace the placeholder values with your actual credentials

## Step 4: Create Admin User

1. Go to **Authentication** → **Users** in Supabase dashboard
2. Click **Add user** → **Create new user**
3. Enter email and password
4. **Important**: Note this email/password - you'll use it to log in at `/admin/login`

## Step 5: Run the Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Initial Setup Tasks

### 6.1 Log in to Admin

1. Go to `http://localhost:3000/admin/login`
2. Use the admin credentials you created in Step 4

### 6.2 Create Your First AI Host

1. Go to **Admin** → **AI Hosts**
2. Click **Create AI Host**
3. Fill in:
   - Name: e.g., "DJ Flam"
   - Voice ID: e.g., "en-US-NovaNeural" (check your TTS provider docs)
   - Persona Prompt: Describe how the AI should talk
   - Active: ✅

### 6.3 Create Your First Show

1. Go to **Admin** → **Shows**
2. Click **Create Show**
3. Fill in show details:
   - Name, description
   - Select AI host
   - Set start/end times
   - Select days of week
   - Set priority

### 6.4 Upload Some Tracks

1. Go to **Admin** → **Tracks**
2. Click **Upload Track**
3. Upload audio files (MP3, WAV, etc.)
4. Fill in metadata (title, artist, genre, etc.)

## Step 7: Test Artist Flow

### 7.1 Register as Artist

1. Go to `http://localhost:3000/artist/register`
2. Create an artist account
3. You'll be redirected to the dashboard

### 7.2 Submit a Track

1. From artist dashboard, click **Submit New Track**
2. Fill in track information
3. Upload an audio file
4. Confirm ownership and permissions
5. Submit

### 7.3 Review Submission (as Admin)

1. Go to **Admin** → **Artist Submissions**
2. Review the submission
3. Approve, reject, or mark as under review
4. Add admin notes if needed

## Step 8: Set Up Icecast Streaming Server

See **[ICECAST_SETUP.md](./ICECAST_SETUP.md)** for complete Icecast setup instructions.

Quick setup:
1. Download and install Icecast from https://icecast.org/download/
2. Copy `icecast.xml.example` to your Icecast directory as `icecast.xml`
3. Update passwords and hostname in `icecast.xml`
4. Start Icecast server
5. Update `.env.local` with your stream URL:
   ```env
   NEXT_PUBLIC_ICECAST_STREAM_URL=http://localhost:8000/stream
   ```

**Note**: You'll need a source client (like BUTT or OBS) or build a radio orchestrator service to actually stream audio to Icecast.

## Step 9: Configure Email Notifications (Optional)

1. Sign up for an email service (Resend, SendGrid, etc.)
2. Get your API key
3. Add it to `.env.local`
4. Update `src/lib/email.ts` with your email service integration

Currently, `src/lib/email.ts` has placeholder code. You'll need to:
- Install your email service SDK
- Replace the placeholder `sendEmail` function with actual implementation

Example with Resend:
```bash
pnpm add resend
```

Then update `src/lib/email.ts`:
```typescript
import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
```

## Step 10: Production Deployment

### 9.1 Build for Production

```bash
pnpm build
```

### 9.2 Deploy

Deploy to Vercel, Netlify, or your preferred platform:

1. Push your code to GitHub
2. Connect your repository to your hosting platform
3. Add environment variables in the platform's dashboard
4. Deploy!

### 9.3 Update Environment Variables

Make sure to set:
- `NEXT_PUBLIC_SITE_URL` to your production URL
- All Supabase credentials
- Email service API key (if using)

## Troubleshooting

### Database Errors

- Make sure you ran `schema.sql` completely
- Check that all tables exist in Supabase Table Editor
- Verify RLS policies are enabled

### Storage Errors

- Verify all buckets are created
- Check bucket permissions (public vs private)
- Ensure file size limits are appropriate

### Authentication Errors

- Verify Supabase credentials in `.env.local`
- Check that admin user exists in Supabase Auth
- Make sure RLS policies allow the operations you need

### Email Notifications Not Working

- Check that email service API key is set
- Verify `src/lib/email.ts` is properly integrated
- Check server logs for email errors

## Next Steps

- Set up your Icecast streaming server
- Configure your radio orchestrator service
- Customize AI host personas
- Add more shows and content
- Integrate with music metadata APIs
- Set up analytics

## Support

For issues, check:
- Supabase documentation: https://supabase.com/docs
- Next.js documentation: https://nextjs.org/docs
- Project README.md

---

**You're all set!** 🎉 Start building your cosmic radio station!

