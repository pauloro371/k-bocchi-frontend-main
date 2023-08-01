import { Group, UnstyledButton } from "@mantine/core";
import { forwardRef } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";

export const Icono = forwardRef(({ ...others }, ref) => {
    return (
      <UnstyledButton ref={ref} {...others}>
        <Group>{<HiEllipsisVertical size="1rem" />}</Group>
      </UnstyledButton>
    );
  });