import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy - PlanToMeet',
  description: 'Privacy Policy for PlanToMeet - Learn how we handle your data.',
}

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-white/5">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-text-secondary text-lg mb-8">
            Last updated: February 6, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Overview</h2>
            <p className="text-text-secondary mb-4">
              PlanToMeet ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you use our mobile application and website.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Information We Collect</h2>
            <p className="text-text-secondary mb-4">
              We collect minimal information necessary to provide our scheduling service:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li><strong className="text-white">Display Name:</strong> The name you choose to display when voting on polls. This is stored locally on your device and with your poll responses.</li>
              <li><strong className="text-white">Poll Data:</strong> Poll titles, time slots, and availability responses you create or participate in.</li>
              <li><strong className="text-white">Session Identifier:</strong> A randomly generated anonymous identifier stored on your device to track your responses across sessions.</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">What We Don't Collect</h2>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li>We do not require account registration or email addresses</li>
              <li>We do not collect your phone number or contacts</li>
              <li>We do not access your calendar data</li>
              <li>We do not track your location</li>
              <li>We do not use cookies for advertising or tracking</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">How We Use Your Information</h2>
            <p className="text-text-secondary mb-4">
              Your information is used solely to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li>Display your name and availability responses to other poll participants</li>
              <li>Calculate the best meeting times based on responses</li>
              <li>Generate calendar events when a time is finalized</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Data Storage</h2>
            <p className="text-text-secondary mb-4">
              Poll data is stored securely using Supabase, a cloud database service. Data is encrypted in transit and at rest. We retain poll data indefinitely unless you request deletion.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Data Sharing</h2>
            <p className="text-text-secondary mb-4">
              We do not sell, trade, or rent your personal information to third parties. Poll data is only visible to participants who have the poll link.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="text-text-secondary mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li>Access your poll data</li>
              <li>Request deletion of your data</li>
              <li>Change your display name at any time</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Children's Privacy</h2>
            <p className="text-text-secondary mb-4">
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Changes to This Policy</h2>
            <p className="text-text-secondary mb-4">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:privacy@plantomeet.app" className="text-accent-blue hover:underline">
                privacy@plantomeet.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
