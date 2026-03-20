import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { ProductSheetPage } from './TechnicalSheet'; // font registration da buradan gelir

/* ── Renkler (TechnicalSheet ile aynı palet) ── */
const C = {
  navy:    '#1c2b3a',
  blue:    '#2e6da4',
  lightBg: '#f0f4f8',
  border:  '#d1dbe6',
  text:    '#1e293b',
  muted:   '#64748b',
  white:   '#ffffff',
  dark:    '#131f2e',
};

const CATEGORY_ORDER = ['simulator', 'atolye', 'ata-chapter'];

const LABELS = {
  tr: {
    simulator:     'Simülatörler',
    atolye:        'Atölye Eğitim Setleri',
    'ata-chapter': 'ATA Chapter Bazlı Setler',
    catalogTitle:  'Ürün Kataloğu',
    subtitle:      'Havacılık Eğitim Ekipmanları',
    toc:           'İçindekiler',
    year:          '2025',
    website:       'www.havek.tr',
    email:         'info@havek.com.tr',
    ctaTitle:      'Bizimle İletişime Geçin',
    ctaText:       'Müfredatınıza ve bütçenize uygun eğitim ekipmanı paketleri için uzman ekibimizle iletişime geçin.',
    products:      'ürün',
  },
  en: {
    simulator:     'Simulators',
    atolye:        'Workshop Training Sets',
    'ata-chapter': 'ATA Chapter Based Sets',
    catalogTitle:  'Product Catalog',
    subtitle:      'Aviation Training Equipment',
    toc:           'Table of Contents',
    year:          '2025',
    website:       'www.havek.tr',
    email:         'info@havek.com.tr',
    ctaTitle:      'Get In Touch',
    ctaText:       'Contact our expert team for training equipment packages tailored to your curriculum and budget.',
    products:      'products',
  },
};

const SECTION_DESC = {
  tr: {
    simulator:     'Cessna tipi uçuş kabini ve rüzgar tüneli dahil simülatör çözümleri.',
    atolye:        'Emniyet teli, contalama, borulama, EWIS ve perçinleme uygulamaları.',
    'ata-chapter': 'Hidrolik, yakıt, pnömatik, elektrik ve oksijen sistem setleri.',
  },
  en: {
    simulator:     'Simulator solutions including Cessna-type cockpit and wind tunnel.',
    atolye:        'Safety wire, sealing, tubing, EWIS and riveting applications.',
    'ata-chapter': 'Hydraulic, fuel, pneumatic, electrical and oxygen system sets.',
  },
};

/* ── Katalog özel stiller ── */
const s = StyleSheet.create({
  /* Kapak */
  coverPage:   { backgroundColor: C.navy, flexDirection: 'column', width: '100%', height: '100%' },
  coverMain:   { flex: 1, padding: '50 52', flexDirection: 'column' },
  coverTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 60 },
  coverLogo:   { width: 160, height: 52, objectFit: 'contain' },
  coverYear:   { fontFamily: 'Roboto', fontSize: 10, fontWeight: 700, color: C.blue, letterSpacing: 1 },
  coverTag:    { fontFamily: 'Roboto', fontSize: 7.5, color: C.blue, letterSpacing: 2.5, marginBottom: 14 },
  coverTitle:  { fontFamily: 'Roboto', fontSize: 40, fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 10 },
  coverSub:    { fontFamily: 'Roboto', fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 44 },
  coverImgRow: { flexDirection: 'row', flex: 1, maxHeight: 195 },
  coverImg0:   { flex: 1.4, objectFit: 'contain', borderRadius: 10, backgroundColor: '#243447', marginRight: 10 },
  coverImg1:   { flex: 1,   objectFit: 'contain', borderRadius: 10, backgroundColor: '#243447' },
  coverAccentBar: { height: 3, backgroundColor: C.blue },
  coverBottom: { backgroundColor: C.dark, padding: '14 52', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  coverBotText:  { fontFamily: 'Roboto', fontSize: 7.5, color: 'rgba(255,255,255,0.38)' },
  coverBotBlue:  { fontFamily: 'Roboto', fontSize: 7.5, fontWeight: 700, color: C.blue },

  /* İçindekiler sayfası */
  tocPage:    { fontFamily: 'Roboto', backgroundColor: C.white, padding: '38 52 32 52', flexDirection: 'column' },
  tocHeader:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 11, borderBottomWidth: 1, borderBottomColor: C.border, marginBottom: 24 },
  tocLogoTxt: { fontFamily: 'Roboto', fontSize: 14, fontWeight: 700, color: C.navy, letterSpacing: 2 },
  tocPageLbl: { fontFamily: 'Roboto', fontSize: 7.5, color: '#94a3b8', letterSpacing: 0.5 },
  tocTitle:   { fontFamily: 'Roboto', fontSize: 24, fontWeight: 700, color: C.navy, letterSpacing: -0.5, marginBottom: 28 },
  tocSection: { marginBottom: 20 },
  tocSecRow:  { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  tocSecBar:  { width: 3, height: 14, backgroundColor: C.blue, borderRadius: 2, marginRight: 9 },
  tocSecName: { fontFamily: 'Roboto', fontSize: 11, fontWeight: 700, color: C.navy },
  tocSecCnt:  { fontFamily: 'Roboto', fontSize: 8, color: C.muted, marginLeft: 6 },
  tocItem:    { flexDirection: 'row', paddingLeft: 12, marginBottom: 3, alignItems: 'center' },
  tocDot:     { width: 3, height: 3, backgroundColor: '#cbd5e1', borderRadius: 2, marginRight: 6 },
  tocItemTxt: { fontFamily: 'Roboto', fontSize: 8, color: C.muted },
  tocFooter:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 9, borderTopWidth: 1, borderTopColor: C.border },
  tocFootTxt: { fontFamily: 'Roboto', fontSize: 7.5, color: '#94a3b8' },

  /* Bölüm ayraç sayfası */
  secPage:    { backgroundColor: C.lightBg, width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'flex-end', padding: '52 52' },
  secBigNum:  { fontFamily: 'Roboto', fontSize: 88, fontWeight: 700, color: 'rgba(46,109,164,0.08)', lineHeight: 1, marginBottom: -6 },
  secAccent:  { width: 32, height: 3, backgroundColor: C.blue, borderRadius: 2, marginBottom: 12 },
  secTag:     { fontFamily: 'Roboto', fontSize: 7.5, color: C.blue, letterSpacing: 2, marginBottom: 8 },
  secTitle:   { fontFamily: 'Roboto', fontSize: 28, fontWeight: 700, color: C.navy, lineHeight: 1.2, marginBottom: 12 },
  secDesc:    { fontFamily: 'Roboto', fontSize: 10, color: C.muted, lineHeight: 1.65, maxWidth: 370 },
  secCount:   { fontFamily: 'Roboto', fontSize: 7.5, color: '#94a3b8', marginTop: 16, letterSpacing: 1 },

  /* Arka kapak */
  backPage:      { backgroundColor: C.navy, width: '100%', height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60' },
  backLogo:      { width: 180, height: 58, objectFit: 'contain', marginBottom: 26 },
  backDivider:   { width: 32, height: 2, backgroundColor: C.blue, borderRadius: 2, marginBottom: 20 },
  backTitle:     { fontFamily: 'Roboto', fontSize: 15, fontWeight: 700, color: C.white, marginBottom: 10, textAlign: 'center' },
  backCta:       { fontFamily: 'Roboto', fontSize: 10, color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: 32, maxWidth: 310, lineHeight: 1.7 },
  backWebsite:   { fontFamily: 'Roboto', fontSize: 11, fontWeight: 700, color: C.blue, textAlign: 'center', marginBottom: 6 },
  backEmail:     { fontFamily: 'Roboto', fontSize: 9, color: 'rgba(255,255,255,0.55)', textAlign: 'center' },
});

/* ── Yardımcılar ── */
const getTitle = (p, lang) => lang === 'en' ? (p.title_en || p.title) : p.title;
const getCat   = (p)       => p.categories?.[0] || p.category || '';

/* ── CatalogPDF ── */
const CatalogPDF = ({ products = [], lang = 'tr', catalogImages = {}, logoDataUrl, email }) => {
  const L = { ...LABELS[lang], email: email || LABELS[lang].email };

  const grouped = CATEGORY_ORDER
    .map((cat, idx) => ({
      cat,
      idx: idx + 1,
      label: L[cat] || cat,
      products: products.filter(p => getCat(p) === cat),
    }))
    .filter(g => g.products.length > 0);

  /* Bilinmeyen kategoriler */
  const known = new Set(CATEGORY_ORDER);
  const other = products.filter(p => !known.has(getCat(p)));
  if (other.length > 0) {
    grouped.push({ cat: 'other', idx: grouped.length + 1, label: lang === 'tr' ? 'Diğer' : 'Other', products: other });
  }

  /* Kapak görselleri — her kategoriden 1 ürün */
  const coverImgs = grouped
    .map(g => g.products.find(p => catalogImages[p.id]?.[0]))
    .filter(Boolean)
    .slice(0, 2)
    .map(p => catalogImages[p.id][0]);

  return (
    <Document title={`HAVEK ${L.catalogTitle} ${L.year}`} author="HAVEK Aviation Training Equipment">

      {/* ── KAPAK ── */}
      <Page size="A4" style={s.coverPage}>
        <View style={s.coverMain}>
          <View style={s.coverTopRow}>
            {logoDataUrl
              ? <Image src={logoDataUrl} style={s.coverLogo} />
              : <Text style={s.coverYear}>HAVEK</Text>
            }
            <Text style={s.coverYear}>{L.year}</Text>
          </View>
          <Text style={s.coverTag}>HAVEK</Text>
          <Text style={s.coverTitle}>{L.catalogTitle}</Text>
          <Text style={s.coverSub}>{L.subtitle}</Text>
          {coverImgs.length > 0 && (
            <View style={s.coverImgRow}>
              {coverImgs[0] && <Image src={coverImgs[0]} style={s.coverImg0} />}
              {coverImgs[1] && <Image src={coverImgs[1]} style={s.coverImg1} />}
            </View>
          )}
        </View>
        <View style={s.coverAccentBar} />
        <View style={s.coverBottom}>
          <Text style={s.coverBotText}>{L.website}</Text>
          <Text style={s.coverBotText}>{L.email}</Text>
          <Text style={s.coverBotBlue}>HAVEK © {L.year}</Text>
        </View>
      </Page>

      {/* ── İÇİNDEKİLER ── */}
      <Page size="A4" style={s.tocPage}>
        <View style={s.tocHeader}>
          {logoDataUrl
            ? <Image src={logoDataUrl} style={{ width: 120, height: 38, objectFit: 'contain' }} />
            : <Text style={s.tocLogoTxt}>HAVEK</Text>
          }
          <Text style={s.tocPageLbl}>{L.catalogTitle} · {L.year}</Text>
        </View>
        <Text style={s.tocTitle}>{L.toc}</Text>
        {grouped.map(g => (
          <View key={g.cat} style={s.tocSection}>
            <View style={s.tocSecRow}>
              <View style={s.tocSecBar} />
              <Text style={s.tocSecName}>{g.label}</Text>
              <Text style={s.tocSecCnt}>  ({g.products.length} {L.products})</Text>
            </View>
            {g.products.map(p => (
              <View key={p.id} style={s.tocItem}>
                <View style={s.tocDot} />
                <Text style={s.tocItemTxt}>{getTitle(p, lang)}</Text>
              </View>
            ))}
          </View>
        ))}
        <View style={s.tocFooter}>
          <Text style={s.tocFootTxt}>{L.website}</Text>
          <Text
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            style={s.tocFootTxt}
          />
        </View>
      </Page>

      {/* ── KATEGORİ BÖLÜMLERİ + ÜRÜN SAYFALARI ── */}
      {grouped.map(g => (
        <React.Fragment key={g.cat}>

          {/* Bölüm ayraç sayfası */}
          <Page size="A4" style={s.secPage}>
            <Text style={s.secBigNum}>{String(g.idx).padStart(2, '0')}</Text>
            <View style={s.secAccent} />
            <Text style={s.secTag}>HAVEK</Text>
            <Text style={s.secTitle}>{g.label}</Text>
            <Text style={s.secDesc}>{SECTION_DESC[lang]?.[g.cat] || ''}</Text>
            <Text style={s.secCount}>
              {g.products.length} {L.products.toUpperCase()}
            </Text>
          </Page>

          {/* Her ürün için TechnicalSheet ile aynı sayfa tasarımı */}
          {g.products.map(p => (
            <ProductSheetPage
              key={p.id}
              product={p}
              lang={lang}
              resolvedImages={catalogImages[p.id] || []}
              email={L.email}
              logoDataUrl={logoDataUrl}
            />
          ))}

        </React.Fragment>
      ))}

      {/* ── ARKA KAPAK ── */}
      <Page size="A4" style={s.backPage}>
        {logoDataUrl
          ? <Image src={logoDataUrl} style={s.backLogo} />
          : <Text style={{ ...s.backTitle, fontSize: 20, marginBottom: 26, letterSpacing: 3 }}>HAVEK</Text>
        }
        <View style={s.backDivider} />
        <Text style={s.backTitle}>{L.ctaTitle}</Text>
        <Text style={s.backCta}>{L.ctaText}</Text>
        <Text style={s.backWebsite}>{L.website}</Text>
        <Text style={s.backEmail}>{L.email}</Text>
      </Page>

    </Document>
  );
};

export default CatalogPDF;
