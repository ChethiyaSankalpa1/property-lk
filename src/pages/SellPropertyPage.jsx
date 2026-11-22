import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import {
  Building2,
  MapPin,
  User,
  Phone,
  MessageCircle,
  CheckCircle2,
  ShieldCheck,
  Send,
  Sparkles,
  Images,
  UploadCloud,
  X,
  Loader2,
  AlertCircle,
  Star
} from 'lucide-react';
import { BRAND } from '../constants/brand';
import { SRI_LANKA_DISTRICTS } from '../constants/districts';
import { PROPERTY_CATEGORIES } from '../constants/categories';
import { useProperties } from '../context/PropertyContext';
import {
  validateImageFile,
  MAX_CUSTOMER_IMAGES,
  MAX_IMAGE_BYTES,
  humanFileSize
} from '../utils/imageValidation';
import { EASE_ANIME } from '../components/motion/motionVariants';
import { useLanguage } from '../i18n/LanguageContext';

const createReferenceId = () => `PL-SELL-${Date.now().toString(36).toUpperCase()}`;

export default function SellPropertyPage() {
  const { uploadImageToCloudinary } = useProperties();
  const reduceMotion = useReducedMotion();
  const { t, districtLabel, categoryLabel } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    whatsappNumber: '',
    propertyType: 'House',
    district: 'Colombo',
    location: '',
    expectedPrice: '',
    description: ''
  });

  const [listingRef] = useState(createReferenceId);
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [whatsappLink, setWhatsappLink] = useState('');
  const [sentPhotoCount, setSentPhotoCount] = useState(0);
  const [attachedManually, setAttachedManually] = useState(false);

  const fileInputRef = useRef(null);
  const imagesRef = useRef([]);

  // Keep a ref so object URLs can be revoked on unmount without re-running effects.
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => {
        if (img.previewUrl && img.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(img.previewUrl);
        }
      });
    };
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const addFiles = (fileList) => {
    const incoming = Array.from(fileList || []);
    if (incoming.length === 0) return;

    setImageError('');
    const errors = [];
    const accepted = [];

    setImages((prev) => {
      let slotsLeft = MAX_CUSTOMER_IMAGES - prev.length;

      if (slotsLeft <= 0) {
        errors.push(t('sell.photos.maxReached', { max: MAX_CUSTOMER_IMAGES }));
        return prev;
      }

      incoming.forEach((file) => {
        if (slotsLeft <= 0) {
          errors.push(t('sell.photos.limitReached', { max: MAX_CUSTOMER_IMAGES }));
          return;
        }
        const { valid, code, sizeBytes, maxSizeBytes } = validateImageFile(file);
        if (!valid) {
          errors.push(
            t(`sell.validation.${code}`, {
              name: file.name,
              size: humanFileSize(sizeBytes),
              max: humanFileSize(maxSizeBytes)
            })
          );
          return;
        }
        accepted.push({
          id: `${file.name}-${file.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          name: file.name,
          size: file.size,
          file,
          previewUrl: URL.createObjectURL(file),
          status: 'ready',
          url: '',
          error: ''
        });
        slotsLeft -= 1;
      });

      if (errors.length > 0) {
        setImageError(errors.join(' '));
      }

      return accepted.length > 0 ? [...prev, ...accepted] : prev;
    });
  };

  const removeImage = (id) => {
    setImageError('');
    setImages((prev) => {
      const target = prev.find((img) => img.id === id);
      if (target?.previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleFileInputChange = (e) => {
    addFiles(e.target.files);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.fullName.trim()) {
      setErrorMsg(t('sell.errors.fullName'));
      return;
    }
    if (!formData.whatsappNumber.trim()) {
      setErrorMsg(t('sell.errors.whatsapp'));
      return;
    }
    if (!formData.location.trim()) {
      setErrorMsg(t('sell.errors.location'));
      return;
    }
    if (!formData.expectedPrice.trim()) {
      setErrorMsg(t('sell.errors.price'));
      return;
    }

    // Upload selected photos so the links can travel inside the WhatsApp message.
    const uploadedUrls = [];
    let manualAttachNeeded = false;

    if (images.length > 0) {
      setIsUploading(true);
      setUploadProgress({ current: 0, total: images.length });

      for (let i = 0; i < images.length; i += 1) {
        const image = images[i];
        setUploadProgress({ current: i + 1, total: images.length });
        setImages((prev) => prev.map((img) => (img.id === image.id ? { ...img, status: 'uploading' } : img)));

        try {
          const result = await uploadImageToCloudinary(image.file);
          if (result?.url && !result.isLocalFallback) {
            uploadedUrls.push(result.url);
            setImages((prev) =>
              prev.map((img) => (img.id === image.id ? { ...img, status: 'uploaded', url: result.url } : img))
            );
          } else {
            // No Cloudinary preset configured (or upload failed) - the customer attaches these manually.
            manualAttachNeeded = true;
            setImages((prev) => prev.map((img) => (img.id === image.id ? { ...img, status: 'manual', url: '' } : img)));
          }
        } catch (err) {
          manualAttachNeeded = true;
          setImages((prev) =>
            prev.map((img) => (img.id === image.id ? { ...img, status: 'error', error: err.message } : img))
          );
        }
      }

      setIsUploading(false);
      setUploadProgress({ current: 0, total: 0 });
    }

    const link = BRAND.createSellPropertyLink(formData, {
      imageUrls: uploadedUrls,
      referenceId: listingRef,
      attachManually: manualAttachNeeded || uploadedUrls.length === 0
    });

    setSentPhotoCount(uploadedUrls.length);
    setAttachedManually(manualAttachNeeded || uploadedUrls.length === 0);
    setWhatsappLink(link);

    window.open(link, '_blank', 'noopener,noreferrer');
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setWhatsappLink('');
    setErrorMsg('');
    setImageError('');
    setSentPhotoCount(0);
    setAttachedManually(false);
  };

  const slotsLeft = MAX_CUSTOMER_IMAGES - images.length;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 sm:pt-28 pb-20">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-navy-800 relative overflow-hidden mb-10">
        <div className="absolute inset-0 bg-anime-aurora opacity-70 animate-aurora pointer-events-none" aria-hidden="true" />
        <div className="absolute top-0 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none animate-floaty-slow" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-navy-900 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 animate-twinkle" />
            <span>{t('sell.hero.badge')}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
            {t('sell.hero.titlePrefix')} <span className="anime-text-gradient">{t('sell.hero.titleGradient')}</span>{' '}
            {t('sell.hero.titleSuffix')}
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            {t('sell.hero.subtitle')}
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Transparent Workflow Notice */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.5, ease: EASE_ANIME }}
          className="mb-8 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-start space-x-3.5 text-xs text-slate-600"
        >
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-navy-950 block text-sm mb-0.5">{t('sell.notice.title')}</strong>
            {t('sell.notice.body', { phone: BRAND.phone })}
          </div>
        </motion.div>

        {/* Main Submission Form */}
        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0.2 : 0.55, ease: EASE_ANIME, delay: 0.08 }}
          className="anime-glow-ring relative bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/90 shadow-card-luxury"
        >
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-10 text-center space-y-5"
            >
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8 stroke-[2.5]" />
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">
                {t('sell.success.title')}
              </h2>

              <p className="text-base sm:text-lg text-emerald-700 font-semibold max-w-md mx-auto">
                {t('sell.success.subtitle')}
              </p>

              <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                {t('sell.success.referencePrefix')}
                <span className="font-bold text-navy-900">{listingRef}</span>
                {t('sell.success.referenceSuffix')}
              </p>

              {sentPhotoCount > 0 && (
                <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
                  {sentPhotoCount === 1
                    ? t('sell.success.photoLinksOne', { count: sentPhotoCount })
                    : t('sell.success.photoLinksOther', { count: sentPhotoCount })}
                </p>
              )}

              {attachedManually && images.length > 0 && (
                <p className="text-xs sm:text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 max-w-lg mx-auto text-left">
                  <AlertCircle className="w-4 h-4 inline-block -mt-0.5 mr-1.5" />
                  {images.length === 1
                    ? t('sell.success.manualAttachOne', { count: images.length })
                    : t('sell.success.manualAttachOther', { count: images.length })}
                </p>
              )}

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-w-lg mx-auto pt-2">
                  {images.map((img) => (
                    <div key={img.id} className="aspect-square rounded-xl overflow-hidden border border-slate-200">
                      <img
                        src={img.previewUrl}
                        alt={img.name}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={whatsappLink || BRAND.createSellPropertyLink(formData, { referenceId: listingRef })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald"
                >
                  <MessageCircle className="w-4 h-4 fill-navy-950" />
                  <span>{t('sell.success.openWhatsapp')}</span>
                </a>

                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider"
                >
                  {t('sell.success.submitAnother')}
                </button>
              </div>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name & WhatsApp Number */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="fullName" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('sell.form.fullName')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      required
                      autoComplete="name"
                      placeholder={t('sell.placeholders.fullName')}
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="whatsappNumber" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('sell.form.whatsappNumber')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      id="whatsappNumber"
                      type="tel"
                      name="whatsappNumber"
                      required
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder={t('sell.placeholders.whatsappNumber')}
                      value={formData.whatsappNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type & District */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="propertyType" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('sell.form.propertyType')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      id="propertyType"
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                    >
                      {PROPERTY_CATEGORIES.map((c) => (
                        <option key={c.id} value={c.singular || c.name}>
                          {categoryLabel(c.singular || c.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="district" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('sell.form.district')} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <select
                      id="district"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                    >
                      {SRI_LANKA_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {districtLabel(d)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Location & Expected Selling Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="location" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('sell.form.location')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    name="location"
                    required
                    placeholder={t('sell.placeholders.location')}
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="expectedPrice" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {t('sell.form.expectedPrice')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="expectedPrice"
                    type="text"
                    name="expectedPrice"
                    required
                    inputMode="numeric"
                    placeholder={t('sell.placeholders.expectedPrice')}
                    value={formData.expectedPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Property Photos */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    {t('sell.form.photos')}{' '}
                    <span className="text-slate-400 normal-case font-medium">
                      {t('sell.form.photosUpTo', { max: MAX_CUSTOMER_IMAGES })}
                    </span>
                  </label>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {t('sell.photos.counter', {
                      count: images.length,
                      max: MAX_CUSTOMER_IMAGES,
                      size: humanFileSize(MAX_IMAGE_BYTES)
                    })}
                  </span>
                </div>

                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`anime-glow-ring rounded-2xl border-2 border-dashed p-4 sm:p-6 text-center transition-all duration-300 ${
                    isDragging ? 'border-emerald-500 bg-emerald-50/60 scale-[1.01] shadow-glow-emerald' : 'border-slate-200 bg-slate-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileInputChange}
                    className="hidden"
                    aria-label={t('sell.photos.selectAria')}
                  />

                  <div className="w-11 h-11 rounded-2xl bg-white border border-slate-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 animate-bobble">
                    <UploadCloud className="w-5 h-5" />
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className="anime-shimmer relative inline-flex items-center justify-center space-x-2 w-full sm:w-auto px-5 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
                  >
                    <Images className="w-4 h-4" />
                    <span className="relative z-10">{t('sell.photos.choose')}</span>
                  </button>

                  <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
                    {t('sell.photos.hint')}
                  </p>
                </div>

                {imageError && (
                  <div className="mt-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] font-semibold flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{imageError}</span>
                  </div>
                )}

                {images.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 mt-4">
                    <AnimatePresence initial={false}>
                      {images.map((img, index) => (
                        <motion.div
                          key={img.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100"
                        >
                          <img
                            src={img.previewUrl}
                            alt={img.name}
                            loading="lazy"
                            className="w-full h-full object-cover"
                          />

                          {index === 0 && (
                            <span className="absolute bottom-1 left-1 inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md bg-navy-950/85 text-emerald-400 text-[9px] font-bold uppercase tracking-wide">
                              <Star className="w-2.5 h-2.5 fill-emerald-400" />
                              <span>{t('sell.photos.main')}</span>
                            </span>
                          )}

                          {img.status === 'uploading' && (
                            <div className="absolute inset-0 bg-navy-950/60 flex items-center justify-center">
                              <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                            </div>
                          )}

                          {img.status === 'uploaded' && (
                            <div className="absolute inset-0 bg-emerald-600/25" />
                          )}

                          {(img.status === 'manual' || img.status === 'error') && (
                            <div className="absolute inset-x-0 bottom-0 bg-amber-500/90 text-navy-950 text-[9px] font-bold px-1 py-0.5 text-center">
                              {t('sell.photos.attachInChat')}
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={() => removeImage(img.id)}
                            aria-label={t('sell.photos.removeAria', { name: img.name })}
                            className="absolute top-1 right-1 w-9 h-9 rounded-full bg-navy-950/80 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}

                {images.length > 0 && (
                  <p className="text-[11px] text-slate-500 mt-2.5">
                    {slotsLeft > 0
                      ? slotsLeft === 1
                        ? t('sell.photos.moreAvailableOne', { count: slotsLeft })
                        : t('sell.photos.moreAvailableOther', { count: slotsLeft })
                      : t('sell.photos.maxReachedNote')}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {t('sell.form.description')}
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder={t('sell.placeholders.description')}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-base sm:text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <motion.button
                  type="submit"
                  disabled={isUploading}
                  whileHover={reduceMotion || isUploading ? undefined : { scale: 1.02, y: -2 }}
                  whileTap={reduceMotion || isUploading ? undefined : { scale: 0.98 }}
                  transition={{ duration: 0.25, ease: EASE_ANIME }}
                  className="anime-shimmer relative w-full flex items-center justify-center space-x-2 py-4 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-sm uppercase tracking-wider shadow-glow-emerald hover:shadow-xl transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="relative z-10">
                        {t('sell.actions.uploading', {
                          current: uploadProgress.current,
                          total: uploadProgress.total
                        })}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span className="relative z-10">{t('sell.actions.submit')}</span>
                    </>
                  )}
                </motion.button>
              </div>

              <div className="text-center text-xs text-slate-400">
                {t('sell.footer', { phone: BRAND.phone })}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
