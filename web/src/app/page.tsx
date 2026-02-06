'use client'

import { motion } from 'framer-motion'
import {
  Calendar,
  Users,
  MessageCircle,
  Check,
  Sparkles,
  Clock,
  Share2,
  Bell,
  ChevronRight,
  Apple,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-white">PlanToMeet</span>
          </div>
          <a
            href="https://apps.apple.com/app/plantomeet"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-full font-medium text-sm hover:bg-gray-100 transition-colors"
          >
            <Apple className="w-4 h-4" />
            <span>Get the App</span>
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background gradient */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-accent-blue/20 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 left-1/3 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="text-center"
          >
            {/* Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-8"
            >
              <Sparkles className="w-4 h-4 text-accent-blue" />
              <span className="text-sm text-accent-blue font-medium">
                Built for iMessage
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="text-white">Find the </span>
              <span className="gradient-text">perfect time</span>
              <br />
              <span className="text-white">to meet</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-text-secondary max-w-2xl mx-auto mb-10"
            >
              Create scheduling polls right in iMessage. Share with friends,
              see everyone's availability, and pick the time that works for all.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <a
                href="https://apps.apple.com/app/plantomeet"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105 glow"
              >
                <Apple className="w-6 h-6" />
                <span>Download for iOS</span>
              </a>
              <Link
                href="#how-it-works"
                className="flex items-center gap-2 px-8 py-4 bg-card border border-border rounded-2xl font-semibold text-lg text-white hover:bg-card-hover transition-colors"
              >
                <span>See How It Works</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero Image / App Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative mx-auto max-w-4xl">
              {/* Mock iMessage conversation */}
              <div className="bg-card rounded-3xl border border-border p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-blue to-purple-600" />
                  <div>
                    <p className="font-semibold text-white">Team Chat</p>
                    <p className="text-sm text-text-tertiary">4 members</p>
                  </div>
                </div>

                {/* Poll Message Preview */}
                <div className="bg-gradient-to-br from-accent-blue to-blue-700 rounded-2xl p-5 max-w-sm ml-auto">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-white">Team Lunch</p>
                      <p className="text-sm text-white/70">Tap to vote</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/80">Feb 10-14</span>
                    <span className="text-white/80">3 responses</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Why PlanToMeet?
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Scheduling shouldn't be complicated. We made it as simple as sending a message.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: MessageCircle,
                title: 'Native iMessage Integration',
                description:
                  'Create and share polls without leaving your conversation. It feels like a natural part of messaging.',
                color: 'from-green-500 to-emerald-600',
              },
              {
                icon: Users,
                title: 'Real-time Responses',
                description:
                  'See votes as they come in. Everyone stays in sync without refreshing or checking back.',
                color: 'from-accent-blue to-blue-600',
              },
              {
                icon: Clock,
                title: 'Smart Time Slots',
                description:
                  'Set your availability once, and we generate time options that work with your schedule.',
                color: 'from-purple-500 to-violet-600',
              },
              {
                icon: Check,
                title: 'One-Tap Voting',
                description:
                  'Yes, Maybe, or No — vote on each time slot with a single tap. No accounts required.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: Bell,
                title: 'Instant Finalization',
                description:
                  'When you pick the winning time, everyone gets notified with an add-to-calendar option.',
                color: 'from-pink-500 to-rose-600',
              },
              {
                icon: Share2,
                title: 'Works Everywhere',
                description:
                  'Share poll links with anyone. They can vote from any device, even without the app.',
                color: 'from-cyan-500 to-teal-600',
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-card rounded-2xl border border-border p-6 hover:border-border-light transition-all hover:-translate-y-1"
              >
                <div
                  className={cn(
                    'w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-4',
                    feature.color
                  )}
                >
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-card/50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              From poll to plan in three easy steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create a Poll',
                description:
                  'Open PlanToMeet in any iMessage conversation. Set your event name, duration, and available dates.',
              },
              {
                step: '02',
                title: 'Collect Votes',
                description:
                  'Share with your group. Everyone votes on times that work for them — Yes, Maybe, or No.',
              },
              {
                step: '03',
                title: 'Pick & Notify',
                description:
                  "See the best option at a glance. Finalize the time and everyone can add it to their calendar.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                <div className="text-6xl font-bold text-accent-blue/20 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-text-secondary">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent-blue/20 via-purple-600/20 to-pink-600/20 rounded-3xl blur-xl" />
            <div className="relative bg-card border border-border rounded-3xl p-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to simplify scheduling?
              </h2>
              <p className="text-xl text-text-secondary mb-8">
                Download PlanToMeet and start finding times that work for everyone.
              </p>
              <a
                href="https://apps.apple.com/app/plantomeet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all hover:scale-105"
              >
                <Apple className="w-6 h-6" />
                <span>Download for Free</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-accent-blue to-purple-600 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium text-white">PlanToMeet</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-tertiary">
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="mailto:support@plantomeet.app" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
          <p className="text-sm text-text-tertiary">
            © {new Date().getFullYear()} PlanToMeet
          </p>
        </div>
      </footer>
    </div>
  )
}
