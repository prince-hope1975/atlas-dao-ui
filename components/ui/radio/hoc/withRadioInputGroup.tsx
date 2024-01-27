import RadioInputGroupContext from '@/components/ui/radio/context/radioInputGroupContext'
import React from 'react'
// eslint-disable-next-line react/display-name
export default function withRadioInputGroup<T>(
	Component: React.ComponentType<T>
) {
  // eslint-disable-next-line react/display-name
  return (props: T) => (
    // eslint-disable-next-line react/display-name
    <RadioInputGroupContext.Consumer>
      {(inputGroup) => <Component {...props} inputGroup={inputGroup} />}
    </RadioInputGroupContext.Consumer>
  );
}
withRadioInputGroup.displayName = 'withRadioInputGroup'
