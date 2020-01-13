import styled from 'styled-components'
import { Color } from '~/common'

const BannerGradientOverlay = styled.div`
  position: relative;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    opacity: 0.6;
    background: linear-gradient(
      180deg,
      ${Color.primary[800]},
      ${Color.primary[400]}
    );
  }
`

export default BannerGradientOverlay
