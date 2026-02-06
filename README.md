# PlanToMeet

A mobile-first scheduling app that helps groups find a common time to meet. Create polls in iMessage, share with friends, and find the perfect time.

## Project Structure

```
TimeTogether/
├── ios/                    # Native iOS app (Swift/SwiftUI)
│   ├── PlanToMeet/        # Main iOS app
│   ├── PlanToMeetMessages/ # iMessage extension
│   └── Shared/            # Shared code between targets
├── web/                    # Next.js web app
│   ├── src/app/           # Pages and routes
│   ├── src/components/    # React components
│   └── src/lib/           # Utilities and API
└── supabase/              # Database schema
```

## Features

### Core Flow
1. **Create a Poll** - Set event title, duration, date range, and mark availability
2. **Share** - Send directly via iMessage or share link
3. **Respond** - Tap Yes/Maybe/No for each time slot
4. **Finalize** - Lock in the best time and add to calendar

### Key Features
- **Native iMessage Integration** - Create and share polls without leaving Messages
- **No accounts required** - Anyone can respond via shared link
- **Visual Grid Picker** - Tap cells on a calendar grid to mark availability
- **Calendar Integration** - See busy times while selecting availability
- **Real-time Updates** - See votes as they come in
- **One-tap finalize** - Creator locks in the best time
- **Add to Calendar** - Everyone can add the finalized event

## iOS App

### Requirements
- iOS 16.0+
- Xcode 15+

### Setup
1. Open `ios/PlanToMeet.xcodeproj` in Xcode
2. Copy `ios/Shared/Secrets.xcconfig.example` to `ios/Shared/Secrets.xcconfig`
3. Add your Supabase credentials to `Secrets.xcconfig`
4. Build and run

### Targets
- **PlanToMeet** - Main iOS app for viewing polls and settings
- **PlanToMeetMessages** - iMessage extension for creating/voting on polls

## Web App

### Requirements
- Node.js 18+

### Setup
```bash
cd web
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
npm run dev
```

### Features
- Server-side rendering for fast loads and OG tags
- PWA support - installable on mobile devices
- Real-time poll updates
- Calendar file download (.ics)

## Database (Supabase)

### Tables
- `polls` - Poll metadata (title, duration, status)
- `time_slots` - Available time options
- `responses` - User votes (yes/maybe/no)
- `participants` - Poll participants with display names
- `availability_blocks` - Creator's availability ranges

### Schema
See `supabase/` directory for migrations and schema.

## Universal Links

Polls are accessible at `https://plantomeet.app/poll/{pollId}`

- **iOS installed** → Opens native app
- **iOS not installed** → Opens web app
- **Other platforms** → Opens web app

### Apple App Site Association

Host at `https://plantomeet.app/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.aviraj.plantomeet",
        "paths": ["/poll/*"]
      }
    ]
  }
}
```

## Design System

- Dark theme with zinc color palette
- Blue primary accent (#3b82f6)
- Green for success/finalized states
- Orange for "maybe" responses
- Red for "no" responses

## Development

### iOS Development
```bash
cd ios
open PlanToMeet.xcodeproj
```

### Web Development
```bash
cd web
npm run dev
```

### Environment Variables

**iOS** (`ios/Shared/Secrets.xcconfig`):
```
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_ANON_KEY = your-anon-key
```

**Web** (`web/.env.local`):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## Deployment

### Web (Vercel)
1. Connect repo to Vercel
2. Set root directory to `web`
3. Add environment variables
4. Deploy

### iOS (App Store)
1. Archive in Xcode
2. Upload to App Store Connect
3. Submit for review

## License

MIT
