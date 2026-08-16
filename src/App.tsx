import { useState, useEffect, useRef } from 'react'
import bounceLogo from '@/imports/bounce-logo.jpeg'
import founders from '@/imports/grock-founders.png'
import upcomingEventPoster from '@/imports/posters/spinoff.png'

const events = [
  {
    date: 'FRI 14 FEB',
    name: 'VALENTINES BASH',
    venue: 'The Tunnel, Glasgow',
    desc: 'Love is in the air — bring a mate, make a memory, and donate to our chosen cause. Free entry with a tin of food.',
    tag: 'CHARITY + CLUB NIGHT',
    color: '#e8001a',
  },
  {
    date: 'SAT 8 MAR',
    name: 'ROCK FOR RUCKSACKS',
    venue: 'Stereo, Glasgow',
    desc: "Live bands, DJ sets, and a rucksack stuffing station. Help us pack 200 emergency kits for Glasgow's homeless shelters.",
    tag: 'LIVE MUSIC + GIVING',
    color: '#ffffff',
  },
  {
    date: 'FRI 25 APR',
    name: 'END OF YEAR BLOWOUT',
    venue: 'Sub Club, Glasgow',
    desc: 'The biggest night of the year. We close out the semester loud, proud, and generous. Proceeds fund next year\'s projects.',
    tag: 'FLAGSHIP EVENT',
    color: '#e8001a',
  },
  {
    date: 'TUE 13 MAY',
    name: 'ACOUSTIC FUNDRAISER',
    venue: 'Mono, Glasgow',
    desc: 'Stripped-back sets from student musicians, a bake sale, and a silent auction. Intimate, warm, and wildly good vibes.',
    tag: 'ACOUSTIC NIGHT',
    color: '#ffffff',
  },
]

const marqueeWords = ['GENEROCKSITY · GIVE LOUD · PARTY HARDER · MAKE CHANGE · GENEROCKSITY · GIVE LOUD · PARTY HARDER · MAKE CHANGE · ']

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [formState, setFormState] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const navLinks = [
    { label: 'Our Story', href: '#story' },
    { label: 'Events', href: '#events' },
    { label: 'Contact', href: '#contact' },
  ]

  // Upcoming / past split for events
  const upcomingEvent = events[0]
  const pastEvents = events.slice(1)

  // Stats data and count-up state
  const statsData = [
    { label: 'Raised', target: 24, prefix: '$', suffix: 'K' },
    { label: 'Events', target: 47 },
    { label: 'Charities', target: 12 },
  ]

  const [counts, setCounts] = useState<number[]>(statsData.map(() => 0))
  const statsRef = useRef<HTMLElement | null>(null)
  const statsAnimatedRef = useRef(false)

  // For constraining the upcoming poster height to the left details height
  const upcomingLeftRef = useRef<HTMLDivElement | null>(null)
  const [posterMaxHeight, setPosterMaxHeight] = useState<number | null>(null)
  const [isMd, setIsMd] = useState<boolean>(false)

  useEffect(() => {
    const el = statsRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !statsAnimatedRef.current) {
            statsAnimatedRef.current = true
            statsData.forEach((s, i) => {
              // slower duration and eased animation for a smoother, more prominent count-up
              const duration = 2400 + i * 800
              const start = 0
              const end = s.target
              const startTime = performance.now()
              function step(now: number) {
                const progress = Math.min((now - startTime) / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 3) // easeOutCubic
                const current = Math.round(eased * (end - start) + start)
                setCounts(prev => {
                  const copy = [...prev]
                  copy[i] = current
                  return copy
                })
                if (progress < 1) requestAnimationFrame(step)
              }
              requestAnimationFrame(step)
            })
          }
        })
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // track breakpoint so constraints are only applied on md+
  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(min-width: 768px)')
    const update = () => setIsMd(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    const leftEl = upcomingLeftRef.current
    if (!leftEl) {
      setPosterMaxHeight(null)
      return
    }
    if (!isMd) {
      // don't constrain on small screens
      setPosterMaxHeight(null)
      return
    }

    const update = () => {
      const h = Math.round(leftEl.getBoundingClientRect().height)
      setPosterMaxHeight(h)
    }
    const ro = new ResizeObserver(update)
    ro.observe(leftEl)
    update()
    window.addEventListener('resize', update)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [isMd])

  return (
    <div className="min-h-screen bg-[#080808] text-[#f5f5f5] overflow-x-hidden">

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-[#080808]/95 backdrop-blur-sm border-b border-[#e8001a]/30' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="font-display text-2xl tracking-wider text-white hover:text-[#e8001a] transition-colors">
            GENE<span className="text-primary">ROCK</span>SITY
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="font-condensed font-700 text-sm tracking-widest uppercase text-[#f5f5f5]/70 hover:text-[#e8001a] transition-colors"
              >
                {link.label}
              </a>
            ))}

            {/* Social / platform icons */}
            <div className="flex items-center gap-4 border-l border-[#2a2a2a] pl-6">
              {/* Instagram */}
              <a href="https://instagram.com/generocksity/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#f5f5f5]/50 hover:text-[#e8001a] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/company/generocksity/home/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#f5f5f5]/50 hover:text-[#e8001a] transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              {/* Bounce */}
              <a href="https://www.bouncelife.com/organizations/64e926b5f868aaceeeae1030" target="_blank" rel="noopener noreferrer" aria-label="Bounce" className="flex items-center gap-1.5 text-[#f5f5f5]/50 hover:text-[#e8001a] transition-colors">
                <img src={bounceLogo} alt="Bounce" className="w-5 h-5 rounded-full object-cover" />
                <span className="font-condensed font-700 text-xs tracking-widest uppercase">BOUNCE</span>
              </a>
            </div>

            <a
              href="#contact"
              className="font-condensed font-700 text-sm tracking-widest uppercase bg-[#e8001a] text-white px-5 py-2 hover:bg-white hover:text-[#e8001a] transition-colors"
            >
              JOIN US
            </a>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 bg-[#e8001a] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#e8001a] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-6 h-0.5 bg-[#e8001a] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#080808] border-t border-[#2a2a2a] px-6 py-6 flex flex-col gap-4">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-condensed font-700 text-xl tracking-widest uppercase text-[#f5f5f5]/70 hover:text-[#e8001a] transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMenuOpen(false)}
              className="font-condensed font-700 text-xl tracking-widest uppercase bg-[#e8001a] text-white px-5 py-3 text-center hover:bg-white hover:text-[#e8001a] transition-colors"
            >
              JOIN US
            </a>
            <div className="flex items-center gap-6 pt-2 border-t border-[#2a2a2a]">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-[#f5f5f5]/50 hover:text-[#e8001a] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-[#f5f5f5]/50 hover:text-[#e8001a] transition-colors">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
              <a href="https://www.bouncelife.com/organizations/64e926b5f868aaceeeae1030" target="_blank" rel="noopener noreferrer" aria-label="Bounce" className="flex items-center gap-1.5 text-[#f5f5f5]/50 hover:text-[#e8001a] transition-colors">
                <img src={bounceLogo} alt="Bounce" className="w-5 h-5 rounded-full object-cover" />
                <span className="font-condensed font-700 text-xs tracking-widest uppercase">BOUNCE</span>
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-end noise overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 60% 40%, #1a0004 0%, #080808 70%)',
        }}
      >
        {/* Big background text */}
        <div
          className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
          style={{ opacity: 0.04 }}
        >
          <span
            className="font-display text-[clamp(120px,22vw,320px)] text-white leading-none tracking-wider"
          >
            GENEROCKSITY
          </span>
        </div>

        {/* Red diagonal stripe */}
        <div
          className="absolute top-0 right-0 w-1/3 h-full opacity-10"
          style={{
            background: 'linear-gradient(135deg, transparent 40%, #e8001a 40%)',
          }}
        />

        {/* Decorative lines */}
        <div className="absolute left-8 top-1/4 w-px h-40 bg-[#e8001a]/40" />
        <div className="absolute left-12 top-1/3 w-px h-24 bg-[#e8001a]/20" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-24 pt-40">
          <div className="flex flex-col gap-6">
            {/* Tag */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-px bg-[#e8001a]" />
              <span className="font-condensed font-700 text-sm tracking-[0.3em] text-[#e8001a] uppercase">
                University of British Columbia · Est. 2013
              </span>
            </div>

            {/* Main headline */}
            <h1 className="font-display leading-none text-[clamp(56px,10vw,140px)] tracking-wide">
              <span className="block text-white">CHANGE THE</span>
              <span className="block text-white">WAY WE</span>
              <span className="block text-[#e8001a]">GIVE.</span>
            </h1>

            <div className="flex flex-col md:flex-row md:items-end gap-8 mt-4">
              <p className="max-w-md text-[#f5f5f5]/70 text-lg leading-relaxed barlow">
                Generocksity is a student club that proves a night out can change lives.
                We throw the loudest parties — and every single one raises money for
                people who need it most.
              </p>
              <div className="flex gap-4 flex-shrink-0">
                <a
                  href="#story"
                  className="font-condensed font-700 tracking-widest uppercase text-sm bg-[#e8001a] text-white px-8 py-4 hover:bg-white hover:text-[#e8001a] transition-all duration-200"
                >
                  OUR STORY
                </a>
                <a
                  href="#events"
                  className="font-condensed font-700 tracking-widest uppercase text-sm border border-white/30 text-white px-8 py-4 hover:border-[#e8001a] hover:text-[#e8001a] transition-all duration-200"
                >
                  EVENTS
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-px h-4 bg-white animate-pulse" />
          <span className="font-condensed text-xs tracking-widest uppercase">Scroll</span>
        </div>
      </section>

      {/* MARQUEE BAND */}
      <div className="bg-[#e8001a] py-3 overflow-hidden">
        <div className="marquee-track inline-flex">
          <span className="font-display text-black text-sm tracking-widest mx-8">
            {marqueeWords[0].repeat(4)}
          </span>
        </div>
      </div>

      {/* OUR STORY */}
      <section id="story" className="relative py-32 overflow-hidden">
        {/* Background accent */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full opacity-5"
          style={{
            background: 'radial-gradient(ellipse at right center, #e8001a, transparent 70%)',
          }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-px bg-[#e8001a]" />
            <span className="font-condensed font-700 text-sm tracking-[0.3em] text-[#e8001a] uppercase">
              Our Story
            </span>
          </div>

          <div className="flex flex-col gap-12">
            {/* Text side */}
            <div className="flex flex-col gap-8">
              <h2 className="font-display text-[clamp(48px,6vw,88px)] leading-none tracking-wide text-white">
                BORN FROM A<br />
                <span className="text-[#e8001a]">FRIEND IN NEED.</span><br />
              </h2>
              <div className="flex flex-col gap-4 text-[#f5f5f5]/70 text-lg leading-relaxed">
                <p>
                  The framework for the organization began in 2013, when co-Founder Zeke Blumenkrans befriended a new patient at the Canuck
  Place Children’s Hospice named David, who was diagnosed with a life-threatening cancer. During a chat about their bucket lists,
  David mentioned how he wanted to organize a charity concert for the hospice. Moved by David’s desire to help others at a time
  of so much personal pain, Zeke decided to organize a team consisting of his classmates: Ori Nevares, Vivian Braithwaite, Rachel
  Warner and Bavenjit Kaur to make David's wishes a reality. 
                </p>
                <p>
                Unfortunately, as pieces for the event began to fall into place and the team almost ready propose the idea to David, tragedy hit.
David’s cancer had become increasingly aggressive and in the summer of 2013, he passed away. 
                </p>
                <p>
                After experiencing this profound grief, Zeke and the team transformed their pain into action, and on November 28, 2013, the
five friends hosted a concert at Vancouver Fan Club benefiting Canuck Place in honour of David.
                </p>
                <p>
                The fundraiser made waves- countless young adults expressed interest for what later became the pillar for Generocksity: <i>the
idea of raising funds for local charities while supporting local musicians in a party setting that is accessible to our busy schedules and thin
wallets.</i>
                </p>
                <p>
                After this feedback, Zeke was re-energized with a new vision but still with the same source of inspiration, reading up to recruit
the non-profit’s final co-founder, Maya Zwang, and formed what we now know as Generocksity.
                </p>
              </div>


              {/* Image side */}
            <div className="relative">
              <div className="relative overflow-hidden w-3/4 mx-auto bg-[#1a1a1a]">
                <img
                  src={founders}
                  alt="Generocksity founders"
                  className="w-full h-full object-cover object-center mx-auto opacity-80"
                />
                {/* Red overlay stripe */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1/3"
                  style={{
                    background: 'linear-gradient(to top, rgba(232,0,26,0.4), transparent)',
                  }}
                />
                {/* Corner badge */}
                <div className="absolute top-6 left-6 bg-[#e8001a] px-4 py-2">
                  <span className="font-display text-sm tracking-widest text-white">
                    EST. 2013
                  </span>
                </div>
              </div>
              {/* Decorative border offset */}
              <div className="absolute -bottom-4 -right-4 w-full h-full border border-[#e8001a]/30 -z-10" />
            </div>
            </div>

          
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="stats" ref={statsRef} className="py-12 bg-[#080808]">
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border border-[#0000]">
            {statsData.map((stat, i) => (
              <div key={stat.label} className={`flex flex-col items-center justify-center text-center gap-2 p-8 ${i < 2 ? 'border-r border-[#000]' : ''}`}>
                <span className="font-display leading-none text-[clamp(48px,10vw,160px)] text-[#e8001a]">
                  {stat.prefix ? stat.prefix : ''}{counts[i]}{stat.suffix ? stat.suffix : ''}
                </span>
                <span className="font-condensed font-700 text-xl tracking-widest uppercase text-[#f5f5f5]/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EVENTS */}
      <section id="events" className="py-32 bg-[#080808] relative overflow-hidden">
        <div
          className="absolute left-0 bottom-0 w-1/2 h-1/2 opacity-5"
          style={{ background: 'radial-gradient(ellipse at left bottom, #e8001a, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-[#e8001a]" />
            <span className="font-condensed font-700 text-sm tracking-[0.3em] text-[#e8001a] uppercase">
              What's On
            </span>
          </div>

          {/* Upcoming event subsection */}

          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-start gap-8 mb-12">
            {/* Header (mobile: top, desktop: left column header) */}
            <div className="md:col-start-1 md:col-end-2">
              <h2 className="font-display text-[clamp(40px,6vw,88px)] leading-none tracking-wide text-white">
                UPCOMING 
                <span className="text-[#e8001a]"> EVENTS.</span>
              </h2>
            </div>

            {/* Poster (mobile: second, desktop: right) */}
            <div className="order-2 md:order-last self-start flex-shrink-0 w-full md:w-auto md:col-start-2 md:col-end-3">
              <div className="bg-[#1a1a1a] overflow-hidden rounded-sm" style={isMd && posterMaxHeight ? { maxHeight: `${posterMaxHeight}px` } : undefined}>
                <img
                  src={upcomingEventPoster}
                  alt={upcomingEvent?.name || 'Upcoming event poster'}
                  style={isMd && posterMaxHeight ? { height: `${posterMaxHeight}px`, width: 'auto' } : { width: '100%', height: 'auto' }}
                  className="object-contain mx-auto block"
                />
              </div>
              {/* Mobile-only GET TICKETS button below poster */}
              <div className="mt-4 md:hidden text-center">
                <a href="#contact" className="inline-block font-condensed font-700 tracking-widest uppercase text-sm px-6 py-3 bg-[#e8001a] text-white hover:bg-white hover:text-[#e8001a] transition-colors">
                  GET TICKETS →
                </a>
              </div>
            </div>

            {/* Details (mobile: third, desktop: left column below header) */}
            <div className="md:col-start-1 md:col-end-2 w-full" ref={upcomingLeftRef}>
              <div className="mt-2">
                <div className="hidden md:flex items-center gap-4 mb-2">
                  <span className="font-display text-2xl text-white" style={{ color: upcomingEvent?.color }}>
                    {upcomingEvent ? upcomingEvent.date.split(' ')[0] : ''}
                  </span>
                  <span className="font-condensed font-700 text-lg text-white/80">
                    {upcomingEvent ? upcomingEvent.date.split(' ').slice(1).join(' ') : ''}
                  </span>
                </div>

                <h3 className="hidden md:block font-display text-3xl md:text-4xl text-white tracking-wide mb-2">
                  {upcomingEvent?.name}
                </h3>

                <span className="hidden md:inline-block font-condensed font-700 text-xs tracking-widest uppercase px-2 py-0.5 inline-block" style={{ borderColor: upcomingEvent?.color, color: upcomingEvent?.color }}>
                  {upcomingEvent?.tag}
                </span>

                <p className="hidden md:block text-[#f5f5f5]/60 text-base leading-relaxed mt-4">
                  {upcomingEvent?.desc}
                </p>

                <p className="hidden md:block text-[#f5f5f5]/50 text-sm leading-relaxed mt-2">{upcomingEvent?.venue}</p>

                <div className="mt-6 hidden md:block">
                  <a href="#contact" className="font-condensed font-700 tracking-widest uppercase text-sm px-6 py-4 bg-[#e8001a] text-white hover:bg-white hover:text-[#e8001a] transition-colors">
                    GET TICKETS →
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Past events subsection */}
          <div className="mt-8">
            <div className="flex items-center gap-3 mb-8">
              <h4 className="font-display text-3xl text-white">PAST EVENTS</h4>
            </div>

            <div className="flex flex-col gap-px bg-[#2a2a2a]">
              {pastEvents.map((event, i) => (
                <div
                  key={i}
                  className="group bg-[#080808] hover:bg-[#111111] transition-colors duration-200 grid grid-cols-1 md:grid-cols-[180px_1fr_auto] gap-0"
                >
                  {/* Date column */}
                  <div className="p-6 md:border-r border-[#2a2a2a] flex md:flex-col gap-3 md:gap-2 items-center md:items-start">
                    <span className="font-display text-2xl md:text-xl leading-none" style={{ color: event.color }}>
                      {event.date.split(' ')[0]}
                    </span>
                    <span className="font-condensed font-700 text-xl md:text-lg text-white/80">
                      {event.date.split(' ').slice(1).join(' ')}
                    </span>
                  </div>

                  {/* Info column */}
                  <div className="px-6 py-6 flex flex-col gap-3 border-t md:border-t-0 border-[#2a2a2a]">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-2xl md:text-3xl tracking-wide text-white">
                        {event.name}
                      </h3>
                      <span className="font-condensed font-700 text-xs tracking-widest uppercase px-2 py-0.5 border" style={{ borderColor: event.color, color: event.color }}>
                        {event.tag}
                      </span>
                    </div>
                    <p className="text-[#f5f5f5]/50 text-sm leading-relaxed">{event.venue}</p>
                    <p className="text-[#f5f5f5]/60 text-sm leading-relaxed max-w-xl hidden md:block">{event.desc}</p>
                  </div>

                  {/* CTA column - Pictures */}
                  <div className="px-6 py-6 flex items-center border-t md:border-t-0 border-[#2a2a2a]">
                    <a href="#" className="font-condensed font-700 tracking-widest uppercase text-xs px-5 py-3 border border-white/20 text-white/60 group-hover:border-[#e8001a] group-hover:text-[#e8001a] transition-all duration-200 whitespace-nowrap">
                      PICTURES
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DIVIDER BAND */}
      <div className="relative overflow-hidden py-20 noise" style={{ background: '#e8001a' }}>
        <div className="max-w-7xl mx-auto px-6">
          <p className="font-display text-[clamp(36px,5vw,72px)] leading-none text-black/90 tracking-wide">
            "THE NIGHT IS YOUNG AND THE CAUSE IS GOOD."
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="w-8 h-px bg-black/40" />
            <span className="font-condensed font-700 text-sm tracking-widest text-black/70 uppercase">
              Generocksity motto
            </span>
          </div>
        </div>
        {/* Decorative */}
        <div className="absolute right-12 top-1/2 -translate-y-1/2 font-display text-[180px] text-black/10 leading-none select-none pointer-events-none">
          ★
        </div>
      </div>

      {/* CONTACT */}
      <section id="contact" className="py-32 relative overflow-hidden">
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 opacity-5"
          style={{ background: 'radial-gradient(ellipse at right, #e8001a, transparent 70%)' }}
        />

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-8 h-px bg-[#e8001a]" />
            <span className="font-condensed font-700 text-sm tracking-[0.3em] text-[#e8001a] uppercase">
              Get Involved
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Left: text */}
            <div className="flex flex-col gap-8">
              <h2 className="font-display text-[clamp(48px,6vw,88px)] leading-none tracking-wide text-white">
                READY TO<br />
                <span className="text-[#e8001a]">ROCK</span><br />
                WITH US?
              </h2>
              <div className="flex flex-col gap-4 text-[#f5f5f5]/70 text-lg leading-relaxed">
                <p>
                  Whether you want to join the team, collaborate on an event, join us as a sponsor,
                  or give our events some feedback — drop us a message.
                </p>
                <p>
                  We're always looking for people who are loud, generous, and ready to have
                  the best night of their lives for a good cause.
                </p>
              </div>

              {/* Social / info links */}
              <div className="flex flex-col gap-4">
                {[
                  { label: 'Instagram', val: '@generocksity' },
                  { label: 'Email', val: 'generocksity@gmail.com' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4 border-b border-[#2a2a2a] pb-4">
                    <span className="font-condensed font-700 text-xs tracking-widest uppercase text-[#e8001a] w-24 pt-0.5 flex-shrink-0">
                      {item.label}
                    </span>
                    <span className="text-white/80 text-sm">{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: form */}
            <div className="flex flex-col">
              {submitted ? (
                <div className="flex flex-col items-center justify-center h-full gap-6 py-16 border border-[#e8001a]/30 px-8 text-center">
                  <div className="font-display text-[72px] text-[#e8001a] leading-none">★</div>
                  <h3 className="font-display text-3xl text-white tracking-wide">YOU'RE IN.</h3>
                  <p className="text-[#f5f5f5]/60 leading-relaxed">
                    We'll be in touch soon. Get ready — it's going to be a great night.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {[
                    { id: 'name', label: 'Name', type: 'text', placeholder: 'Your full name' },
                    { id: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com' },
                  ].map(field => (
                    <div key={field.id} className="flex flex-col gap-2">
                      <label
                        htmlFor={field.id}
                        className="font-condensed font-700 text-xs tracking-widest uppercase text-[#e8001a]"
                      >
                        {field.label}
                      </label>
                      <input
                        id={field.id}
                        type={field.type}
                        required
                        placeholder={field.placeholder}
                        value={formState[field.id as keyof typeof formState]}
                        onChange={e => setFormState(s => ({ ...s, [field.id]: e.target.value }))}
                        className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-white/20 px-5 py-4 text-sm focus:outline-none focus:border-[#e8001a] transition-colors"
                      />
                    </div>
                  ))}
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="message"
                      className="font-condensed font-700 text-xs tracking-widest uppercase text-[#e8001a]"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Tell us how you want to get involved..."
                      value={formState.message}
                      onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                      className="bg-[#111111] border border-[#2a2a2a] text-white placeholder-white/20 px-5 py-4 text-sm focus:outline-none focus:border-[#e8001a] transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="font-display text-xl tracking-widest bg-[#e8001a] text-white py-5 hover:bg-white hover:text-[#e8001a] transition-all duration-200 mt-2"
                  >
                    SEND IT →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#2a2a2a] py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-display text-xl tracking-wider text-WHITE">GENE<span className='text-primary'>ROCK</span>SITY</span>
          <p className="text-[#f5f5f5]/30 text-xs tracking-wider text-center">
            © 2026 Generocksity · University of British Columbia · Change the way we give.
          </p>
          <div className="flex gap-6">
            <a
              href="https://instagram.com/generocksity/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-condensed text-xs tracking-widest uppercase text-white/30 hover:text-[#e8001a] transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://www.linkedin.com/company/generocksity/home/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-condensed text-xs tracking-widest uppercase text-white/30 hover:text-[#e8001a] transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://www.bouncelife.com/organizations/64e926b5f868aaceeeae1030"
              target="_blank"
              rel="noopener noreferrer"
              className="font-condensed text-xs tracking-widest uppercase text-white/30 hover:text-[#e8001a] transition-colors flex items-center gap-2"
            >
              Bounce
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
