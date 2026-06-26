import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { CMSInventoryItem } from '../data/cms';

interface CarsCardProps {
  item: CMSInventoryItem;
}

const MotionLink = motion.create(Link);

export default function CarsCard({ item }: CarsCardProps) {
  const { slug, fieldData } = item;
  const { 
    yhmUaSJgn: image,
    i251F_cLI: name,
    AsGqvZIRE: year,
    ieALPznS3: price,
    FixYCUMxe: mileage,
    XKcYqdDj3: fuel,
    DUdYPJIP0: transmission,
    oBzwmlvOK: badge
  } = fieldData;

  return (
    <MotionLink 
      to={`/inventory/${slug}`} 
      className="group flex flex-col w-full bg-white border border-grey-main rounded-[16px] md:rounded-[20px] overflow-hidden relative block h-full"
      whileHover="hover"
      initial="initial"
      variants={{
        initial: { y: 0, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0)" },
        hover: { y: -8, boxShadow: "0px 16px 40px rgba(0, 0, 0, 0.08)" }
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Image Container */}
      <div className="w-full aspect-[4/3] bg-[#F5F5F5] relative overflow-hidden flex items-center justify-center p-2 md:p-4">
        {image?.value ? (
          <motion.img 
            src={image.value} 
            alt={name.value} 
            className="w-full h-full object-contain"
            style={{ mixBlendMode: 'multiply' }}
            variants={{
              initial: { scale: 1 },
              hover: { scale: 1.06 }
            }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-extra-muted">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        
        {/* Badge */}
        {badge?.value && badge.value.trim() !== "" && (
          <div className="absolute top-2 left-2 md:top-4 md:left-4 bg-white/90 backdrop-blur-sm px-2 py-1 md:px-3 md:py-1.5 rounded-full z-10">
            <span className="text-[10px] md:text-[12px] font-bold uppercase tracking-wider text-black">{badge.value}</span>
          </div>
        )}
        
        {/* Year Label */}
        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 bg-black-50 backdrop-blur-md px-2 py-1 md:px-3 md:py-1.5 rounded-full z-10 text-white font-medium text-[11px] md:text-sm">
          {year?.value}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-3 md:p-6 gap-3 md:gap-6 flex-grow bg-white z-20">
        <div className="flex flex-col gap-0.5 md:gap-1">
          <h3 className="text-[14px] md:text-[24px] font-bold leading-tight tracking-[-0.02em] text-text-black transition-colors line-clamp-2">{name?.value}</h3>
          <p className="text-[13px] md:text-[20px] font-semibold text-black mt-0.5">{price?.value ? `RM ${Number(price.value).toLocaleString()}` : ''}</p>
        </div>

        {/* Specs */}
        <div className="flex flex-col gap-2 mt-auto pt-2 md:pt-4 border-t border-grey-main">
          <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between text-[11px] md:text-sm text-text-black-muted">
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              <span className="truncate">{mileage?.value?.toLocaleString() || "0"} km</span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M3 3v18h18"></path><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path></svg>
              <span className="truncate">{transmission?.value?.split('-')[0] || "Manual"}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5-5-5 5M12 4v12"></path></svg>
              <span className="truncate">{fuel?.value || "Petrol"}</span>
            </span>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}