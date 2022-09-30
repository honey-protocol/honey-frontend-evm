import { style } from '@vanilla-extract/css';

export const pageContent = style({
  display: 'grid',
  gridGap: '30px',
  gridTemplateColumns: '1fr 1fr',
  '@media': {
    'screen and (max-width: 900px)': {
      gridTemplateColumns: '1fr'
    }
  }
});
