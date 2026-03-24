// Admin butonuyla aynı mantıkta tüm dillere (EN, FR, DE, JA) çeviri
// node translate-bulk.mjs

const SUPABASE_URL = 'https://wbfkktnswmpmzrwriudt.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiZmtrdG5zd21wbXpyd3JpdWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NjM3MDAsImV4cCI6MjA4OTQzOTcwMH0.0bOUWo1z481PM3R8SFwDEoI5M2ywc3MPAn8x72SdkDE';

const TARGET_LANGS = ['en', 'fr', 'de', 'ja'];

const SECTION_TRANSLATIONS = {
  en: {
    'Temel Özellikler': 'Key Features',
    'Set İçeriği': 'Set Contents',
    'Yapılabilecek Görevler': 'Available Tasks',
    'Temel Donanımlar': 'Main Equipment',
    'İsteğe Bağlı Modüller': 'Optional Modules',
    'İsteğe Bağlı Ek Donanımlar': 'Optional Accessories',
    'Bölümler': 'Sections',
    'Donanımlar': 'Equipment',
    'Yangın Söndürme Sistemi': 'Fire Suppression System',
    'Yangın Algılama Sistemi': 'Fire Detection System',
    'Temel Çanta İçeriği': 'Basic Bag Contents',
    'Özellikler': 'Specifications',
    'Teknik Özellikler': 'Technical Specifications',
    'Hizmet Kapsamı': 'Service Scope',
    'Seviyeler': 'Levels',
    'Pafta, Kılavuz ve Helicoil Seti': 'Die, Tap & Helicoil Set',
    'Tüp Depolama Kafesi': 'Tube Storage Cage',
  },
  fr: {
    'Temel Özellikler': 'Caractéristiques principales',
    'Set İçeriği': 'Contenu du set',
    'Yapılabilecek Görevler': 'Tâches disponibles',
    'Temel Donanımlar': 'Équipements principaux',
    'İsteğe Bağlı Modüller': 'Modules optionnels',
    'İsteğe Bağlı Ek Donanımlar': 'Équipements optionnels',
    'Bölümler': 'Sections',
    'Donanımlar': 'Équipements',
    'Yangın Söndürme Sistemi': "Système d'extinction d'incendie",
    'Yangın Algılama Sistemi': "Système de détection d'incendie",
    'Temel Çanta İçeriği': 'Contenu du sac de base',
    'Özellikler': 'Spécifications',
    'Teknik Özellikler': 'Spécifications techniques',
    'Hizmet Kapsamı': 'Portée du service',
    'Seviyeler': 'Niveaux',
    'Pafta, Kılavuz ve Helicoil Seti': 'Filière, Taraud & Helicoil',
    'Tüp Depolama Kafesi': 'Cage de stockage des tubes',
  },
  de: {
    'Temel Özellikler': 'Hauptmerkmale',
    'Set İçeriği': 'Set-Inhalt',
    'Yapılabilecek Görevler': 'Verfügbare Aufgaben',
    'Temel Donanımlar': 'Hauptausrüstung',
    'İsteğe Bağlı Modüller': 'Optionale Module',
    'İsteğe Bağlı Ek Donanımlar': 'Optionales Zubehör',
    'Bölümler': 'Abschnitte',
    'Donanımlar': 'Ausrüstung',
    'Yangın Söndürme Sistemi': 'Feuerlöschsystem',
    'Yangın Algılama Sistemi': 'Brandmeldesystem',
    'Temel Çanta İçeriği': 'Grundlegende Tascheninhalte',
    'Özellikler': 'Spezifikationen',
    'Teknik Özellikler': 'Technische Spezifikationen',
    'Hizmet Kapsamı': 'Leistungsumfang',
    'Seviyeler': 'Ebenen',
    'Pafta, Kılavuz ve Helicoil Seti': 'Schneideisen, Gewindeschneider & Helicoil',
    'Tüp Depolama Kafesi': 'Rohrlagergestell',
  },
  ja: {
    'Temel Özellikler': '主な特長',
    'Set İçeriği': 'セット内容',
    'Yapılabilecek Görevler': '実施可能なタスク',
    'Temel Donanımlar': '主要機器',
    'İsteğe Bağlı Modüller': 'オプションモジュール',
    'İsteğe Bağlı Ek Donanımlar': 'オプション付属品',
    'Bölümler': 'セクション',
    'Donanımlar': '機器',
    'Yangın Söndürme Sistemi': '消火システム',
    'Yangın Algılama Sistemi': '火災検知システム',
    'Temel Çanta İçeriği': 'ベーシックバッグ内容',
    'Özellikler': '仕様',
    'Teknik Özellikler': '技術仕様',
    'Hizmet Kapsamı': 'サービス範囲',
    'Seviyeler': 'レベル',
    'Pafta, Kılavuz ve Helicoil Seti': 'ダイス、タップ & ヘリコイルセット',
    'Tüp Depolama Kafesi': 'チューブ保管ケージ',
  },
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// Google Translate (ücretsiz, api key yok) - uzun metinleri parçalar
async function translateText(text, targetLang) {
  if (!text?.trim()) return '';
  const words = text.split(' ');
  const chunks = [];
  let chunk = '';
  for (const word of words) {
    if ((chunk + ' ' + word).length > 450) {
      if (chunk) chunks.push(chunk.trim());
      chunk = word;
    } else {
      chunk = chunk ? chunk + ' ' + word : word;
    }
  }
  if (chunk) chunks.push(chunk.trim());

  const parts = [];
  for (const c of chunks) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=${targetLang}&dt=t&q=${encodeURIComponent(c)}`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const data = await res.json();
      const result = data[0]?.map(seg => seg[0]).join('') || c;
      parts.push(result);
      await sleep(120);
    } catch {
      parts.push(c);
    }
  }
  return parts.join(' ');
}

function parseProductHTML(html) {
  if (!html) return { intro: '', sections: [] };
  const parts = html.split(/<h4[^>]*>/i);
  const introRaw = parts[0] || '';
  const intro = introRaw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const sections = [];
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];
    const titleMatch = part.match(/^([\s\S]*?)<\/h4>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '';
    const liMatches = [...part.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    const items = liMatches.map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    if (title || items.length) sections.push({ title, items });
  }
  return { intro, sections };
}

async function translateProduct(product, lang) {
  const { intro, sections } = parseProductHTML(product.description);

  const translatedTitle = await translateText(product.title, lang);
  await sleep(200);

  let descHtml = '';
  if (intro) {
    const translatedIntro = await translateText(intro, lang);
    descHtml += `<p>${translatedIntro}</p>`;
    await sleep(200);
  }

  for (const sec of sections) {
    const secTitle = SECTION_TRANSLATIONS[lang]?.[sec.title] || await translateText(sec.title, lang);
    if (!SECTION_TRANSLATIONS[lang]?.[sec.title]) await sleep(150);

    const items = [];
    for (const item of sec.items) {
      const translated = await translateText(item, lang);
      items.push(translated);
      await sleep(200);
    }
    descHtml += `<h4>${secTitle}</h4><ul>${items.map(i => `<li>${i}</li>`).join('')}</ul>`;
  }

  return { title: translatedTitle, desc: descHtml };
}

async function fetchProducts() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?select=id,title,description,title_en,title_fr,title_de,title_ja&is_active=eq.true&order=display_order.asc`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
  );
  return res.json();
}

async function updateProduct(id, data) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/products?id=eq.${id}`,
    {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(data),
    }
  );
  return res.ok;
}

// Çeviri bozuk mu? (boş ya da Türkçe başlıkla aynıysa bozuk)
function isBad(translated, original) {
  if (!translated?.trim()) return true;
  return translated.trim() === original.trim();
}

async function main() {
  console.log('Ürünler çekiliyor...');
  const products = await fetchProducts();
  console.log(`${products.length} ürün bulundu.\n`);

  let updated = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    // Hangi diller eksik/bozuk?
    const needsTranslation = TARGET_LANGS.filter(l => isBad(product[`title_${l}`], product.title));

    if (needsTranslation.length === 0) {
      console.log(`[${i+1}/${products.length}] "${product.title}" — tüm diller tamam, atlanıyor.`);
      continue;
    }

    console.log(`[${i+1}/${products.length}] "${product.title}" → çevriliyor: ${needsTranslation.join(', ').toUpperCase()}`);

    const updates = {};
    for (const lang of needsTranslation) {
      process.stdout.write(`  → ${lang.toUpperCase()}... `);
      try {
        const result = await translateProduct(product, lang);
        updates[`title_${lang}`] = result.title;
        updates[`description_${lang}`] = result.desc;
        console.log(`✓ "${result.title}"`);
      } catch (err) {
        console.log(`✗ hata: ${err.message}`);
      }
      await sleep(400);
    }

    if (Object.keys(updates).length > 0) {
      const ok = await updateProduct(product.id, updates);
      console.log(`  Kaydedildi: ${ok ? '✓' : '✗'}`);
      updated++;
    }

    if (i < products.length - 1) await sleep(700);
  }

  console.log(`\nTamamlandı! ${updated} ürün güncellendi.`);
}

main().catch(console.error);
