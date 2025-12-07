import FAQ from '../models/FAQ.js';

// Public: GET FAQs by language
export async function getFAQs(req, res) {
  try {
    const lang = (req.query.lang || 'en').toLowerCase();
    const faqs = await FAQ.find({ lang })
      .sort({ order: 1 })
      .lean();
    return res.json({ lang, faqs });
  } catch (err) {
    console.error('getFAQs error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Admin: list FAQs for a language
export async function listFAQs(req, res) {
  try {
    const lang = (req.query.lang || 'en').toLowerCase();
    const faqs = await FAQ.find({ lang })
      .sort({ order: 1 })
      .lean();
    return res.json({ lang, faqs });
  } catch (err) {
    console.error('listFAQs error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Admin: create FAQ
export async function createFAQ(req, res) {
  try {
    const { lang = 'en', faq } = req.body || {};
    if (!faq || faq.order === undefined) {
      return res.status(400).json({ error: 'faq with order required' });
    }
    const created = await FAQ.create({ ...faq, lang: lang.toLowerCase() });
    return res.status(201).json({ message: 'created', faq: created });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'duplicate order for lang' });
    }
    console.error('createFAQ error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Admin: update FAQ
export async function updateFAQ(req, res) {
  try {
    const { lang = 'en', updates = {} } = req.body || {};
    const order = parseInt(req.params.order);
    if (isNaN(order)) {
      return res.status(400).json({ error: 'Invalid order' });
    }
    const updated = await FAQ.findOneAndUpdate(
      { lang: lang.toLowerCase(), order },
      { $set: updates },
      { new: true }
    ).lean();
    if (!updated) return res.status(404).json({ error: 'not found' });
    return res.json({ message: 'updated', faq: updated });
  } catch (err) {
    console.error('updateFAQ error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

// Admin: delete FAQ
export async function deleteFAQ(req, res) {
  try {
    const lang = (req.query.lang || 'en').toLowerCase();
    const order = parseInt(req.params.order);
    if (isNaN(order)) {
      return res.status(400).json({ error: 'Invalid order' });
    }
    const result = await FAQ.deleteOne({ lang, order });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'not found' });
    return res.json({ message: 'deleted' });
  } catch (err) {
    console.error('deleteFAQ error', err);
    return res.status(500).json({ error: 'Server error' });
  }
}

