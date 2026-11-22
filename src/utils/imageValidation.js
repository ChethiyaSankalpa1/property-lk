// Shared image rules used by the customer "Sell Property" flow and the admin uploader.
export const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5 MB per image
export const MAX_CUSTOMER_IMAGES = 6;

// Common formats accepted on Android, iPhone and desktop browsers.
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/avif'
];

export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif', 'avif'];

export const humanFileSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const getExtension = (name = '') => name.split('.').pop().toLowerCase();

/**
 * Validates a single selected image file.
 * iOS/Android sometimes report an empty mime type, so the file extension is used as a fallback.
 */
export const validateImageFile = (file) => {
  if (!file) {
    return { valid: false, error: 'No file selected.' };
  }

  const extension = getExtension(file.name);
  const hasValidType = ALLOWED_IMAGE_TYPES.includes((file.type || '').toLowerCase());
  const hasValidExtension = ALLOWED_IMAGE_EXTENSIONS.includes(extension);

  if (!hasValidType && !hasValidExtension) {
    return {
      valid: false,
      error: `Unsupported format for "${file.name}". Please use JPG, PNG, WEBP, HEIC or AVIF.`
    };
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return {
      valid: false,
      error: `"${file.name}" is ${humanFileSize(file.size)}. Maximum allowed size is ${humanFileSize(MAX_IMAGE_BYTES)} per photo.`
    };
  }

  if (file.size === 0) {
    return { valid: false, error: `"${file.name}" appears to be empty or unreadable.` };
  }

  return { valid: true, error: '' };
};
