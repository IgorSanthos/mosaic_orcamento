// ListEstimates.jsx - Lista de orçamentos salvos 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import "./ListEstimates.css";

export default function ListEstimates() {
  const [estimates, setEstimates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/estimates`)
      .then(res => res.json())
      .then(data => setEstimates(data))
      .catch(err => console.error("Erro ao carregar orçamentos:", err))
      .finally(() => setLoading(false)); // 👈 QUANDO TERMINA
  }, []);

  function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/estimates/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setEstimates(estimates.filter(e => e.id !== id));
        alert("Orçamento excluído!");
      })
      .catch(err => alert("Erro ao excluir: " + err));
  }

  if (loading) {
    return (
      <Layout title="Orçamentos Salvos" subtitle="Carregando dados...">
        <div className="loading">
          Carregando...
        </div>
      </Layout>
    );
  }
  return (
    <Layout title="Orçamentos Salvos" subtitle="Gerencie todos os orçamentos já criados.">
      <table className="est-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Cliente</th>
            <th>Data</th>
            <th>Valor Total</th>
            <th>Ações</th>
          </tr>
        </thead>

        <tbody>
          {estimates.map((est, index) => (
            <tr key={est.id}>
              <td>{index + 1}</td>
              <td>{est.id}</td>
              <td>{est.client_name}</td>
              <td>{new Date(est.created_at).toLocaleDateString("pt-BR")}</td>
              <td>R$ {(est.total || 0).toFixed(2).replace(".", ",")}</td>

              <td className="actions">
                <Link className="btn primary" to={`/orcamentos/${est.id}`}>
                  🔍
                </Link>

                <Link className="btn warning" to={`/orcamentos/${est.id}/editar`}>
                  ✏️
                </Link>

                <button className="btn danger" onClick={() => handleDelete(est.id)}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}
