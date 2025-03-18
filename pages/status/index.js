import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <DatabaseStatus />
    </>
  );
}

function DatabaseStatus() {
  const { isLoading, data } = useSWR("api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  if (!isLoading && data) {
    return (
      <>
        <h1>Status</h1>
        <div>Atualizado em: {data.updated_at}</div>
        <h2>Database</h2>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões Ativas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões Máximass: {data.dependencies.database.max_connections}
        </div>
        a
      </>
    );
  } else {
    return <div>Carregando...</div>;
  }
}
