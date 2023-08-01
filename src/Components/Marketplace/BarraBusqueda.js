import { TextInput, UnstyledButton } from "@mantine/core";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function BarraBusqueda() {
  let [searchParams, setSearchParams] = useSearchParams({ palabra: "" });
  let [search, setSearch] = useState(searchParams.get("palabra"));
  let navigate = useNavigate();
  useEffect(() => {
    console.log({ search });
  }, [search]);
  return (
    <TextInput
      value={search}
      onChange={({ currentTarget: { value } }) => {
        setSearch(value);
      }}
      rightSection={
        <UnstyledButton
          onClick={() => {
            let x = new URLSearchParams(searchParams);
            x.set("palabra", search);
            navigate(`/app/marketplace/resultados?${x}`);
          }}
        >
          <AiOutlineSearch />
        </UnstyledButton>
      }
    />
  );
}
