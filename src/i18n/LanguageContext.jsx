import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import en from './locales/en';
import si from './locales/si';
import { PROPERTY_CATEGORIES } from '../constants/categories';

const STORAGE_KEY = 'property_lk_language';

const DICTIONARIES = { en, si };

export const DEFAULT_LANGUAGE = 'en';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', short: 'EN' },
  { code: 'si', label: 'Sinhala', nativeLabel: 'සිංහල', short: 'සිං' },
];

export const isSupportedLanguage = (code) =>
  typeof code === 'string' && Object.prototype.hasOwnProperty.call(DICTIONARIES, code);

/**
 * Resolves the language to use on first paint:
 * 1. the visitor's saved choice, 2. their browser preference, 3. English.
 */
export const readStoredLanguage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(stored)) return stored;
  } catch (err) {
    /* storage can be blocked (private mode) - fall through to detection */
  }

  try {
    const candidates = [navigator.language, ...(navigator.languages || [])].filter(Boolean);
    if (candidates.some((code) => String(code).toLowerCase().startsWith('si'))) {
      return 'si';
    }
  } catch (err) {
    /* navigator is always present in browsers - defensive only */
  }

  return DEFAULT_LANGUAGE;
};

const applyLanguageToDocument = (lang) => {
  if (typeof document === 'undefined') return;
  document.documentElement.lang = lang;
  document.documentElement.setAttribute('data-lang', lang);
};

// Applied once at module load so the <html> element carries the correct
// language (and therefore the correct Sinhala font stack) before first paint.
const INITIAL_LANGUAGE = readStoredLanguage();
applyLanguageToDocument(INITIAL_LANGUAGE);

const lookup = (source, path) => {
  if (!source || !path) return undefined;
  return String(path)
    .split('.')
    .reduce((acc, part) => {
      if (acc && typeof acc === 'object' && part in acc) return acc[part];
      return undefined;
    }, source);
};

const interpolate = (template, params) => {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) =>
    params[key] === undefined || params[key] === null ? match : String(params[key])
  );
};

// Maps every spelling of a category (id, plural name, singular name) to its id.
const CATEGORY_BY_ALIAS = PROPERTY_CATEGORIES.reduce((acc, category) => {
  [category.id, category.name, category.singular].forEach((alias) => {
    if (alias) acc[String(alias).toLowerCase()] = category.id;
  });
  return acc;
}, {});

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(INITIAL_LANGUAGE);

  useEffect(() => {
    applyLanguageToDocument(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (err) {
      /* preference is not critical - ignore blocked storage */
    }
  }, [lang]);

  const setLang = useCallback((next) => {
    setLangState((current) => (isSupportedLanguage(next) ? next : current));
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((current) => (current === 'en' ? 'si' : 'en'));
  }, []);

  const value = useMemo(() => {
    const dictionary = DICTIONARIES[lang] || DICTIONARIES[DEFAULT_LANGUAGE];

    const t = (key, params) => {
      if (key === undefined || key === null || key === '') return '';
      const found = lookup(dictionary, key);
      const raw = found === undefined ? lookup(DICTIONARIES[DEFAULT_LANGUAGE], key) : found;
      if (raw === undefined) return String(key);
      if (typeof raw === 'string') return interpolate(raw, params);
      return raw;
    };

    // Falls back to the raw value for anything not covered by the catalogue
    // (e.g. an admin-typed city) instead of leaking a translation key.
    const resolvedLabel = (key, fallback) => {
      const label = t(key);
      return label === key ? String(fallback) : label;
    };

    const districtLabel = (name) => (name ? resolvedLabel(`data.district.${name}`, name) : '');

    const provinceLabel = (name) => (name ? resolvedLabel(`data.province.${name}`, name) : '');

    const categoryId = (value) => {
      if (!value) return '';
      return CATEGORY_BY_ALIAS[String(value).toLowerCase()] || String(value);
    };

    const categoryLabel = (value) =>
      value ? resolvedLabel(`data.category.${categoryId(value)}.name`, value) : '';

    const categoryValue = (value, field = 'name') =>
      value ? resolvedLabel(`data.category.${categoryId(value)}.${field}`, value) : '';

    // Localised mirror of BRAND.formatPrice (kept in sync with the admin copy).
    const formatPrice = (price, options = {}) => {
      const { isNegotiable = false, hidePrice = false } = options;
      const onRequest = t('common.priceOnRequest');

      if (hidePrice) return onRequest;
      if (price === null || price === undefined || price === '') return onRequest;

      const num = Number(price);
      if (Number.isNaN(num) || num <= 0) return onRequest;

      const symbol = t('common.currency.symbol');
      let formatted = `${symbol} ${num.toLocaleString('en-LK')}`;

      if (num >= 1000000) {
        const millions = (num / 1000000).toFixed(num >= 10000000 ? 1 : 2).replace(/\.0+$/, '');
        formatted = `${symbol} ${t('common.units.million')} ${millions}`;
      } else if (num >= 100000) {
        const lakhs = (num / 100000).toFixed(1).replace(/\.0+$/, '');
        formatted = `${symbol} ${t('common.units.lakhs')} ${lakhs}`;
      }

      return isNegotiable ? `${formatted} (${t('common.negotiable')})` : formatted;
    };

    const formatFullPrice = (price, hidePrice = false) => {
      const onRequest = t('common.priceOnRequest');
      if (hidePrice) return onRequest;
      const num = Number(price);
      if (price === null || price === undefined || price === '' || Number.isNaN(num) || num <= 0) {
        return onRequest;
      }
      return `${t('common.currency.symbol')} ${num.toLocaleString('en-LK')}`;
    };

    const languageOption =
      SUPPORTED_LANGUAGES.find((item) => item.code === lang) || SUPPORTED_LANGUAGES[0];

    return {
      lang,
      locale: lang === 'si' ? 'si-LK' : 'en-LK',
      isSinhala: lang === 'si',
      languages: SUPPORTED_LANGUAGES,
      languageLabel: languageOption.nativeLabel,
      setLang,
      toggleLang,
      t,
      districtLabel,
      provinceLabel,
      categoryLabel,
      categoryValue,
      formatPrice,
      formatFullPrice,
    };
  }, [lang, setLang, toggleLang]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
      <span className="sr-only" role="status" aria-live="polite">
        {value.t('common.language.selected', { language: value.languageLabel })}
      </span>
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
