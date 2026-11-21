import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Tag, 
  MessageCircle, 
  ArrowUpRight, 
  Sparkles, 
  Home,
  CheckCircle2,
  Lock,
  Layers
} from 'lucide-react';
import { BRAND } from '../../constants/brand';

export default function PropertyCard({ property }) {
  if (!property) return null;

  const {
    id,
    referenceId,
    title,
    price,
    hidePrice,
    isNegotiable,
    category,
    district,
    city,
    bedrooms,
    bathrooms,
    landSize,
    houseSize,
    images = [],
    isFeatured,
    isSold
  } = property;

  const coverImage = images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  const isPriceHidden = Boolean(hidePrice);
  const displayPrice = BRAND.formatPrice(price, isNegotiable, isPriceHidden);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-card-luxury hover:shadow-card-luxury-hover transition-all duration-300 flex flex-col"
    >
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-navy-950">
        <img
          src={coverImage}
          alt={title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Gradient Overlay for Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-black/20" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
          <div className="flex flex-wrap items-center gap-1.5">
            {isFeatured && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-emerald-500 text-navy-950 shadow-md">
                <Sparkles className="w-3 h-3 fill-navy-950" />
                <span>Featured</span>
              </span>
            )}
            
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-navy-900/80 backdrop-blur-md text-white border border-white/20">
              {category || 'Property'}
            </span>
          </div>

          {referenceId && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-mono tracking-wider bg-navy-950/70 text-slate-300 backdrop-blur-sm border border-slate-700">
              #{referenceId}
            </span>
          )}
        </div>

        {/* Sold Overlay Banner */}
        {isSold && (
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center z-10">
            <span className="px-4 py-1.5 rounded-xl text-sm font-bold uppercase tracking-widest bg-red-600 text-white shadow-lg border border-red-400">
              Sold Out
            </span>
          </div>
        )}

        {/* Price / Price on Request Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between text-white pointer-events-none">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-semibold text-emerald-300 drop-shadow-sm">
              {isPriceHidden ? 'Pricing' : 'Selling Price'}
            </div>
            <div className={`font-serif font-bold text-white drop-shadow-md ${isPriceHidden ? 'text-base sm:text-lg text-emerald-300' : 'text-xl sm:text-2xl'}`}>
              {displayPrice}
            </div>
          </div>
          {!isPriceHidden && isNegotiable && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 backdrop-blur-sm">
              Negotiable
            </span>
          )}
          {isPriceHidden && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-navy-900/80 text-slate-200 border border-white/20 backdrop-blur-sm flex items-center space-x-1">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>Inquire</span>
            </span>
          )}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center space-x-1.5 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span className="font-medium truncate">
              {city ? `${city}, ` : ''}{district} District
            </span>
          </div>

          {/* Title */}
          <Link to={`/property/${id}`} className="block group-hover:text-emerald-700 transition-colors">
            <h3 className="font-serif text-lg font-bold text-navy-900 leading-snug line-clamp-2 mb-3">
              {title}
            </h3>
          </Link>

          {/* Key Specifications Badges */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-100 text-xs text-slate-600 mb-4">
            {bedrooms ? (
              <div className="flex items-center space-x-1.5 truncate">
                <Bed className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{bedrooms} Beds</span>
              </div>
            ) : null}

            {bathrooms ? (
              <div className="flex items-center space-x-1.5 truncate">
                <Bath className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{bathrooms} Baths</span>
              </div>
            ) : null}

            {landSize ? (
              <div className="flex items-center space-x-1.5 truncate">
                <Maximize2 className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{landSize}</span>
              </div>
            ) : houseSize ? (
              <div className="flex items-center space-x-1.5 truncate">
                <Home className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{houseSize}</span>
              </div>
            ) : (
              <div className="flex items-center space-x-1.5 truncate text-slate-500">
                <Layers className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verified</span>
              </div>
            )}
          </div>
        </div>

        {/* Card Actions */}
        <div className="pt-2 flex items-center justify-between gap-2.5">
          <Link
            to={`/property/${id}`}
            className="flex-1 inline-flex items-center justify-center space-x-1.5 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-semibold text-xs transition-colors"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <a
            href={BRAND.createPropertyInquiryLink(property)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center space-x-1.5 py-2.5 px-3.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 font-semibold text-xs transition-all duration-200"
            title="Inquire via WhatsApp"
          >
            <MessageCircle className="w-4 h-4 fill-emerald-600/20 text-emerald-600" />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
