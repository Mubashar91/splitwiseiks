import Hero from '../models/Hero.js';

// Public: GET hero by language
export async function getHero(req, res) {
  try {
    const lang = (req.query.lang || 'en').toLowerCase();
    const hero = await Hero.findOne({ lang }).lean();
    if (!hero) return res.status(404).json({ error: 'Hero not found' });
    return res.json({ lang, hero });
  } catch (err) {
    console.error('getHero error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Admin: get hero
export async function getHeroAdmin(req, res) {
  try {
    const lang = (req.query.lang || 'en').toLowerCase();
    const hero = await Hero.findOne({ lang }).lean();
    return res.json({ lang, hero });
  } catch (err) {
    console.error('getHeroAdmin error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Admin: create or update hero
export async function upsertHero(req, res) {
  try {
    const { lang = 'en', hero } = req.body || {};
    if (!hero) {
      return res.status(400).json({ error: 'hero data required' });
    }
    const updated = await Hero.findOneAndUpdate(
      { lang: lang.toLowerCase() },
      { ...hero, lang: lang.toLowerCase() },
      { upsert: true, new: true }
    ).lean();
    return res.json({ message: 'saved', hero: updated });
  } catch (err) {
    console.error('upsertHero error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

