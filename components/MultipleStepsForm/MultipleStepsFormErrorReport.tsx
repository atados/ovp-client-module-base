import React from 'react'
import styled from 'styled-components'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import Icon from '../Icon'

const Container = styled.div`
  background: #d6002a;
  border-radius: 10px 10px 0 0;
  color: #fff;
  text-align: center;
  font-size: 18px;
  padding: 8px;
`

interface MultipleStepsFormErrorReportProps {
  readonly className?: string
}

const MultipleStepsFormErrorReport: React.FC<
  MultipleStepsFormErrorReportProps
> = ({ className }) => {
  const { payload, failedToSubmit } = useMultipleStepsForm()
  return failedToSubmit ? (
    <Container className={className}>
      <Icon name="error" className="mr-2" />
      {typeof payload === 'string'
        ? payload
        : payload && (payload.message || payload.detail)}
    </Container>
  ) : null
}

MultipleStepsFormErrorReport.displayName = 'MultipleStepsFormErrorReport'

export default MultipleStepsFormErrorReport
