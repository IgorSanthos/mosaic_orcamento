// src/components/ItemRow.jsx
import "./ItemRow.css";

export default function ItemRow({ index, item, updateItem, removeItem }) {
  const total = (item.quantity || 0) * (item.unit_price || 0);
  const totalCost = (item.quantity || 0) * (item.cost || 0);
  const profit = total - totalCost;
  const profitAfterNfe = profit * 0.93;

  return (
    <tr>
      <td data-label="DESCRIÇÃO">
        <input
          value={item.title}
          placeholder="Descrição"
          onChange={(e) => updateItem(index, "title", e.target.value)}
          className="item-row-input item-row-description"
        />
      </td>

      <td data-label="QUANT.">
        <input
          type="number"
          value={item.quantity}
          onChange={(e) => updateItem(index, "quantity", Number(e.target.value))}
          className="item-row-input"
        />
      </td>

      <td data-label="VALOR">
        <input
          type="number"
          value={item.unit_price}
          onChange={(e) => updateItem(index, "unit_price", Number(e.target.value))}
          className="item-row-input"
        />
      </td>

      <td data-label="TOTAL">
        R$ {total.toFixed(2).replace('.',',')}
      </td>

      <td data-label="CUSTO">
        <input
          type="number"
          value={item.cost || ''}
          onChange={(e) => updateItem(index, "cost", Number(e.target.value))}
          className="item-row-input"
        />
      </td>

      <td data-label="CUSTO TOTAL">
        R$ {(totalCost || 0).toFixed(2).replace('.',',')}
      </td>

      <td data-label="L.LIQUIDO">
        R$ {profitAfterNfe.toFixed(2).replace('.',',')}
      </td>
    </tr>
  );
}
