import React from "react";

import OfferQuantity from "components/OfferQuantity";
import OfferUnitPrice from "components/OfferUnitPrice";
import css from "./index.scss";

const formatPrice = (preis, { locale }) => {
  let price = preis;
  if (price > 10 && price % 1 >= 0.9) {
    price = Math.round(price);
  }
  if (price % 10 >= 9) {
    price = Math.round(price / 10) * 10;
  }
  if (price % 100 >= 90) {
    price = Math.round(price / 100) * 100;
  }
  if (price % 1000 >= 900) {
    price = Math.round(price / 1000) * 1000;
  }
  const priceHasDecimal = price % 1 !== 0;
  return `${price.toLocaleString(locale, {
    maximumFractionDigits: 2,
  })}${priceHasDecimal ? "" : ",-"}`;
};

const OfferPriceTag = ({ locale = "da-DK", pricing, quantity, block }) => {
  const { unit, size, pieces } = quantity;
  const { from: sizeFrom = 0, to: sizeTo = 0 } = size;
  const { from: piecesFrom = 0, to: piecesTo = 0 } = pieces;
  let presentation = false;
  if (!(piecesFrom === 1 && piecesTo === 1 && sizeFrom === 1 && sizeTo === 1) && unit) {
    presentation = true;
  }
  if (block) {
    return (
      <div className={css.block}>
        <div className={css.price}>
          {pricing.pre_price && (
            <div className={css.savings}>
              Save {Math.floor((pricing.price / pricing.pre_price - 1) * -100)}%
              <div className={css.prePrice}>
                {formatPrice(pricing.pre_price, { ...pricing, locale })}
              </div>
            </div>
          )}
          {formatPrice(pricing.price, { ...pricing, locale })}
        </div>
        <div className={css.unitPricing}>
          <OfferUnitPrice {...{ quantity, pricing }} />
        </div>
      </div>
    );
  }

  return (
    <span className={css.inline}>
      <span className={css.price}>{formatPrice(pricing.price, { ...pricing, locale })}</span>
      {presentation && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-around",
            fontSize: "1em",
            marginLeft: "0.5em",
            flex: 1,
          }}
        >
          <span className={css.quantity}>
            <OfferQuantity quantity={quantity} />
          </span>
          <span className={css.unitPricing}>
            <OfferUnitPrice {...{ quantity, pricing }} />
          </span>
        </div>
      )}
    </span>
  );
};

export default OfferPriceTag;
