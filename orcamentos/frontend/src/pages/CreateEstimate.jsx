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

  //============================================== GERAR PDF 

  const generatePDF = ({
  clientName,
  date,
  paymentMethod,
  items,
  obs,
  total
  }) => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // === NUMERAÇÃO DO PEDIDO ===
  const orderNumber = Date.now().toString().slice(-6);

  // === DATA E HORA DA GERAÇÃO ===
  const now = new Date();
  const generatedAt = now.toLocaleDateString("pt-BR") + " " + now.toLocaleTimeString("pt-BR");

  const logo = new Image();
  logo.src = "/logo_mosaic.png";

  logo.onload = () => {
    const pageWidth = doc.internal.pageSize.width;

    const marginLeft = 40;
    const marginRight = 30;
    const usableWidth = pageWidth - marginLeft - marginRight;

    // ---------------- CABEÇALHO ----------------
    doc.addImage(logo, "PNG", marginLeft, 30, 100, 100);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("MOSAIC GRÁFICA", pageWidth - marginRight - 160, 40);
    doc.setFont("helvetica", "normal");
    doc.text("CNPJ: 55.326.497/0001-24", pageWidth - marginRight - 160, 60);
    doc.text("Telefone: +55 11 91944-0061", pageWidth - marginRight - 160, 80);
    doc.text("contato@mosaicgrafica.com.br", pageWidth - marginRight - 160, 100);

    // ---------------- INFORMAÇÃO DE GERAÇÃO ----------------
    doc.setFontSize(10);
    doc.text(`Gerado em: ${generatedAt}`, marginLeft, 20);

    // ---------------- TÍTULO COM NÚMERO ----------------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text(`Pedido de Venda Nº ${orderNumber}`, pageWidth / 2, 165, { align: "center" });

    let y = 190;

    // ---------------- CAIXA CLIENTE ----------------
    doc.rect(marginLeft, y, usableWidth, 30);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Cliente:", marginLeft + 10, y + 18);
    doc.setFont("helvetica", "normal");
    doc.text(clientName || "", marginLeft + 50, y + 18);

    // ---------------- CAIXA DATA / PAGAMENTO ----------------
    y += 70;

    doc.rect(marginLeft, y, usableWidth, 26);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Data:", marginLeft + 10, y + 15);
    doc.text("Pagamento:", marginLeft + 210, y + 15);
    

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(date, marginLeft + 40, y + 15);
    doc.text(paymentMethod, marginLeft + 270, y + 15);

    // ---------------- TABELA ITENS ----------------
    y += 80;

    autoTable(doc, {
      startY: y,
      tableWidth: usableWidth,
      margin: { left: marginLeft },
      theme: "grid",
      headStyles: {
        fillColor: [29, 47, 67],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        lineWidth: 0.8
      },
      styles: {
        lineWidth: 0.5,
        lineColor: [150, 150, 150],
        fontSize: 11
      },
      head: [["Item", "Descrição", "Qtd", "Valor Unit.", "Total"]],
      body: items.map((it, i) => {
        const q = parseLocalFloat(it.quantity);
        const u = parseLocalFloat(it.unit_price);
        return [
          i + 1,
          it.title,
          q,
          `R$ ${u.toFixed(2)}`,
          `R$ ${(q * u).toFixed(2)}`
        ];
      }),
      columnStyles: {
        0: { halign: "center", cellWidth: 50 },
        1: { cellWidth: 240 },
        2: { halign: "center", cellWidth: 60 },
        3: { halign: "center", cellWidth: 90 },
        4: { halign: "center", cellWidth: 90 }
      }
    });

    y = doc.lastAutoTable.finalY + 30;

    // ---------------- TOTAL GERAL ----------------
    doc.rect(marginLeft, y, usableWidth, 40);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(`Total Geral: R$ ${total.toFixed(2)}`, marginLeft + 10, y + 25);

    // ---------------- OBSERVAÇÕES ----------------
    if (obs?.trim()) {
      y += 60;
      doc.rect(marginLeft, y, usableWidth, 80);
      doc.setFont("helvetica", "bold");
      doc.text("Observações:", marginLeft + 10, y + 20);

      doc.setFont("helvetica", "normal");
      const wrapped = doc.splitTextToSize(obs, usableWidth - 20);
      doc.text(wrapped, marginLeft + 10, y + 40);
    }

    // ---------------- ABRIR PARA VISUALIZAÇÃO ----------------
    window.open(doc.output("bloburl"), "_blank");
  };
  };

// ====================== GERAR PDF ================


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
        <button
          className="btn btn-warning"
          onClick={() => {
            console.log("CLICOU NO BOTÃO PDF !!!");
            generatePDF({
              clientName,
              date: new Date().toLocaleDateString("pt-BR"),
              paymentMethod,
              items,
              obs,
              total
            });
          }}
        >
          Gerar PDF
        </button>
        <div className="small-muted">Total: R$ {total.toFixed(2)}</div>
      </div>
    </Layout>
  );
}
