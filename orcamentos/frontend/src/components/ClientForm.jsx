// src/components/ClientForm.jsx
import React from "react";

export default function ClientForm({
  clientName, setClientName,
  productionEta, setProductionEta,
  paymentMethod, setPaymentMethod
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>Dados do Cliente</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input className="input" placeholder="Nome do cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
        <div></div>
        <div>
          <label className="label">Prazo</label>
          <input className="input input-sm" placeholder="Prazo (ex: 3 a 4 dias)" value={productionEta} onChange={e => setProductionEta(e.target.value)} />
        </div>
        <div>
          <label className="label">Forma de pagamento</label>
          <input className="input" placeholder="Forma de pagamento (PIX, Cartão...)" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
