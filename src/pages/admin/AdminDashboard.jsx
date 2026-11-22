import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  PlusCircle, 
  Search, 
  Trash2, 
  Edit, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Layers, 
  TrendingUp, 
  MapPin,
  Eye,
  AlertCircle,
  AlertTriangle,
  X,
  Loader2,
  Check
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { BRAND } from '../../constants/brand';

export default function AdminDashboard() {
  const { properties, deleteProperty, toggleFeatured, toggleSold } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    property: null,
    isProcessing: false
  });

  // Notification toast state
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success'
  });

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  // Real statistics calculation (Safely handles empty or missing data)
  const totalListings = (properties || []).length;
  const soldListings = (properties || []).filter(p => p && p.isSold).length;
  const activeListings = totalListings - soldListings;
  const featuredListings = (properties || []).filter(p => p && p.isFeatured).length;

  // Filter listings safely
  const filtered = (properties || []).filter(p => {
    if (!p) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = p.title?.toLowerCase().includes(q);
      const matchRef = p.referenceId?.toLowerCase().includes(q);
      const matchCity = p.city?.toLowerCase().includes(q);
      const matchDistrict = p.district?.toLowerCase().includes(q);
      if (!matchTitle && !matchRef && !matchCity && !matchDistrict) return false;
    }
    if (filterCategory && p.category !== filterCategory) return false;
    return true;
  });

  // Open confirmation modal
  const handleOpenDeleteModal = (prop) => {
    if (!prop) return;
    setDeleteModal({
      isOpen: true,
      property: prop,
      isProcessing: false
    });
  };

  // Close modal
  const handleCloseDeleteModal = () => {
    if (deleteModal.isProcessing) return;
    setDeleteModal({
      isOpen: false,
      property: null,
      isProcessing: false
    });
  };

  // Confirm and execute deletion
  const handleConfirmDelete = async () => {
    if (!deleteModal.property || deleteModal.isProcessing) return;
    
    setDeleteModal(prev => ({ ...prev, isProcessing: true }));
    const title = deleteModal.property.title || 'Listing';
    const targetId = deleteModal.property.id;

    try {
      await deleteProperty(targetId);
      setDeleteModal({ isOpen: false, property: null, isProcessing: false });
      showToast(`"${title}" was permanently deleted.`, 'success');
    } catch (err) {
      console.error('Delete failed', err);
      setDeleteModal(prev => ({ ...prev, isProcessing: false }));
      showToast('Deletion failed. Please try again.', 'error');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto pb-12">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 max-w-[calc(100vw-2rem)] sm:max-w-sm flex items-center space-x-3 px-5 py-3.5 rounded-2xl shadow-2xl backdrop-blur-md border text-sm font-semibold ${
              toast.type === 'success' 
                ? 'bg-navy-950/95 text-white border-emerald-500/40' 
                : 'bg-red-950/95 text-white border-red-500/40'
            }`}
          >
            {toast.type === 'success' ? (
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-navy-950 flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            ) : (
              <span className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shrink-0">
                <AlertTriangle className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            )}
            <span className="truncate max-w-xs sm:max-w-md">{toast.message}</span>
            <button 
              onClick={() => setToast(prev => ({ ...prev, show: false }))} 
              className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">
            Admin Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time management for Sri Lankan property & antique listings.
          </p>
        </div>

        <Link
          to="/admin/add"
          className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all active:scale-95"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6">
        
        {/* Total Properties */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Listings
          </span>
          <div className="text-2xl sm:text-4xl font-extrabold font-serif text-navy-950">
            {totalListings}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">In local storage</span>
        </div>

        {/* Active Properties */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Active & Available
          </span>
          <div className="text-2xl sm:text-4xl font-extrabold font-serif text-emerald-600">
            {activeListings}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Live for inquiries</span>
        </div>

        {/* Featured */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
            Featured
          </span>
          <div className="text-2xl sm:text-4xl font-extrabold font-serif text-amber-600">
            {featuredListings}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Highlighted on home</span>
        </div>

        {/* Sold Out */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-red-500 block mb-1">
            Sold / Closed
          </span>
          <div className="text-2xl sm:text-4xl font-extrabold font-serif text-red-600">
            {soldListings}
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Marked as sold</span>
        </div>

      </div>

      {/* Property Management Container */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Table / List Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, ref ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
            <span className="text-xs font-bold text-slate-500">
              Showing {filtered.length} of {properties.length}
            </span>
          </div>
        </div>

        {/* Empty state when zero properties */}
        {properties.length === 0 ? (
          <div className="p-8 sm:p-14 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-xl font-bold text-navy-950">
              No Properties in LocalStorage Yet
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
              As configured, your website begins with zero properties. Click the button below to add your first real house, land, villa, hotel, or antique item.
            </p>
            <Link
              to="/admin/add"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add First Property</span>
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-xs">
            No properties match your search query "{searchQuery}".
          </div>
        ) : (
          <>
            {/* Desktop Table View (md and above) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                    <th className="py-3.5 px-4">Item / Property</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">District</th>
                    <th className="py-3.5 px-4">Price (LKR)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((prop) => {
                    const cover = prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';
                    
                    return (
                      <tr key={prop.id} className="hover:bg-slate-50/80 transition-colors">
                        
                        {/* Title & Image */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={cover}
                              alt=""
                              loading="lazy"
                              className="w-12 h-10 rounded-lg object-cover shrink-0 bg-slate-100"
                            />
                            <div className="max-w-xs sm:max-w-sm">
                              <span className="font-semibold text-navy-950 line-clamp-1 block">
                                {prop.title}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400">
                                REF: #{prop.referenceId || prop.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {prop.category}
                        </td>

                        {/* District */}
                        <td className="py-3.5 px-4 text-slate-600">
                          {prop.city ? `${prop.city}, ` : ''}{prop.district}
                        </td>

                        {/* Price */}
                        <td className="py-3.5 px-4 font-semibold">
                          {prop.hidePrice ? (
                            <span className="text-emerald-700 flex items-center space-x-1">
                              <Lock className="w-3 h-3 text-emerald-600" />
                              <span>Price on Request</span>
                            </span>
                          ) : (
                            <span className="text-navy-950">
                              Rs. {Number(prop.price).toLocaleString('en-LK')}
                            </span>
                          )}
                        </td>

                        {/* Status Badges */}
                        <td className="py-3.5 px-4 space-x-1">
                          {prop.isSold ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-700">
                              Sold
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                              Active
                            </span>
                          )}

                          {prop.isFeatured && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                              Featured
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center space-x-1">
                            
                            {/* Toggle Featured */}
                            <button
                              onClick={() => toggleFeatured(prop.id)}
                              title={prop.isFeatured ? "Unmark featured" : "Mark featured"}
                              className={`p-2 rounded-lg border transition-colors ${
                                prop.isFeatured 
                                  ? 'bg-amber-500 text-white border-amber-600' 
                                  : 'bg-slate-100 text-slate-500 hover:text-amber-600'
                              }`}
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>

                            {/* Toggle Sold */}
                            <button
                              onClick={() => toggleSold(prop.id)}
                              title={prop.isSold ? "Mark active" : "Mark sold"}
                              className={`p-2 rounded-lg border transition-colors ${
                                prop.isSold 
                                  ? 'bg-red-600 text-white border-red-700' 
                                  : 'bg-slate-100 text-slate-500 hover:text-red-600'
                              }`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit */}
                            <Link
                              to={`/admin/edit/${prop.id}`}
                              title="Edit Property"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 border border-slate-200 transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Link>

                            {/* View Live */}
                            <Link
                              to={`/property/${prop.id}`}
                              target="_blank"
                              title="View Public Page"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-600 border border-slate-200 transition-colors"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>

                            {/* Modern Delete Button */}
                            <button
                              onClick={() => handleOpenDeleteModal(prop)}
                              title="Delete Listing"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-red-50 text-red-600 border border-slate-200 hover:border-red-200 transition-colors active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                          </div>
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Touch-Friendly Card List (Under md / Phones) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((prop) => {
                const cover = prop.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80';

                return (
                  <div key={prop.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <img
                        src={cover}
                        alt=""
                        loading="lazy"
                        className="w-20 h-16 rounded-xl object-cover shrink-0 bg-slate-100 border border-slate-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-navy-100 text-navy-800">
                            {prop.category}
                          </span>
                          {prop.isFeatured && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800">
                              Featured
                            </span>
                          )}
                          {prop.isSold && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700">
                              Sold
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-navy-950 text-xs sm:text-sm line-clamp-1">
                          {prop.title}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                          <span>{prop.district}</span>
                          <span className="font-bold text-navy-900">
                            {prop.hidePrice ? 'Price on Request' : `Rs. ${Number(prop.price).toLocaleString('en-LK')}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Mobile Action Buttons Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 gap-1.5">
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={() => toggleFeatured(prop.id)}
                          className={`px-3 py-2.5 rounded-lg border text-[11px] font-semibold flex items-center space-x-1 transition-colors ${
                            prop.isFeatured 
                              ? 'bg-amber-500 text-white border-amber-600' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>{prop.isFeatured ? 'Featured' : 'Feature'}</span>
                        </button>

                        <button
                          onClick={() => toggleSold(prop.id)}
                          className={`px-3 py-2.5 rounded-lg border text-[11px] font-semibold flex items-center space-x-1 transition-colors ${
                            prop.isSold 
                              ? 'bg-red-600 text-white border-red-700' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{prop.isSold ? 'Sold' : 'Active'}</span>
                        </button>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <Link
                          to={`/admin/edit/${prop.id}`}
                          className="p-2.5 rounded-lg bg-slate-100 text-navy-900 hover:bg-slate-200 border border-slate-200"
                          title="Edit"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          to={`/property/${prop.id}`}
                          target="_blank"
                          className="p-2.5 rounded-lg bg-slate-100 text-emerald-600 hover:bg-emerald-50 border border-slate-200"
                          title="View Live"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenDeleteModal(prop)}
                          className="p-2.5 rounded-lg bg-red-50 text-red-600 border border-red-200 active:scale-95"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>

      {/* Modern Animated Confirmation Dialog */}
      <AnimatePresence>
        {deleteModal.isOpen && deleteModal.property && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={handleCloseDeleteModal}
              className="fixed inset-0 bg-navy-950/75 backdrop-blur-sm -z-10"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200 space-y-6"
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
            >
              {/* Header Icon + Warning */}
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-sm">
                  <AlertTriangle className="w-6 h-6 stroke-[2]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 id="delete-dialog-title" className="font-serif text-lg sm:text-xl font-bold text-navy-950">
                    Delete Property Listing?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                    Are you sure you want to delete this property? This action is permanent and will remove it from your marketplace.
                  </p>
                </div>
                <button
                  onClick={handleCloseDeleteModal}
                  disabled={deleteModal.isProcessing}
                  className="p-1 rounded-xl text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Selected Property Preview Pill */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3.5">
                <img
                  src={deleteModal.property.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
                  alt=""
                  className="w-14 h-12 rounded-xl object-cover shrink-0 bg-slate-200 border border-slate-300"
                />
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-navy-950 text-xs sm:text-sm line-clamp-1 block">
                    {deleteModal.property.title}
                  </span>
                  <div className="flex items-center space-x-2 text-[11px] text-slate-500 mt-0.5">
                    <span className="font-mono text-emerald-600 font-semibold">
                      REF: #{deleteModal.property.referenceId || deleteModal.property.id}
                    </span>
                    <span>•</span>
                    <span>{deleteModal.property.district}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={deleteModal.isProcessing}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteModal.isProcessing}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-red-600/30 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 active:scale-95"
                >
                  {deleteModal.isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Delete Property</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
