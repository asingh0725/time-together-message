# PlanToMeet Web

The web version of PlanToMeet - a scheduling poll application.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or bun

### Installation

```bash
cd web
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Build

```bash
npm run build
```

### Production

```bash
npm run start
```

## Project Structure

```
web/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── page.tsx        # Landing page
│   │   ├── poll/[id]/      # Poll detail page
│   │   └── layout.tsx      # Root layout
│   ├── components/          # React components
│   │   ├── TimeSlotCard.tsx
│   │   ├── NameInput.tsx
│   │   ├── AddToCalendar.tsx
│   │   └── Providers.tsx
│   └── lib/                 # Utilities and API
│       ├── api/            # Supabase API functions
│       ├── types.ts        # TypeScript types
│       ├── hooks.ts        # React Query hooks
│       ├── utils.ts        # Utility functions
│       └── supabase.ts     # Supabase client
├── public/                  # Static assets
│   ├── manifest.json       # PWA manifest
│   └── favicon.svg         # Favicon
└── package.json
```

## Features

- **Server-Side Rendering** - Fast initial load with OG tag support
- **Real-time Updates** - Poll data refreshes automatically
- **PWA Support** - Installable as a Progressive Web App
- **Responsive Design** - Works on all screen sizes
- **Calendar Integration** - Download .ics or add to Google Calendar

## Icon Generation

Generate PWA icons from the SVG favicon:

```bash
# Install sharp-cli globally
npm install -g sharp-cli

# Generate icons
sharp -i public/favicon.svg -o public/icon-192.png resize 192 192
sharp -i public/favicon.svg -o public/icon-512.png resize 512 512
sharp -i public/favicon.svg -o public/og-image.png resize 1200 630
```

Or use a service like [favicon.io](https://favicon.io) to generate all icon sizes.
