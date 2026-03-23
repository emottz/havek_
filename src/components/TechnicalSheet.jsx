import React from 'react';
import {
  Document, Page, Text, View, StyleSheet, Image, Font,
} from '@react-pdf/renderer';
import { parseProductHTML } from '../lib/parseProductHTML';
import { SECTION_TRANSLATIONS, CATEGORY_LABELS, UI_TEXT } from '../lib/pdfTranslations';

const BASE = window.location.origin;
Font.register({
  family: 'Roboto',
  fonts: [
    { src: `${BASE}/fonts/Roboto-Regular.ttf`, fontWeight: 400 },
    { src: `${BASE}/fonts/Roboto-Bold.ttf`,    fontWeight: 700 },
  ],
});

const C = {
  navy:    '#1c2b3a',
  blue:    '#2e6da4',
  lightBg: '#f0f4f8',
  border:  '#d1dbe6',
  text:    '#1e293b',
  muted:   '#64748b',
  white:   '#ffffff',
};

const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    fontWeight: 400,
    fontSize: 8.5,
    color: C.text,
    backgroundColor: C.white,
    paddingBottom: 44,
  },

  header: {
    backgroundColor: C.navy,
    paddingHorizontal: 32,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  brandName: {
    fontSize: 20,
    fontWeight: 700,
    color: C.white,
    letterSpacing: 2,
  },
  brandSub: {
    fontSize: 6.5,
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 1,
    marginTop: 2,
  },
  docLabel: { fontSize: 6.5, color: 'rgba(255,255,255,0.4)', letterSpacing: 0.8 },
  docType:  { fontSize: 8.5, fontWeight: 700, color: C.white, marginTop: 2 },

  accentBar: { height: 3, backgroundColor: C.blue },

  body: { paddingHorizontal: 32, paddingTop: 18 },

  chipRow: { flexDirection: 'row', gap: 5, marginBottom: 8 },
  chip: {
    backgroundColor: C.lightBg,
    borderRadius: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderLeftWidth: 2,
    borderLeftColor: C.blue,
  },
  chipText: { fontSize: 6.5, fontWeight: 700, color: C.blue, letterSpacing: 0.4 },

  productTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: C.navy,
    lineHeight: 1.2,
    marginBottom: 3,
  },
  divider: { height: 1, backgroundColor: C.border, marginVertical: 10 },

  intro: { fontSize: 8.5, color: C.text, lineHeight: 1.6, marginBottom: 10 },

  twoCol: { flexDirection: 'row', gap: 12 },
  col:    { flex: 1 },

  section:      { marginBottom: 10 },
  sectionHeader: {
    backgroundColor: C.lightBg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderLeftWidth: 2.5,
    borderLeftColor: C.blue,
    marginBottom: 5,
  },
  sectionTitle: {
    fontSize: 7.5,
    fontWeight: 700,
    color: C.navy,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3, paddingLeft: 2 },
  bullet:   { width: 10, color: C.blue, fontWeight: 700, fontSize: 9, lineHeight: 1.25 },
  itemText: { flex: 1, fontSize: 8, color: C.text, lineHeight: 1.5 },

  imageRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  productImage: {
    flex: 1,
    height: 100,
    objectFit: 'contain',
    backgroundColor: C.lightBg,
    borderRadius: 3,
  },

  infoBox: {
    backgroundColor: C.lightBg,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: C.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: { fontSize: 6.5, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  infoValue: { fontSize: 8, fontWeight: 700, color: C.navy },

  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  footerBrand: { fontSize: 8, fontWeight: 700, color: C.navy },
  footerText:  { fontSize: 6.5, color: C.muted },
});

const LOCALE_MAP = { tr: 'tr-TR', en: 'en-GB', fr: 'fr-FR', de: 'de-DE', ja: 'ja-JP' };

function formatDate(lang) {
  const locale = LOCALE_MAP[lang] || 'en-GB';
  return new Date().toLocaleDateString(locale, {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

function splitSections(sections) {
  const half = Math.ceil(sections.length / 2);
  return [sections.slice(0, half), sections.slice(half)];
}

function fixImageUrl(src) {
  if (!src) return src;
  if (src.startsWith('/')) {
    const encoded = src.split('/').map(seg => encodeURIComponent(decodeURIComponent(seg))).join('/');
    return `${window.location.origin}${encoded}`;
  }
  return src;
}

function translateTitle(title, lang) {
  if (lang === 'tr') return title;
  return SECTION_TRANSLATIONS[lang]?.[title] || SECTION_TRANSLATIONS.en[title] || title;
}

function categoryLabelForLang(cat, lang) {
  return (CATEGORY_LABELS[lang] || CATEGORY_LABELS.tr)[cat] || cat;
}

/* ── Tek ürün sayfası — Document olmadan (katalog için dışa aktarılır) ── */
export const ProductSheetPage = ({ product, lang = 'tr', resolvedImages, email, logoDataUrl }) => {
  const t = UI_TEXT[lang];

  const title = (lang !== 'tr' && product[`title_${lang}`])
    ? product[`title_${lang}`]
    : (product.title_en && lang !== 'tr' ? product.title_en : product.title);

  const rawDescription = (lang !== 'tr' && product[`description_${lang}`])
    ? product[`description_${lang}`]
    : (product.description_en && lang !== 'tr' ? product.description_en : product.description);

  const { intro, sections } = parseProductHTML(rawDescription);

  const images = resolvedImages || (product.images || [])
    .filter(src => !!src)
    .slice(0, 3)
    .map(fixImageUrl);

  const [left, right] = splitSections(sections);
  const cats = product.categories || [];

  return (
    <Page size="A4" style={styles.page}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          {logoDataUrl
            ? <Image src={logoDataUrl} style={{ width: 110, height: 36, objectFit: 'contain' }} />
            : <Text style={styles.brandName}>HAVEK</Text>
          }
          <Text style={styles.brandSub}>{t.brandSub}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.docLabel}>{t.docTypeLabel}</Text>
          <Text style={styles.docType}>{t.docType}</Text>
        </View>
      </View>
      <View style={styles.accentBar} />

      <View style={styles.body}>

        {cats.length > 0 && (
          <View style={styles.chipRow}>
            {cats.map(c => (
              <View key={c} style={styles.chip}>
                <Text style={styles.chipText}>{categoryLabelForLang(c, lang)}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.productTitle}>{title}</Text>
        <View style={styles.divider} />

        {intro ? <Text style={styles.intro}>{intro}</Text> : null}

        {images.length > 0 && (
          <View style={styles.imageRow}>
            {images.map((src, i) => (
              <Image
                key={i}
                src={{ uri: src, method: 'GET', headers: {}, body: '' }}
                style={styles.productImage}
              />
            ))}
          </View>
        )}

        {sections.length > 0 && (
          <View style={styles.twoCol}>
            <View style={styles.col}>
              {left.map((sec, i) => (
                <View key={i} style={styles.section}>
                  {sec.title ? (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>{translateTitle(sec.title, lang)}</Text>
                    </View>
                  ) : null}
                  {sec.items.map((item, j) => (
                    <View key={j} style={styles.itemRow}>
                      <Text style={styles.bullet}>{'\u203A'}</Text>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
            <View style={styles.col}>
              {right.map((sec, i) => (
                <View key={i} style={styles.section}>
                  {sec.title ? (
                    <View style={styles.sectionHeader}>
                      <Text style={styles.sectionTitle}>{translateTitle(sec.title, lang)}</Text>
                    </View>
                  ) : null}
                  {sec.items.map((item, j) => (
                    <View key={j} style={styles.itemRow}>
                      <Text style={styles.bullet}>{'\u203A'}</Text>
                      <Text style={styles.itemText}>{item}</Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <View>
            <Text style={styles.infoLabel}>{t.compliance}</Text>
            <Text style={styles.infoValue}>{t.complianceVal}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>{t.customLabel}</Text>
            <Text style={styles.infoValue}>{t.customVal}</Text>
          </View>
          <View>
            <Text style={styles.infoLabel}>{t.contactLabel}</Text>
            <Text style={styles.infoValue}>{email || 'info@havek.com.tr'}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View>
          <Text style={styles.footerBrand}>HAVEK</Text>
          <Text style={styles.footerText}>{t.brandSub}</Text>
        </View>
        <Text style={styles.footerText}>{t.footerNote}</Text>
        <Text style={styles.footerText}>{t.footerDate}: {formatDate(lang)}</Text>
      </View>

    </Page>
  );
};

/* ── Tek ürün teknik dökümanı (standalone) ── */
export const TechnicalSheet = ({ product, lang = 'tr', resolvedImages, email, logoDataUrl }) => {
  const t = UI_TEXT[lang];
  const title = (lang !== 'tr' && product[`title_${lang}`]) ? product[`title_${lang}`] : (lang !== 'tr' && product.title_en ? product.title_en : product.title);
  return (
    <Document title={`${title} - ${t.docType}`} author="HAVEK Aviation Training Equipment">
      <ProductSheetPage product={product} lang={lang} resolvedImages={resolvedImages} email={email} logoDataUrl={logoDataUrl} />
    </Document>
  );
};
