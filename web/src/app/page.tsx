'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  Apple,
  ArrowRight,
  CalendarCheck,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  Clock,
  MessageSquare,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const APP_STORE_URL = 'https://apps.apple.com/app/plantomeet'

// Logo cloud items - apps/companies that integrate with scheduling
const LOGO_CLOUD = [
  { name: 'iMessage', icon: MessageSquare },
  { name: 'Calendar', icon: CalendarDays },
  { name: 'App Clip', icon: Zap },
  { name: 'Groups', icon: Users },
  { name: 'Reminders', icon: Clock },
  { name: 'Events', icon: CalendarCheck },
]

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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-4"
    >
      <nav
        className={`mx-auto flex max-w-5xl items-center justify-between rounded-full px-4 py-2.5 transition-all duration-300 md:px-6 ${
          scrolled
            ? 'border border-white/10 bg-[#0a0f1f]/80 shadow-lg shadow-black/20 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/icon-192.png"
            alt="PlanToMeet"
            width={36}
            height={36}
            className="rounded-xl"
          />
          <span className="font-display text-lg font-semibold text-white">
            PlanToMeet
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a href="#how-it-works" className="text-sm text-white/70 transition hover:text-white">
            How it works
          </a>
          <a href="#features" className="text-sm text-white/70 transition hover:text-white">
            Features
          </a>
          <a href="#app-clip" className="text-sm text-white/70 transition hover:text-white">
            App Clip
          </a>
        </div>

        <a
          href={APP_STORE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-semibold text-[#0a0f1f] transition hover:bg-white/90"
        >
          <Apple className="h-4 w-4" />
          <span className="hidden sm:inline">Get the App</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </a>
      </nav>
    </motion.header>
  )
}

function HeroBadge() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 backdrop-blur-sm"
    >
      <Sparkles className="h-4 w-4 text-violet-400" />
      <p className="text-sm font-medium text-violet-200">
        Built natively for iMessage
      </p>
    </motion.div>
  )
}

function DeviceFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {/* Side buttons */}
      <div className="absolute -left-1 top-24 hidden h-12 w-1 rounded-full bg-[#1a1f35] md:block" />
      <div className="absolute -left-1 top-40 hidden h-8 w-1 rounded-full bg-[#1a1f35] md:block" />
      <div className="absolute -right-1 top-32 hidden h-16 w-1 rounded-full bg-[#1a1f35] md:block" />

      {/* Phone frame */}
      <div className="relative rounded-[48px] bg-gradient-to-b from-[#2a3050] via-[#1a1f35] to-[#0a0f1f] p-3 shadow-2xl shadow-black/50">
        <div className="absolute inset-0 rounded-[48px] border border-white/10" />
        <div className="relative rounded-[40px] border border-white/5 bg-black p-1.5">
          {/* Dynamic Island */}
          <div className="absolute inset-x-0 top-2.5 z-10 flex justify-center">
            <div className="h-6 w-28 rounded-full bg-black" />
          </div>
          {/* Screen */}
          <div className="relative overflow-hidden rounded-[34px] bg-black">
            {children}
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
    <div className="relative">
      {/* Step indicators */}
      <div className="mb-6 flex justify-center gap-2">
        {FLOW_CLIPS.map((clip, index) => (
          <button
            key={clip.id}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all ${
              index === activeIndex
                ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-500/50'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            <span className="hidden sm:inline">{clip.title}:</span>
            <span className={index === activeIndex ? 'text-white' : ''}>{clip.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Carousel */}
      <div className="flex justify-center">
        <DeviceFrame>
          <div className="relative aspect-[390/844] w-[280px] overflow-hidden sm:w-[320px]">
            {FLOW_CLIPS.map((clip, index) => (
              <motion.div
                key={clip.id}
                initial={false}
                animate={{
                  opacity: index === activeIndex ? 1 : 0,
                  scale: index === activeIndex ? 1 : 0.95,
                }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0"
              >
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el
                  }}
                  muted
                  playsInline
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
                  onEnded={advance}
                >
                  <source src={clip.video} type="video/mp4" />
                </video>
              </motion.div>
            ))}
          </div>
        </DeviceFrame>
      </div>
    </div>
  )
}

function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.8], [1, 0.97])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen overflow-hidden bg-[#040810] pt-32 md:pt-40"
    >
      {/* Animated gradient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Primary glow */}
        <div className="absolute -top-32 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
        {/* Secondary glow */}
        <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-blue-600/15 blur-[100px]" />
        <div className="absolute bottom-0 left-1/4 h-[300px] w-[300px] rounded-full bg-emerald-500/10 blur-[80px]" />
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <motion.div style={{ opacity, scale }} className="relative z-10 px-6">
        <div className="mx-auto max-w-5xl text-center">
          <HeroBadge />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mx-auto mt-8 max-w-4xl font-display text-[clamp(2.5rem,8vw,5.5rem)] font-bold leading-[0.95] tracking-tight"
          >
            <span className="text-white">Find the </span>
            <span className="font-serif italic text-violet-400">perfect time</span>
            <br />
            <span className="text-white">to meet</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60 md:text-xl"
          >
            Create polls in iMessage, let everyone vote in seconds, and lock the
            winning time. No more endless back-and-forth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-14 items-center gap-3 rounded-full bg-white px-8 text-base font-semibold text-[#0a0f1f] shadow-xl shadow-violet-500/20 transition hover:shadow-violet-500/30"
            >
              <Apple className="h-5 w-5" />
              Download for iOS
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#how-it-works"
              className="flex h-14 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 text-base font-medium text-white backdrop-blur-sm transition hover:bg-white/10"
            >
              <Sparkles className="h-4 w-4 text-violet-400" />
              See how it works
            </a>
          </motion.div>
        </div>

        {/* Product Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 md:mt-20"
        >
          <FlowCarousel />
        </motion.div>
      </motion.div>
    </section>
  )
}

function LogoCloud() {
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[#050910] py-12">
      <div className="mx-auto max-w-5xl px-6">
        <p className="mb-8 text-center text-sm font-medium uppercase tracking-widest text-white/40">
          Seamless integration with
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {LOGO_CLOUD.map((item) => (
            <div
              key={item.name}
              className="flex items-center gap-2 text-white/30 transition hover:text-white/60"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Features() {
  const features = [
    {
      icon: CalendarDays,
      title: 'Create polls in iMessage',
      description: 'Pick your date range, mark free slots, and share directly in your group chat.',
      color: 'from-violet-500 to-purple-600',
    },
    {
      icon: Users,
      title: 'Friends vote fast',
      description: 'Everyone can answer instantly. iOS users get native App Clip speed.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: CheckCheck,
      title: 'Lock the winner',
      description: 'See consensus at a glance and finalize the slot that works for everyone.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: CalendarCheck,
      title: 'Calendar ready',
      description: 'One tap to add the event. Done. No scheduling ping-pong.',
      color: 'from-amber-500 to-orange-500',
    },
  ]

  return (
    <section id="features" className="bg-[#040810] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-violet-400"
          >
            Product Features
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-white"
          >
            Built for the{' '}
            <span className="font-serif italic text-violet-400">speed</span>{' '}
            of group chat
          </motion.h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => (
            <motion.article
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.08] to-transparent p-8 transition hover:border-white/20"
            >
              {/* Gradient accent */}
              <div
                className={`absolute -right-20 -top-20 h-40 w-40 rounded-full bg-gradient-to-br ${feature.color} opacity-20 blur-3xl transition-opacity group-hover:opacity-30`}
              />

              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${feature.color}`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
              <p className="mt-3 leading-relaxed text-white/60">{feature.description}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorks() {
  const steps = [
    { step: '01', title: 'Open iMessage', description: 'Tap the PlanToMeet app in your iMessage drawer' },
    { step: '02', title: 'Set dates', description: 'Choose the date range and mark your availability' },
    { step: '03', title: 'Share poll', description: 'Send to your group chat with one tap' },
    { step: '04', title: 'Collect votes', description: 'Friends vote instantly via App Clip - no install needed' },
    { step: '05', title: 'Finalize', description: 'Lock the winning time and add to everyone\'s calendar' },
  ]

  return (
    <section id="how-it-works" className="bg-[#050910] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-widest text-violet-400"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-white"
          >
            From chaos to{' '}
            <span className="font-serif italic text-violet-400">confirmed</span>{' '}
            in 5 steps
          </motion.h2>
        </div>

        <div className="relative">
          {/* Connection line */}
          <div className="absolute left-6 top-0 hidden h-full w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent md:left-1/2 md:block" />

          <div className="space-y-8 md:space-y-12">
            {steps.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className={`relative flex items-center gap-6 md:gap-12 ${
                  index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                {/* Step number */}
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-violet-500/20 text-sm font-bold text-violet-400 ring-4 ring-[#050910] md:absolute md:left-1/2 md:-translate-x-1/2">
                  {item.step}
                </div>

                {/* Content */}
                <div
                  className={`flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:w-[calc(50%-3rem)] ${
                    index % 2 === 0 ? 'md:mr-auto md:pr-12' : 'md:ml-auto md:pl-12'
                  }`}
                >
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                  <p className="mt-2 text-white/60">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function AppClipSection() {
  return (
    <section id="app-clip" className="bg-[#040810] px-6 py-24 md:py-32">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-violet-900/30 via-[#0a0f20] to-[#040810]">
          <div className="grid items-center gap-8 p-8 md:grid-cols-2 md:gap-12 md:p-12">
            {/* Content */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
                <Zap className="h-4 w-4" />
                App Clip Technology
              </div>
              <h2 className="mt-6 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight tracking-tight text-white">
                Friends vote{' '}
                <span className="font-serif italic text-violet-400">instantly</span>
                <br />
                without installing
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-white/60">
                When someone taps a poll link, a lightweight App Clip opens immediately.
                No App Store, no signup, no friction.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  { color: 'bg-emerald-500', text: 'Zero friction for the group chat' },
                  { color: 'bg-blue-500', text: 'No downloads just to vote' },
                  { color: 'bg-amber-500', text: 'One tap to get the full app' },
                ].map((item) => (
                  <div key={item.text} className="flex items-center gap-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>

              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-2 text-violet-400 transition hover:text-violet-300"
              >
                Get the full app
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-violet-600/20 to-transparent blur-2xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black/50 p-3">
                <Image
                  src="/hero-media/posters/app-clip.png"
                  alt="PlanToMeet App Clip preview"
                  width={600}
                  height={1000}
                  className="rounded-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="bg-[#040810] px-6 py-24 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto max-w-4xl overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-violet-600 via-violet-700 to-indigo-800 p-10 text-center md:p-16"
      >
        {/* Decorative elements */}
        <div className="absolute -left-20 -top-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-60 w-60 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-200">
            Stop the scheduling chaos
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-[clamp(2rem,5vw,3.5rem)] font-bold leading-tight tracking-tight text-white">
            Run one poll, get one decision, keep the chat moving
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-violet-100/80">
            Start free on iPhone and send your first poll in under a minute.
          </p>

          <a
            href={APP_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 inline-flex h-14 items-center gap-3 rounded-full bg-white px-8 text-base font-semibold text-violet-700 shadow-xl transition hover:bg-violet-50"
          >
            <Apple className="h-5 w-5" />
            Download for iOS
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#040810] px-6 py-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 text-sm text-white/50 sm:flex-row">
        <div className="flex items-center gap-3">
          <Image
            src="/icon-192.png"
            alt="PlanToMeet"
            width={28}
            height={28}
            className="rounded-lg"
          />
          <span className="font-medium text-white/70">PlanToMeet</span>
        </div>
        <span>© {new Date().getFullYear()} PlanToMeet. All rights reserved.</span>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="transition hover:text-white">
            Privacy
          </Link>
          <Link href="/terms" className="transition hover:text-white">
            Terms
          </Link>
          <a href="mailto:support@plantomeet.app" className="transition hover:text-white">
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#040810] text-white">
      <Navigation />
      <Hero />
      <LogoCloud />
      <Features />
      <HowItWorks />
      <AppClipSection />
      <CTA />
      <Footer />
    </main>
  )
}
