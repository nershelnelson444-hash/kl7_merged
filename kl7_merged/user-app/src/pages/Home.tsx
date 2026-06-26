import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeaturedInventory } from '../data/cms';
import CarsCard from '../components/CarsCard';
import TestimonialCard from '../components/TestimonialCard';
import CountUp from '../components/CountUp';
import TeamMemberCard from '../components/TeamMemberCard';
import FaqAccordion from '../components/FaqAccordion';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import { motion } from 'framer-motion';
import Button from '../components/Button';
import heroImage from '../assets/hero.png';
import findYourBikeImage from '../assets/findyourbike.jpg';

/* ── Mobile FAQ component (self-contained for cleanliness) ── */
function MobileFaq({ items }: { items: { question: string; answer: string }[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  return (
    <div className="mobile-faq-list mobile-only">
      {items.map((item, i) => (
        <div
          key={i}
          className={`mobile-faq-card${openIdx === i ? ' open' : ''}`}
          onClick={() => setOpenIdx(openIdx === i ? null : i)}
        >
          <div className="mobile-faq-header">
            <p className="mobile-faq-question">{item.question}</p>
            <div className="mobile-faq-chevron">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>
          <div className="mobile-faq-answer">
            <div className="mobile-faq-answer-inner">{item.answer}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

const faqItems = [
  { question: "Are all bikes inspected before sale?", answer: "Yes. Every motorcycle at KL7 Garage undergoes a detailed technical inspection to ensure quality, safety, and reliability before being listed for sale." },
  { question: "Are the bike documents verified?", answer: "Yes. We verify ownership history, RC, insurance, and other essential documents to ensure a transparent and secure buying experience." },
  { question: "Do you provide financing or EMI options?", answer: "Yes. We offer loan and financing assistance through trusted partners, subject to eligibility and approval." },
  { question: "Do you provide warranty?", answer: "Selected motorcycles come with warranty support for added peace of mind. Coverage may vary depending on the motorcycle." },
  { question: "Can I exchange or sell my current bike?", answer: "Yes. We accept bike exchange and also purchase well-maintained motorcycles after inspection and evaluation." },
];

export default function Home() {
  const featuredBikes = getFeaturedInventory().slice(0, 6);
  const navigate = useNavigate();
  const [heroSearch, setHeroSearch] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/inventory?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      navigate('/inventory');
    }
  };

  return (
    <div className="w-full flex flex-col bg-white">

      {/* ══════════════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════════════ */}

      {/* ── Desktop Hero ── */}
      <section className="desktop-only w-full h-screen bg-background-main overflow-hidden flex flex-col pt-[104px] px-2 pb-2">
        <div className="w-full h-full bg-black-main rounded-2xl relative overflow-hidden flex flex-col items-center justify-center p-8 lg:p-16">
          <div className="absolute inset-0 z-0">
            <img src={heroImage} alt="KL7 Garage Hero" className="w-full h-full object-cover" />
          </div>
          <div className="w-full h-full max-w-[1480px] z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="flex flex-col justify-between h-full max-w-3xl py-8 gap-8">
              <FadeIn direction="up" delay={0.2}>
                <h1 className="text-text-white font-bold text-[56px] leading-tight tracking-[-0.03em]">
                  Kochi's Premier Bike Showroom
                </h1>
              </FadeIn>
              <FadeIn direction="up" delay={0.4} className="mt-auto">
                <div className="flex flex-col gap-6">
                  <p className="text-text-white font-medium text-base max-w-[480px]">
                    Curated pre-owned motorcycles from the world's most sought-after brands since 2016
                  </p>
                  <Button asLink to="/inventory" variant="inverse">Browse Bikes</Button>
                </div>
              </FadeIn>
            </div>
            <div className="flex flex-col justify-between items-end h-full py-8">
              <FadeIn direction="left" delay={0.4}>
                <form onSubmit={handleHeroSearch} className="hero-search-container bg-white/10 backdrop-blur-md px-4 py-2 border border-white/20 text-white w-[206px]">
                  <input
                    type="text"
                    placeholder="Search bikes..."
                    className="hero-search-bar bg-transparent outline-none text-white placeholder-white/70"
                    value={heroSearch}
                    onChange={(e) => setHeroSearch(e.target.value)}
                  />
                </form>
              </FadeIn>
              <StaggerContainer delayChildren={0.6} staggerChildren={0.2} className="flex flex-col gap-4 mt-auto items-end">
                <StaggerItem>
                  <div className="flex flex-col items-end">
                    <span className="text-text-white font-bold text-[48px] leading-none">500+</span>
                    <span className="text-text-white-muted uppercase text-sm tracking-wider">Bikes Sold</span>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="flex flex-col items-end">
                    <span className="text-text-white font-bold text-[48px] leading-none">RM 40M</span>
                    <span className="text-text-white-muted uppercase text-sm tracking-wider">Sales Value</span>
                  </div>
                </StaggerItem>
              </StaggerContainer>
            </div>
          </div>
        </div>
      </section>

      {/* ── Mobile Hero ── */}
      <section className="mobile-only w-full bg-background-main pt-[88px] pb-0 px-0">
        <motion.div
          className="mobile-hero"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="mobile-hero-bg">
            <img src={heroImage} alt="KL7 Garage" />
          </div>
          <div className="mobile-hero-overlay" />
          <div className="mobile-hero-content">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-hero-eyebrow">
                <span className="mobile-hero-dot" />
                <span>KL7 Garage · Est. 2016</span>
              </div>
            </motion.div>

            <motion.h1
              className="mobile-hero-title"
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.32, ease: [0.22, 1, 0.36, 1] }}
            >
              Kochi's Premier Bike Showroom
            </motion.h1>

            <motion.p
              className="mobile-hero-sub"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.44, ease: [0.22, 1, 0.36, 1] }}
            >
              Curated pre-owned motorcycles from the world's most sought-after brands.
            </motion.p>

            <motion.div
              className="mobile-hero-stats"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.54, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mobile-hero-stat">
                <span className="mobile-hero-stat-num">500+</span>
                <span className="mobile-hero-stat-label">Bikes Sold</span>
              </div>
              <div className="mobile-hero-stat">
                <span className="mobile-hero-stat-num">RM 40M</span>
                <span className="mobile-hero-stat-label">Sales Value</span>
              </div>
              <div className="mobile-hero-stat">
                <span className="mobile-hero-stat-num">4.8★</span>
                <span className="mobile-hero-stat-label">Google Rating</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.64, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link to="/inventory" className="mobile-hero-cta">
                Browse Bikes
                <span className="mobile-hero-cta-icon">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </span>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED BIKES
      ══════════════════════════════════════════════════ */}

      {/* ── Desktop ── */}
      <section className="desktop-only w-full bg-background-main py-20 flex flex-col items-center">
        <div className="max-w-[1480px] w-full px-8 flex flex-col gap-10">
          <FadeIn direction="up">
            <div className="flex flex-row justify-between items-end w-full">
              <div className="flex flex-col gap-4">
                <span className="text-sm font-bold uppercase tracking-wider text-text-extra-muted">Featured Bikes</span>
                <h2 className="text-[48px] font-bold leading-tight tracking-[-0.03em]">Performance Meets Prestige</h2>
              </div>
              <div className="flex flex-col items-end gap-6">
                <Button asLink to="/inventory" variant="primary">Browse Bikes</Button>
                <p className="text-text-black-muted max-w-[480px] text-right">
                  Handpicked from our collection. Each one represents the pinnacle of motorcycling excellence.
                </p>
              </div>
            </div>
          </FadeIn>
          <StaggerContainer delayChildren={0.2} staggerChildren={0.15} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
            {getFeaturedInventory().slice(0, 3).map((item) => (
              <StaggerItem key={item.id}><CarsCard item={item} /></StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Mobile Bike Carousel ── */}
      <section className="mobile-only mobile-section">
        <div className="mobile-section-inner">
          <div className="mobile-section-header">
            <span className="mobile-eyebrow">Featured Bikes</span>
            <h2 className="mobile-section-title">Performance Meets Prestige</h2>
            <p className="mobile-section-body">Handpicked from our collection. Each one the pinnacle of motorcycling excellence.</p>
          </div>
        </div>
        <div className="mobile-bike-carousel">
          {featuredBikes.map((item) => {
            const { slug, fieldData } = item;
            const {
              yhmUaSJgn: image, i251F_cLI: name, AsGqvZIRE: year,
              ieALPznS3: price, FixYCUMxe: mileage, XKcYqdDj3: fuel,
              DUdYPJIP0: transmission, oBzwmlvOK: badge
            } = fieldData;
            return (
              <Link key={item.id} to={`/inventory/${slug}`} className="mobile-bike-carousel-card">
                <div className="mobile-bike-card-img">
                  {image?.value
                    ? <img src={image.value} alt={name?.value} />
                    : <div style={{ color: '#aaa', fontSize: 12 }}>No image</div>
                  }
                  {badge?.value?.trim() && (
                    <span className="mobile-bike-card-badge">{badge.value}</span>
                  )}
                  {year?.value && (
                    <span className="mobile-bike-card-year">{year.value}</span>
                  )}
                </div>
                <div className="mobile-bike-card-body">
                  <p className="mobile-bike-card-name">{name?.value}</p>
                  <p className="mobile-bike-card-price">RM {price?.value?.toLocaleString?.() ?? price?.value}</p>
                  <div className="mobile-bike-card-specs">
                    <span className="mobile-bike-spec-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {mileage?.value?.toLocaleString?.() ?? 0} mi
                    </span>
                    <span className="mobile-bike-spec-pill">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5-5-5 5M12 4v12"/></svg>
                      {fuel?.value ?? 'Petrol'}
                    </span>
                    <span className="mobile-bike-spec-pill">⚙ {transmission?.value?.split('-')[0] ?? 'Auto'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <Link to="/inventory" className="mobile-view-all-link">
          View All Bikes
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </section>

      {/* ══════════════════════════════════════════════════
          SERVICES — Numbered List Layout
      ══════════════════════════════════════════════════ */}
      <section className="w-full bg-white py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1480px] mx-auto">

          {/* Top eyebrow */}
          <FadeIn direction="up">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/40 mb-10">— HOW WE SERVE YOU</p>
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* LEFT — sticky title */}
            <div className="lg:w-[38%] lg:sticky lg:top-28 lg:self-start">
              <FadeIn direction="up">
                <h2 className="text-[38px] md:text-[52px] font-black leading-[1.08] tracking-[-0.03em] text-black">
                  Everything your<br />ride <span className="italic font-black">deserves,</span><br />in one place.
                </h2>
                <p className="mt-6 text-black/50 text-base leading-relaxed max-w-[340px]">
                  From financing to after-sales, every service at KL7 Garage is built around making your ownership experience seamless.
                </p>
                <div className="mt-10">
                  <Button asLink to="/contact" variant="primary">Get in Touch</Button>
                </div>
              </FadeIn>
            </div>

            {/* RIGHT — numbered service rows */}
            <div className="lg:w-[62%] flex flex-col">
              {[
                {
                  num: '01',
                  title: 'Financing',
                  desc: 'Flexible loan and EMI options designed to fit your budget — whether you\'re buying your first superbike or upgrading to your dream machine.',
                  img: 'https://framerusercontent.com/images/DKYMPBTwzZsENhq8F0kqQLKshtw.jpg',
                },
                {
                  num: '02',
                  title: 'Warranty',
                  desc: 'Every bike we sell comes with reliable post-purchase coverage. Ride with confidence knowing you\'re protected well after the paperwork is signed.',
                  img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
                },
                {
                  num: '03',
                  title: 'Inspection',
                  desc: 'A thorough, transparent technical evaluation of every bike — engine, chassis, electrics, and beyond — so you know exactly what you\'re getting.',
                  img: 'https://images.unsplash.com/photo-1625047509248-ec889cbff17f?w=800&q=80',
                },
                {
                  num: '04',
                  title: 'Verified History',
                  desc: 'Full ownership trail, RC documents, insurance records, and service history — every bike comes with a clean, verified paper trail.',
                  img: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800&q=80',
                },
                {
                  num: '05',
                  title: 'After Sales Support',
                  desc: 'We don\'t disappear after delivery. Our team stays available for guidance, servicing referrals, and support long after you ride home.',
                  img: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
                },
              ].map((service, i) => (
                <motion.div
                  key={service.num}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="group"
                >
                  {/* Top divider */}
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    className="w-full h-px bg-black/10 origin-left"
                  />

                  <div className="flex flex-col sm:flex-row gap-6 py-8 cursor-pointer">
                    {/* Number */}
                    <span className="text-[13px] font-bold text-black/25 tracking-widest uppercase pt-1 w-10 flex-shrink-0">
                      {service.num}
                    </span>

                    {/* Text content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-[22px] md:text-[26px] font-black tracking-tight text-black group-hover:translate-x-1 transition-transform duration-300">
                          {service.title}
                        </h3>
                        {/* Arrow */}
                        <div className="flex-shrink-0 w-8 h-8 rounded-full border border-black/15 flex items-center justify-center mt-1 group-hover:bg-black group-hover:border-black transition-all duration-300">
                          <svg
                            width="13" height="13" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                            className="text-black/40 group-hover:text-white group-hover:rotate-45 transition-all duration-300"
                          >
                            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </div>
                      </div>

                      <p className="mt-3 text-black/50 text-[15px] leading-relaxed max-w-[480px]">
                        {service.desc}
                      </p>

                      {/* Image reveal on hover */}
                      <div className="overflow-hidden mt-5 rounded-2xl max-h-0 group-hover:max-h-[220px] transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                        <img
                          src={service.img}
                          alt={service.title}
                          className="w-full h-[220px] object-cover rounded-2xl scale-105 group-hover:scale-100 transition-transform duration-700"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Bottom divider */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-px bg-black/10 origin-left"
              />
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TESTIMONIALS / STATS
          Real KL7 Garage customer reviews (grammar-corrected)
      ══════════════════════════════════════════════════ */}

      {/* ── Desktop ── */}
      <section className="desktop-only w-full bg-background-main py-20 flex flex-col items-center">
        <div className="max-w-[1480px] w-full px-8 flex flex-col gap-20">
          <FadeIn direction="up">
            <div className="flex flex-row justify-between items-start w-full">
              <div className="flex flex-col gap-4 max-w-[550px]">
                <div className="bg-white border border-grey-main rounded-full px-4 py-2 w-fit">
                  <span className="text-base font-medium uppercase tracking-wider">CUSTOMER REVIEWS</span>
                </div>
                <h2 className="text-[48px] font-bold leading-tight tracking-[-0.03em] max-w-[480px]">What Our Riders Say.</h2>
              </div>
              <div className="flex flex-col gap-6 items-start self-end max-w-[480px]">
                <p className="text-text-black font-medium text-base">Real reviews from real customers who trusted KL7 Garage with their purchase.</p>
                <Button asLink to="/inventory" variant="primary">Browse Bikes</Button>
              </div>
            </div>
          </FadeIn>
          <StaggerContainer delayChildren={0.2} staggerChildren={0.1} className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-[65%] grid grid-cols-1 md:grid-cols-2 gap-6">
              <StaggerItem>
                <TestimonialCard
                  name="Arun Kumar"
                  quote="Very good service. Got my bike at a very reasonable price. The staff was helpful and the whole process was smooth and hassle-free. Highly recommended!"
                  vehicle="KL7 Garage Customer"
                />
              </StaggerItem>
              <StaggerItem>
                <TestimonialCard
                  name="Vishnu V"
                  quote="Excellent experience! The team is very friendly and transparent. No hidden charges — what they quoted is what I paid. The bike was in perfect condition as described."
                  vehicle="KL7 Garage Customer"
                />
              </StaggerItem>
              <StaggerItem>
                <TestimonialCard
                  name="Sreehari S"
                  quote="I bought my bike from KL7 Garage and I am very happy with the purchase. The staff explained everything clearly and helped me with the documentation as well. Great place!"
                  vehicle="KL7 Garage Customer"
                />
              </StaggerItem>
              <StaggerItem>
                <TestimonialCard
                  name="Midhun M"
                  quote="Best used bike showroom in Kochi. Very genuine dealers — they showed me multiple options within my budget without any pressure. Will definitely recommend to friends."
                  vehicle="KL7 Garage Customer"
                />
              </StaggerItem>
            </div>
            <div className="w-full lg:w-[35%] flex flex-col gap-6">
              <StaggerItem className="h-[180px]">
                <div className="bg-background-mid rounded-2xl p-6 flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CountUp targetNumber={10} duration={2} fontSize={58} lineHeight={58} color="#000000" fontWeight="500" />
                  <span className="text-text-black font-medium text-base">Years of Experience</span>
                </div>
              </StaggerItem>
              <StaggerItem className="h-[240px]">
                <div className="bg-background-mid rounded-2xl p-6 flex flex-col justify-between h-full hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <CountUp targetNumber={500} duration={2.5} fontSize={58} lineHeight={58} color="#000000" fontWeight="500" />
                  <span className="text-text-black font-medium text-base">Happy Riders</span>
                </div>
              </StaggerItem>
              <StaggerItem className="h-[120px]">
                <div className="bg-background-main rounded-none flex flex-col justify-end items-start h-full gap-2 pt-6">
                  <a
                    href="https://maps.app.goo.gl/bx1MVSCQcGQs73hn9"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 items-center bg-white border border-grey-main rounded-full px-4 py-2 hover:bg-background-mid cursor-pointer transition-colors"
                  >
                    <span className="font-bold text-black">Google Rating 4.8</span>
                    <span className="text-yellow-500">★★★★★</span>
                  </a>
                  <span className="text-sm font-medium text-text-black">Across both KL7 Garage locations</span>
                </div>
              </StaggerItem>
            </div>
          </StaggerContainer>
        </div>
      </section>

      {/* ── Mobile Stats + Reviews ── */}
      <section className="mobile-only mobile-section">
        <div className="mobile-section-inner">
          <div className="mobile-section-header">
            <span className="mobile-eyebrow">By the Numbers</span>
            <h2 className="mobile-section-title">What Our Riders Say.</h2>
          </div>
        </div>
        <div className="mobile-stats-scroll">
          <div className="mobile-stat-card">
            <span className="mobile-stat-card-num">10+</span>
            <span className="mobile-stat-card-label">Years in Business</span>
          </div>
          <div className="mobile-stat-card">
            <span className="mobile-stat-card-num">500+</span>
            <span className="mobile-stat-card-label">Happy Riders</span>
          </div>
          <div className="mobile-stat-card">
            <span className="mobile-stat-card-num">RM40M</span>
            <span className="mobile-stat-card-label">Sales Value</span>
          </div>
          <div className="mobile-stat-card-rating">
            <span className="stars">★★★★★</span>
            <span className="rating-score">4.8</span>
            <span className="rating-label">Google · Both Locations</span>
          </div>
        </div>

        {/* Testimonials Scroll */}
        <div style={{ marginTop: 28 }}>
          <div className="mobile-section-inner" style={{ marginBottom: 16 }}>
            <span className="mobile-eyebrow">Customer Reviews</span>
          </div>
          <div className="mobile-testimonial-scroll">
            {[
              { name: "Arun Kumar", quote: "Very good service. Got my bike at a very reasonable price. The staff was helpful and the whole process was smooth and hassle-free. Highly recommended!", vehicle: "KL7 Garage Customer" },
              { name: "Vishnu V", quote: "Excellent experience! The team is very friendly and transparent. No hidden charges — what they quoted is what I paid. The bike was in perfect condition as described.", vehicle: "KL7 Garage Customer" },
              { name: "Sreehari S", quote: "I bought my bike from KL7 Garage and I am very happy with the purchase. The staff explained everything clearly and helped me with the documentation as well.", vehicle: "KL7 Garage Customer" },
              { name: "Midhun M", quote: "Best used bike showroom in Kochi. Very genuine dealers — they showed me multiple options within my budget without any pressure. Will definitely recommend to friends.", vehicle: "KL7 Garage Customer" },
            ].map((t, i) => (
              <div key={i} className="mobile-testimonial-card">
                <p className="mobile-testimonial-quote">"{t.quote}"</p>
                <div className="mobile-testimonial-author">
                  <span className="mobile-testimonial-name">{t.name}</span>
                  <span className="mobile-testimonial-vehicle">{t.vehicle}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════════════ */}

      {/* ── Desktop ── */}
      <section className="desktop-only w-full bg-background-main py-20 flex flex-col items-center">
        <div className="max-w-[1480px] w-full px-8 flex flex-col gap-20">
          <FadeIn direction="up">
            <div className="flex flex-col-reverse lg:flex-row justify-between items-center w-full gap-20">
              <StaggerContainer delayChildren={0.2} staggerChildren={0.15} className="flex flex-col md:flex-row w-full lg:w-[60%] gap-6 items-center md:items-end">
                <StaggerItem className="w-full md:w-1/2">
                  <TeamMemberCard name="Farid Hasan" role="Sales Director" height="324px" image="https://framerusercontent.com/images/1yWlVlCg6wQ01Y2X6qA0K0xG0E.webp" />
                </StaggerItem>
                <StaggerItem className="w-full md:w-1/2">
                  <TeamMemberCard name="Nurul Ain" role="Founder & CEO" height="424px" image="https://framerusercontent.com/images/xH1B6Z4I9v3R8fK7M2W5B9T4.webp" />
                </StaggerItem>
              </StaggerContainer>
              <div className="flex flex-col gap-6 w-full lg:w-[40%] self-start">
                <div className="bg-white border border-grey-main rounded-full px-4 py-2 w-fit">
                  <span className="text-base font-medium uppercase tracking-wider">OUR TEAM</span>
                </div>
                <h2 className="text-[48px] font-bold leading-tight tracking-[-0.03em] max-w-[480px]">Meet The Experts.</h2>
                <p className="text-text-black font-medium text-base mt-2">Passionate about bikes, precision, and exceptional service. Meet the people who make it happen.</p>
                <Button asLink to="/about-us" variant="primary" className="mt-2">Learn More</Button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Mobile Team ── */}
      <section className="mobile-only mobile-section">
        <div className="mobile-section-inner">
          <div className="mobile-section-header">
            <span className="mobile-eyebrow">Our Team</span>
            <h2 className="mobile-section-title">Meet the Experts.</h2>
            <p className="mobile-section-body">Passionate about bikes, precision, and exceptional service.</p>
          </div>
        </div>
        <div className="mobile-team-scroll">
          {[
            { name: "Farid Hasan", role: "Sales Director", image: "https://framerusercontent.com/images/1yWlVlCg6wQ01Y2X6qA0K0xG0E.webp" },
            { name: "Nurul Ain", role: "Founder & CEO", image: "https://framerusercontent.com/images/xH1B6Z4I9v3R8fK7M2W5B9T4.webp" },
          ].map((m, i) => (
            <div key={i} className="mobile-team-card">
              <img src={m.image} alt={m.name} />
              <div className="mobile-team-gradient" />
              <div className="mobile-team-info">
                <p className="mobile-team-name">{m.name}</p>
                <p className="mobile-team-role">{m.role}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mobile-section-inner" style={{ marginTop: 20 }}>
          <Link to="/about-us" className="mobile-view-all-link" style={{ margin: 0 }}>
            Meet the Full Team
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════ */}

      {/* ── Desktop ── */}
      <section className="desktop-only w-full bg-background-main py-10 flex flex-col items-center">
        <div className="max-w-[1480px] w-full px-8 relative flex flex-col justify-center items-start min-h-[400px] rounded-[24px] overflow-hidden p-16">
          <div className="absolute inset-0 z-0">
            <img src={findYourBikeImage} alt="CTA Background" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          <FadeIn direction="up" fullWidth>
            <div className="relative z-10 flex flex-col gap-6 max-w-[50%]">
              <h2 className="text-[48px] font-bold leading-tight tracking-[-0.03em] text-white">Ready to Find Your Dream Bike?</h2>
              <p className="text-white/90 font-medium text-base">Visit our showroom and feel what true performance means. Every bike available for immediate viewing.</p>
              <Button asLink to="/contact" variant="inverse" className="mt-2">Visit Showroom</Button>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Mobile CTA ── */}
      <section className="mobile-only mobile-section">
        <div className="mobile-cta-banner">
          <img src={findYourBikeImage} alt="CTA" />
          <div className="mobile-cta-banner-overlay" />
          <div className="mobile-cta-content">
            <h2 className="mobile-cta-title">Ready to Find Your Dream Bike?</h2>
            <p className="mobile-cta-sub">Visit our showroom and feel what true performance means. Every bike available for immediate viewing.</p>
            <Link to="/contact" className="mobile-cta-btn">
              Visit Showroom
              <span className="mobile-hero-cta-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FAQ
      ══════════════════════════════════════════════════ */}

      {/* ── Desktop ── */}
      <section className="desktop-only w-full bg-background-main py-20 flex flex-col items-center">
        <div className="max-w-[1480px] w-full px-8 flex flex-col lg:flex-row gap-20">
          <FadeIn direction="up">
            <div className="flex flex-col gap-6 w-full lg:w-1/2">
              <div className="bg-white border border-grey-main rounded-full px-4 py-2 w-fit">
                <span className="text-base font-medium uppercase tracking-wider">FAQ</span>
              </div>
              <h2 className="text-[48px] font-bold leading-tight tracking-[-0.03em] max-w-[480px]">Everything You Need Here</h2>
              <p className="text-text-black font-medium text-base mt-2">Everything you need to know about financing, warranties, and buying a bike with confidence.</p>
            </div>
          </FadeIn>
          <FadeIn direction="up" delay={0.2} className="w-full lg:w-1/2">
            <FaqAccordion items={faqItems} />
          </FadeIn>
        </div>
      </section>

      {/* ── Mobile FAQ ── */}
      <section className="mobile-only mobile-section">
        <div className="mobile-section-inner">
          <div className="mobile-section-header">
            <span className="mobile-eyebrow">FAQ</span>
            <h2 className="mobile-section-title">Everything You Need Here</h2>
            <p className="mobile-section-body">Financing, warranties, and buying with full confidence.</p>
          </div>
        </div>
        <MobileFaq items={faqItems} />
        <div style={{ height: 40 }} />
      </section>

    </div>
  );
}