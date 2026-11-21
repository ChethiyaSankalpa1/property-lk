import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  Upload, 
  Trash2, 
  Plus, 
  Eye, 
  Save, 
  ArrowLeft, 
  Check, 
  Sparkles, 
  X, 
  MapPin, 
  Image as ImageIcon,
  Lock,
  AlertCircle,
  Star,
  Layers,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { SRI_LANKA_DISTRICTS } from '../../constants/districts';
import { PROPERTY_CATEGORIES } from '../../constants/categories';
import { BRAND } from '../../constants/brand';

export default function AddEditProperty() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { properties, addProperty, updateProperty, getPropertyById, uploadImageToCloudinary } = useProperties();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Lands',
    district: 'Colombo',
    city: '',
    price: '',
    hidePrice: false,
    isNegotiable: false,
    bedrooms: '',
    bathrooms: '',
    landSize: '',
    houseSize: '',
    description: '',
    isFeatured: false,
    isSold: false,
    images: []
  });

  const [bulkUrls, setBulkUrls] = useState('');
  const [uploadProgress, setUploadProgress] = useState({ active: false, current: 0, total: 0 });
  const [uploadError, setUploadError] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Category classification helpers
  const categoryLower = (formData.category || '').toLowerCase();
  const isLand = categoryLower.includes('land');
  const isAntique = categoryLower.includes('antique');
  const showBedroomsBathrooms = !isLand && !isAntique;
  const showLandSize = !isAntique;

  // If editing, load existing property
  useEffect(() => {
    if (isEditing) {
      const existing = getPropertyById(id);
      if (existing) {
        setFormData({
          title: existing.title || '',
          category: existing.category || 'Houses',
          district: existing.district || 'Colombo',
          city: existing.city || '',
          price: existing.price !== undefined ? existing.price : '',
          hidePrice: Boolean(existing.hidePrice),
          isNegotiable: Boolean(existing.isNegotiable),
          bedrooms: existing.bedrooms || '',
          bathrooms: existing.bathrooms || '',
          landSize: existing.landSize || '',
          houseSize: existing.houseSize || '',
          description: existing.description || '',
          isFeatured: Boolean(existing.isFeatured),
          isSold: Boolean(existing.isSold),
          images: Array.isArray(existing.images) ? existing.images : []
        });
      }
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // MULTIPLE IMAGE FILES UPLOAD (Select 5, 10, 20 photos at once)
  const processFiles = async (files) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files).filter(f => f.type.startsWith('image/'));
    if (fileList.length === 0) {
      setUploadError('Please select valid image files (JPG, PNG, WEBP).');
      return;
    }

    setUploadProgress({ active: true, current: 0, total: fileList.length });
    setUploadError('');

    const newUploadedUrls = [];

    for (let i = 0; i < fileList.length; i++) {
      setUploadProgress({ active: true, current: i + 1, total: fileList.length });
      try {
        const result = await uploadImageToCloudinary(fileList[i]);
        if (result?.url) {
          newUploadedUrls.push(result.url);
        }
      } catch (err) {
        console.error(`Error uploading image ${i + 1}`, err);
        setUploadError(`Note: Image ${i + 1} (${fileList[i].name}) upload had an error: ${err.message}`);
      }
    }

    if (newUploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...newUploadedUrls]
      }));
    }

    setUploadProgress({ active: false, current: 0, total: 0 });
  };

  const handleFileInputChange = (e) => {
    processFiles(e.target.files);
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
    if (e.dataTransfer?.files) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleAddBulkUrls = (e) => {
    e.preventDefault();
    if (!bulkUrls.trim()) return;

    const urls = bulkUrls
      .split(/[\n,]+/)
      .map(u => u.trim())
      .filter(u => u.startsWith('http://') || u.startsWith('https://') || u.startsWith('data:image/'));

    if (urls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));
      setBulkUrls('');
    } else {
      setUploadError('Please enter valid http:// or https:// image URLs.');
    }
  };

  const handleAddSamplePack = () => {
    const samplePack = [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80'
    ];

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...samplePack]
    }));
  };

  const handleSetCover = (index) => {
    setFormData(prev => {
      const selected = prev.images[index];
      const remaining = prev.images.filter((_, idx) => idx !== index);
      return {
        ...prev,
        images: [selected, ...remaining]
      };
    });
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  const handleClearAllImages = () => {
    if (window.confirm('Remove all uploaded photos for this listing?')) {
      setFormData(prev => ({ ...prev, images: [] }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter a listing title');
      return;
    }

    // Clean data according to category: Lands don't have bedrooms/bathrooms!
    const cleanedPayload = {
      ...formData,
      price: Number(formData.price) || 0,
      bedrooms: showBedroomsBathrooms ? formData.bedrooms : '',
      bathrooms: showBedroomsBathrooms ? formData.bathrooms : '',
      houseSize: isLand ? '' : formData.houseSize,
      landSize: isAntique ? '' : formData.landSize,
      images: formData.images.length > 0 
        ? formData.images 
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
    };

    if (isEditing) {
      updateProperty(id, cleanedPayload);
    } else {
      addProperty(cleanedPayload);
    }

    setSaveSuccess(true);
    setTimeout(() => {
      navigate('/admin');
    }, 800);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Link
            to="/admin"
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-navy-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">
              {isEditing ? 'Edit Listing' : 'Add New Listing'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Specific fields for Houses, Lands, Antique Items, Villas, Hotels, or Bars.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live Preview</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>Listing saved successfully! Redirecting to dashboard...</span>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Card 1: Title, Category & Location */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="font-serif text-lg font-bold text-navy-950 border-b border-slate-100 pb-3">
            1. Title, Category & Location
          </h2>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Listing Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder={isLand ? "e.g. Prime 20 Perches Residential Land in Malabe" : "e.g. Luxury 4-Bedroom Villa in Thalpe, Galle"}
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 focus:bg-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Category */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {PROPERTY_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* District */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                District <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                value={formData.district}
                onChange={handleChange}
                className="w-full px-3 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {SRI_LANKA_DISTRICTS.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                City / Specific Area
              </label>
              <input
                type="text"
                name="city"
                placeholder="e.g. Thalpe Beach, Rajagiriya, Negombo Rd"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

          </div>
        </div>

        {/* Card 2: Pricing & Privacy ("NO PRICE LISTING / PRICE ON REQUEST") */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-serif text-lg font-bold text-navy-950">
              2. Pricing & Privacy Controls
            </h2>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              Flexible Price Visibility
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-center">
            
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Selling Price (LKR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  Rs.
                </span>
                <input
                  type="number"
                  name="price"
                  placeholder="e.g. 45000000"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                {formData.price ? `Formatted: Rs. ${Number(formData.price).toLocaleString('en-LK')}` : 'Enter amount or leave for price on request'}
              </span>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/70 transition-colors">
                <input
                  type="checkbox"
                  name="hidePrice"
                  checked={formData.hidePrice}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-navy-950 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Hide Price / "Price on Request"</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block leading-tight mt-0.5">
                    Customers will only see photos, location & specifications. Prompts buyers to message you directly on WhatsApp.
                  </span>
                </div>
              </label>

              <label className="flex items-center space-x-3 px-3 py-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isNegotiable"
                  checked={formData.isNegotiable}
                  onChange={handleChange}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-700">
                  Mark as Price Negotiable
                </span>
              </label>
            </div>

          </div>
        </div>

        {/* Card 3: Dynamic Specifications (Bedrooms ONLY for houses/villas, NEVER for Land!) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <h2 className="font-serif text-lg font-bold text-navy-950 border-b border-slate-100 pb-3">
            3. {isLand ? 'Land Extent & Details' : isAntique ? 'Antique Specifications' : 'Specifications & Details'}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Bedrooms (ONLY for Houses, Villas, Apartments) */}
            {showBedroomsBathrooms && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="bedrooms"
                  placeholder="e.g. 4"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Bathrooms (ONLY for Houses, Villas, Apartments) */}
            {showBedroomsBathrooms && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="bathrooms"
                  placeholder="e.g. 3"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* Land Size (For Land, Houses, Villas) */}
            {showLandSize && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  Land Extent <span className="text-slate-400 font-normal">(Perches / Acres)</span>
                </label>
                <input
                  type="text"
                  name="landSize"
                  placeholder="e.g. 20 Perches / 2.5 Acres"
                  value={formData.landSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

            {/* House Size or Dimensions (For Houses, Antiques) */}
            {!isLand && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                  {isAntique ? 'Item Dimensions / Height x Width' : 'House / Floor Size (sqft)'}
                </label>
                <input
                  type="text"
                  name="houseSize"
                  placeholder={isAntique ? "e.g. Height: 7ft, Width: 4ft" : "e.g. 3,200 sqft"}
                  value={formData.houseSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
                />
              </div>
            )}

          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Full Description & Specifications
            </label>
            <textarea
              name="description"
              rows={5}
              placeholder={
                isLand 
                  ? "Describe road frontage width, access road, water & electricity connections, soil/slope, clear deed status..."
                  : isAntique 
                  ? "Describe historical period, wood type (Calamander, Teak, Ebony), carvings, authenticity, provenance..."
                  : "Detail house layout, kitchen, parking, garden, security, surroundings, clear deed status..."
              }
              value={formData.description}
              onChange={handleChange}
              className="w-full p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-navy-950 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Mark as Featured Listing</span>
              </span>
            </label>

            <label className="flex items-center space-x-2.5 cursor-pointer">
              <input
                type="checkbox"
                name="isSold"
                checked={formData.isSold}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 rounded border-slate-300 focus:ring-red-500 cursor-pointer"
              />
              <span className="text-xs font-bold text-red-600">
                Mark as Sold Out
              </span>
            </label>
          </div>
        </div>

        {/* Card 4: Photography */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-3 gap-2">
            <div>
              <h2 className="font-serif text-lg font-bold text-navy-950 flex items-center space-x-2">
                <span>4. Photography & Multi-Image Gallery</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  {formData.images.length} {formData.images.length === 1 ? 'Photo' : 'Photos'}
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Upload 5, 10, or more real photos for this item. Drag & drop or select multiple files.
              </p>
            </div>

            {formData.images.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllImages}
                className="text-xs font-semibold text-red-600 hover:text-red-700 flex items-center space-x-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Photos</span>
              </button>
            )}
          </div>

          <div 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`p-6 sm:p-8 rounded-2xl border-2 border-dashed text-center transition-all ${
              isDragging 
                ? 'border-emerald-500 bg-emerald-50/50 scale-[1.01]' 
                : 'border-slate-300 bg-slate-50/70 hover:bg-slate-50'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
              <Upload className="w-6 h-6 stroke-[2.2]" />
            </div>
            
            <h3 className="font-serif text-base font-bold text-navy-950 mb-1">
              Select or Drag & Drop Multiple Photos
            </h3>
            
            <p className="text-xs text-slate-500 max-w-md mx-auto mb-4">
              Hold <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-mono">Ctrl</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-200 rounded text-[10px] font-mono">Shift</kbd> to pick <strong>5, 10, or 20 images at once</strong> from your files.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <label className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-xs uppercase tracking-wider cursor-pointer shadow-glow-emerald transition-all">
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>{uploadProgress.active ? `Uploading (${uploadProgress.current}/${uploadProgress.total})...` : 'Select Multiple Photos'}</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInputChange}
                  disabled={uploadProgress.active}
                  className="hidden"
                />
              </label>

              <button
                type="button"
                onClick={handleAddSamplePack}
                className="inline-flex items-center space-x-1.5 px-4 py-3 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-semibold text-xs transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Add 5 Photos Pack</span>
              </button>
            </div>

            {uploadProgress.active && (
              <div className="mt-4 max-w-xs mx-auto">
                <div className="flex justify-between text-xs font-semibold text-emerald-700 mb-1">
                  <span>Uploading photo {uploadProgress.current} of {uploadProgress.total}</span>
                  <span>{Math.round((uploadProgress.current / uploadProgress.total) * 100)}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-2 transition-all duration-300" 
                    style={{ width: `${(uploadProgress.current / uploadProgress.total) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Bulk URL Paste */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="block text-xs font-bold text-navy-950 mb-1">
              Or Paste Multiple Image URLs (Bulk)
            </span>
            <div className="space-y-2">
              <textarea
                rows={2}
                placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
                value={bulkUrls}
                onChange={(e) => setBulkUrls(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-mono focus:outline-none focus:border-emerald-500"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleAddBulkUrls}
                  className="px-4 py-2 rounded-xl bg-navy-950 text-white font-bold text-xs hover:bg-navy-900 transition-colors"
                >
                  Add URLs
                </button>
              </div>
            </div>
          </div>

          {uploadError && (
            <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
              {uploadError}
            </div>
          )}

          {/* Current Images Gallery Grid */}
          {formData.images.length > 0 ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>The first photo is the <strong>Primary Cover Photo</strong>.</span>
                <span className="font-semibold text-emerald-700">{formData.images.length} photos ready</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {formData.images.map((imgUrl, index) => (
                  <div 
                    key={index} 
                    className={`relative group rounded-xl overflow-hidden aspect-[4/3] bg-navy-950 border-2 transition-all ${
                      index === 0 ? 'border-emerald-500 ring-2 ring-emerald-400/40' : 'border-slate-200'
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                    
                    <div className="absolute top-1.5 left-1.5 flex items-center space-x-1">
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-navy-950/80 text-white backdrop-blur-sm">
                        #{index + 1}
                      </span>
                      {index === 0 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500 text-navy-950 shadow-sm flex items-center space-x-0.5">
                          <Star className="w-2.5 h-2.5 fill-navy-950" />
                          <span>Cover</span>
                        </span>
                      )}
                    </div>

                    <div className="absolute inset-0 bg-navy-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-1">
                      {index !== 0 && (
                        <button
                          type="button"
                          onClick={() => handleSetCover(index)}
                          className="px-2 py-1 rounded bg-emerald-500 text-navy-950 text-[10px] font-bold hover:bg-emerald-400"
                        >
                          Make Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="p-1.5 rounded bg-red-600 text-white text-[10px] hover:bg-red-700"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-400">
              No photos added yet.
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <Link
            to="/admin"
            className="px-6 py-3.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald hover:shadow-xl transition-all"
          >
            {isEditing ? 'Save Changes' : `Publish ${formData.category} Listing`}
          </button>
        </div>

      </form>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
            <button
              onClick={() => setPreviewOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-600 block mb-1">
              Preview Mode • {formData.images.length} Photos
            </span>
            <h2 className="font-serif text-xl font-bold text-navy-950 mb-4">
              {formData.title || 'Untitled Listing'}
            </h2>

            <div className="aspect-[16/10] rounded-2xl overflow-hidden bg-navy-950 mb-3">
              <img
                src={formData.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-4">
              <span className="text-xs uppercase text-slate-500 font-semibold block">
                {formData.hidePrice ? 'Price Status' : 'Selling Price'}
              </span>
              <div className="font-serif font-bold text-lg text-navy-950">
                {formData.hidePrice ? (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <Lock className="w-4 h-4" />
                    <span>Price on Request / Contact Directly</span>
                  </span>
                ) : (
                  `Rs. ${Number(formData.price || 0).toLocaleString('en-LK')} ${formData.isNegotiable ? '(Negotiable)' : ''}`
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-600 mb-4">
              <div className="p-2 bg-slate-50 rounded-lg">Category: <strong>{formData.category}</strong></div>
              <div className="p-2 bg-slate-50 rounded-lg">District: <strong>{formData.district}</strong></div>
              {showLandSize && <div className="p-2 bg-slate-50 rounded-lg">Land: <strong>{formData.landSize || '-'}</strong></div>}
              {showBedroomsBathrooms && <div className="p-2 bg-slate-50 rounded-lg">Beds: <strong>{formData.bedrooms || '-'}</strong></div>}
            </div>

            <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed mb-6">
              {formData.description || 'No description provided.'}
            </p>

            <button
              onClick={() => setPreviewOpen(false)}
              className="w-full py-3 rounded-xl bg-navy-950 text-white font-bold text-xs uppercase tracking-wider"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
