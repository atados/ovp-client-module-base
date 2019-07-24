import React from 'react'

interface VolunteerIconProps {
  readonly className?: string
  readonly width?: number
  readonly height?: number
  readonly fill?: string
}

const VolunteerIcon: React.FC<VolunteerIconProps> = ({
  className,
  fill,
  width,
  height,
}) => (
  <svg
    className={className}
    width={`${width}px`}
    height={`${height}px`}
    viewBox="0 0 43 62"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <rect fill={fill} x="22" y="0" width="4" height="14" rx="2" />
      <rect
        fill={fill}
        transform="translate(36.683179, 11.140829) rotate(31.000000) translate(-36.683179, -11.140829) "
        x="34.6831788"
        y="4.1408286"
        width="4"
        height="14"
        rx="2"
      />
      <rect
        fill={fill}
        transform="translate(10.340616, 11.590988) scale(-1, 1) rotate(31.000000) translate(-10.340616, -11.590988) "
        x="8.34061644"
        y="4.59098794"
        width="4"
        height="14"
        rx="2"
      />
      <path
        d="M13,62 C5.66574062,45.9981479 1.66574062,37.3314812 1,36 C-1.80411242e-14,34 7.05824288e-14,32 1,31 C1.57687552,30.4231245 4,29 6,31 C6.92789376,31.9278938 7.64746333,33.2949267 8,34 C10,38 10,38 12,41 C12.5532286,41.8298429 13.2025827,42 15,42 C16.3333333,42 22,42 32,42 C34,42 36,43 37,45 C37.6666667,47.6666667 38.6666667,53.3333333 40,62 L13,62 Z"
        fill={fill}
      />
      <circle fill={fill} cx="23" cy="29" r="8" />
    </g>
  </svg>
)

VolunteerIcon.displayName = 'VolunteerIcon'
VolunteerIcon.defaultProps = {
  fill: '#333',
  width: 43,
  height: 62,
  className: undefined,
}

export default VolunteerIcon
