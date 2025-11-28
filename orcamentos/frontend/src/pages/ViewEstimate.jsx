// src/pages/ViewEstimate.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import "./ViewEstimate.css";

export default function ViewEstimate(){
  const { id } = useParams();
  const [estimate, setEstimate] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(()=> {
    fetch(`${import.meta.env.VITE_API_URL}/api/estimates/${id}`)
      .then(r=>r.json()).then(data=>{
        setEstimate(data.estimate);
        setMessage(data.message || "");
      }).catch(()=>{});
  },[id]);

  if(!estimate) return <Layout title="Carregando..." />;

  return (
    <Layout title={`Orçamento #${estimate.id}`} subtitle={`Cliente: ${estimate.client_name}`}>
      <div className="view-details">
        <strong>Produção:</strong> {estimate.production_eta} <br/>
        <strong>Pagamento:</strong> {estimate.payment_method} <br/>
        <strong>Validade:</strong> {estimate.validity_days} dias
      </div>

      <h4>Itens</h4>
      <table className="table">
        <thead><tr><th>Qtd</th><th>Descrição</th><th>Valor Unit.</th><th>Subtotal</th></tr></thead>
        <tbody>
          {estimate.items.map((it,i)=>(
            <tr key={i}>
              <td className="view-item-qty">{it.quantity}</td>
              <td>{it.title}</td>
              <td className="view-item-price">R$ {(it.unit_price || 0).toFixed(2).replace('.', ',')}</td>
              <td className="view-item-price">R$ {((it.quantity || 0) * (it.unit_price || 0)).toFixed(2).replace('.', ',')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer-actions view-footer">
        <button className="btn" onClick={() => navigator.clipboard.writeText(message)}>Copiar Texto</button>
        <button className="btn btn-warning" onClick={(e)=>{e.preventDefault(); window.print();}}>Imprimir</button>
        <div className="small-muted" style={{ marginLeft: 10 }}>Total: R$ {(estimate.total || 0).toFixed(2).replace('.', ',')}</div>
      </div>
    </Layout>
  );
}
