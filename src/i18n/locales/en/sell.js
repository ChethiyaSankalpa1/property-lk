// Customer "Sell My Property" flow. English is the reference catalogue.
export default {
  hero: {
    badge: 'Direct Seller Service',
    titlePrefix: 'Sell Your',
    titleGradient: 'Property',
    titleSuffix: 'in Sri Lanka',
    subtitle:
      'Connect directly with verified property buyers. Add your details and photos below to instantly start an official WhatsApp listing consultation with PROPERTY LK.',
  },
  notice: {
    title: 'Zero Account Friction & Immediate WhatsApp Routing',
    body: 'You do not need to register an account or remember passwords. Submitting this form opens your official WhatsApp chat with pre-formatted property specs and your photo links sent to our verified desk ({{phone}}).',
  },
  success: {
    title: 'Thank you for contacting PROPERTY LK.',
    subtitle: 'We will contact you through WhatsApp.',
    referencePrefix: 'Listing reference ',
    referenceSuffix:
      ". If your WhatsApp didn't open automatically, use the button below to send your details again anytime.",
    photoLinksOne: '{{count}} photo link is included in your WhatsApp message.',
    photoLinksOther: '{{count}} photo links are included in your WhatsApp message.',
    manualAttachOne:
      'WhatsApp does not allow a website to attach image files automatically. Your {{count}} photo is still ready below - please tap the attach (📎) button in the WhatsApp chat and add it so we can publish your listing.',
    manualAttachOther:
      'WhatsApp does not allow a website to attach image files automatically. Your {{count}} photos are still ready below - please tap the attach (📎) button in the WhatsApp chat and add them so we can publish your listing.',
    openWhatsapp: 'Open WhatsApp Again',
    submitAnother: 'Submit Another Property',
  },
  form: {
    fullName: 'Full Name',
    whatsappNumber: 'WhatsApp Number',
    propertyType: 'Property Type',
    district: 'District',
    location: 'Location / City',
    expectedPrice: 'Expected Selling Price (LKR)',
    photos: 'Property Photos',
    photosUpTo: '(up to {{max}})',
    description: 'Property Description & Specifications',
  },
  placeholders: {
    fullName: 'e.g. Kasun Perera',
    whatsappNumber: 'e.g. +94 77 123 4567',
    location: 'e.g. Rajagiriya, Negombo Road, Kandy Town',
    expectedPrice: 'e.g. 45,000,000 or 4.5 Crore',
    description:
      'Detail land size in perches, number of bedrooms, house square footage, access road width, water/electricity availability, clear deed details, etc.',
  },
  photos: {
    counter: '{{count}}/{{max}} added · max {{size}} each',
    selectAria: 'Select property photos',
    choose: 'Choose Photos',
    hint: 'Tap to open your camera or gallery. JPG, PNG, WEBP, HEIC and AVIF are supported.',
    maxReached: 'You can upload up to {{max}} photos. Remove a photo to add another.',
    limitReached: 'Only the first {{max}} photos were added (maximum reached).',
    main: 'Main',
    attachInChat: 'Attach in chat',
    removeAria: 'Remove {{name}}',
    moreAvailableOne: 'You can add {{count}} more photo. The first photo is used as the main image.',
    moreAvailableOther: 'You can add {{count}} more photos. The first photo is used as the main image.',
    maxReachedNote: 'Maximum number of photos reached.',
  },
  validation: {
    noFile: 'No file selected.',
    unsupportedFormat: 'Unsupported format for "{{name}}". Please use JPG, PNG, WEBP, HEIC or AVIF.',
    tooLarge: '"{{name}}" is {{size}}. Maximum allowed size is {{max}} per photo.',
    empty: '"{{name}}" appears to be empty or unreadable.',
  },
  errors: {
    fullName: 'Please enter your full name.',
    whatsapp: 'Please provide your WhatsApp contact number.',
    location: 'Please provide the location or city where the property is located.',
    price: 'Please state your expected selling price.',
  },
  actions: {
    uploading: 'Uploading photos {{current}}/{{total}}',
    submit: 'Submit Property',
  },
  footer: 'Submissions open WhatsApp directly with official representative: {{phone}}',
};
