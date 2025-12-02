// src/components/ItemRow.jsx

const parseLocalFloat = (val) => {
    const v = val ?? ''; // Garante que não é nulo ou indefinido
    if (typeof v === 'string') {
        // Substitui a vírgula por ponto e converte para float, ou retorna 0 se inválido
        return parseFloat(v.replace(',', '.')) || 0;
    }
    return v || 0;
}

export default function ItemRow({ index, item, updateItem, removeItem }) {
  const quantity = parseLocalFloat(item.quantity);
  const unit_price = parseLocalFloat(item.unit_price);
  const cost = parseLocalFloat(item.cost);

  const total = quantity * unit_price;
  const totalCost = quantity * cost;
  const profit = total - totalCost;
  const profitAfterNfe = profit * 0.93;

  return (
    <tr>
      <td data-label="DESCRIÇÃO">
        <textarea
          value={item.title}
          placeholder="Descrição"
          onChange={(e) => updateItem(index, "title", e.target.value)}
          className="item-row-input item-row-description"
        />
      </td>

      <td data-label="QUANT.">
        <input
          type="text"
          value={item.quantity ?? ''}
          onChange={(e) => updateItem(index, "quantity", e.target.value)}
          className="item-row-input"
        />
      </td>

      <td data-label="VALOR">
        <input
          type="text"
          value={item.unit_price ?? ''}
          onChange={(e) => updateItem(index, "unit_price", e.target.value)}
          className="item-row-input"
        />
      </td>

      <td data-label="TOTAL">
        R$ {total.toFixed(2).replace('.',',')}
      </td>

      <td data-label="CUSTO">
        <input
          type="text"
          value={item.cost ?? ''}
          onChange={(e) => updateItem(index, "cost", e.target.value)}
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
