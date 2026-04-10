import React from "react";
import { Row } from "react-bootstrap";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div
      className="stats"
      style={{
        backgroundColor: "var(--clr-surface-tonal-a0)",
        border: "1px solid var(--clr-surface-tonal-a20)",
        borderRadius: "8px",
        padding: "2rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
      }}
    >
      <div className="stats-header">
        <span>{title}</span>
        <span>{icon}</span>
      </div>

      <div className="stats-value">{value}</div>
    </div>
  );
};

export default StatsCard;
