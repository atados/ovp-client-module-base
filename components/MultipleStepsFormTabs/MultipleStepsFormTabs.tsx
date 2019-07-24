import cx from 'classnames'
import Link from 'next/link'
import React from 'react'
import styled from 'styled-components'
import useMultipleStepsForm from '~/hooks/use-multiple-steps-form'
import { FormComposerMode } from '../FormComposer/FormComposer'
import Icon from '../Icon'

const Container = styled.div`
  height: 64px;
  overflow-x: auto;
  white-space: nowrap;

  &::-webkit-scrollbar {
    display: none;
  }
`

const Tab = styled.a`
  font-size: 16px;
  color: rgba(0, 0, 0, 0.4);
  transition: color 0.2s;
  display: inline-block;
  padding: 20px 0;
  margin-right: 20px;
  font-weight: 500;

  &:hover {
    text-decoration: none;
    color: rgba(0, 0, 0, 0.6);
  }

  &.active {
    color: rgba(0, 0, 0, 0.8);
    opacity: 1;
  }
`

interface MultipleStepsFormTabsProps {
  readonly pathname: string
  readonly as: string
  readonly className?: string
  readonly query?: any
}

const MultipleStepsFormTabs: React.FC<MultipleStepsFormTabsProps> = ({
  className,
  pathname,
  as: asPath,
  query,
}) => {
  const {
    steps,
    currentStepId,
    context: { mode },
    submitted,
  } = useMultipleStepsForm()
  const onTabClick = (event: React.MouseEvent) => {
    if (submitted && mode !== FormComposerMode.EDIT) {
      event.preventDefault()
    }
  }

  return (
    <Container>
      {steps.map(step => (
        <Link
          key={step.id}
          href={{
            pathname,
            query: query ? { ...query, stepId: step.id } : { stepId: step.id },
          }}
          as={`${asPath}${step.id}${
            query && query.draftIndex !== undefined
              ? `?draftIndex=${query.draftIndex}`
              : ''
          }`}
        >
          <Tab
            className={cx('animate-slideInUp', className, {
              active: step.id === currentStepId,
            })}
            href={`${asPath}${step.id}`}
            onClick={onTabClick}
          >
            {step.done && (
              <Icon name="check_circle" className="tc-success mr-2" />
            )}
            {step.options.label}
          </Tab>
        </Link>
      ))}
    </Container>
  )
}

MultipleStepsFormTabs.displayName = 'MultipleStepsFormTabs'

export default MultipleStepsFormTabs
