import React from "react";
import { storiesOf } from "@storybook/react";
// import { action } from "@storybook/addon-actions";
// import { withInfo } from "@storybook/addon-info";

import OfferQuantity from "./OfferQuantity";

const defaultProps = {
  t: t => t,
};

storiesOf("OfferQuantity", module)
  .add("1 pcs", () => (
    <OfferQuantity
      {...defaultProps}
      {...{
        quantity: {
          unit: {
            symbol: "pcs",
          },
          size: {
            from: 1,
            to: 1,
          },
          pieces: {
            from: 1,
            to: 1,
          },
        },
      }}
    />
  ))
  .add("SI unit range + pieces range", () => (
    <OfferQuantity
      {...defaultProps}
      {...{
        quantity: {
          unit: {
            symbol: "cl",
            si: {
              symbol: "l",
              factor: 0.01,
            },
          },
          size: {
            from: 75,
            to: 150,
          },
          pieces: {
            from: 1,
            to: 2,
          },
        },
      }}
    />
  ));
