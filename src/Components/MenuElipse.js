import { Group, Menu, UnstyledButton } from "@mantine/core";
import { forwardRef } from "react";
import { HiEllipsisVertical } from "react-icons/hi2";

export default function MenuElipse({ ...props }) {
  const handleClick = (event) => {
    event.stopPropagation();
  };
  return (
    <Group position="center" onClick={handleClick} {...props}>
      <Menu withArrow>
        <Menu.Target>
          <Icono />
        </Menu.Target>
        <Menu.Dropdown>{props.children}</Menu.Dropdown>
      </Menu>
    </Group>
  );
}
export const Icono = forwardRef(({ ...others }, ref) => {
  return (
    <UnstyledButton ref={ref} {...others}>
      <Group>{<HiEllipsisVertical size="1rem" />}</Group>
    </UnstyledButton>
  );
});
