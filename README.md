# PROPERTY LK – Premium Sri Lankan Property & Antiques Marketplace

A modern, highly animated real estate and luxury asset marketplace designed specifically for Sri Lanka. Built with **React.js**, **Vite**, **Tailwind CSS**, and **Framer Motion**, ready for instant zero-configuration deployment to **Vercel**.

---

## 🌟 Key Highlights & Features

- **Brand Identity**: PROPERTY LK – Sri Lanka's Premier Real Estate & Asset Marketplace.
- **Official Contact & WhatsApp**: **+94 71 654 5457** (`https://wa.me/94716545457`).
- **Zero Fake Listings Guarantee**: The website starts with **0 properties** out of the box. No fake, demonstration, or randomly generated listings.
- **Stunning Empty State**: When no listings are present, an elegant animated empty state welcomes prospective clients to connect on WhatsApp or submit their property.
- **Privacy & "Price on Request" Mode**: Sell **Lands**, **Antique Items**, **Houses**, and **Commercial Assets** with hidden public price listings ("Price on Request") so buyers can see images, location, and specs while inquiring directly over WhatsApp.
- **Curated Asset Categories**:
  - Houses & Luxury Residencies
  - Lands (Residential & Commercial Plots)
  - Antique Items (Colonial Furniture, Heirloom Collectibles)
  - Villas & Coastal Estates
  - Hotels & Boutique Resorts
  - Bars, Lounges & Nightlife Establishments
  - Apartments & Condominiums
  - Commercial Properties & Warehouses
  - Shops & Retail Spaces
  - Agricultural & Plantation Lands
- **All 25 Sri Lankan Districts**: Comprehensive coverage with district-level filtering across all provinces.
- **100% Mobile Responsive**: Tested fluid design on phones, tablets, and desktops with smooth Framer Motion mobile menus and touch filters.
- **Direct WhatsApp Workflows**:
  - Floating WhatsApp button on every public page.
  - Property-specific inquiries with pre-filled title and reference ID.
  - "Sell Your Property" form triggers direct pre-formatted WhatsApp submission with zero account registration friction.

---

## 🔐 Architecture & Admin Prototype Transparency

- **Frontend-Only**: No Node.js backend server, no Express, no MongoDB, no MySQL.
- **Data Persistence**: Uses browser **LocalStorage** (`property_lk_listings`). Changes made in the Admin panel persist in your browser.
- **Multi-Device Notice**: LocalStorage is browser-specific. To synchronize across multiple devices or team members, use the built-in **JSON Backup & Restore** feature in Admin Settings, or connect a backend database in future phases.
- **Prototype Authentication**: Admin access uses client-side LocalStorage verification (Default PIN: `admin123`). This is clearly documented as a prototype intended for demonstration and private browser administration.

---

## 🚀 Instant Vercel Deployment

1. Push this repository to GitHub or upload to Vercel.
2. In Vercel, select **Vite** as the framework preset:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. The included `vercel.json` ensures full Single Page Application (SPA) routing with rewrites:
   ```json
   {
     "rewrites": [
       { "source": "/(.*)", "destination": "/index.html" }
     ]
   }
   ```
   Refreshing `/property/:id`, `/properties`, or `/admin` will never trigger a 404 error on Vercel.

---

## 🛠️ Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## 🔑 Admin Console

- **Access URL**: `/admin` (or `/admin/login`)
- **Default Password / PIN**: `admin123` (can be changed in Admin Settings)
- **Features**:
  - Add, edit, and delete properties
  - Toggle **Featured** or **Sold Out** status
  - Toggle **Hide Price / "Price on Request"**
  - Upload multiple photos via **Cloudinary unsigned preset** or direct image URLs (with auto-preview fallback)
  - Live preview modal before publishing
  - Export and restore JSON data backups

---

## ☁️ Cloudinary Setup (Optional for Image Uploads)

To enable direct cloud uploads without exposing API secrets:
1. Create a free account at [Cloudinary](https://cloudinary.com).
2. Go to **Settings** &rarr; **Upload** &rarr; **Upload Presets** &rarr; Click **Add upload preset**.
3. Set **Signing Mode** to **Unsigned**.
4. Set an unsigned preset name (e.g., `property_lk_unsigned`).
5. In PROPERTY LK Admin Settings (`/admin/settings`), enter your **Cloud Name** and **Upload Preset**.
