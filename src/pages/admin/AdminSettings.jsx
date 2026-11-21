import React, { useState } from 'react';
import { 
  Cloud, 
  KeyRound, 
  Download, 
  Upload, 
  Trash2, 
  ShieldAlert, 
  Check, 
  AlertCircle,
  HelpCircle,
  Database,
  Globe,
  Copy
} from 'lucide-react';
import { useProperties } from '../../context/PropertyContext';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSettings() {
  const { 
    cloudinaryConfig, 
    updateCloudinaryConfig, 
    properties, 
    exportData, 
    importData, 
    clearAllProperties 
  } = useProperties();

  const { updatePin, securityDisclaimer } = useAdminAuth();

  // Cloudinary form state
  const [cloudName, setCloudName] = useState(cloudinaryConfig.cloudName || '');
  const [uploadPreset, setUploadPreset] = useState(cloudinaryConfig.uploadPreset || '');
  const [cloudSaved, setCloudSaved] = useState(false);

  // PIN update state
  const [oldPin, setOldPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [pinMessage, setPinMessage] = useState({ text: '', isError: false });

  // Import JSON state
  const [importStatus, setImportStatus] = useState('');
  const [copiedGlobalJson, setCopiedGlobalJson] = useState(false);

  const handleSaveCloudinary = (e) => {
    e.preventDefault();
    updateCloudinaryConfig({
      cloudName: cloudName.trim(),
      uploadPreset: uploadPreset.trim()
    });
    setCloudSaved(true);
    setTimeout(() => setCloudSaved(false), 3000);
  };

  const handleUpdatePin = (e) => {
    e.preventDefault();
    setPinMessage({ text: '', isError: false });

    const res = updatePin(oldPin.trim(), newPin.trim());
    if (res.success) {
      setPinMessage({ text: 'Admin Password / PIN updated successfully!', isError: false });
      setOldPin('');
      setNewPin('');
    } else {
      setPinMessage({ text: res.message, isError: true });
    }
  };

  const handleFileImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const res = importData(event.target?.result);
      if (res.success) {
        setImportStatus(`Successfully restored ${res.count} listings!`);
      } else {
        setImportStatus(`Import failed: ${res.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleCopyGlobalJson = () => {
    const jsonStr = JSON.stringify(properties, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopiedGlobalJson(true);
    setTimeout(() => setCopiedGlobalJson(false), 2500);
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL properties in this browser? This cannot be undone unless you have a JSON backup.')) {
      clearAllProperties();
      alert('All properties cleared. You now have 0 properties in LocalStorage.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-navy-950">
          Settings & Integrations
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure Cloudinary unsigned image uploads, global listings sync, or update admin credentials.
        </p>
      </div>

      {/* Global Sync Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-emerald-950 via-navy-950 to-navy-900 border border-emerald-500/30 text-white shadow-glass-dark space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-navy-950 flex items-center justify-center font-bold">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-white">
              Make Listings Visible to ALL Customers Worldwide
            </h2>
            <p className="text-xs text-slate-300">
              You currently have <strong className="text-emerald-400 font-bold">{properties.length} listings</strong> in your browser.
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Because this is a serverless frontend site, you can publish your listings to every customer on any phone or computer by clicking <strong>"Copy All Listings JSON"</strong> and pasting it into the project (or sending it to your AI assistant to commit).
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={handleCopyGlobalJson}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-glow-emerald transition-all"
          >
            {copiedGlobalJson ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedGlobalJson ? 'Listings Copied!' : 'Copy All Listings JSON'}</span>
          </button>

          <button
            onClick={exportData}
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-white font-semibold text-xs border border-navy-700 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download .JSON File</span>
          </button>
        </div>
      </div>

      {/* Security Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs leading-relaxed flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="block text-amber-800 text-sm mb-0.5">Frontend Prototype Disclaimer:</strong>
          {securityDisclaimer}
        </div>
      </div>

      {/* Card 1: Cloudinary Unsigned Upload Configuration */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-950">
              Cloudinary Unsigned Upload Settings
            </h2>
            <p className="text-xs text-slate-500">
              Direct client-side uploads without exposing any API secret keys.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveCloudinary} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Cloudinary Cloud Name
              </label>
              <input
                type="text"
                placeholder="e.g. dxyz1234"
                value={cloudName}
                onChange={(e) => setCloudName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Unsigned Upload Preset
              </label>
              <input
                type="text"
                placeholder="e.g. property_lk_unsigned"
                value={uploadPreset}
                onChange={(e) => setUploadPreset(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-relaxed border border-slate-100">
            <strong>How to create an unsigned preset:</strong> Log in to cloudinary.com &rarr; Go to Settings &rarr; Upload &rarr; Add Upload Preset &rarr; Change Signing Mode to <em>Unsigned</em> &rarr; Save. Enter that name above!
          </div>

          {cloudSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center space-x-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Cloudinary configuration saved in your browser!</span>
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Save Cloudinary Settings
          </button>
        </form>
      </div>

      {/* Card 2: Backup & Restore */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-950">
              Data Backup & Restore (JSON)
            </h2>
            <p className="text-xs text-slate-500">
              Export backups to keep your listings safe or transfer between browsers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Export */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-navy-950 block mb-1">
                Export Listings Backup
              </span>
              <p className="text-[11px] text-slate-500 mb-4">
                Downloads a `.json` file containing all {properties.length} listings currently stored.
              </p>
            </div>
            
            <button
              onClick={exportData}
              className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download JSON Backup</span>
            </button>
          </div>

          {/* Import */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-navy-950 block mb-1">
                Restore from JSON File
              </span>
              <p className="text-[11px] text-slate-500 mb-4">
                Select a previously saved PROPERTY LK JSON file to restore listings.
              </p>
            </div>

            <label className="inline-flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <span>Choose Backup File</span>
              <input
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
              />
            </label>
          </div>

        </div>

        {importStatus && (
          <div className="p-3 rounded-xl bg-slate-100 text-xs font-semibold text-navy-950">
            {importStatus}
          </div>
        )}

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-red-600 block">Clear All Listings</span>
            <span className="text-[11px] text-slate-400">Permanently reset listing count back to zero.</span>
          </div>
          <button
            onClick={handleClearAll}
            className="px-4 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs border border-red-200 transition-colors"
          >
            Reset to 0 Properties
          </button>
        </div>
      </div>

      {/* Card 3: Change Admin Password / PIN */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
        <div className="flex items-center space-x-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold text-navy-950">
              Update Admin Password / PIN
            </h2>
            <p className="text-xs text-slate-500">
              Change your LocalStorage browser passkey.
            </p>
          </div>
        </div>

        <form onSubmit={handleUpdatePin} className="space-y-4 max-w-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Current Password / PIN
            </label>
            <input
              type="password"
              required
              placeholder="Enter current password (default: admin123)"
              value={oldPin}
              onChange={(e) => setOldPin(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              New Password / PIN
            </label>
            <input
              type="password"
              required
              placeholder="At least 4 characters"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
            />
          </div>

          {pinMessage.text && (
            <div className={`p-3 rounded-xl text-xs font-semibold ${
              pinMessage.isError ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-800'
            }`}>
              {pinMessage.text}
            </div>
          )}

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>

    </div>
  );
}
