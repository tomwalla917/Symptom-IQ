import { useState } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { GET_SYMPTOM } from "../graphql/queries";

interface Symptom {
  _id: string;
  name: string;
  severity: number;
  date?: string;
  possibleTrigger?: string;
  notes?: string;
  createdAt: string;
}

interface Props {
  symptom: Symptom;
  onDelete: (id: string) => void;
}

const getSeverityConfig = (severity: number) => {
  if (severity <= 3) return { color: "var(--clr-success-a10)", label: "Mild", bg: "var(--clr-success-a0)" };
  if (severity <= 6) return { color: "var(--clr-warning-a10)", label: "Moderate", bg: "var(--clr-warning-a0)" };
  return { color: "var(--clr-danger-a10)", label: "Severe", bg: "var(--clr-danger-a0)" };
};

const DetailRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <div style={{
    display: "flex", flexDirection: "column", gap: "0.25rem",
    padding: "0.75rem", backgroundColor: "var(--clr-surface-tonal-a10)",
    borderRadius: "6px", border: "1px solid var(--clr-surface-tonal-a20)",
  }}>
    <span style={{ fontSize: "0.7rem", color: "var(--clr-surface-a50)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {icon} {label}
    </span>
    <span style={{ fontSize: "0.9rem", color: "var(--clr-primary-a40)" }}>{value}</span>
  </div>
);

const SymptomCard = ({ symptom, onDelete }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const sev = getSeverityConfig(symptom.severity);

  const [fetchSymptom, { data, loading }] = useLazyQuery(GET_SYMPTOM);

  const handleCardClick = () => {
    setShowModal(true);
    fetchSymptom({ variables: { id: symptom._id } });
  };

  const detail = data?.getSymptom;

  return (
    <>
      {/* Card */}
      <div
        onClick={handleCardClick}
        style={{
          backgroundColor: "var(--clr-surface-tonal-a10)",
          border: "1px solid var(--clr-surface-tonal-a20)",
          borderLeft: `4px solid ${sev.color}`,
          borderRadius: "8px",
          padding: "1.25rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          height: "100%",
          cursor: "pointer",
          transition: "background-color 0.2s ease, transform 0.2s ease",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--clr-surface-tonal-a20)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLDivElement).style.backgroundColor = "var(--clr-surface-tonal-a10)";
          (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        }}
      >
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h5 style={{ color: "var(--clr-primary-a0)", fontFamily: "Rubik Mono One, sans-serif", margin: 0, fontSize: "1rem" }}>
            {symptom.name}
          </h5>
          <div style={{
            backgroundColor: sev.bg, color: sev.color, borderRadius: "20px",
            padding: "2px 10px", fontSize: "0.75rem", fontWeight: 600,
            whiteSpace: "nowrap", marginLeft: "0.5rem",
          }}>
            {symptom.severity}/10 — {sev.label}
          </div>
        </div>

        {/* Severity bar */}
        <div style={{ height: "4px", backgroundColor: "var(--clr-surface-a20)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{
            height: "100%", width: `${symptom.severity * 10}%`,
            backgroundColor: sev.color, borderRadius: "2px", transition: "width 0.3s ease",
          }} />
        </div>

        {/* Meta info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flex: 1 }}>
          {symptom.date && (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.8rem", color: "var(--clr-surface-a50)" }}>
              <span>📅</span>
              <span>{new Date(symptom.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
            </div>
          )}
          {symptom.possibleTrigger && (
            <div style={{ fontSize: "0.8rem", color: "var(--clr-primary-a40)" }}>
              <span style={{ color: "var(--clr-warning-a10)", marginRight: "0.4rem" }}>⚡</span>
              <strong style={{ color: "var(--clr-primary-a30)" }}>Trigger: </strong>
              {symptom.possibleTrigger}
            </div>
          )}
          {symptom.notes && (
            <div style={{ fontSize: "0.8rem", color: "var(--clr-primary-a40)", fontStyle: "italic" }}>
              <span style={{ marginRight: "0.4rem" }}>📝</span>
              {symptom.notes}
            </div>
          )}
        </div>

        {/* Click hint */}
        <div style={{ fontSize: "0.7rem", color: "var(--clr-surface-a40)", textAlign: "right" }}>
          Click for details →
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          onClick={() => setShowModal(false)}
          style={{
            position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.7)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1050, padding: "1rem",
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              backgroundColor: "var(--clr-surface-tonal-a0)",
              border: `1px solid var(--clr-surface-tonal-a20)`,
              borderTop: `3px solid ${sev.color}`,
              borderRadius: "10px",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "90vh",
              overflowY: "auto",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ color: "var(--clr-primary-a0)", fontFamily: "Rubik Mono One, sans-serif", margin: 0 }}>
                {symptom.name}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "none", border: "none", color: "var(--clr-surface-a50)",
                  fontSize: "1.25rem", cursor: "pointer", lineHeight: 1,
                }}
              >✕</button>
            </div>

            {loading ? (
              <div style={{ textAlign: "center", padding: "2rem" }}>
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : detail ? (
              <>
                {/* Severity bar in modal */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--clr-surface-a50)", textTransform: "uppercase" }}>Severity</span>
                    <span style={{ fontSize: "0.75rem", color: sev.color, fontWeight: 600 }}>{detail.severity}/10 — {sev.label}</span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "var(--clr-surface-a20)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${detail.severity * 10}%`, backgroundColor: sev.color, borderRadius: "3px" }} />
                  </div>
                </div>

                {/* Detail fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {detail.date && (
                    <DetailRow icon="📅" label="Date" value={new Date(detail.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} />
                  )}
                  {detail.possibleTrigger && (
                    <DetailRow icon="⚡" label="Possible Trigger" value={detail.possibleTrigger} />
                  )}
                  {detail.notes && (
                    <DetailRow icon="📝" label="Notes" value={detail.notes} />
                  )}
                  {detail.createdAt && (
                    <DetailRow icon="🕐" label="Logged At" value={new Date(Number(detail.createdAt)).toLocaleString()} />
                  )}
                </div>

                {/* Delete */}
                <button
                  onClick={() => { onDelete(symptom._id); setShowModal(false); }}
                  style={{
                    marginTop: "0.5rem", backgroundColor: "transparent",
                    border: "1px solid var(--clr-danger-a0)", color: "var(--clr-danger-a10)",
                    borderRadius: "6px", padding: "0.5rem", fontSize: "0.85rem",
                    cursor: "pointer", width: "100%", transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "var(--clr-danger-a0)";
                    (e.target as HTMLButtonElement).style.color = "var(--clr-light-a0)";
                  }}
                  onMouseLeave={e => {
                    (e.target as HTMLButtonElement).style.backgroundColor = "transparent";
                    (e.target as HTMLButtonElement).style.color = "var(--clr-danger-a10)";
                  }}
                >
                  Delete Symptom
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
};

export default SymptomCard;