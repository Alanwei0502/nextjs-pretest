'use client'

import React, { useCallback, useEffect, useRef } from 'react';
import { InputNumberClickType } from '@/types';
import CustomButton from '../CustomButton/CustomButton';
import './CustomInputNumber.css';

type NativeHTMLInputElementProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

interface ICustomInputNumberProps extends NativeHTMLInputElementProps {
  min: number;
  max: number;
  step: number;
  name: string;
  disabled: boolean;
  value: string | number | readonly string[];
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  onBlur: React.FocusEventHandler<HTMLInputElement>
}

const CustomInputNumber: React.FC<ICustomInputNumberProps> = (props) => {
  const {
    min,
    max,
    step,
    value,
    disabled,
    onChange,
    ...rest
  } = props;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const clearTimeoutIntervalRef = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, [])

  const createSyntheticEvent = (value: number): React.ChangeEvent<HTMLInputElement> => {
    if (!inputRef.current) {
      throw new Error("Input element is not available");
    }

    const event = new Event('change', { bubbles: true });

    const syntheticEvent = {
      ...event,
      target: { ...props, value: value.toString() },
      currentTarget: inputRef.current,
      persist: () => { },
      isPersistent: () => false,
      isDefaultPrevented: () => false,
      isPropagationStopped: () => false,
      preventDefault: () => { },
      stopPropagation: () => { },
      nativeEvent: event,
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    return syntheticEvent;
  };

  const handleClick = (type: InputNumberClickType) => {
    if (!inputRef.current) return;

    const value = +inputRef.current.value;

    const newValue = type === InputNumberClickType.increase
      ? Math.min(max, value + step)
      : Math.max(min, value - step);

    if (onChange) {
      const syntheticEvent = createSyntheticEvent(newValue);
      onChange(syntheticEvent);
    }
  }


  const handleMouseDown = (type: InputNumberClickType) => {
    if (timeoutRef.current || intervalRef.current) return;

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        if (!inputRef.current) return;
        const value = +inputRef.current.value;

        const newValue = type === InputNumberClickType.increase
          ? Math.min(max, value + step)
          : Math.max(min, value - step);

        inputRef.current.value = newValue.toString();
      }, 100);
    }, 1000);
  }

  const handleMouseUpAndLeave = () => {
    clearTimeoutIntervalRef();

    if (!inputRef.current || !onChange) return;

    const newValue = inputRef.current.value;
    if (value !== newValue) {
      const syntheticEvent = createSyntheticEvent(+newValue);
      onChange(syntheticEvent);
    }
  }

  useEffect(() => {
    return clearTimeoutIntervalRef;
  }, [clearTimeoutIntervalRef]);


  return (
    <div className='custom_input_number'>
      <CustomButton
        className='input_number_button'
        onClick={() => handleClick(InputNumberClickType.decrease)}
        onMouseDown={() => handleMouseDown(InputNumberClickType.decrease)}
        onMouseUp={handleMouseUpAndLeave}
        onMouseLeave={handleMouseUpAndLeave}
        disabled={disabled || +value <= min}
      >
        <svg height="1.5rem" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 11H20V13H4V11Z" fill={disabled ? '#333333' : "#3498db"} />
        </svg>
      </CustomButton>
      <input
        ref={inputRef}
        type="number"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange}
        className='input_number hide_number_input_spinners'
        disabled={disabled || (+value <= min && +value >= max)}
        {...rest}
      />
      <CustomButton
        className='input_number_button'
        onClick={() => handleClick(InputNumberClickType.increase)}
        onMouseDown={() => handleMouseDown(InputNumberClickType.increase)}
        onMouseUp={handleMouseUpAndLeave}
        onMouseLeave={handleMouseUpAndLeave}
        disabled={disabled || +value >= max}
      >
        <svg fill={disabled ? '#333333' : "#3498db"} height="1.3rem" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
          <path d="M866.332 213v653.332H213v186.666h653.332v653.332h186.666v-653.332h653.332V866.332h-653.332V213z" />
        </svg>
      </CustomButton>
    </div >
  );
};

export default CustomInputNumber;