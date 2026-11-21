import React, { createContext, useContext, useState, useEffect } from 'react';

const PropertyContext = createContext();

const STORAGE_KEY = 'property_lk_listings';
const CLOUDINARY_CONFIG_KEY = 'property_lk_cloudinary_config';

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

  // 2. Fetch live properties & MERGE so local admin additions are NEVER lost
  const fetchFromDatabase = async () => {
    setIsLoading(true);
    let remoteData = [];

    try {
      const res = await fetch('/api/properties');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          remoteData = data;
          setDbConnected(true);
        }
      }
    } catch (err) {
      console.warn('API error, falling back to listings.json', err);
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

    // MERGE logic: Keep every property from local storage AND remote database
    setProperties(prev => {
      const propertyMap = new Map();

      // First add remote properties
      remoteData.forEach(p => {
        if (p && p.id) propertyMap.set(p.id, p);
      });

      // Then merge local properties (local edits take priority and newly added items are preserved!)
      prev.forEach(p => {
        if (p && p.id) {
          const existingRemote = propertyMap.get(p.id);
          propertyMap.set(p.id, { ...existingRemote, ...p });
        }
      });

      const mergedList = Array.from(propertyMap.values());

      // If there are local properties not yet saved in MongoDB, auto-sync them to MongoDB
      const remoteIds = new Set(remoteData.map(r => r.id));
      prev.forEach(localItem => {
        if (!remoteIds.has(localItem.id)) {
          fetch('/api/properties', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(localItem)
          }).catch(() => {});
        }
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedList));
      } catch (e) {}

      return mergedList;
    });

    setIsLoading(false);
  };

  useEffect(() => {
    fetchFromDatabase();
  }, []);

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

  // 3. Add Property (Saves to MongoDB Atlas & Local State)
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

    // Update UI immediately (optimistic UI)
    setProperties(prev => [propertyWithMeta, ...prev.filter(p => p.id !== propertyWithMeta.id)]);

    // Save to MongoDB Atlas via /api/properties
    try {
      await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(propertyWithMeta)
      });
    } catch (err) {
      console.warn('Saved locally, will sync to MongoDB when online.', err);
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

    try {
      await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData })
      });
    } catch (err) {
      console.warn('Updated locally, will sync to MongoDB when online.', err);
    }
  };

  // 5. Delete Property
  const deleteProperty = async (id) => {
    setProperties(prev => prev.filter(item => item.id !== id));

    try {
      await fetch(`/api/properties?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
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

    try {
      await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isFeatured: newFeatured })
      });
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

    try {
      await fetch('/api/properties', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, isSold: newSold })
      });
    } catch (err) {}
  };

  // Cloudinary Upload
  const uploadImageToCloudinary = async (file) => {
    const cloudName = cloudinaryConfig.cloudName;
    const uploadPreset = cloudinaryConfig.uploadPreset;

    if (!cloudName || !uploadPreset) {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result,
            isLocalFallback: true,
            message: 'Preview mode: Configure Cloudinary in Admin Settings for cloud hosting.'
          });
        };
        reader.readAsDataURL(file);
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || 'Failed to upload image to Cloudinary');
    }

    const data = await response.json();
    return {
      url: data.secure_url || data.url,
      isLocalFallback: false,
      publicId: data.public_id
    };
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
        // Save to MongoDB
        for (const item of parsed) {
          try {
            await fetch('/api/properties', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(item)
            });
          } catch (e) {}
        }
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
  };

  return (
    <PropertyContext.Provider value={{
      properties,
      isLoading,
      dbConnected,
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
