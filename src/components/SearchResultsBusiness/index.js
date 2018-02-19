import React from 'react';

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

export default ({ business }) => (
  <div
    style={{
      background: `#${business.color}`,
      color: contrastBWFromHex(business.color),
      borderRadius: '4px',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow:
        '0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)',
    }}>
    <ul
      style={{
        flex: 1,
        alignItems: 'center',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        listStyle: 'none',
        margin: 0,
        padding: 0,
        backgroundColor: contrastHighlightFromHex(business.color),
      }}>
      {business.pagedPublications.map((pagedPublication, index) => (
        <li
          key={pagedPublication.id}
          style={{
            width: '60%',
            flexShrink: 0,
            margin: '0 5%',
            marginLeft: index === 0 ? '20%' : undefined,
            marginRight: index + 1 === business.pagedPublications.length ? '20%' : '5%',
          }}>
          <img
            src={pagedPublication.images.view}
            alt={pagedPublication.label}
            style={{ width: '100%' }} />
        </li>
      ))}
      {business.pagedPublications.length > 1 && <li style={{ visibility: 'hidden' }}>.</li>}
    </ul>
    {business.locations.length > 1 && (
      <ul
        style={{
          display: 'flex',
          overflowX: 'auto',
          overflowY: 'hidden',
          listStyle: 'none',
          margin: 0,
          padding: '8px',
        }}>
        {business.locations.map(location => (
          <li
            key={location.id}
            style={{
              whiteSpace: 'nowrap',
              borderRadius: '2px',
              marginRight: '4px',
              padding: '2px 4px',
              border: `1px solid ${contrastHighlightFromHexInv(business.color)}`,
              fontSize: '14px',
            }}>
            {location.street}
            <div>
              {location.zipCode} {location.city}
            </div>
          </li>
        ))}
        <li>
          <a href="#">Vis alle</a>
        </li>
      </ul>
    )}
    {business.locations.length === 1 && (
      <div
        style={{
          whiteSpace: 'nowrap',
          borderRadius: '4px',
          margin: '8px 4px',
          padding: '4px 4px',
        }}>
        {business.locations[0].street}
        <div>
          {business.locations[0].zipCode} {business.locations[0].city}
        </div>
      </div>
    )}
  </div>
);
