import React from 'react';
import MdExpandMore from 'react-icons/lib/md/expand-more';

import OfferPriceTag from '../OfferPriceTag';

const contrastBWFromHex = ([r1, r2, g1, g2, ...b]) =>
  ([[r1, r2], [g1, g2], b].reduce(
    (memo, hex, i) => memo + parseInt(hex.join(''), 16) * [0.299, 0.587, 0.114][i],
    0,
  ) >= 128
    ? 'black'
    : 'white');

const contrastHighlightFromHex = ([r1, r2, g1, g2, ...b]) =>
  ([[r1, r2], [g1, g2], b].reduce(
    (memo, hex, i) => memo + parseInt(hex.join(''), 16) * [0.299, 0.587, 0.114][i],
    0,
  ) >= 128
    ? 'rgba(255,255,255,0.12)'
    : 'rgba(0,0,0,0.12)');

const contrastHighlightFromHexInv = ([r1, r2, g1, g2, ...b]) =>
  ([[r1, r2], [g1, g2], b].reduce(
    (memo, hex, i) => memo + parseInt(hex.join(''), 16) * [0.299, 0.587, 0.114][i],
    0,
  ) >= 128
    ? 'rgba(0,0,0,0.12)'
    : 'rgba(255,255,255,0.12)');

export default ({ offer }) => (
  <div
    style={{
      background: `#${offer.branding.color}`,
      color: contrastBWFromHex(offer.branding.color),
      borderRadius: '4px',
      margin: '8px',
      height: '100%',
      display: 'flex',
      boxShadow:
        '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
    }}>
    <div
      style={{
        width: '75%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flex: 1,
      }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          padding: '8px',
          paddingBottom: '4px',
        }}>
        <div
          style={{
            fontSize: '16px',
            textAlign: 'center',
          }}>
          {offer.heading}
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
          }}>
          <OfferPriceTag {...offer} />
        </div>
      </div>
      <div
        style={{
          //                  padding: '8px',
          borderTop: `1px solid ${contrastHighlightFromHexInv(offer.branding.color)}`,
          display: 'flex',
          justifyContent: 'space-between',
        }}>
        <button
          style={{
            color: 'inherit',
            WebkitAppearance: 'none',
            fontSize: '14px',
            background: 'none',
            border: 0,
            height: '32px',
            lineHeight: '32px',
            textTransform: 'uppercase',
            padding: '0 12px',
          }}>
          Skjul
        </button>
        <button
          style={{
            color: 'inherit',
            WebkitAppearance: 'none',
            fontSize: '32px',
            background: 'none',
            border: 0,
            height: '32px',
            lineHeight: '0.1',
            textTransform: 'uppercase',
            padding: '0 12px',
          }}>
          <MdExpandMore />
        </button>
      </div>
    </div>
    <div
      style={{
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '20%',
        padding: '4px',
        background: `${contrastHighlightFromHex(offer.branding.color)} center no-repeat`,
      }}>
      <div
        style={{
          paddingTop: '100%',
          width: '100%',
          maxWidth: '100%',
          minWidth: '64px',
          background: `url(${offer.images.thumb}) center no-repeat`,
          backgroundSize: 'contain',
        }} />
      <img
        src={offer.branding.pageflip.logo}
        alt={offer.branding.name}
        style={{ maxHeight: '24px', maxWidth: '100%' }} />
    </div>
  </div>
);
