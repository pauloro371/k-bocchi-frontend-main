import { Input } from "@mantine/core";
import { useId, useShallowEffect } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { IMaskInput, useIMask, IMask } from "react-imask";
import getValueFromPath from "../GetValueFromPath";

const maskOptions = {
  overwrite: true,
  autofix: true,
  mask: "HH:MM",
  blocks: {
    HH: {
      mask: IMask.MaskedRange,
      placeholderChar: "HH",
      from: 0,
      to: 23,
      maxLength: 2,
    },
    MM: {
      mask: IMask.MaskedRange,
      placeholderChar: "MM",
      from: 0,
      to: 59,
      maxLength: 2,
    },
  },
};
export default function HoraInput({
  label,
  form,
  inputName,
  propName,
  value,
  error,
  ...props
}) {
  const id = useId();
  // const [value, setValue] = useState(getValueFromPath(form.values, inputName));
  // const previousValue = usePrevious(value);
  // useShallowEffect(() => {
  //   console.log(inputName, getValueFromPath(form.values, inputName));
  //   let x = form.validateField(inputName);
  //   console.log({ e: form.errors, x });

  //   setTypedValue(getValueFromPath(form.values, inputName));
  //   return () => form.clearFieldError(inputName);
  // }, [getValueFromPath(form.values, inputName)]);
  useEffect(() => {

    // setValue(getValueFromPath(form.values, inputName));
  }, []);
  const { ref, setValue, setTypedValue, setUnmaskedValue } = useIMask(
    maskOptions,
    {
      onAccept: (s, l) => {
        form.setFieldValue(inputName, s);
      },
      onComplete: (s) => {
        // console.log({ complete: s });
        // console.log(inputName);
      },
    }
  );
  return (
    <Input.Wrapper id={id} label={label} required maw={320} mx="auto" error={error}>
      <Input ref={ref} id={id} placeholder="00:00" value={getValueFromPath(form.values, inputName)} {...props}/>
    </Input.Wrapper>
  );
}
