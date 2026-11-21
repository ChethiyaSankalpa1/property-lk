import React, { createContext, useContext, useState, useEffect } from 'react';

const PropertyContext = createContext();

const STORAGE_KEY = 'property_lk_listings';
const CLOUDINARY_CONFIG_KEY = 'property_lk_cloudinary_config';

export const PropertyProvider = ({ children }) => {
  // STRICT REQUIREMENT: Initial state is empty array. No fake, sample or generated properties.
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

  // Persist properties to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(properties));
    } catch (err) {
      console.error('Failed to save properties to localStorage', err);
    }
  }, [properties]);

  // Persist Cloudinary config
  const updateCloudinaryConfig = (config) => {
    setCloudinaryConfig(config);
    try {
      localStorage.setItem(CLOUDINARY_CONFIG_KEY, JSON.stringify(config));
    } catch (err) {
      console.error('Failed to save cloudinary config to localStorage', err);
    }
  };

  // Add new property
  const addProperty = (newProperty) => {
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
      isNegotiable: Boolean(newProperty.isNegotiable),
      images: Array.isArray(newProperty.images) && newProperty.images.length > 0 
        ? newProperty.images 
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
    };

    setProperties(prev => [propertyWithMeta, ...prev]);
    return propertyWithMeta;
  };

  // Update existing property
  const updateProperty = (id, updatedData) => {
    setProperties(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          ...updatedData,
          updatedAt: new Date().toISOString(),
          price: Number(updatedData.price !== undefined ? updatedData.price : item.price) || 0
        };
      }
      return item;
    }));
  };

  // Delete property
  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(item => item.id !== id));
  };

  // Get single property
  const getPropertyById = (id) => {
    return properties.find(item => item.id === id || item.referenceId === id);
  };

  // Toggle Featured status
  const toggleFeatured = (id) => {
    setProperties(prev => prev.map(item => 
      item.id === id ? { ...item, isFeatured: !item.isFeatured, updatedAt: new Date().toISOString() } : item
    ));
  };

  // Toggle Sold status
  const toggleSold = (id) => {
    setProperties(prev => prev.map(item => 
      item.id === id ? { ...item, isSold: !item.isSold, updatedAt: new Date().toISOString() } : item
    ));
  };

  // Unsigned Cloudinary Upload helper
  const uploadImageToCloudinary = async (file) => {
    const cloudName = cloudinaryConfig.cloudName;
    const uploadPreset = cloudinaryConfig.uploadPreset;

    if (!cloudName || !uploadPreset) {
      // Fallback: convert file to local base64 preview so user can test seamlessly
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            url: reader.result,
            isLocalFallback: true,
            message: 'Saved locally as preview. Configure Cloudinary in Admin Settings for cloud hosting.'
          });
        };
        reader.readAsDataURL(file);
      });
    }

    // Direct unsigned upload to Cloudinary (no secret keys exposed)
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

  const importData = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        setProperties(parsed);
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
