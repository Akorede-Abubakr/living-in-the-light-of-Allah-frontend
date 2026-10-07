import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  article?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description = 'A curated digital bookstore and immersive reading platform for seekers of timeless ideas, knowledge, philosophy, and spiritual illumination.',
  image,
}) => {
  useEffect(() => {
    const fullTitle = title ? `${title} — Living in the light of Allah` : 'Living in the light of Allah — Digital Bookstore & Reader';
    document.title = fullTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update Open Graph tags
    const setMetaProperty = (property: string, content: string) => {
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMetaProperty('og:title', fullTitle);
    setMetaProperty('og:description', description);
    if (image) {
      setMetaProperty('og:image', image);
    }
  }, [title, description, image]);

  return null;
};
