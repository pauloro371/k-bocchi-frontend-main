import { useState, useRef, useEffect } from "react";
import {
  NumberInput,
  Group,
  ActionIcon,
  NumberInputHandlers,
  rem,
} from "@mantine/core";

export default function ControlCantidad({
  max,
  disabled,
  size,
  widthInput,
  heightInput,
  initialValue = 0,
  onChange = (value, setValue = (value) => {}) => {},
  onBlur = (value, setValue = (value) => {}) => {},
  step = 1,
  min = 0,
  ...props
}) {
  const [value, setValue] = useState(initialValue);
  const [lastValue, setLastValue] = useState(min - 1);
  const handlers = useRef();

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);
  useEffect(() => {
    if (lastValue !== min - 1) {
      setValue(lastValue);
      setLastValue(min - 1);
    }
  }, [lastValue]);
  useEffect(() => {
    onChange(value, setValue);
  }, [value]);
  return (
    <Group spacing={5} {...props} noWrap>
      <ActionIcon
        size={size}
        variant="default"
        disabled={value === min || disabled}
        onClick={() => {
          handlers.current.decrement();
          onBlur(value - 1, setLastValue);
        }}
      >
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={(val) => setValue(val)}
        handlersRef={handlers}
        max={max}
        min={min}
        step={step}
        disabled={disabled}
        onBlur={(e) => {
          onBlur(value, setLastValue);
        }}
        styles={{
          input: {
            width: widthInput,
            height: heightInput,
            textAlign: "center",
          },
        }}
      />

      <ActionIcon
        size={size}
        variant="default"
        disabled={value === max || disabled}
        onClick={() => {
          handlers.current.increment();
          onBlur(value + 1, setLastValue);
        }}
      >
        +
      </ActionIcon>
    </Group>
  );
}
