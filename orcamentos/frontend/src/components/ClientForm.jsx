// src/components/ClientForm.jsx
import React from "react";
import "./ClientForm.css";

export default function ClientForm({
  clientName, setClientName,
  productionEta, setProductionEta,
  paymentMethod, setPaymentMethod
}) {
  return (
    <div className="client-form">
      <h3 className="client-form-title">Dados do Cliente</h3>

      <div className="client-form-grid">
        <input className="input" placeholder="Nome do cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
        <div></div>
        <div>
          <label className="label">Prazo</label>
          <input className="input" placeholder="Prazo (ex: 3 a 4 dias)" value={productionEta} onChange={e => setProductionEta(e.target.value)} />
        </div>
        <div>
          <label className="label">Forma de pagamento</label>
          <input className="input" placeholder="Forma de pagamento (PIX, Cartão...)" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
