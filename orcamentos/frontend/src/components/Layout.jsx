// src/components/Layout.jsx
import React from "react";
import "../index.css";

export default function Layout({ title, subtitle, children }) {
  return (
    <div className="container">
      <div className="card">
        <div className="header-row">
          <div className="brand">
            <img src="/logo.png" alt="Mosaic Gráfica" />
            <div className="title">
              <h1>{title || "Mosaic Gráfica"}</h1>
              {subtitle && <div className="subtitle">{subtitle}</div>}
            </div>
          </div>
          <div className="small-muted">Mosaic Gráfica — Sistema de Orçamentos</div>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
