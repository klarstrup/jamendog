const formatPrice = ({ price, currency, locale }) =>
  price.toLocaleString(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  });

const OfferPriceTag = ({ t = a => a, locale = 'da-DK', pricing, quantity }) => {
  const { price, currency } = pricing;
  const { unit, size, pieces } = quantity;
  const { from: sizeFrom = 0, to: sizeTo = 0 } = size;
  const sizeSpread = sizeFrom - sizeTo > 0;
  const { from: piecesFrom = 0, to: piecesTo = 0 } = pieces;
  const piecesSpread = piecesTo - piecesFrom > 0;
  let unitPricing = '';
  if (!(piecesFrom === 1 && piecesTo === 1 && sizeFrom === 1 && sizeTo === 1) && unit) {
    if (unit.si) {
      if (piecesSpread || sizeSpread) {
        unitPricing += `${t('offer.unit.max.label')} `;
      }
      const unitPrice = price / piecesFrom * (1 / (sizeFrom * unit.si.factor));
      const unitPriceHasDecimal = unitPrice % 1 != 0;
      unitPricing += `${unitPrice.toLocaleString(locale, {
        maximumFractionDigits: 2,
        ...(unitPriceHasDecimal ? { minimumFractionDigits: 2 } : {}),
      })}${unitPriceHasDecimal ? '' : ',-'}`;
      if (unit.si.symbol) {
        unitPricing += '/';
        if (unit.si.symbol === 'pcs') {
          unitPricing += t('offer.unit.each.label');
        } else {
          unitPricing += unit.si.symbol;
        }
      }
    }
  }

  return unitPricing;
};

export default OfferPriceTag;
