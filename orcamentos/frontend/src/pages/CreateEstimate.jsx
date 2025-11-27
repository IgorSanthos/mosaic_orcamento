// src/pages/CreateEstimate.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import ClientForm from "../components/ClientForm";
import ItemTable from "../components/ItemTable";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function CreateEstimate() {
  const [clientName, setClientName] = useState("");
  const [productionEta, setProductionEta] = useState("3 a 4 dias");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [validityDays, setValidityDays] = useState(7);
  const [obs, setObs] = useState("");

  const [items, setItems] = useState([{ title:"Revista de Receitas AVIVA", specs:"21cm x 29,7cm - Miolo 14págs - Couche 150g - Impressão Digital (4x4)", quantity:25, unit_price:15.75 }]);

  function addItem(){ setItems([...items, { title:"", specs:"", quantity:1, unit_price:0 }]); }
  function updateItem(index, field, value){ const arr=[...items]; arr[index][field]=value; setItems(arr); }

  const total = items.reduce((s,it)=>s + (it.quantity||0)*(it.unit_price||0), 0);

  const finalMessage =
`Segue proposta:

${items.map((it,i)=>`Item ${i+1} - "${it.title}" - ${it.specs}
${it.quantity} unidades (R$ ${it.unit_price.toFixed(2)} un.)
Subtotal: R$ ${(it.quantity*it.unit_price).toFixed(2)}`).join("\n\n")}

--------------------------
Cliente: ${clientName}
Data: ${new Date().toLocaleDateString()}
Produção: ${productionEta}

Valor total a pagar:
R$ ${total.toFixed(2)}
`;

  function saveEstimate(){
    const payload = {
      client_name: clientName,
      production_eta: productionEta,
      payment_method: paymentMethod,
      validity_days: validityDays,
      observations: obs,
      items: items.map(it=>({ title:it.title, specs:it.specs, quantity:it.quantity, unit_price:it.unit_price }))
    };
    fetch("http://localhost:8080/api/estimates", {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload)
    }).then(r=>r.json()).then(res=>{
      alert("Orçamento salvo!");
      console.log(res);
    }).catch(e=>alert("Erro: "+e));
  }

  const generatePDF = () => {
    const doc = new jsPDF();
    const logo = new Image(); logo.src = "/logo.png";

    logo.onload = () => {
      doc.addImage(logo, "PNG", 14, 10, 48, 24);
      doc.setFontSize(20);
      doc.text("Mosaic Gráfica - Orçamento", 70, 26);
      doc.setFontSize(11);
      doc.text(`Cliente: ${clientName}`, 14, 46);
      doc.text(`Produção: ${productionEta}`, 14, 54);
      doc.text(`Pagamento: ${paymentMethod}`, 14, 62);
      doc.text(`Validade: ${validityDays} dias`, 14, 70);
      doc.text(`Observações: ${obs}`, 14, 78);

      const tableData = items.map(it => [it.quantity, it.title, `R$ ${it.unit_price.toFixed(2)}`, `R$ ${(it.quantity*it.unit_price).toFixed(2)}`]);

      autoTable(doc, { head:[["Qtd","Descrição","Valor Unit.","Subtotal"]], body:tableData, startY: 90 });
      doc.setFontSize(14);
      doc.text(`Total: R$ ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 16);
      doc.save("orcamento_mosaic.pdf");
    };
  };

  return (
    <Layout title="Criar Orçamento" subtitle="Crie e exporte propostas rápidas">
      <ClientForm
        clientName={clientName} setClientName={setClientName}
        productionEta={productionEta} setProductionEta={setProductionEta}
        paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
        validityDays={validityDays} setValidityDays={setValidityDays}
      />

      <div style={{ marginBottom: 12 }}>
        <label style={{ fontWeight:600 }}>Observações</label>
        <textarea className="input textarea-md" value={obs} onChange={e=>setObs(e.target.value)} />
      </div>

      <ItemTable items={items} updateItem={updateItem} addItem={addItem} />

      <div className="footer-actions">
        <button className="btn" onClick={saveEstimate}>Salvar Orçamento</button>
        <button className="btn btn-success" onClick={()=>navigator.clipboard.writeText(finalMessage)}>Copiar Texto</button>
        <button className="btn btn-warning" onClick={generatePDF}>Gerar PDF</button>
        <div className="small-muted">Total: R$ {total.toFixed(2)}</div>
      </div>
    </Layout>
  );
}
