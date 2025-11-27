// src/components/ItemTable.jsx
import React from "react";
import ItemRow from "./ItemRow";

export default function ItemTable({ items, updateItem, addItem }) {
  return (
    <div style={{ marginTop: 12 }}>
      <h3 style={{ marginBottom: 8 }}>Itens</h3>
      <table className="table">
        <thead>
          <tr>
            <th style={{ width:80 }}>QUANT.</th>
            <th>DESCRIÇÃO</th>
            <th style={{ width:140 }}>VALOR</th>
            <th style={{ width:140 }}>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {items.map((it, i) => <ItemRow key={i} index={i} item={it} updateItem={updateItem} />)}
        </tbody>
      </table>

      <div style={{ marginTop: 10 }}>
        <button className="btn btn-ghost" onClick={addItem}>+ Adicionar Item</button>
      </div>
    </div>
  );
}
