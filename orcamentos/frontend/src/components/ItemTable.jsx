// src/components/ItemTable.jsx
import React from "react";
import ItemRow from "./ItemRow";
import "./ItemTable.css";

export default function ItemTable({ items, updateItem, addItem, removeItem }) {
  return (
    <div className="item-table-container">
      <h3 className="item-table-title">Itens</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>DESCRIÇÃO</th>
              <th>QUANT.</th>
              <th>VALOR</th>
              <th>TOTAL</th>
              <th>CUSTO</th>
              <th>CUSTO TOTAL</th>
              <th>L.LIQUIDO</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it, i) => (
              <ItemRow
                key={i}
                index={i}
                item={it}
                updateItem={updateItem}
                removeItem={removeItem}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="item-table-actions">
        <button className="btn btn-ghost" onClick={addItem}>
          + Adicionar Item
        </button>
      </div>
    </div>
  );
}
