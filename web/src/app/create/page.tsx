import type { Metadata } from 'next'
import { CreatePollClient } from './CreatePollClient'

export const metadata: Metadata = {
  title: 'Create a Poll — PlanToMeet',
  description: 'Create a free scheduling poll and share it with your group. No sign-up required.',
}

export default function CreatePollPage() {
  return <CreatePollClient />
}
