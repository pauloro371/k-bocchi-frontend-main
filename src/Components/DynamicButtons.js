import { Button, Tooltip } from "@mantine/core";

export function EnabledButton({ ...props }) {
    return (
      <Button {...props} type="sumbit">
        {props.children}
      </Button>
    );
  }
  
const defaultLabelDisabled = "Llena todos los campos correctamente"
export function DisabledButton({ label=defaultLabelDisabled,...props }) {
    return (
      <Tooltip label={label}>
        <Button
          data-disabled
          sx={{ "&[data-disabled]": { pointerEvents: "all" } }}
          onClick={(event) => event.preventDefault()}
          {...props}
        >
          {props.children}
        </Button>
      </Tooltip>
    );
  }