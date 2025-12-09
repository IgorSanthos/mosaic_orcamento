// src/pages/CreateEstimate.jsx
import React, { useState } from "react";
import Layout from "../components/Layout";
import ClientForm from "../components/ClientForm";
import ItemTable from "../components/ItemTable";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./CreateEstimate.css";

const parseLocalFloat = (val) => {
    const v = val ?? ''; // Garante que não é nulo ou indefinido
    if (typeof v === 'string') {
        // Substitui a vírgula por ponto e converte para float, ou retorna 0 se inválido
        return parseFloat(v.replace(',', '.')) || 0;
    }
    return v || 0;
}

export default function CreateEstimate() {
  const [clientName, setClientName] = useState("");
  const [productionEta, setProductionEta] = useState("3 a 4 dias");
  const [paymentMethod, setPaymentMethod] = useState("PIX");
  const [obs, setObs] = useState("");

  const [items, setItems] = useState([{ title:"Revista de Receitas AVIVA - 21x29,7cm - Miolo 14págs - Couche 150g", quantity:25, unit_price:15.75 }]);

  function addItem(){ setItems([...items, { title:"", quantity:1, unit_price:0 }]); }
  function updateItem(index, field, value){ const arr=[...items]; arr[index][field]=value; setItems(arr); }

  const total = items.reduce((s,it)=>s + (parseLocalFloat(it.quantity))*(parseLocalFloat(it.unit_price)), 0);

  // mensagem de texto 
  const finalMessage =
  `Segue proposta:

  ${items.map((it, i) => {
    const quantity = parseLocalFloat(it.quantity);
    const unit_price = parseLocalFloat(it.unit_price);
    return `_ITEM ${i + 1}_
  "${it.title}"
  *_${quantity} unidades (R$ ${unit_price.toFixed(2)} un)_* 
  Valor TOTAL - *R$ ${(quantity * unit_price).toFixed(2)}*`;
  }).join("\n\n")}

  --------------------------
  *Cliente:* ${clientName}
  *Data:* ${new Date().toLocaleDateString('pt-BR')}
  *Produção:* ${productionEta}

  *Valor total a pagar:*  
  *R$ ${total.toFixed(2)}*
  `;


  function saveEstimate(){
    const payload = {
      client_name: clientName,
      production_eta: productionEta,
      payment_method: paymentMethod,
      observations: obs,
      items: items.map(it=>({ title:it.title, quantity:parseLocalFloat(it.quantity), unit_price:parseLocalFloat(it.unit_price) }))
    };
    fetch(`${import.meta.env.VITE_API_URL}/api/estimates`, {
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
      doc.text(`Observações: ${obs}`, 14, 78);

      const tableData = items.map(it => {
        const quantity = parseLocalFloat(it.quantity);
        const unit_price = parseLocalFloat(it.unit_price);
        return [quantity, it.title, `R$ ${unit_price.toFixed(2)}`, `R$ ${(quantity*unit_price).toFixed(2)}`];
      });

      autoTable(doc, { head:[["Qtd","Descrição","Valor Unit.","Subtotal"]], body:tableData, startY: 90 });
      doc.setFontSize(14);
      doc.text(`Total: R$ ${total.toFixed(2)}`, 14, doc.lastAutoTable.finalY + 16);
      doc.save("orcamento_mosaic.pdf");
    };
  };

  return (
    <Layout title="CRIAR ORÇAMENTO" subtitle="Crie e exporte propostas rápidas">
      <ClientForm
        clientName={clientName} setClientName={setClientName}
        productionEta={productionEta} setProductionEta={setProductionEta}
        paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod}
      />

      <div className="obs-textarea">
        <label className="obs-label">Observações</label>
        <textarea className="input textarea-md" value={obs} onChange={e => setObs(e.target.value)} />
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
