import { css } from 'lit-element';

const sharedStyle = css`
  .button-section-background {
    background: var(--sonos-int-button-section-background-color);
    border-radius: var(--sonos-int-border-radius);
    border: var(--sonos-int-border-width) solid var(--sonos-int-color);
    margin-top: 1rem;
    padding: 0 0.5rem;
  }
`;

export default sharedStyle;
