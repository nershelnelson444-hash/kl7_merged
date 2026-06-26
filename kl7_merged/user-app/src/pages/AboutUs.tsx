import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import TeamMemberCard from '../components/TeamMemberCard';
import aboutHero from '../assets/aboutpage.png';
import FaqAccordion from '../components/FaqAccordion';
import CountUp from '../components/CountUp';
import ScrollReveal from '../components/ScrollReveal';
import { easings, springs } from '../utils/motionTokens';

/* ─── INLINE STYLED COMPONENTS ─────────────────────────────────────── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block text-[11px] font-bold uppercase tracking-[0.22em] text-[#808080] mb-4">
    {children}
  </span>
);

const Divider = () => (
  <div className="w-full h-px bg-[#E0E0E0] my-0" />
);

/* ─── VALUE CARD ────────────────────────────────────────────────────── */
interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function ValueCard({ icon, title, description, index }: ValueCardProps) {
  return (
    <ScrollReveal staggerIndex={index} offsetStart="start 90%" offsetEnd="start 55%">
      <motion.div
        className="group p-8 border border-[#E0E0E0] bg-white rounded-2xl flex flex-col gap-5 h-full"
        whileHover={{ y: -4, transition: springs.hover }}
      >
        <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-black text-white">
          {icon}
        </div>
        <div>
          <h3 className="text-[20px] font-bold text-black mb-2">{title}</h3>
          <p className="text-[#5A5A5A] text-[15px] leading-relaxed">{description}</p>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─── WHY CARD ──────────────────────────────────────────────────────── */
interface WhyCardProps {
  number: string;
  title: string;
  description: string;
  index: number;
}

function WhyCard({ number, title, description, index }: WhyCardProps) {
  return (
    <ScrollReveal staggerIndex={index} offsetStart="start 90%" offsetEnd="start 55%">
      <div className="py-8 border-b border-[#E0E0E0] flex flex-col sm:flex-row gap-6 group">
        <span className="text-[13px] font-bold text-[#B0B0B0] tabular-nums w-8 shrink-0 pt-1">{number}</span>
        <div>
          <h3 className="text-[18px] font-bold text-black mb-2 group-hover:underline underline-offset-4 transition-all duration-200">{title}</h3>
          <p className="text-[#5A5A5A] text-[15px] leading-relaxed">{description}</p>
        </div>
      </div>
    </ScrollReveal>
  );
}

/* ─── TESTIMONIAL ───────────────────────────────────────────────────── */
interface TestimonialProps {
  quote: string;
  name: string;
  bike: string;
  rating: number;
  index: number;
}

function Testimonial({ quote, name, bike, rating, index }: TestimonialProps) {
  return (
    <ScrollReveal staggerIndex={index} offsetStart="start 90%" offsetEnd="start 55%">
      <motion.div
        className="bg-white rounded-2xl p-8 border border-[#E8E8E8] flex flex-col gap-6 h-full"
        whileHover={{ y: -3, boxShadow: '0 8px 32px rgba(0,0,0,0.07)', transition: springs.hover }}
      >
        <div className="flex gap-1">
          {Array.from({ length: rating }).map((_, i) => (
            <svg key={i} width="14" height="14" viewBox="0 0 14 14" fill="black">
              <path d="M7 0l1.76 3.57L13 4.27l-3 2.92.71 4.12L7 9.27l-3.71 2.04.71-4.12L1 4.27l4.24-.7L7 0z" />
            </svg>
          ))}
        </div>
        <p className="text-[#1A1A1A] text-[16px] font-medium leading-relaxed flex-1">"{quote}"</p>
        <div>
          <p className="font-bold text-black text-[15px]">{name}</p>
          <p className="text-[#808080] text-[13px] mt-0.5">{bike}</p>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─── GALLERY ITEM ──────────────────────────────────────────────────── */
interface GalleryItemProps {
  src: string;
  label: string;
  tall?: boolean;
}

function GalleryItem({ src, label, tall = false }: GalleryItemProps) {
  return (
    <motion.div
      className={`relative overflow-hidden rounded-2xl cursor-pointer group ${tall ? 'row-span-2' : ''}`}
      whileHover="hover"
      initial="initial"
    >
      <motion.img
        src={src}
        alt={label}
        className="w-full h-full object-cover"
        style={{ minHeight: tall ? '420px' : '200px' }}
        variants={{
          initial: { scale: 1 },
          hover: { scale: 1.06 }
        }}
        transition={{ duration: 0.6, ease: easings.easeHoverMotion }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <motion.span
        className="absolute bottom-4 left-4 text-white text-sm font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      >
        {label}
      </motion.span>
    </motion.div>
  );
}

/* ─── STAT ITEM ─────────────────────────────────────────────────────── */
interface StatItemProps {
  number: number;
  suffix: string;
  label: string;
  sublabel?: string;
  index: number;
}

function StatItem({ number, suffix, label, sublabel, index }: StatItemProps) {
  return (
    <ScrollReveal staggerIndex={index} offsetStart="start 90%" offsetEnd="start 60%">
      <div className="flex flex-col gap-2 py-10 px-6 border-r border-[#2A2A2A] last:border-r-0">
        <CountUp targetNumber={number} fontSize={52} suffix={suffix} />
        <p className="text-[#BFBFBF] text-[13px] uppercase tracking-widest font-semibold mt-1">{label}</p>
        {sublabel && <p className="text-[#666] text-[12px]">{sublabel}</p>}
      </div>
    </ScrollReveal>
  );
}

/* ─── SHOWROOM LOCATION CARD ────────────────────────────────────────── */
interface ShowroomCardProps {
  name: string;
  address: string;
  mapsUrl: string;
  embedSrc: string;
  index: number;
}

function ShowroomCard({ name, address, mapsUrl, embedSrc, index }: ShowroomCardProps) {
  return (
    <ScrollReveal staggerIndex={index} offsetStart="start 90%" offsetEnd="start 55%">
      <motion.div
        className="rounded-2xl overflow-hidden border border-[#E0E0E0] bg-white flex flex-col"
        whileHover={{ y: -4, transition: springs.hover }}
      >
        <div className="w-full h-[260px] overflow-hidden">
          <iframe
            src={embedSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={name}
          />
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <h3 className="text-[18px] font-bold text-black mb-1">{name}</h3>
            <p className="text-[#5A5A5A] text-[14px] leading-relaxed">{address}</p>
          </div>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-black hover:text-[#555] transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            Get Directions
          </a>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

/* ─── MAIN COMPONENT ────────────────────────────────────────────────── */
export default function AboutUs() {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  });
  const heroImageY = useTransform(heroScroll, [0, 1], ['0%', '20%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <div className="flex flex-col font-sans overflow-x-hidden bg-[#F2F2F2]">

      {/* ─── 1. HERO ───────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative h-screen min-h-[700px] flex items-end overflow-hidden">
        <motion.div className="absolute inset-0 z-0" style={{ y: heroImageY }}>
          <img
            src={aboutHero}
            alt="KL7 Garage Showroom"
            className="w-full h-full object-cover scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/5" />
        </motion.div>

        <motion.div
          className="relative z-10 w-full max-w-[1480px] mx-auto px-8 pb-20"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: easings.easeOutMotion, delay: 0.2 }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/60 mb-6">
              Kochi, Kerala · Est. 2016
            </p>
            <h1 className="text-[clamp(40px,6vw,88px)] font-bold text-white leading-[0.95] tracking-tight mb-8 max-w-3xl">
              Born from a passion<br />for the machine.
            </h1>
            <p className="text-white/70 text-[18px] max-w-md leading-relaxed mb-10">
              Kerala's most trusted pre-owned motorcycle showroom. Built on honesty, driven by obsession.
            </p>
            <div className="flex flex-row gap-4 flex-wrap">
              <Button variant="inverse">Our Story</Button>
              <Link
                to="/inventory"
                className="inline-flex items-center gap-2 text-white/80 font-medium text-[14px] hover:text-white transition-colors pt-2"
              >
                Browse Inventory
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-8 z-10 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          <motion.div
            className="w-px h-12 bg-white/40"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: 'top' }}
          />
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest rotate-90 origin-center mt-2">Scroll</span>
        </motion.div>
      </section>

      {/* ─── 2. OUR STORY ──────────────────────────────────────────── */}
      <section className="py-[120px] px-8 max-w-[1480px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          <div>
            <ScrollReveal offsetStart="start 90%" offsetEnd="start 55%">
              <SectionLabel>Our Story</SectionLabel>
              <h2 className="text-[clamp(36px,4vw,56px)] font-bold text-black leading-[1.05] tracking-tight mb-8">
                A decade of doing things differently.
              </h2>
            </ScrollReveal>
          </div>

          <div className="flex flex-col gap-8">
            <ScrollReveal staggerIndex={1} offsetStart="start 90%" offsetEnd="start 55%">
              <p className="text-[#3A3A3A] text-[17px] leading-relaxed">
                For the past 10 years, KL7 Garage has been one of Kerala’s trusted destinations for premium pre-owned motorcycles. Built from a passion for riding and a commitment to quality, we have helped hundreds of riders buy and sell motorcycles with complete confidence, transparency, and peace of mind.
              </p>
            </ScrollReveal>
            <ScrollReveal staggerIndex={2} offsetStart="start 90%" offsetEnd="start 55%">
              <p className="text-[#3A3A3A] text-[17px] leading-relaxed">
                With 500+ happy customers and a strong reputation in Kochi, KL7 Garage continues to deliver carefully inspected motorcycles, fair pricing, and exceptional service. Every bike that leaves our showroom carries more than just value — it carries trust built over a decade.
              </p>
            </ScrollReveal>
            <ScrollReveal staggerIndex={3} offsetStart="start 90%" offsetEnd="start 55%">
              <blockquote className="border-l-2 border-black pl-6 text-[17px] font-medium text-black italic leading-relaxed">
                "The best showroom experience isn't about the bikes on the floor. It's about the trust you build before a single key is handed over."
                <footer className="mt-3 text-[13px] font-bold not-italic text-[#808080] uppercase tracking-widest">KL7 Garage · Founder</footer>
              </blockquote>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <Divider />

      {/* ─── 3. MISSION / CORE VALUES ─────────────────────────────── */}
      <section className="py-[120px] px-8 max-w-[1480px] mx-auto w-full">
        <ScrollReveal offsetStart="start 90%" offsetEnd="start 60%">
          <SectionLabel>What We Stand For</SectionLabel>
          <h2 className="text-[clamp(34px,4vw,52px)] font-bold text-black leading-[1.05] tracking-tight mb-16 max-w-xl">
            Three principles. No exceptions.
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ValueCard
            index={0}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
              </svg>
            }
            title="Radical Transparency"
            description="Every price is the real price. Every bike's history is disclosed upfront. You see exactly what we paid and exactly what we're asking. No games."
          />
          <ValueCard
            index={1}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            }
            title="Earned Trust"
            description="Trust isn't declared — it's built one honest interaction at a time. We've spent years proving that integrity is a better business model than pressure."
          />
          <ValueCard
            index={2}
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            }
            title="Pure Passion"
            description="We are riders. Our team rides the bikes we sell, reads the spec sheets for fun, and gets genuinely excited when the right bike finds its rider."
          />
        </div>
      </section>

      {/* ─── 4. SHOWROOM GALLERY ───────────────────────────────────── */}
      <section className="py-[80px] px-8 max-w-[1480px] mx-auto w-full">
        <ScrollReveal offsetStart="start 90%" offsetEnd="start 60%">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <SectionLabel>Gallery</SectionLabel>
              <h2 className="text-[clamp(30px,3.5vw,48px)] font-bold text-black leading-[1.1] tracking-tight">
                Inside KL7 Garage.
              </h2>
            </div>
            <a
              href="https://www.instagram.com/kl7garage"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[13px] font-bold uppercase tracking-widest text-[#808080] hover:text-black transition-colors"
            >
              Follow us on Instagram
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 12L12 2M12 2H5M12 2v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3" style={{ gridAutoRows: '200px' }}>
          <GalleryItem tall src="https://framerusercontent.com/images/WyhRtolqAtg9ZPTE92NjlKjv0.webp" label="Showroom" />
          <GalleryItem src="https://framerusercontent.com/images/ePT9kuMpmdFFmnCqOllNvONQys.webp" label="Deliveries" />
          <GalleryItem src="https://framerusercontent.com/images/TcgsebcRv5iSa7dvNbl6PMQECA.webp" label="Events" />
          <GalleryItem tall src="https://framerusercontent.com/images/DKYMPBTwzZsENhq8F0kqQLKshtw.jpg" label="Customers" />
          <GalleryItem src="https://framerusercontent.com/images/ePT9kuMpmdFFmnCqOllNvONQys.webp" label="Track Days" />
          <GalleryItem src="https://framerusercontent.com/images/WyhRtolqAtg9ZPTE92NjlKjv0.webp" label="Collection" />
        </div>
      </section>

      <Divider />

      {/* ─── 5. MEET THE TEAM ─────────────────────────────────────── */}
      <section className="py-[130px] px-8 max-w-[1480px] mx-auto w-full">
        <ScrollReveal offsetStart="start 90%" offsetEnd="start 60%">
          <SectionLabel>The People</SectionLabel>
          <h2 className="text-[clamp(34px,4vw,52px)] font-bold text-black leading-[1.05] tracking-tight mb-4 max-w-lg">
            Meet the team behind the machines.
          </h2>
          <p className="text-[#5A5A5A] text-[16px] max-w-lg mb-16 leading-relaxed">
            Every expert here is a rider first. They bring that same obsession to helping you find your perfect match.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal staggerIndex={0}>
            <TeamMemberCard
              name="Nurul Ain"
              role="Founder & CEO"
              height="460px"
              image="https://framerusercontent.com/images/1yWlVlCg6wQ01Y2X6qA0K0xG0E.webp"
            />
            <div className="mt-3 px-1">
              <p className="text-[12px] text-[#808080] uppercase tracking-widest font-bold">10+ Years Experience</p>
            </div>
          </ScrollReveal>

          <ScrollReveal staggerIndex={1}>
            <div className="mt-10">
              <TeamMemberCard
                name="Farid Hasan"
                role="Sales Director"
                height="460px"
                image="https://framerusercontent.com/images/xH1B6Z4I9v3R8fK7M2W5B9T4.webp"
              />
              <div className="mt-3 px-1">
                <p className="text-[12px] text-[#808080] uppercase tracking-widest font-bold">8 Years Experience</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal staggerIndex={2}>
            <TeamMemberCard
              name="Arif Zulkifli"
              role="Finance Manager"
              height="460px"
              image="https://framerusercontent.com/images/1yWlVlCg6wQ01Y2X6qA0K0xG0E.webp"
            />
            <div className="mt-3 px-1">
              <p className="text-[12px] text-[#808080] uppercase tracking-widest font-bold">6 Years Experience</p>
            </div>
          </ScrollReveal>

          <ScrollReveal staggerIndex={3}>
            <div className="mt-6">
              <TeamMemberCard
                name="Izzaty Rashid"
                role="Service Advisor"
                height="460px"
                image="https://framerusercontent.com/images/xH1B6Z4I9v3R8fK7M2W5B9T4.webp"
              />
              <div className="mt-3 px-1">
                <p className="text-[12px] text-[#808080] uppercase tracking-widest font-bold">5 Years Experience</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal staggerIndex={4} offsetStart="start 90%" offsetEnd="start 70%">
          <div className="mt-16 text-center">
            <Button asLink to="/contact" variant="primary">Get in Touch With Our Team</Button>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── 6. WHY CHOOSE KL7 ─────────────────────────────────────── */}
      <section className="py-[120px] px-8 bg-white">
        <div className="max-w-[1480px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div className="lg:sticky lg:top-32 self-start">
              <ScrollReveal offsetStart="start 90%" offsetEnd="start 55%">
                <SectionLabel>Why KL7</SectionLabel>
                <h2 className="text-[clamp(34px,4vw,52px)] font-bold text-black leading-[1.05] tracking-tight mb-6">
                  The standard others are chasing.
                </h2>
                <p className="text-[#5A5A5A] text-[16px] leading-relaxed mb-8 max-w-sm">
                  We've reimagined every step of the buying journey — from the first browse to the moment you ride away.
                </p>
                <Button asLink to="/inventory" variant="primary">See Our Inventory</Button>
              </ScrollReveal>
            </div>

            <div>
              <WhyCard
                number="01"
                title="Every Bike is Verified"
                description="Multi-point technical inspection on every motorcycle that enters our showroom. No cosmetic-only fixes — genuine mechanical integrity, documented."
                index={0}
              />
              <WhyCard
                number="02"
                title="Flexible Financing"
                description="In-house loan facilitation with partnerships across Kerala's leading banks. Competitive rates, fast approvals, honest terms."
                index={1}
              />
              <WhyCard
                number="03"
                title="Warranty & Peace of Mind"
                description="Every purchase comes backed by a KL7 Garage warranty. Ride away with confidence, not fingers crossed."
                index={2}
              />
              <WhyCard
                number="04"
                title="Clean Documentation"
                description="Full ownership history, RTO paperwork, and transfer assistance handled by our experienced team. Zero headaches."
                index={3}
              />
              <WhyCard
                number="05"
                title="Aftersales Support"
                description="Our relationship continues after you ride away. Technical guidance, service referrals, and genuine ongoing support."
                index={4}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ─── 7. STATS ──────────────────────────────────────────────── */}
      <section className="bg-black py-0">
        <div className="max-w-[1480px] mx-auto w-full">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[#2A2A2A]">
            <StatItem number={9} suffix="+" label="Years in Business" sublabel="Since 2016" index={0} />
            <StatItem number={500} suffix="+" label="Riders Served" sublabel="And growing" index={1} />
            <StatItem number={2} suffix="" label="Showroom Locations" sublabel="Across Kochi" index={2} />
            <StatItem number={98} suffix="%" label="Satisfaction Rate" sublabel="Verified reviews" index={3} />
          </div>
        </div>
      </section>

      {/* ─── 8. TESTIMONIALS ───────────────────────────────────────── */}
      <section className="py-[120px] px-8 max-w-[1480px] mx-auto w-full">
        <ScrollReveal offsetStart="start 90%" offsetEnd="start 60%">
          <SectionLabel>What Riders Say</SectionLabel>
          <h2 className="text-[clamp(34px,4vw,52px)] font-bold text-black leading-[1.05] tracking-tight mb-4">
            Don't take our word for it.
          </h2>
          <div className="flex items-center gap-3 mb-16">
            <div className="flex gap-1">
              {[1,2,3,4,5].map((i) => (
                <svg key={i} width="18" height="18" viewBox="0 0 14 14" fill={i <= 4 ? '#F59E0B' : 'none'} stroke="#F59E0B" strokeWidth="0.5">
                  <path d="M7 0l1.76 3.57L13 4.27l-3 2.92.71 4.12L7 9.27l-3.71 2.04.71-4.12L1 4.27l4.24-.7L7 0z" />
                </svg>
              ))}
            </div>
            <span className="text-[#1A1A1A] font-bold text-[18px]">4.8</span>
            <span className="text-[#808080] text-[14px]">on Google · Across both KL7 Garage locations</span>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Testimonial
            index={0}
            quote="Very good service. Got my bike at a very reasonable price. The staff was helpful and the whole process was smooth and hassle-free. Highly recommended!"
            name="Arun Kumar"
            bike="KL7 Garage Customer"
            rating={5}
          />
          <Testimonial
            index={1}
            quote="Excellent experience! The team is very friendly and transparent. No hidden charges — what they quoted is what I paid. The bike was in perfect condition as described."
            name="Vishnu V"
            bike="KL7 Garage Customer"
            rating={5}
          />
          <Testimonial
            index={2}
            quote="I bought my bike from KL7 Garage and I am very happy with the purchase. The staff explained everything clearly and helped me with the documentation as well. Great place!"
            name="Sreehari S"
            bike="KL7 Garage Customer"
            rating={5}
          />
          <Testimonial
            index={3}
            quote="Best used bike showroom in Kochi. Very genuine dealers — they showed me multiple options within my budget without any pressure. Will definitely recommend to friends."
            name="Midhun M"
            bike="KL7 Garage Customer"
            rating={5}
          />
          <Testimonial
            index={4}
            quote="The team was very patient and answered all my questions honestly. I never felt rushed or pressured. The bike condition matched exactly what they had described. Trustworthy place."
            name="Rahul Jose"
            bike="KL7 Garage Customer"
            rating={5}
          />
          <Testimonial
            index={5}
            quote="Quick process, fair pricing, and proper documentation handled without any issues. The staff was professional and kept me updated throughout. Really happy with my purchase."
            name="Akhil Rajan"
            bike="KL7 Garage Customer"
            rating={5}
          />
        </div>
      </section>

      <Divider />

      {/* ─── 9. OUR SHOWROOM LOCATIONS ─────────────────────────────── */}
      <section className="py-[120px] px-8 max-w-[1480px] mx-auto w-full">
        <ScrollReveal offsetStart="start 90%" offsetEnd="start 60%">
          <SectionLabel>Find Us</SectionLabel>
          <h2 className="text-[clamp(34px,4vw,52px)] font-bold text-black leading-[1.05] tracking-tight mb-4">
            Visit our showrooms.
          </h2>
          <p className="text-[#5A5A5A] text-[16px] mb-16 leading-relaxed max-w-lg">
            We have two convenient locations in Kochi. Walk in any day — no appointment needed.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ShowroomCard
            index={0}
            name="KL7 Garage — Thrikkakara"
            address="Thoppil, Pipeline Road, Thrikkakara, Ernakulam, Kerala — 682021"
            mapsUrl="https://maps.app.goo.gl/bx1MVSCQcGQs73hn9"
            embedSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.2!2d76.3175511!3d10.0274227!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d2687fd6dbf%3A0x6efc3c632fc2025a!2sKL7%20GARAGE!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
          />
          <ShowroomCard
            index={1}
            name="KL7 Garage — Edapally"
            address="Near City Tower, Edapally, Ernakulam, Kerala — 682024"
            mapsUrl="https://maps.app.goo.gl/7p2ArJj8suwLYfTu9"
            embedSrc="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3929.5!2d76.3077388!3d10.025506!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d5b883c8b51%3A0xff555b5c58cced89!2sKL7%20GARAGE!5e0!3m2!1sen!2sin!4v1700000000001!5m2!1sen!2sin"
          />
        </div>

        {/* Opening Hours note */}
        <ScrollReveal staggerIndex={2} offsetStart="start 90%" offsetEnd="start 70%">
          <div className="mt-10 p-6 rounded-2xl bg-white border border-[#E0E0E0] flex flex-col sm:flex-row gap-6 sm:items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-black flex items-center justify-center shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <p className="font-bold text-black text-[15px]">Open 7 Days a Week</p>
                <p className="text-[#5A5A5A] text-[14px]">10:00 AM – 7:00 PM · Both Locations</p>
              </div>
            </div>
            <Button asLink to="/contact" variant="primary">Contact Us</Button>
          </div>
        </ScrollReveal>
      </section>

      {/* ─── 10. FAQ ────────────────────────────────────────────────── */}
      <section className="py-[130px] px-8 max-w-[1480px] mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-20">
          <div className="lg:col-span-2 lg:sticky lg:top-32 self-start">
            <ScrollReveal>
              <SectionLabel>FAQ</SectionLabel>
              <h2 className="text-[clamp(30px,3.5vw,44px)] font-bold text-black leading-[1.1] tracking-tight">
                Questions we hear most often.
              </h2>
              <p className="text-[#5A5A5A] mt-4 text-[15px] leading-relaxed">
                Answered the same way we answer everything — honestly.
              </p>
            </ScrollReveal>
          </div>

          <div className="lg:col-span-3">
            <ScrollReveal staggerIndex={1} offsetStart="start 80%" offsetEnd="start 40%">
              <FaqAccordion
                items={[
                  {
                    question: "What makes KL7 different from other showrooms?",
                    answer: "We eliminated pressure tactics entirely. Fixed, transparent pricing. No negotiation theatre. No hidden fees. Our team is measured on customer satisfaction, not upselling. That changes everything about how the conversation feels."
                  },
                  {
                    question: "How do you verify the bikes you sell?",
                    answer: "Every motorcycle goes through a multi-point technical inspection conducted by our mechanics. We check the engine, transmission, brakes, tyres, electricals, frame integrity, and service history. Only bikes that meet our standard reach the showroom floor."
                  },
                  {
                    question: "Can I get financing through KL7?",
                    answer: "Yes. We work with Kerala's leading banks and financial institutions and can facilitate competitive loan packages in-house. Most approvals come back within 24–48 hours. Our finance team walks you through every option without pressure."
                  },
                  {
                    question: "What warranty comes with the bike?",
                    answer: "All bikes purchased from KL7 Garage come with a KL7 Warranty. Terms vary by bike age and condition and are disclosed before purchase. We also help connect you with extended coverage options if you want additional peace of mind."
                  },
                  {
                    question: "Do you buy or consign my current bike?",
                    answer: "Both. We offer outright purchases at fair market rates (no lowballing) and a consignment arrangement where we sell your bike for you. Either way, we handle all RTO documentation and transfer paperwork."
                  },
                  {
                    question: "What brands do you carry?",
                    answer: "We stock Royal Enfield, KTM, Bajaj, Honda, Yamaha, TVS, Suzuki, and more. Inventory rotates regularly — follow our Instagram or check the live inventory page for what's available now."
                  }
                ]}
              />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── 11. FINAL CTA ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black py-[140px] px-8">
        <div className="absolute inset-0 z-0">
          <img
            src="https://framerusercontent.com/images/DKYMPBTwzZsENhq8F0kqQLKshtw.jpg"
            alt="KL7 Showroom"
            className="w-full h-full object-cover opacity-20"
          />
        </div>

        <div className="relative z-10 max-w-[1480px] mx-auto">
          <ScrollReveal offsetStart="start 90%" offsetEnd="start 55%">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/50 mb-6">
              Ready?
            </p>
            <h2 className="text-[clamp(40px,6vw,80px)] font-bold text-white leading-[0.95] tracking-tight mb-6 max-w-2xl">
              Your next bike is waiting.
            </h2>
            <p className="text-white/60 text-[17px] max-w-md mb-12 leading-relaxed">
              Browse the showroom, book a visit, or just call us. No pressure. Ever.
            </p>
            <div className="flex flex-row gap-4 flex-wrap">
              <Button asLink to="/inventory" variant="inverse">Browse Inventory</Button>
              <Button asLink to="/contact" variant="inverse">Contact Us</Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

    </div>
  );
}