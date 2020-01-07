import React from 'react'
import styled from 'styled-components'

const generateSizeCSS = (height: number): string => {
  const itemSize = Math.round(height - height / 6)
  const padding = Math.round((height - itemSize) / 2)
  return `
    width: ${height * 1.7}px;
    height: ${height}px;

    .input-switch-indicator::after {
      width: ${itemSize}px;
      height: ${itemSize}px;
      top: ${padding}px;
      left: ${padding}px;
    }


    > input:checked + .input-switch-indicator::after {
      margin-left: ${(itemSize + padding) * -1}px;
    }
  `
}

interface ButtonProps {
  height: number
}
const Button = styled('span')`
  display: inline-block;

  > input {
    display: none;
  }

  ${(props: ButtonProps) =>
    generateSizeCSS(props.height)} .input-switch-indicator {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 18px;
    position: relative;
    cursor: pointer;
    background: #eee;
    box-shadow: inset 0 0 1px rgba(0, 0, 0, 0.1);
    transition: background 0.2s;
  }

  .input-switch-indicator::after {
    content: '';
    position: absolute;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    margin-left: 0;
    transition: left 0.2s, margin-left 0.2s;
  }

  > input:checked + .input-switch-indicator {
    background: #0eb261;
  }

  > input:checked + .input-switch-indicator::after {
    left: 100%;
  }
`

interface ToggleSwitchProps {
  readonly height?: number
  readonly className?: string
}

const ToggleSwitch: React.FC<ToggleSwitchProps &
  React.InputHTMLAttributes<HTMLInputElement>> = ({
  height,
  className,
  ...props
}) => (
  <Button height={height as number} className={className}>
    <input type="checkbox" {...props} />
    <span className="input-switch-indicator" />
  </Button>
)

ToggleSwitch.displayName = 'ToggleSwitch'
ToggleSwitch.defaultProps = {
  height: 36,
}

export default ToggleSwitch
