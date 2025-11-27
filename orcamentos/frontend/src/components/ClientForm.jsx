// src/components/ClientForm.jsx
import React from "react";

export default function ClientForm({
  clientName, setClientName,
  productionEta, setProductionEta,
  paymentMethod, setPaymentMethod,
  validityDays, setValidityDays
}) {
  return (
    <div style={{ marginBottom: 18 }}>
      <h3 style={{ margin: 0, marginBottom: 8 }}>Dados do Cliente</h3>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 160px", gap: 12 }}>
        <input className="input" placeholder="Nome do cliente" value={clientName} onChange={e => setClientName(e.target.value)} />
        <input className="input input-sm" placeholder="Prazo (ex: 3 a 4 dias)" value={productionEta} onChange={e => setProductionEta(e.target.value)} />
        <input className="input" placeholder="Forma de pagamento (PIX, Cartão...)" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} />
        <input className="input input-sm" type="number" placeholder="Validade (dias)" value={validityDays} onChange={e => setValidityDays(Number(e.target.value))} />
      </div>
    </div>
  );
}
