import Offer from '../models/Offer.js';

const parseDate = (value) => {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export const getActiveOffers = async (_req, res) => {
  try {
    const now = new Date();
    const offers = await Offer.find({
      isActive: true,
      startsAt: { $lte: now },
      $or: [{ endsAt: null }, { endsAt: { $exists: false } }, { endsAt: { $gte: now } }],
    })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.json(offers);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const getAllOffers = async (_req, res) => {
  try {
    const offers = await Offer.find().sort({ createdAt: -1 }).limit(100);
    return res.json(offers);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const createOffer = async (req, res) => {
  try {
    const { title, description, code, discountPercent, startsAt, endsAt, isActive } = req.body;
    if (!title || !description || !startsAt || !endsAt) {
      return res.status(400).json({ message: 'Title, description, start date and end date are required' });
    }

    const parsedStart = parseDate(startsAt);
    const parsedEnd = parseDate(endsAt);

    if (!parsedStart) {
      return res.status(400).json({ message: 'Invalid start date' });
    }
    if (!parsedEnd) {
      return res.status(400).json({ message: 'Invalid end date' });
    }
    if (parsedEnd && parsedEnd < parsedStart) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    const offer = await Offer.create({
      title: String(title).trim(),
      description: String(description).trim(),
      code: code ? String(code).trim().toUpperCase() : '',
      discountPercent: discountPercent === '' || discountPercent === undefined ? undefined : Number(discountPercent),
      startsAt: parsedStart,
      endsAt: parsedEnd,
      isActive: isActive !== false,
      createdBy: req.user?._id,
    });

    return res.status(201).json(offer);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const updateOffer = async (req, res) => {
  try {
    const updatePayload = { ...req.body };
    if (updatePayload.code !== undefined) {
      updatePayload.code = String(updatePayload.code || '')
        .trim()
        .toUpperCase();
    }
    if (updatePayload.startsAt !== undefined) {
      const parsedStart = parseDate(updatePayload.startsAt);
      if (!parsedStart) {
        return res.status(400).json({ message: 'Invalid start date' });
      }
      updatePayload.startsAt = parsedStart;
    }
    if (updatePayload.endsAt !== undefined) {
      const parsedEnd = parseDate(updatePayload.endsAt);
      if (!parsedEnd) {
        return res.status(400).json({ message: 'Invalid end date' });
      }
      updatePayload.endsAt = parsedEnd;
    }
    const effectiveStart = updatePayload.startsAt;
    const effectiveEnd = updatePayload.endsAt;
    if (effectiveStart && effectiveEnd && effectiveEnd < effectiveStart) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }
    const offer = await Offer.findByIdAndUpdate(req.params.id, updatePayload, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    return res.json(offer);
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ message: 'Offer not found' });
    }
    return res.json({ message: 'Offer removed' });
  } catch (err) {
    return res.status(500).json({ message: err.message || 'Server error' });
  }
};
