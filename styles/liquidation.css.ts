import { globalStyle, style } from '@vanilla-extract/css';
import { vars } from 'degen';

export const dataContainer = style({
  display: 'flex',
  flexDirection: 'column',
  marginTop: '1em',
  borderWidth: vars.borderWidths['0.5'],
  borderColor: 'transparent',
  transition: 'all .5s'
});

export const dataRowWrapper = style({
  width: '100%',
  display: 'flex'
});

globalStyle(`${dataRowWrapper} > div`, {
  width: '100%',
  justifyContent: 'space-around'
});

globalStyle(`${dataRowWrapper} > div > *`, {
  width: '20%',
  textAlign: 'center',
  display: 'block'
});

globalStyle(`${dataRowWrapper} > div > div > div > span`, {
  display: 'block',
  textAlign: 'center'
});

export const avatarContainer = style({
  display: 'flex!important',
  flexDirection: 'row',
  alignItems: 'center'
});

globalStyle(`${avatarContainer} > div`, {
  width: 'auto',
  marginRight: '.5em'
});

export const openRows = style({
  ':hover': {
    borderColor: vars.colors.accent
  }
});
