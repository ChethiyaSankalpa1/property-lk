import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { compressImage } from '../utils/imageCompressor';

const PropertyContext = createContext();

const STORAGE_KEY = 'property_lk_listings';
const DELETED_IDS_KEY = 'property_lk_deleted_ids';
const CLOUDINARY_CONFIG_KEY = 'property_lk_cloudinary_config';
const BACKEND_URL_KEY = 'property_lk_backend_url';

// Helper to get blacklist of deleted IDs
const getDeletedIdsSet = () => {
  try {
    const saved = localStorage.getItem(DELETED_IDS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return new Set(parsed.map(String));
    }
  } catch (err) {
    console.warn('Error reading deleted IDs', err);
  }
  return new Set();
};

const saveDeletedId = (id) => {
  if (!id) return;
  try {
    const set = getDeletedIdsSet();
    set.add(String(id));
    localStorage.setItem(DELETED_IDS_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {}
};

export const PropertyProvider = ({ children }) => {
  // 1. Initial State from LocalStorage cache with safety filtering
  const [properties, setProperties] = useState(() => {
    try {
      const deletedSet = getDeletedIdsSet();
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => 
            p && 
            p.id && 
            !deletedSet.has(String(p.id)) && 
            (!p.referenceId || !deletedSet.has(String(p.referenceId)))
          );
        }
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

  const getApiEndpoint = useCallback(() => {
    if (backendUrl && backendUrl.trim()) {
      return `${backendUrl.trim().replace(/\/$/, '')}/api/properties`;
    }
    return '/api/properties';
  }, [backendUrl]);

  const updateBackendUrl = (url) => {
    const cleaned = (url || '').trim().replace(/\/$/, '');
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

  // 2. Fetch live properties & MERGE safely
  const fetchFromDatabase = useCallback(async (customUrl) => {
    setIsLoading(true);
    let remoteData = [];
    const endpoint = customUrl 
      ? `${customUrl.replace(/\/$/, '')}/api/properties` 
      : getApiEndpoint();

    try {
      const res = await fetch(endpoint, {
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          remoteData = data;
          setDbConnected(true);
        }
      }
    } catch (err) {
      // Offline or network error - continue to local fallback
    }

    // Only fallback to listings.json if DB returned nothing and we haven't deleted everything
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

    const deletedSet = getDeletedIdsSet();

    setProperties(prev => {
      const propertyMap = new Map();

      // Filter remote data against deleted IDs blacklist and nulls
      remoteData.forEach(p => {
        if (p && p.id && !deletedSet.has(String(p.id)) && (!p.referenceId || !deletedSet.has(String(p.referenceId)))) {
          propertyMap.set(String(p.id), p);
        }
      });

      // Overlay locally saved updates/properties if not deleted
      (prev || []).forEach(p => {
        if (p && p.id && !deletedSet.has(String(p.id)) && (!p.referenceId || !deletedSet.has(String(p.referenceId)))) {
          const existingRemote = propertyMap.get(String(p.id));
          propertyMap.set(String(p.id), { ...(existingRemote || {}), ...p });
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
  }, [getApiEndpoint]);

  // REAL-TIME AUTO SYNC ENGINE:
  useEffect(() => {
    fetchFromDatabase();

    // Setup BroadcastChannel for 0-second instant sync between browser tabs & windows
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastRef.current = new BroadcastChannel('property_lk_realtime');
        broadcastRef.current.onmessage = (event) => {
          if (event.data?.type === 'SYNC_PROPERTIES') {
            fetchFromDatabase();
          } else if (event.data?.type === 'PROPERTY_DELETED' && event.data?.id) {
            const delId = String(event.data.id);
            setProperties(prev => (prev || []).filter(item => item && String(item.id) !== delId));
          }
        };
      }
    } catch (e) {}

    // Listen to cross-tab localStorage changes
    const handleStorageChange = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const updated = JSON.parse(e.newValue);
          if (Array.isArray(updated)) {
            const deletedSet = getDeletedIdsSet();
            setProperties(updated.filter(p => p && p.id && !deletedSet.has(String(p.id))));
          }
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    // Auto re-fetch on window focus / tab switch
    const handleVisibilityOrFocus = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchFromDatabase();
      }
    };
    window.addEventListener('focus', handleVisibilityOrFocus);
    document.addEventListener('visibilitychange', handleVisibilityOrFocus);

    // Background Polling (every 15 seconds)
    const pollingInterval = setInterval(() => {
      fetchFromDatabase();
    }, 15000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      clearInterval(pollingInterval);
      if (broadcastRef.current) {
        broadcastRef.current.close();
      }
    };
  }, [fetchFromDatabase]);

  // Helper to notify other open tabs
  const broadcastSync = (payload = { type: 'SYNC_PROPERTIES' }) => {
    try {
      if (broadcastRef.current) {
        broadcastRef.current.postMessage({ ...payload, timestamp: Date.now() });
      }
    } catch (e) {}
  };

  // Sync state changes to localStorage safely
  useEffect(() => {
    try {
      if (Array.isArray(properties)) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
      }
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

    setProperties(prev => [propertyWithMeta, ...(prev || []).filter(p => p && p.id !== propertyWithMeta.id)]);
    broadcastSync();

    try {
      await fetch(getApiEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyWithMeta)
      });
      broadcastSync();
    } catch (err) {
      console.warn('Saved locally, will sync when online.', err);
    }

    return propertyWithMeta;
  };

  // 4. Update Property
  const updateProperty = async (id, updatedData) => {
    setProperties(prev => (prev || []).map(item => {
      if (item && item.id === id) {
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

  // 5. Delete Property (Bulletproof with Tombstone / Blacklist)
  const deleteProperty = async (id) => {
    if (!id) return;
    const strId = String(id);

    // 1. Mark as deleted in permanent blacklist
    saveDeletedId(strId);

    // 2. Remove from memory and update localStorage immediately
    setProperties(prev => {
      const next = (prev || []).filter(item => item && String(item.id) !== strId && String(item.referenceId) !== strId);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // 3. Broadcast to other tabs instantly
    broadcastSync({ type: 'PROPERTY_DELETED', id: strId });

    // 4. Remote delete from database
    try {
      await fetch(`${getApiEndpoint()}?id=${encodeURIComponent(strId)}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: strId })
      });
    } catch (err) {
      console.warn('Deleted locally. Remote deletion will sync once connection is restored.', err);
    }
  };

  const getPropertyById = (id) => {
    if (!id) return null;
    const strId = String(id);
    return (properties || []).find(item => item && (String(item.id) === strId || String(item.referenceId) === strId));
  };

  // 6. Toggle Featured
  const toggleFeatured = async (id) => {
    const item = (properties || []).find(p => p && p.id === id);
    if (!item) return;

    const newFeatured = !item.isFeatured;
    setProperties(prev => (prev || []).map(p => 
      p && p.id === id ? { ...p, isFeatured: newFeatured, updatedAt: new Date().toISOString() } : p
    ));
    broadcastSync();

    try {
      await fetch(getApiEndpoint(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFeatured: newFeatured })
      });
    } catch (err) {}
  };

  // 7. Toggle Sold
  const toggleSold = async (id) => {
    const item = (properties || []).find(p => p && p.id === id);
    if (!item) return;

    const newSold = !item.isSold;
    setProperties(prev => (prev || []).map(p => 
      p && p.id === id ? { ...p, isSold: newSold, updatedAt: new Date().toISOString() } : p
    ));
    broadcastSync();

    try {
      await fetch(getApiEndpoint(), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isSold: newSold })
      });
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
    const dataStr = JSON.stringify(properties || [], null, 2);
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
    (properties || []).forEach(p => {
      if (p && p.id) saveDeletedId(p.id);
    });
    setProperties([]);
    localStorage.removeItem(STORAGE_KEY);
    broadcastSync();
  };

  return (
    <PropertyContext.Provider value={{
      properties: properties || [],
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
