import {Center,Outlet,Card} from "@mantine/core"

export function FormularioRegistro({setDatos,datos}) {
  return (
    <>
      <Center mx="center" mih="100vh">
        <Card
          shadow="xl"
          padding="lg"
          radius="md"
          maw="30%"
          miw={350}
          mx="auto"
          style={{ borderRadius: 0 }}
        >
          <Outlet context={{ setDatos: setDatos, datos: datos }} />
        </Card>
      </Center>
    </>
  );
}
