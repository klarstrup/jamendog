import * as R from 'ramda';

const OfferQuantity = ({ t = a => a, quantity, locale = 'da-DK' }) => {
  const formatSize = new Intl.NumberFormat(locale).format;
  const { unit, size, pieces } = quantity;
  const { from: sizeFrom = 0, to: sizeTo = 0 } = size;
  const sizeSpread = sizeFrom - sizeTo > 0;
  const { from: piecesFrom = 0, to: piecesTo = 0 } = pieces;
  const piecesSpread = piecesTo - piecesFrom > 0;
  let presentation = '';

  if (!(piecesFrom === 1 && piecesTo === 1 && sizeFrom === 1 && sizeTo === 1) && unit) {
    if (piecesSpread && sizeSpread) {
      presentation = `${[piecesFrom, piecesTo].join('–')} ${t('offer.unit.symbol.pcs')}`;
    } else {
      if (piecesSpread || piecesFrom > 1) {
        presentation += R.uniq([piecesFrom, piecesTo]).join('–');
      }

      if (sizeFrom > 0) {
        if (piecesSpread || piecesFrom > 1) presentation += 'x';
        presentation += R.uniq([sizeFrom, sizeTo])
          .map(formatSize)
          .join('–');
      }

      if (unit.symbol && unit.symbol !== 'pcs') {
        presentation += ` ${unit.symbol}`;
      } else {
        presentation += ` ${t('offer.unit.symbol.pcs')}`;
      }
    }
  } else {
    presentation = `1 ${t('offer.unit.symbol.pcs')}`;
  }

  return presentation;
};

export default OfferQuantity;
