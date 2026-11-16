// Converts the tour .docx files into src/data/seedTours.json using the same
// parser as the admin panel. Usage: npx tsx scripts/build-seed-tours.ts "<docx folder>"
import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';
import { parseVoyraTourDocument } from '../src/utils/docxTourParser';
import { sanitizeTourDestinations } from '../src/utils/destinationDetector';

const dir = process.argv[2];
if (!dir) throw new Error('Pass the folder containing the .docx tour files');
const DEFAULT_IMG = 'https://raw.githubusercontent.com/yamanozgur/voyratours/main/asset/default.jpg';

const tours: any[] = [];
for (const f of fs.readdirSync(dir).filter((x) => x.toLowerCase().endsWith('.docx')).sort()) {
  const { value } = await mammoth.extractRawText({ path: path.join(dir, f) });
  let t: any = parseVoyraTourDocument(value, f);
  const clean = f.replace(/\.[^/.]+$/, '').replace(/\s*-\s*/g, '-').replace(/[-_]/g, ' ').trim()
    .split(' ').filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
  if (!t.title || t.title.length > 70 || /your journey begins|day 1|number of guests/i.test(t.title)) {
    t.title = clean; t.titleTr = clean;
  }
  if (!t.heroImage) t.heroImage = DEFAULT_IMG;
  if (!t.galleryImages?.length) t.galleryImages = [DEFAULT_IMG];
  t.id = t.id.replace(/-d{4}$/, ''); t.slug = t.id;
  t = sanitizeTourDestinations(t);
  if (tours.some((x) => x.id === t.id)) { t.id = `${t.id}-${tours.length}`; t.slug = t.id; }
  tours.push(t);
  console.log(f, '->', t.id, '|', t.title, '|', t.durationDays + 'd', '€' + t.priceEUR, '| days:', t.itinerary?.length);
}
fs.writeFileSync('src/data/seedTours.json', JSON.stringify(tours, null, 2));
