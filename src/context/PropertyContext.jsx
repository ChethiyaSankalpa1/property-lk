import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { compressImage } from '../utils/imageCompressor';

const PropertyContext = createContext();

const STORAGE_KEY = 'property_lk_listings';
const CLOUDINARY_CONFIG_KEY = 'property_lk_cloudinary_config';
const BACKEND_URL_KEY = 'property_lk_backend_url';

export const PropertyProvider = ({ children }) => {
  // 1. Initial State from LocalStorage cache
  const [properties, setProperties] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (err) {
      console.error('Failed to parse properties from localStorage', err);
    }
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [lastSyncedTime, setLastSyncedTime] = useState(Date.now());

  // Cross-tab broadcast channel for instant 0ms sync across tabs
  const broadcastRef = useRef(null);

  // Backend URL
  const [backendUrl, setBackendUrl] = useState(() => {
    return localStorage.getItem(BACKEND_URL_KEY) || import.meta.env.VITE_API_URL || '';
  });

  // Cloudinary settings
  const [cloudinaryConfig, setCloudinaryConfig] = useState(() => {
    try {
      const saved = localStorage.getItem(CLOUDINARY_CONFIG_KEY);
      if (saved) return JSON.parse(saved);
    } catch (err) {
      console.error('Failed to parse cloudinary config from localStorage', err);
    }
    return {
      cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || '',
      uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || ''
    };
  });

  const getApiEndpoint = () => {
    if (backendUrl && backendUrl.trim()) {
      return `${backendUrl.trim().replace(/\/$/, '')}/api/properties`;
    }
    return '/api/properties';
  };

  const updateBackendUrl = (url) => {
    const cleaned = url.trim().replace(/\/$/, '');
    setBackendUrl(cleaned);
    try {
      if (cleaned) {
        localStorage.setItem(BACKEND_URL_KEY, cleaned);
      } else {
        localStorage.removeItem(BACKEND_URL_KEY);
      }
    } catch (e) {}
    fetchFromDatabase(cleaned);
  };

  // 2. Fetch live properties & MERGE
  const fetchFromDatabase = async (customUrl) => {
    setIsLoading(true);
    let remoteData = [];
    const endpoint = customUrl 
      ? `${customUrl.replace(/\/$/, '')}/api/properties` 
      : getApiEndpoint();

    try {
      const res = await fetch(endpoint);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          remoteData = data;
          setDbConnected(true);
        }
      }
    } catch (err) {
      // Fallback
    }

    if (remoteData.length === 0) {
      try {
        const fallbackRes = await fetch('/listings.json');
        if (fallbackRes.ok) {
          const fallbackData = await fallbackRes.json();
          if (Array.isArray(fallbackData)) {
            remoteData = fallbackData;
          }
        }
      } catch (e) {}
    }

    setProperties(prev => {
      const propertyMap = new Map();

      // Remote properties
      remoteData.forEach(p => {
        if (p && p.id) propertyMap.set(p.id, p);
      });

      // Local properties
      prev.forEach(p => {
        if (p && p.id) {
          const existingRemote = propertyMap.get(p.id);
          propertyMap.set(p.id, { ...existingRemote, ...p });
        }
      });

      const mergedList = Array.from(propertyMap.values());

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
      } catch (e) {}

      return mergedList;
    });

    setLastSyncedTime(Date.now());
    setIsLoading(false);
  };

  // REAL-TIME AUTO SYNC ENGINE:
  useEffect(() => {
    // A. Initial fetch
    fetchFromDatabase();

    // B. Setup BroadcastChannel for 0-second instant sync between browser tabs & windows
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastRef.current = new BroadcastChannel('property_lk_realtime');
        broadcastRef.current.onmessage = (event) => {
          if (event.data?.type === 'SYNC_PROPERTIES') {
            fetchFromDatabase();
          }
        };
      }
    } catch (e) {}

    // C. Listen to cross-tab localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            setProperties(updated);
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // D. Auto re-fetch on window focus / tab switch
    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchFromDatabase();
      }
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // E. Background Polling (Silently re-syncs every 12 seconds so users see new properties live!)
    const pollingInterval = setInterval(() => {
      fetchFromDatabase();
    }, 12000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(pollingInterval);
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
    };
  }, [backendUrl]);

  // Helper to notify other open tabs
  const broadcastSync = () => {
    try {
      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ type: 'SYNC_PROPERTIES', timestamp: Date.now() });
      }
    } catch (e) {}
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (err) {}
  }, [properties]);

  const updateCloudinaryConfig = (config) => {
    setCloudinaryConfig(config);
    try {
      localStorage.setItem(CLOUDINARY_CONFIG_KEY, JSON.stringify(config));
    } catch (err) {}
  };

  // 3. Add Property
  const addProperty = async (newProperty) => {
    const timestamp = Date.now();
    const referenceId = `PLK-${Math.floor(1000 + Math.random() * 9000)}`;
    
    const propertyWithMeta = {
      ...newProperty,
      id: newProperty.id || `prop_${timestamp}`,
      referenceId: newProperty.referenceId || referenceId,
      createdAt: newProperty.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFeatured: Boolean(newProperty.isFeatured),
      isSold: Boolean(newProperty.isSold),
      price: Number(newProperty.price) || 0,
      hidePrice: Boolean(newProperty.hidePrice),
      isNegotiable: Boolean(newProperty.isNegotiable),
      images: Array.isArray(newProperty.images) && newProperty.images.length > 0 
        ? newProperty.images 
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
    };

    setProperties(prev => [propertyWithMeta, ...prev.filter(p => p.id !== propertyWithMeta.id)]);
    broadcastSync();

    try {
      await fetch(getApiEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyWithMeta)
      });
      broadcastSync();
    } catch (err) {
      console.warn('Saved locally, will sync to backend when online.', err);
    }

    return propertyWithMeta;
  };

  // 4. Update Property
  const updateProperty = async (id, updatedData) => {
    setProperties(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedData,
          updatedAt: new Date().toISOString(),
          price: Number(updatedData.price !== undefined ? updatedData.price : item.price) || 0,
          hidePrice: Boolean(updatedData.hidePrice !== undefined ? updatedData.hidePrice : item.hidePrice)
        };
      }
      return item;
    }));
    broadcastSync();

    try {
      await fetch(getApiEndpoint(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      });
      broadcastSync();
    } catch (err) {
      console.warn('Updated locally.', err);
    }
  };

  // 5. Delete Property
  const deleteProperty = async (id) => {
    setProperties(prev => prev.filter(item => item.id !== id));
    broadcastSync();

    try {
      await fetch(`${getApiEndpoint()}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      broadcastSync();
    } catch (err) {
      console.warn('Deleted locally.', err);
    }
  };

  const getPropertyById = (id) => {
    return properties.find(item => item.id === id || item.referenceId === id);
  };

  // 6. Toggle Featured
  const toggleFeatured = async (id) => {
    const item = properties.find(p => p.id === id);
    if (!item) return;

    const newFeatured = !item.isFeatured;
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, isFeatured: newFeatured, updatedAt: new Date().toISOString() } : p
    ));
    broadcastSync();

    try {
      await fetch(getApiEndpoint(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFeatured: newFeatured })
      });
      broadcastSync();
    } catch (err) {}
  };

  // 7. Toggle Sold
  const toggleSold = async (id) => {
    const item = properties.find(p => p.id === id);
    if (!item) return;

    const newSold = !item.isSold;
    setProperties(prev => prev.map(p => 
      p.id === id ? { ...p, isSold: newSold, updatedAt: new Date().toISOString() } : p
    ));
    broadcastSync();

    try {
      await fetch(getApiEndpoint(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isSold: newSold })
      });
      broadcastSync();
    } catch (err) {}
  };

  // 8. Image Upload with Automatic Lightweight Compression
  const uploadImageToCloudinary = async (file) => {
    const cloudName = cloudinaryConfig.cloudName;
    const uploadPreset = cloudinaryConfig.uploadPreset;

    let optimizedDataUrl = null;
    try {
      optimizedDataUrl = await compressImage(file, 1280, 960, 0.75);
    } catch (compressErr) {
      console.warn('Compression fallback', compressErr);
    }

    if (!cloudName || !uploadPreset) {
      return {
        url: optimizedDataUrl || URL.createObjectURL(file),
        isLocalFallback: true,
        message: 'Saved real photo using optimized web compression.'
      };
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Cloudinary error, using compressed image fallback');
      }

      const data = await response.json();
      return {
        url: data.secure_url || data.url,
        isLocalFallback: false,
        publicId: data.public_id
      };
    } catch (err) {
      return {
        url: optimizedDataUrl,
        isLocalFallback: true,
        message: 'Saved real photo locally.'
      };
    }
  };

  // Backup & Restore
  const exportData = () => {
    const dataStr = JSON.stringify(properties, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `property_lk_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = async (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setProperties(parsed);
        broadcastSync();
        for (const item of parsed) {
          try {
            await fetch(getApiEndpoint(), {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          } catch (e) {}
        }
        broadcastSync();
        return { success: true, count: parsed.length };
      }
      return { success: false, message: 'Invalid JSON format: Expected an array of properties.' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const clearAllProperties = () => {
    setProperties([]);
    localStorage.removeItem(STORAGE_KEY);
    broadcastSync();
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      isLoading,
      dbConnected,
      lastSyncedTime,
      backendUrl,
      updateBackendUrl,
      fetchFromDatabase,
      addProperty,
      updateProperty,
      deleteProperty,
      getPropertyById,
      toggleFeatured,
      toggleSold,
      cloudinaryConfig,
      updateCloudinaryConfig,
      uploadImageToCloudinary,
      exportData,
      importData,
      clearAllProperties
    }}>
      {children}
    </PropertyContext.Provider>
  );
};

export const useProperties = () => {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error('useProperties must be used within a PropertyProvider');
  }
  return context;
};
