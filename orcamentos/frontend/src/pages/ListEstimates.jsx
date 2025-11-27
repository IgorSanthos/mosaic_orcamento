// ListEstimates.jsx - Lista de orçamentos salvos 
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";

export default function ListEstimates() {
  const [estimates, setEstimates] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/estimates")
      .then(res => res.json())
      .then(data => setEstimates(data))
      .catch(err => console.error("Erro ao carregar orçamentos:", err));
  }, []);

  function handleDelete(id) {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;

    fetch(`http://localhost:8080/api/estimates/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setEstimates(estimates.filter(e => e.id !== id));
        alert("Orçamento excluído!");
      })
      .catch(err => alert("Erro ao excluir: " + err));
  }

  return (
    <Layout title="Orçamentos Salvos" subtitle="Gerencie todos os orçamentos já criados.">
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
        <thead>
          <tr>
            <th style={header}>ID</th>
            <th style={header}>Cliente</th>
            <th style={header}>Data</th>
            <th style={header}>Valor Total</th>
            <th style={header}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {estimates.map(est => (
            <tr key={est.id}>
              <td style={cell}>{est.id}</td>
              <td style={cell}>{est.client_name}</td>
              <td style={cell}>{new Date(est.created_at).toLocaleDateString('pt-BR')}</td>
              <td style={cell}>R$ {(est.total || 0).toFixed(2).replace('.', ',')}</td>
              <td style={cell}>
                <Link to={`/orcamentos/${est.id}`} style={btnLink}>Ver</Link>

                <Link
                  to={`/orcamentos/${est.id}/editar`}
                  style={{ ...btnLink, background: "#f0ad4e" }}
                >
                  Editar
                </Link>

                <button
                  style={{ ...btnButton, background: "#d9534f" }}
                  onClick={() => handleDelete(est.id)}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Layout>
  );
}

const header = {
  background: "#f1f1f1",
  padding: "10px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
  fontWeight: "600"
};

const cell = {
  padding: "10px",
  borderBottom: "1px solid #eee"
};

const btnLink = {
  padding: "6px 12px",
  background: "#1a73e8",
  color: "white",
  borderRadius: "6px",
  textDecoration: "none",
  marginRight: "8px",
  display: "inline-block"
};

const btnButton = {
  padding: "6px 12px",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};
