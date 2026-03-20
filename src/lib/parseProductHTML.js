/**
 * Ürün description HTML'ini PDF için yapılandırılmış veriye çevirir.
 * Beklenen yapı: <p> intro, <h4> başlıklar, <ul><li> maddeler
 */
export function parseProductHTML(html) {
  if (!html) return { intro: '', sections: [] };

  // h4 taglarına göre parçala
  const parts = html.split(/<h4[^>]*>/i);

  // İlk parça: intro paragraph
  const introRaw = parts[0] || '';
  const intro = introRaw
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Kalan parçalar: her biri bir section
  const sections = [];
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    // Başlık: </h4>'e kadar
    const titleMatch = part.match(/^([\s\S]*?)<\/h4>/i);
    const title = titleMatch
      ? titleMatch[1].replace(/<[^>]+>/g, '').trim()
      : '';

    // Maddeler: <li> tagları
    const liMatches = [...part.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
    const items = liMatches.map(m =>
      m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
    );

    if (title || items.length) {
      sections.push({ title, items });
    }
  }

  return { intro, sections };
}

export function categoryLabel(cat) {
  const map = {
    'atolye': 'Atölye Eğitim Seti',
    'ata-chapter': 'ATA Chapter Bazlı',
    'simulator': 'Simülatör',
  };
  return map[cat] || cat;
}
