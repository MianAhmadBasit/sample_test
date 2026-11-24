import { useEffect } from 'react';

interface SEOOptions {
  title: string;
  description: string;
  canonicalPath?: string;
  ogType?: 'website' | 'product' | 'article';
  ogImage?: string;
  structuredData?: Record<string, unknown> | Array<Record<string, unknown>>;
}

function setMetaTag(selector: string, attributeName: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attributeName, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSEO({
  title,
  description,
  canonicalPath,
  ogType = 'website',
  ogImage = '/src/assets/images/hero_skincare_editorial_1795341252134.jpg',
  structuredData,
}: SEOOptions) {
  useEffect(() => {
    const fullTitle = title.includes('LUMÉRA SKIN') ? title : `${title} | LUMÉRA SKIN`;
    document.title = fullTitle;

    const currentUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${canonicalPath ?? window.location.pathname}`
        : canonicalPath ?? '/';

    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', ogType);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', ogImage);
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', ogImage);

    let canonicalLink = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentUrl);

    const scriptId = 'lumera-dynamic-jsonld';
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    if (structuredData) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    return () => {
      const dynamicScript = document.getElementById(scriptId);
      if (dynamicScript) {
        dynamicScript.remove();
      }
    };
  }, [title, description, canonicalPath, ogType, ogImage, structuredData]);
}
