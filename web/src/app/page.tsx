'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Apple,
  ArrowRight,
  CalendarDays,
  CheckCheck,
  MessageSquareText,
  Sparkles,
  TimerReset,
  Users,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const APP_STORE_URL = 'https://apps.apple.com/app/plantomeet'

type Clip = {
  id: string
  title: string
  subtitle: string
  video: string
  poster: string
}

const FLOW_CLIPS: Clip[] = [
  {
    id: 'tap',
    title: 'Step 1',
    subtitle: 'Tap PlanToMeet',
    video: '/hero-media/trimmed/01-tap-on-plantomeet.mp4',
    poster: '/hero-media/posters/01-tap-on-plantomeet.jpg',
  },
  {
    id: 'create',
    title: 'Step 2',
    subtitle: 'Create the poll',
    video: '/hero-media/trimmed/02-create-poll.mp4',
    poster: '/hero-media/posters/02-create-poll.jpg',
  },
  {
    id: 'respond',
    title: 'Step 3',
    subtitle: 'Respond in App Clip',
    video: '/hero-media/trimmed/04-respond-to-poll.mp4',
    poster: '/hero-media/posters/04-respond-to-poll.jpg',
  },
  {
    id: 'finalize',
    title: 'Step 4',
    subtitle: 'Finalize results',
    video: '/hero-media/trimmed/03-confirm-poll.mp4',
    poster: '/hero-media/posters/03-confirm-poll.jpg',
  },
  {
    id: 'calendar',
    title: 'Step 5',
    subtitle: 'Add to calendar',
    video: '/hero-media/trimmed/05-add-to-calendar.mp4',
    poster: '/hero-media/posters/05-add-to-calendar.jpg',
  },
]

function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto mt-4 flex w-[min(1100px,92vw)] items-center justify-between rounded-2xl border border-white/15 bg-[#091021]/70 px-4 py-3 backdrop-blur-xl md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/icon-192.png"
            alt="PlanToMeet icon"
            width={32}
            height={32}
            className="rounded-[10px]"
          />
          <span className="font-display text-base font-semibold tracking-tight text-white md:text-lg">
            PlanToMeet
          </span>
        </Link>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 text-sm font-semibold text-white transition hover:bg-white/20"
        >
          <Apple className="h-4 w-4" />
          <span className="hidden sm:inline">Download</span>
        </a>
      </div>
    </header>
  )
}

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute -left-1.5 top-24 hidden h-14 w-1.5 rounded-full bg-[#0b1022] shadow-[0_0_12px_rgba(0,0,0,0.6)] md:block" />
      <div className="absolute -left-1.5 top-44 hidden h-10 w-1.5 rounded-full bg-[#0b1022] shadow-[0_0_12px_rgba(0,0,0,0.6)] md:block" />
      <div className="absolute -right-1.5 top-36 hidden h-20 w-1.5 rounded-full bg-[#0b1022] shadow-[0_0_12px_rgba(0,0,0,0.6)] md:block" />
      <div className="relative rounded-[52px] bg-gradient-to-b from-[#2a3552] via-[#131a2f] to-[#090e1f] p-[12px] shadow-[0_45px_130px_-60px_rgba(6,10,24,1)]">
        <div className="absolute inset-0 rounded-[52px] border border-white/10" />
        <div className="relative rounded-[44px] border border-white/10 bg-black/90 p-[6px]">
          <div className="absolute inset-x-0 top-3 flex justify-center">
            <div className="h-[26px] w-[118px] rounded-full border border-white/10 bg-black/90" />
          </div>
          <div className="relative overflow-hidden rounded-[36px] bg-black">
            {children}
            <div className="pointer-events-none absolute inset-0 rounded-[36px] ring-[2px] ring-black" />
          </div>
        </div>
      </div>
    </div>
  )
}

function FlowCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const advanceLockRef = useRef(false)

  const advance = useCallback(() => {
    if (advanceLockRef.current) return
    advanceLockRef.current = true
    setActiveIndex((prev) => (prev + 1) % FLOW_CLIPS.length)
  }, [])

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return
      if (index === activeIndex) {
        advanceLockRef.current = false
        video.currentTime = 0
        const playPromise = video.play()
        if (playPromise) {
          playPromise.catch(() => undefined)
        }
      } else {
        video.pause()
      }
    })
  }, [activeIndex])

  return (
    <div className="mx-auto w-full max-w-[420px] rounded-[34px] border border-white/15 bg-white/[0.04] p-6 shadow-[0_30px_90px_-60px_rgba(6,10,24,1)] backdrop-blur-xl md:p-7">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#87a6e6]">Flow steps</p>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {FLOW_CLIPS.map((clip, index) => (
          <button
            key={clip.id}
            onClick={() => {
              setActiveIndex(index)
            }}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition ${
              index === activeIndex
                ? 'border-[#7dd3ff] bg-[#1a2b53] text-white'
                : 'border-white/10 text-[#a8b6d4] hover:border-white/20'
            }`}
          >
            {clip.title}
          </button>
        ))}
      </div>

      <div className="mt-6 overflow-hidden">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {FLOW_CLIPS.map((clip, index) => (
            <div key={clip.id} className="flex w-full shrink-0 justify-center px-1 md:px-2">
              <DeviceFrame>
                <div className="relative aspect-[748/1636]">
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el
                    }}
                    muted
                    playsInline
                    autoPlay
                    preload="metadata"
                    poster={clip.poster}
                    className="h-full w-full object-cover"
                    onTimeUpdate={(event) => {
                      if (index !== activeIndex || advanceLockRef.current) return
                      const video = event.currentTarget
                      if (!Number.isFinite(video.duration) || video.duration <= 0) return
                      if (video.currentTime >= video.duration - 0.05) {
                        advance()
                      }
                    }}
                    onEnded={() => {
                      advance()
                    }}
                  >
                    <source src={clip.video} type="video/mp4" />
                  </video>
                </div>
              </DeviceFrame>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-12 pt-36 md:pt-44">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-44 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-[#1a73ff]/20 blur-3xl" />
        <div className="absolute bottom-0 right-[-140px] h-[380px] w-[380px] rounded-full bg-[#12c2a8]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto w-[min(1100px,100%)]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#c6d6ff]">
            <Sparkles className="h-3.5 w-3.5" />
            Built for iMessage
          </div>

          <h1 className="font-display text-[clamp(2.7rem,7.6vw,6.6rem)] leading-[0.95] tracking-[-0.03em] text-white">
            Make plans
            <span className="block text-[#9ec5ff]">before the chat dies</span>
          </h1>

          <p className="mt-6 max-w-2xl text-[clamp(1rem,2vw,1.2rem)] leading-relaxed text-[#b8c2da]">
            Start a poll in iMessage, let everyone vote in seconds, then lock the winning time. The flow below
            plays the exact steps in order.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-[#0f172d] transition hover:bg-[#dbe7ff]"
            >
              <Apple className="h-5 w-5" />
              Download for iOS
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#flow"
              className="inline-flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white/90 transition hover:bg-white/10"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="mt-12">
          <FlowCarousel />
        </div>
      </div>
    </section>
  )
}

function AppClipSection() {
  return (
    <section className="px-6 py-16 md:py-20">
      <div className="mx-auto grid w-[min(1080px,100%)] gap-6 rounded-[36px] border border-white/15 bg-[linear-gradient(150deg,#101a33_0%,#0b1428_50%,#061126_100%)] p-6 md:grid-cols-[1.1fr_0.9fr] md:items-center md:p-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9ab4f0]">
            <Zap className="h-3.5 w-3.5" />
            App Clip
          </div>
          <h2 className="mt-4 font-display text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] tracking-[-0.02em] text-white">
            Friends can vote instantly without installing the app
          </h2>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-[#b6c1da]">
            Tap a shared poll to open a lightweight App Clip. It loads fast, lets everyone vote, and only
            prompts for the full app if they want it.
          </p>
          <div className="mt-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7fb2ff]">Why it works</div>
            <ul className="mt-4 space-y-3 text-sm text-[#c2cbe0]">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#68f0c3]" />
                Zero friction for the group chat
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#7dd3ff]" />
                No downloads just to vote
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#ffd37d]" />
                One tap to jump into the full app
              </li>
            </ul>
          </div>
        </div>
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-4">
          <div className="relative overflow-hidden rounded-[22px] border border-white/10 bg-black">
            <Image
              src="/hero-media/posters/app-clip.png"
              alt="PlanToMeet App Clip preview"
              width={900}
              height={1600}
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

function FlowSection() {
  const steps = [
    {
      icon: CalendarDays,
      title: 'Create poll in iMessage',
      body: 'Pick your date range, mark your free slots, and send the poll inside the same chat.',
    },
    {
      icon: Users,
      title: 'Friends vote fast',
      body: 'Anyone can answer quickly. iOS users get App Clip speed with no signup friction.',
    },
    {
      icon: CheckCheck,
      title: 'Lock the winner',
      body: 'See consensus instantly and finalize one slot that works for the group.',
    },
    {
      icon: TimerReset,
      title: 'Calendar ready',
      body: 'Share the final decision and move on. No scheduling ping-pong.',
    },
  ]

  return (
    <section id="flow" className="px-6 py-20 md:py-28">
      <div className="mx-auto w-[min(1080px,100%)]">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#85a1d8]">Product flow</p>
          <h2 className="mt-3 font-display text-[clamp(2rem,5vw,4rem)] leading-[1] tracking-[-0.025em] text-white">
            Built for the speed of group chat
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {steps.map((step, index) => (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group rounded-3xl border border-white/15 bg-white/[0.04] p-5 backdrop-blur-xl transition hover:border-[#78b6ff]/60 hover:bg-[#1a2b53]/35"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/25 bg-[#1d2f5a]">
                <step.icon className="h-5 w-5 text-[#93c0ff]" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#a8b6d4]">{step.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="px-6 pb-24 pt-12 md:pb-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-120px' }}
        transition={{ duration: 0.65 }}
        className="mx-auto w-[min(1000px,100%)] rounded-[40px] border border-white/20 bg-[linear-gradient(145deg,#ffffff_0%,#d6e6ff_45%,#b8ffd9_110%)] p-8 text-center text-[#0f1833] md:p-12"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#365a95]">PlanToMeet</p>
        <h2 className="mx-auto mt-3 max-w-3xl font-display text-[clamp(2rem,4.8vw,4.2rem)] leading-[0.98] tracking-[-0.03em]">
          Run one poll, get one decision, keep the chat moving
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[#3e4f76]">
          Start free on iPhone and send your first poll in under a minute.
        </p>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-[#0d1633] px-6 text-sm font-semibold text-white transition hover:bg-[#162554]"
        >
          <Apple className="h-5 w-5" />
          Download for iOS
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 px-6 py-8">
      <div className="mx-auto flex w-[min(1100px,100%)] flex-col items-center justify-between gap-4 text-sm text-[#8f9dbd] sm:flex-row">
        <span>© {new Date().getFullYear()} PlanToMeet</span>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="transition hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition hover:text-white">Terms</Link>
          <a href="mailto:support@plantomeet.app" className="transition hover:text-white">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#040815] text-white">
      <Navigation />
      <Hero />
      <AppClipSection />
      <FlowSection />
      <CTA />
      <Footer />
    </main>
  )
}
