import { Metadata } from 'next'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service - PlanToMeet',
  description: 'Terms of Service for PlanToMeet - Read our terms and conditions.',
}

export default function TermsOfService() {
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
        <h1 className="text-3xl font-bold text-white mb-8">Terms of Service</h1>

        <div className="prose prose-invert prose-zinc max-w-none">
          <p className="text-text-secondary text-lg mb-8">
            Last updated: February 6, 2026
          </p>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Agreement to Terms</h2>
            <p className="text-text-secondary mb-4">
              By accessing or using PlanToMeet ("the Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Description of Service</h2>
            <p className="text-text-secondary mb-4">
              PlanToMeet is a scheduling application that helps groups find common times to meet. The Service allows users to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li>Create scheduling polls with available time slots</li>
              <li>Share polls via iMessage or web links</li>
              <li>Vote on available times</li>
              <li>Finalize meeting times and add them to calendars</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">User Responsibilities</h2>
            <p className="text-text-secondary mb-4">
              When using our Service, you agree to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li>Provide accurate information when creating or responding to polls</li>
              <li>Use the Service only for lawful purposes</li>
              <li>Not attempt to disrupt or interfere with the Service</li>
              <li>Not use the Service to harass, spam, or harm others</li>
              <li>Not attempt to access data belonging to other users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Acceptable Use</h2>
            <p className="text-text-secondary mb-4">
              You may not use the Service to:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-2 mb-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Distribute malware or harmful code</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Collect user data without consent</li>
              <li>Create polls with offensive or inappropriate content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Intellectual Property</h2>
            <p className="text-text-secondary mb-4">
              The Service, including its original content, features, and functionality, is owned by PlanToMeet and is protected by international copyright, trademark, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">User Content</h2>
            <p className="text-text-secondary mb-4">
              You retain ownership of any content you create through the Service (poll titles, responses, etc.). By using the Service, you grant us a license to store and display this content to other poll participants.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Service Availability</h2>
            <p className="text-text-secondary mb-4">
              We strive to maintain high availability of the Service, but we do not guarantee uninterrupted access. The Service may be temporarily unavailable due to maintenance, updates, or factors beyond our control.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Disclaimer of Warranties</h2>
            <p className="text-text-secondary mb-4">
              The Service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be error-free, secure, or uninterrupted.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Limitation of Liability</h2>
            <p className="text-text-secondary mb-4">
              To the maximum extent permitted by law, PlanToMeet shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Termination</h2>
            <p className="text-text-secondary mb-4">
              We reserve the right to terminate or suspend access to the Service at any time, without notice, for conduct that we believe violates these Terms or is harmful to other users or the Service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Changes to Terms</h2>
            <p className="text-text-secondary mb-4">
              We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the modified Terms. We encourage you to review these Terms periodically.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Governing Law</h2>
            <p className="text-text-secondary mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-text-secondary mb-4">
              If you have any questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@plantomeet.app" className="text-accent-blue hover:underline">
                legal@plantomeet.app
              </a>
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
