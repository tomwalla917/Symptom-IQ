import React from "react";

interface CardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

const StatsCard: React.FC<CardProps> = ({ title, value, icon }) => {
  return (
    <div className="stats">
      <div className="stats-header">
        <span>{title}</span>
        <span>{icon}</span>
      </div>

      <div className="stats-value">{value}</div>
    </div>
  );
};

export default StatsCard;
