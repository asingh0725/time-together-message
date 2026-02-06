import { Metadata } from 'next'
import { fetchPollBasic } from '@/lib/api/polls'
import { PollPageClient } from './PollPageClient'

interface PollPageProps {
  params: { id: string }
}

// Generate dynamic metadata for OG tags
export async function generateMetadata({ params }: PollPageProps): Promise<Metadata> {
  const poll = await fetchPollBasic(params.id)

  if (!poll) {
    return {
      title: 'Poll Not Found - PlanToMeet',
      description: 'This poll could not be found.',
    }
  }

  const title = poll.title || 'PlanToMeet Poll'
  const description = poll.status === 'finalized'
    ? `Time has been selected for "${title}". View details and add to calendar.`
    : `Vote on available times for "${title}". Help find the perfect time to meet!`

  return {
    title: `${title} - PlanToMeet`,
    description,
    openGraph: {
      title: `${title} - PlanToMeet`,
      description,
      type: 'website',
      siteName: 'PlanToMeet',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} - PlanToMeet`,
      description,
      images: ['/og-image.png'],
    },
  }
}

export default function PollPage({ params }: PollPageProps) {
  return <PollPageClient pollId={params.id} />
}
