import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  Home, 
  Check, 
  MessageCircle, 
  Phone, 
  Share2, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Building2, 
  Tag, 
  Clock, 
  Calendar, 
  Copy,
  ArrowLeft,
  X,
  ShieldCheck,
  Lock,
  ExternalLink,
  Navigation,
  FileCheck2,
  CalendarCheck,
  Eye,
  CheckCircle2,
  Compass,
  Layers,
  Ruler
} from 'lucide-react';
import { BRAND } from '../constants/brand';
import { useProperties } from '../context/PropertyContext';

export default function PropertyDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPropertyById } = useProperties();

  const property = getPropertyById(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
        <div className="max-w-xl mx-auto text-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-card-luxury">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-navy-950 mb-2">
            Property Not Found
          </h2>
          <p className="text-sm text-slate-500 mb-6">
            The property or item you are looking for may have been removed, sold, or the URL reference might be incorrect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/properties"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-950 text-white font-bold text-xs uppercase tracking-wider"
            >
              Browse All Properties
            </Link>
            <a
              href={BRAND.createWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold text-xs"
            >
              Contact on WhatsApp
            </a>
          </div>
        </div>
      </div>
    );
  }

  const images = Array.isArray(property.images) && property.images.length > 0 
    ? property.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'];

  const isPriceHidden = Boolean(property.hidePrice);

  // Category classification helpers
  const categoryLower = (property.category || '').toLowerCase();
  const isLand = categoryLower.includes('land');
  const isAntique = categoryLower.includes('antique');
  const isCommercial = categoryLower.includes('commercial') || categoryLower.includes('shop');
  const hasBedrooms = !isLand && !isAntique && Number(property.bedrooms) > 0;
  const hasBathrooms = !isLand && !isAntique && Number(property.bathrooms) > 0;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this listing on PROPERTY LK: ${property.title} (Ref: ${property.referenceId})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Google Maps Search Link
  const locationQuery = encodeURIComponent(`${property.city || ''} ${property.district} Sri Lanka`.trim());
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${locationQuery}`;

  // WhatsApp inspection booking link
  const createInspectionLink = () => {
    const text = `Hello PROPERTY LK,\n\nI would like to schedule an on-site viewing for this ${property.category || 'listing'}:\n- Title: ${property.title}\n- Ref: #${property.referenceId || property.id}\n- Location: ${property.city ? `${property.city}, ` : ''}${property.district}\n\nPlease let me know available dates and times.`;
    return BRAND.createWhatsAppLink(text);
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-20">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 hover:text-navy-950 transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-600" />
            <span>Back to Listings</span>
          </button>

          <div className="flex items-center space-x-2 self-end sm:self-auto">
            <button
              onClick={handleShare}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </>
              )}
            </button>

            <span className="px-3 py-1.5 rounded-xl bg-navy-950 text-slate-200 text-xs font-mono font-semibold tracking-wider">
              REF #{property.referenceId || property.id}
            </span>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Gallery + Information */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Animated Multi-Image Gallery */}
            <div className="bg-navy-950 rounded-3xl overflow-hidden border border-navy-800 shadow-glass-dark relative">
              
              {/* Main Feature Image Display */}
              <div className="relative aspect-[16/10] sm:aspect-[16/9] overflow-hidden bg-black flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={images[activeImageIndex]}
                    alt={`${property.title} - Image ${activeImageIndex + 1}`}
                    initial={{ opacity: 0, scale: 1.02 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setLightboxOpen(true)}
                    className="w-full h-full object-cover cursor-zoom-in"
                  />
                </AnimatePresence>

                {/* Badges on Top of Image */}
                <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
                  {property.isFeatured && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500 text-navy-950 shadow-md flex items-center space-x-1">
                      <Sparkles className="w-3 h-3 fill-navy-950" />
                      <span>Featured</span>
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-navy-900/80 backdrop-blur-md text-white border border-white/20">
                    {property.category}
                  </span>
                  {property.isSold && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-red-600 text-white shadow-md">
                      Sold Out
                    </span>
                  )}
                  {isPriceHidden && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-navy-950/80 text-emerald-300 border border-emerald-400/30 backdrop-blur-md flex items-center space-x-1">
                      <Lock className="w-3 h-3" />
                      <span>Price On Request</span>
                    </span>
                  )}
                </div>

                {/* Image Navigation Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/70 hover:bg-navy-950 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-navy-950/70 hover:bg-navy-950 text-white flex items-center justify-center backdrop-blur-md transition-all shadow-lg"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Counter indicator */}
                <div className="absolute bottom-3 right-4 px-3 py-1 rounded-md bg-navy-950/80 backdrop-blur-sm text-xs font-mono text-white border border-white/10 flex items-center space-x-1.5">
                  <Eye className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{activeImageIndex + 1} / {images.length} Photos</span>
                </div>
              </div>

              {/* Thumbnails Row */}
              {images.length > 1 && (
                <div className="p-3 bg-navy-900/90 border-t border-navy-800 flex items-center space-x-2.5 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-14 sm:w-24 sm:h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        activeImageIndex === idx 
                          ? 'border-emerald-400 scale-105 shadow-glow-emerald' 
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title, Location & Price Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury space-y-6">
              
              {/* Location Badge */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2">
                <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    {property.city ? `${property.city}, ` : ''}{property.district} District, Sri Lanka
                  </span>
                </div>

                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-600 transition-colors"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                  <span>View on Google Maps</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </div>

              {/* Title */}
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-950 leading-tight">
                {property.title}
              </h1>

              {/* Price display inside card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500 block mb-0.5">
                    {isPriceHidden ? 'Pricing Details' : 'Asking Price (LKR)'}
                  </span>
                  {isPriceHidden ? (
                    <div className="text-xl sm:text-2xl font-extrabold font-serif text-emerald-700 flex items-center space-x-2">
                      <Lock className="w-5 h-5 text-emerald-600" />
                      <span>Price on Request</span>
                    </div>
                  ) : (
                    <div className="text-2xl sm:text-3xl font-extrabold font-serif text-navy-950">
                      Rs. {Number(property.price).toLocaleString('en-LK')}
                    </div>
                  )}
                </div>

                {isPriceHidden ? (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider w-fit">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Inquire For Private Quote</span>
                  </span>
                ) : property.isNegotiable ? (
                  <span className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider w-fit">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>Price Negotiable</span>
                  </span>
                ) : null}
              </div>

              {/* Smart Details Grid tailored to Asset Type */}
              <div>
                <h3 className="font-serif text-lg font-bold text-navy-950 mb-3 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>
                    {isLand ? 'Land & Plot Details' : isAntique ? 'Antique Item Specifications' : 'Property Specifications'}
                  </span>
                </h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  
                  {/* Category */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Category
                    </span>
                    <span className="font-bold text-navy-950 text-sm truncate block">
                      {property.category}
                    </span>
                  </div>

                  {/* District / Location */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      District
                    </span>
                    <span className="font-bold text-navy-950 text-sm truncate block">
                      {property.district}
                    </span>
                  </div>

                  {/* Land Size (ONLY for Land / House / Villa / Hotel, NEVER for Antique) */}
                  {!isAntique && property.landSize ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Land Extent
                      </span>
                      <span className="font-bold text-navy-950 text-sm truncate block">
                        {property.landSize}
                      </span>
                    </div>
                  ) : null}

                  {/* House / Item Dimensions (ONLY for Houses / Villas or Antiques, NEVER for bare Land!) */}
                  {!isLand && property.houseSize ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        {isAntique ? 'Item Dimensions' : 'House / Floor Size'}
                      </span>
                      <span className="font-bold text-navy-950 text-sm truncate block">
                        {property.houseSize}
                      </span>
                    </div>
                  ) : null}

                  {/* Bedrooms (ONLY for Houses, Villas, Apartments, NEVER FOR LAND!) */}
                  {hasBedrooms ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Bedrooms
                      </span>
                      <span className="font-bold text-navy-950 text-sm">
                        {property.bedrooms} Beds
                      </span>
                    </div>
                  ) : null}

                  {/* Bathrooms (ONLY for Houses, Villas, Apartments, NEVER FOR LAND!) */}
                  {hasBathrooms ? (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                        Bathrooms
                      </span>
                      <span className="font-bold text-navy-950 text-sm">
                        {property.bathrooms} Baths
                      </span>
                    </div>
                  ) : null}

                  {/* Deed / Provenance Status */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      {isAntique ? 'Authenticity' : 'Title Status'}
                    </span>
                    <span className="font-bold text-emerald-700 text-sm flex items-center space-x-1">
                      <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{isAntique ? 'Verified Provenance' : 'Clear Deed'}</span>
                    </span>
                  </div>

                  {/* Ref ID */}
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="block text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                      Reference ID
                    </span>
                    <span className="font-mono font-bold text-navy-950 text-sm">
                      #{property.referenceId || property.id}
                    </span>
                  </div>

                </div>
              </div>

              {/* Detailed Description */}
              <div>
                <h3 className="font-serif text-lg font-bold text-navy-950 mb-3">
                  Full Description & Specifications
                </h3>
                <div className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
                  {property.description || "No full description provided for this listing. Please contact PROPERTY LK on WhatsApp for complete details, authenticity certificates, or viewing arrangements."}
                </div>
              </div>

            </div>

          </div>

          {/* Right Column: Sticky Contact & Inquiry Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-card-luxury space-y-6">
              
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center text-navy-950 shadow-glow-emerald">
                  <Building2 className="w-6 h-6 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-navy-950">
                    PROPERTY LK
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    Verified Direct Contact Desk
                  </span>
                </div>
              </div>

              {/* Primary WhatsApp Action Buttons */}
              <div className="space-y-3">
                <a
                  href={BRAND.createPropertyInquiryLink(property)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-4 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald transition-all duration-200 hover:scale-[1.01]"
                >
                  <MessageCircle className="w-5 h-5 fill-navy-950" />
                  <span>{isPriceHidden ? 'Inquire Price on WhatsApp' : 'Inquire on WhatsApp'}</span>
                </a>

                <a
                  href={createInspectionLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <CalendarCheck className="w-4 h-4 text-emerald-600" />
                  <span>{isLand ? 'Schedule Land Site Visit' : isAntique ? 'Request Private Viewing' : 'Book Property Inspection'}</span>
                </a>

                <a
                  href={`tel:${BRAND.phoneRaw}`}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                >
                  <Phone className="w-4 h-4 text-emerald-400" />
                  <span>Call {BRAND.phone}</span>
                </a>
              </div>

              {/* Inquiry Notice */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center space-x-2 text-navy-950 font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Inquiry Verification</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  Mentioning Reference ID <strong>#{property.referenceId || property.id}</strong> when you message or call allows our team to immediately provide current photos, deed verification, and private viewing slots.
                </p>
              </div>

              {/* Summary Details */}
              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Location:</span>
                  <span className="font-semibold text-navy-950 truncate max-w-[160px]">
                    {property.city ? `${property.city}, ` : ''}{property.district}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Category:</span>
                  <span className="font-semibold text-navy-950">{property.category}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Pricing:</span>
                  <span className="font-semibold text-emerald-700">
                    {isPriceHidden ? 'Private on Request' : `Rs. ${Number(property.price).toLocaleString('en-LK')}`}
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Photos:</span>
                  <span className="font-semibold text-navy-950">{images.length} available</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* Full-screen Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-md"
          >
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-20"
              aria-label="Close full-screen image viewer"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative max-w-5xl max-h-[85vh] w-full flex items-center justify-center">
              <img
                src={images[activeImageIndex]}
                alt="Full screen view"
                className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 text-white hover:bg-black/80"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
