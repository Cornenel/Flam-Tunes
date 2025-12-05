# Flam Tunes - AI-Driven Online Radio

A self-hosted AI-driven online radio web application built with Next.js, TypeScript, and Supabase.

## 🚀 Quick Start

**For detailed setup instructions, see [SETUP.md](./SETUP.md)**

Quick setup:
1. Install dependencies: `pnpm install`
2. Set up Supabase project and run `supabase/schema.sql`
3. Create storage buckets (see SETUP.md)
4. Configure `.env.local` with your Supabase credentials
5. Run `pnpm dev`

## Features

- 🎵 **Public Radio Player** - Live streaming with HTML5 audio player and cosmic design
- 📻 **Show Management** - Schedule and manage radio shows with AI hosts
- 🤖 **AI Hosts** - Configure AI personalities for automated hosting
- 🎶 **Track Management** - Upload, organize, search, and preview music tracks
- 💬 **Listener Requests** - Accept and manage song requests from listeners
- 🎤 **Artist Submissions** - Artists can register and submit tracks for review
- 📊 **Admin Dashboard** - Comprehensive management interface with search and filtering
- 🎙️ **Segments** - AI-generated talk segments, news, weather, and ads
- ✉️ **Email Notifications** - Automated emails for submission status updates
- 👤 **Artist Profiles** - Artists can manage their profiles and view submission history

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Package Manager**: pnpm

## Prerequisites

- Node.js 18+ and pnpm installed
- A Supabase project (free tier works)
- (Optional) Icecast server for streaming

## Setup Instructions

### 1. Clone and Install

```bash
# Install dependencies
pnpm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Icecast Stream URL (optional for now)
# Use NEXT_PUBLIC_ prefix if you want it accessible in the browser
NEXT_PUBLIC_ICECAST_STREAM_URL=https://your-icecast-server.com/stream
# Or use ICECAST_STREAM_URL for server-side only
ICECAST_STREAM_URL=https://your-icecast-server.com/stream

# Optional: OpenAI API Key (for future AI integration)
OPENAI_API_KEY=your_openai_api_key
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the SQL schema from `supabase/schema.sql`

This will create all necessary tables:
- `ai_hosts` - AI host configurations
- `shows` - Radio show schedules
- `tracks` - Music tracks and audio files
- `segments` - AI-generated segments
- `now_playing_history` - Playback history
- `requests` - Listener requests

### 4. Storage Buckets

In your Supabase dashboard, create the following storage buckets:

1. **radio-tracks** - Public bucket for music files
2. **radio-segments** - Public bucket for AI-generated segments
3. **radio-assets** - Public bucket for cover art, avatars, show images

Make sure to set appropriate policies for public read access on these buckets.

### 5. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Admin User

1. Go to your Supabase dashboard → Authentication
2. Create a new user with email/password
3. Use these credentials to log in at `/admin/login`

## Project Structure

```
flam-tunes/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/              # Admin dashboard pages
│   │   ├── api/                # API route handlers
│   │   ├── schedule/           # Public schedule page
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/             # React components
│   │   ├── admin/              # Admin-specific components
│   │   └── ...                 # Public components
│   ├── lib/                    # Utility libraries
│   │   ├── supabase/           # Supabase client helpers
│   │   └── storage.ts           # Storage utilities
│   └── types/                  # TypeScript types
│       └── db.ts               # Database types
├── supabase/
│   └── schema.sql              # Database schema
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## API Routes

### Public Routes

- `POST /api/requests` - Submit a listener request
- `GET /api/now-playing` - Get current playing track/segment
- `GET /api/history` - Get playback history

### Admin Routes (Requires Authentication)

- `POST /api/admin/shows` - Create a new show
- `PUT /api/admin/shows/[id]` - Update a show
- `POST /api/admin/ai-hosts` - Create an AI host
- `POST /api/admin/tracks/upload` - Upload a track
- `POST /api/admin/mark-request` - Update request status

### Internal Routes (For Orchestrator)

- `POST /api/internal/now-playing` - Update now playing status (called by orchestrator)

## Future Integration

This application is designed to work with:

1. **Radio Orchestrator Service** - A separate service that:
   - Manages playlists
   - Generates AI segments
   - Controls playback timing
   - Calls `/api/internal/now-playing` when tracks change

2. **Icecast Server** - For actual audio streaming:
   - Set `ICECAST_STREAM_URL` in environment variables
   - The public player will connect to this stream

## ✅ Completed Features

- ✅ Artist registration and authentication
- ✅ Track submission with ownership verification
- ✅ Admin review workflow
- ✅ Search and filtering in admin tables
- ✅ Track preview/playback
- ✅ Artist profile management
- ✅ Email notification structure
- ✅ Cosmic/psychedelic UI design

## 🚧 Future Enhancements

- [ ] AI segment generation integration
- [ ] Real-time updates using Supabase Realtime
- [ ] Advanced analytics dashboard
- [ ] Mobile app / PWA support
- [ ] Playlist management
- [ ] Automated show scheduling
- [ ] Listener chat integration
- [ ] Bulk actions in admin
- [ ] Advanced search with filters
- [ ] Music metadata API integration

## License

MIT

## Support

For issues and questions, please open an issue on the repository.

