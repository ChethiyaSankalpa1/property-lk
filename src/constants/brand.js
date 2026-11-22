export const BRAND = {
  name: "PROPERTY LK",
  tagline: "Sri Lanka's Premier Real Estate & Antiques Marketplace",
  phone: "+94 71 654 5457",
  phoneRaw: "+94716545457",
  whatsappNumber: "94716545457",
  whatsappUrl: "https://wa.me/94716545457",
  email: "info@propertylk.com",
  location: "Colombo, Sri Lanka",
  currency: "LKR",
  currencySymbol: "Rs.",
  
  // Standard inquiry templates
  defaultInquiryMessage: "Hello PROPERTY LK, I am interested in your property services. Please provide more information.",
  
  // Helper to build WhatsApp link
  createWhatsAppLink: (customMessage) => {
    const text = encodeURIComponent(customMessage || BRAND.defaultInquiryMessage);
    return `https://wa.me/${BRAND.whatsappNumber}?text=${text}`;
  },

  // Helper for property & antique specific WhatsApp inquiry
  createPropertyInquiryLink: (property) => {
    const priceText = property.hidePrice 
      ? 'Price on Request / Inquire directly' 
      : property.price ? `Rs. ${Number(property.price).toLocaleString('en-LK')}` : 'Price on Request';

    const message = `Hello PROPERTY LK,\n\nI am interested in this listing:\n- Title: ${property.title}\n- Category: ${property.category}\n- Ref ID: ${property.referenceId || property.id}\n- Price: ${priceText}\n- Location: ${property.city ? `${property.city}, ` : ''}${property.district}\n\nPlease provide more details, photos, and arrange an inspection.`;
    return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },

  // Helper for Sell Property inquiry (optionally carries uploaded photo links + a listing reference)
  createSellPropertyLink: (formData, options = {}) => {
    const { imageUrls = [], referenceId = '', attachManually = false } = options;

    let message = `*PROPERTY LK - SELL LISTING INQUIRY*\n`;
    if (referenceId) {
      message += `*Listing Ref:* ${referenceId}\n`;
    }
    message += `\n` +
      `*Full Name:* ${formData.fullName}\n` +
      `*WhatsApp:* ${formData.whatsappNumber}\n` +
      `*Item/Property Type:* ${formData.propertyType}\n` +
      `*District:* ${formData.district}\n` +
      `*Location/City:* ${formData.location}\n` +
      `*Expected Price (LKR):* ${formData.expectedPrice || 'Contact for Price'}\n` +
      `*Description:* ${formData.description}\n`;

    if (imageUrls.length > 0) {
      message += `\n*Property Photos (${imageUrls.length}) - Ref ${referenceId || 'n/a'}:*\n`;
      message += imageUrls.map((url, index) => `${index + 1}. ${url}`).join('\n');
      message += '\n';
    } else if (attachManually) {
      message += `\n*Property Photos:* I have photos to share and will attach them here in this chat.\n`;
    }

    message += `\nPlease contact me regarding listing this item.`;
    return `https://wa.me/${BRAND.whatsappNumber}?text=${encodeURIComponent(message)}`;
  },

  // Formatter for LKR price with support for hidePrice
  formatPrice: (price, isNegotiable = false, hidePrice = false) => {
    if (hidePrice) return 'Price on Request';
    if (!price && price !== 0) return 'Price on Request';
    const num = Number(price);
    if (isNaN(num) || num <= 0) return 'Price on Request';

    let formatted = `Rs. ${num.toLocaleString('en-LK')}`;
    
    // Add short millions/lakhs representation for large numbers in badges
    if (num >= 10000000) {
      const millions = (num / 1000000).toFixed(1).replace(/\.0$/, '');
      formatted = `Rs. ${millions} Million`;
    } else if (num >= 1000000) {
      const millions = (num / 1000000).toFixed(2).replace(/\.00$/, '');
      formatted = `Rs. ${millions} Million`;
    } else if (num >= 100000) {
      const lakhs = (num / 100000).toFixed(1).replace(/\.0$/, '');
      formatted = `Rs. ${lakhs} Lakhs`;
    }

    return isNegotiable ? `${formatted} (Negotiable)` : formatted;
  },

  formatFullPrice: (price, hidePrice = false) => {
    if (hidePrice) return 'Price on Request';
    if (!price && price !== 0) return 'Price on Request';
    const num = Number(price);
    if (isNaN(num) || num <= 0) return 'Price on Request';
    return `Rs. ${num.toLocaleString('en-LK')}`;
  }
};
