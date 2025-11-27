import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function EditEstimate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [clientName, setClientName] = useState("");
  const [productionEta, setProductionEta] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [validityDays, setValidityDays] = useState("");
  const [obs, setObs] = useState("");

  const [items, setItems] = useState([]);

  // Carregar orçamento
  useEffect(() => {
    fetch(`http://localhost:8080/api/estimates/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const e = data.estimate;
        setClientName(e.client_name);
        setProductionEta(e.production_eta);
        setPaymentMethod(e.payment_method);
        setValidityDays(e.validity_days);
        setObs(e.observations || "");
        setItems(e.items);
      });
  }, [id]);

  function updateItem(index, field, value) {
    const arr = [...items];
    arr[index][field] = value;
    setItems(arr);
  }

  // SALVAR ALTERAÇÕES
  function saveChanges() {
    const payload = {
      client_name: clientName,
      production_eta: productionEta,
      payment_method: paymentMethod,
      validity_days: validityDays,
      observations: obs,
      items,
    };

    fetch(`http://localhost:8080/api/estimates/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        alert("Orçamento atualizado!");
        navigate(`/orcamentos/${id}`);
      })
      .catch((err) => alert("Erro ao atualizar: " + err));
  }

  // GERAR PDF
  function generatePDF() {
    const doc = new jsPDF();

    // 🔵 Inserir logo
    const logo = new Image();
    logo.src = "/logo.png";

    logo.onload = () => {
      doc.addImage(logo, "PNG", 14, 10, 40, 20);

      doc.setFontSize(20);
      doc.text("Orçamento Atualizado", 14, 40);

      doc.setFontSize(12);
      doc.text(`Cliente: ${clientName}`, 14, 55);
      doc.text(`Pagamento: ${paymentMethod}`, 14, 63);
      doc.text(`Validade: ${validityDays} dias`, 14, 71);
      doc.text(`Produção: ${productionEta}`, 14, 79);
      doc.text(`Observações: ${obs}`, 14, 87);

      const tableData = items.map((it) => [
        it.quantity,
        it.title,
        `R$ ${it.unit_price.toFixed(2)}`,
        `R$ ${(it.quantity * it.unit_price).toFixed(2)}`
      ]);

      autoTable(doc, {
        head: [["Qtd", "Título", "Valor Unit.", "Subtotal"]],
        body: tableData,
        startY: 100
      });

      const total = items.reduce(
        (s, it) => s + it.quantity * it.unit_price,
        0
      );

      doc.setFontSize(14);
      doc.text(
        `Total: R$ ${total.toFixed(2)}`,
        14,
        doc.lastAutoTable.finalY + 20
      );

      doc.save(`orcamento_editado_${id}.pdf`);
    };
  }


  return (
    <Layout title="Editar Orçamento" subtitle="Alterar dados e itens do orçamento">
      
      <h3 style={sectionTitle}>Dados do Cliente</h3>
      <div style={card}>
        <label>Cliente</label>
        <input value={clientName} onChange={(e) => setClientName(e.target.value)} style={input} />

        <label>Produção</label>
        <input value={productionEta} onChange={(e) => setProductionEta(e.target.value)} style={input} />

        <label>Pagamento</label>
        <input value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} style={input} />

        <label>Validade</label>
        <input
          type="number"
          value={validityDays}
          onChange={(e) => setValidityDays(Number(e.target.value))}
          style={input}
        />

        <label>Observações</label>
        <textarea
          value={obs}
          onChange={(e) => setObs(e.target.value)}
          style={{ width: "100%", height: "80px", marginTop: "8px" }}
        />
      </div>

      <h3 style={sectionTitle}>Itens</h3>

      {items.map((it, i) => (
        <div key={i} style={card}>
          <input
            placeholder="Título"
            value={it.title}
            onChange={(e) => updateItem(i, "title", e.target.value)}
            style={input}
          />
          <input
            placeholder="Especificações"
            value={it.specs}
            onChange={(e) => updateItem(i, "specs", e.target.value)}
            style={input}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={it.quantity}
            onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
            style={input}
          />
          <input
            type="number"
            placeholder="Valor Unitário"
            value={it.unit_price}
            onChange={(e) =>
              updateItem(i, "unit_price", Number(e.target.value))
            }
            style={input}
          />
        </div>
      ))}

      <div style={{ marginTop: "25px" }}>
        <button style={btnBlue} onClick={saveChanges}>Salvar Alterações</button>
        <button style={btnGreen} onClick={generatePDF}>Gerar PDF</button>
      </div>
    </Layout>
  );
}

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginTop: "8px",
};

const card = {
  background: "#fff",
  padding: "20px",
  borderRadius: "16px",
  marginBottom: "20px",
  boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
};

const sectionTitle = {
  margin: "10px 0",
  fontWeight: "bold",
  fontSize: "20px",
};

const btnBlue = {
  background: "#1a73e8",
  padding: "14px 30px",
  color: "#fff",
  borderRadius: "10px",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
  marginRight: "12px",
};

const btnGreen = {
  background: "#27ae60",
  padding: "14px 30px",
  color: "#fff",
  borderRadius: "10px",
  border: "none",
  fontSize: "16px",
  cursor: "pointer",
};
