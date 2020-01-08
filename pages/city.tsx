import React from 'react'
import cx from 'classnames'

interface CityPageProps {
  readonly className?: string
}

const CityPage: React.FC<CityPageProps> = ({ className }) => {
  return <div className={cx(className, '')} />
}

CityPage.displayName = 'CityPage'

export default CityPage
