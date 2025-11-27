
export default function ItemRow({ index, item, updateItem }) {
  const total = (item.quantity || 0) * (item.unit_price || 0);
  const totalCost = (item.quantity || 0) * (item.cost || 0);
  const profit = total - totalCost;
  const profitAfterNfe = profit * 0.93;

  return (
    <tr>
      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
          style={{ width: "60px" }}
        />
      </td>

      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        <input
          value={item.title}
          placeholder="Descrição"
          onChange={(e) => updateItem(index, "title", e.target.value)}
          style={{ width: "180px" }}
        />
        <input
          value={item.specs}
          placeholder="Detalhes"
          onChange={(e) => updateItem(index, "specs", e.target.value)}
          style={{ width: "180px", marginTop: "5px" }}
        />
      </td>

      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        <input
          type="number"
          value={item.unit_price}
          onChange={(e) => updateItem(index, "unit_price", Number(e.target.value))}
          style={{ width: "80px" }}
        />
      </td>

      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        R$ {total.toFixed(2).replace('.',',')}
      </td>

      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        <input
          type="number"
          value={item.cost || ''}
          onChange={(e) => updateItem(index, "cost", Number(e.target.value))}
          style={{ width: "80px" }}
        />
      </td>

      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        R$ {(totalCost || 0).toFixed(2).replace('.',',')}
      </td>

      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        R$ {profit.toFixed(2).replace('.',',')}
      </td>

      <td style={{ padding: "8px", borderBottom: "1px solid #eee" }}>
        R$ {profitAfterNfe.toFixed(2).replace('.',',')}
      </td>
    </tr>
  );
}
