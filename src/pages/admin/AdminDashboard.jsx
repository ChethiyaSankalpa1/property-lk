import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  AlertCircle
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { BRAND } from '../../constants/brand';

export default function AdminDashboard() {
  const { properties, deleteProperty, toggleFeatured, toggleSold } = useProperties();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Real statistics calculation (Zero when empty)
  const totalListings = properties.length;
  const soldListings = properties.filter(p => p.isSold).length;
  const activeListings = totalListings - soldListings;
  const featuredListings = properties.filter(p => p.isFeatured).length;

  // Filter listings
  const filtered = properties.filter(p => {
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

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) {
      deleteProperty(id);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      
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
          className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Listing</span>
        </Link>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Properties */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Total Listings
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-navy-950">
            {totalListings}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">In local storage</span>
        </div>

        {/* Active Properties */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
            Active & Available
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-emerald-600">
            {activeListings}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Live for inquiries</span>
        </div>

        {/* Featured */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
            Featured
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-amber-600">
            {featuredListings}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Highlighted on home</span>
        </div>

        {/* Sold Out */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-red-500 block mb-1">
            Sold / Closed
          </span>
          <div className="text-3xl sm:text-4xl font-extrabold font-serif text-red-600">
            {soldListings}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">Marked as sold</span>
        </div>

      </div>

      {/* Property Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Table Controls */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, ref ID, or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <span className="text-xs font-bold text-slate-500">
              Showing {filtered.length} of {properties.length}
            </span>
          </div>
        </div>

        {/* Empty state when zero properties */}
        {properties.length === 0 ? (
          <div className="p-12 text-center space-y-4">
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
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3 px-4">Item / Property</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">District</th>
                  <th className="py-3 px-4">Price (LKR)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
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
                            className={`p-1.5 rounded-lg border transition-colors ${
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
                            className={`p-1.5 rounded-lg border transition-colors ${
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
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-navy-900 border border-slate-200 transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </Link>

                          {/* View Live */}
                          <Link
                            to={`/property/${prop.id}`}
                            target="_blank"
                            title="View Public Page"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-emerald-600 border border-slate-200 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(prop.id, prop.title)}
                            title="Delete"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-50 text-red-600 border border-slate-200 transition-colors"
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
        )}

      </div>

    </div>
  );
}
