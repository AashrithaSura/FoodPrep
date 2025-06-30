const Promo = require('../models/promoModel');

const validatePromo = async (req, res) => {
  try {
    const { code } = req.query;
    const subtotal = parseFloat(req.query.subtotal) || 0;

    if (!code) {
      return res.status(400).json({ message: "Promo code is required" });
    }

    const promo = await Promo.findOne({
      code: code.toUpperCase().trim(),
      isActive: true
    })

    if (!promo) {
      return res.status(404).json({ message: "Invalid or inactive promo code" });
    }

    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Promo code has expired" });
    }

    if (promo.usageLimit && promo.timesUsed >= promo.usageLimit) {
      return res.status(400).json({ message: "Promo code usage limit reached" });
    }

    if (promo.minOrderValue && subtotal < promo.minOrderValue) {
      return res.status(400).json({
        message: `Subtotal ₹${subtotal} is less than minimum required ₹${promo.minOrderValue}`
      })
    }

    return res.status(200).json({ promo });

  } catch (error) {
    console.error("Promo validation error:", error);
    return res.status(500).json({ message: "Server error during promo validation" });
  }
}

const recordPromoUsage = async (promoCode) => {
  try {
    await Promo.findOneAndUpdate(
      { code: promoCode.toUpperCase().trim() },
      { $inc: { timesUsed: 1 } }
    );
  } catch (error) {
    console.error("Error recording promo usage:", error);
  }
}

module.exports = {
  validatePromo,
  recordPromoUsage
}