import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_SYMPTOM, DELETE_SYMPTOM } from "../graphql/queries";

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
  onUpdate?: (updated: Symptom) => void;
}

const getSeverityConfig = (severity: number) => {
  if (severity <= 3) return { color: "var(--clr-success-a10)", label: "Mild" };
  if (severity <= 6) return { color: "var(--clr-warning-a10)", label: "Moderate" };
  return { color: "var(--clr-danger-a10)", label: "Severe" };
};

const parseDate = (val?: string) => {
  if (!val) return null;
  const asNum = Number(val);
  const d = isNaN(asNum) ? new Date(val) : new Date(asNum);
  return isNaN(d.getTime()) ? null : d;
};

const SymptomCard = ({ symptom, onDelete, onUpdate }: Props) => {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ ...symptom });

  const sev = getSeverityConfig(symptom.severity);
  const draftSev = getSeverityConfig(draft.severity);

  const [updateSymptom, { loading: updating }] = useMutation(UPDATE_SYMPTOM);

  const handleSave = async () => {
    await updateSymptom({ variables: { id: symptom._id, ...draft } });
    onUpdate?.({ ...symptom, ...draft });
    setEditing(false);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditing(false);
    setDraft({ ...symptom });
  };

  const field = (label: string, value: string) => (
    <div style={{
      display: "flex", flexDirection: "column", gap: "0.25rem",
      padding: "0.75rem", backgroundColor: "var(--clr-surface-tonal-a10)",
      borderRadius: "6px", border: "1px solid var(--clr-surface-tonal-a20)",
    }}>
      <span style={{ fontSize: "0.7rem", color: "var(--clr-surface-a50)",
        textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
      <span style={{ fontSize: "0.9rem", color: "var(--clr-primary-a40)" }}>{value}</span>
    </div>
  );

  return (
    <>
      {/* ── Card ── */}
      <div
        onClick={() => setShowModal(true)}
        style={{
          backgroundColor: "var(--clr-surface-tonal-a10)",
          border: "1px solid var(--clr-surface-tonal-a20)",
          borderLeft: `4px solid ${sev.color}`,
          borderRadius: "8px", padding: "1.25rem",
          display: "flex", flexDirection: "column", gap: "0.75rem",
          cursor: "pointer", transition: "background-color 0.2s ease, transform 0.2s ease",
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <h5 style={{ color: "var(--clr-primary-a0)", fontFamily: "Rubik Mono One, sans-serif", margin: 0 }}>
            {symptom.name}
          </h5>
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: sev.color, marginLeft: "0.5rem" }}>
            {symptom.severity}/10 — {sev.label}
          </span>
        </div>

        <div style={{ height: "4px", backgroundColor: "var(--clr-surface-a20)", borderRadius: "2px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${symptom.severity * 10}%`,
            backgroundColor: sev.color, borderRadius: "2px" }} />
        </div>

        {(() => {
          const d = parseDate(symptom.date);
          return d ? (
            <span style={{ fontSize: "0.8rem", color: "var(--clr-surface-a50)" }}>
              📅 {d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
            </span>
          ) : null;
        })()}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div
          onClick={handleClose}
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
              borderRadius: "10px", width: "100%", maxWidth: "480px",
              maxHeight: "90vh", overflowY: "auto",
              padding: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem",
            }}
          >
            {/* Modal header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h4 style={{ color: "var(--clr-primary-a0)", fontFamily: "Rubik Mono One, sans-serif", margin: 0 }}>
                {symptom.name}
              </h4>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <button
                  onClick={() => setEditing(e => !e)}
                  style={{
                    background: "none", border: "1px solid var(--clr-primary-a0)",
                    color: "var(--clr-primary-a0)", borderRadius: "6px",
                    padding: "2px 10px", fontSize: "0.8rem", cursor: "pointer",
                  }}
                >
                  {editing ? "Cancel" : "Edit"}
                </button>
                <button
                  onClick={handleClose}
                  style={{
                    background: "none", border: "none", color: "var(--clr-surface-a50)",
                    fontSize: "1.25rem", cursor: "pointer", lineHeight: 1,
                  }}
                >✕</button>
              </div>
            </div>

            {editing ? (
              /* ── Edit mode ── */
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  <div>
                    <label className="form-label">
                      Severity: {draft.severity}/10 — {draftSev.label}
                    </label>
                    <input
                      type="range" className="form-range" min={1} max={10}
                      value={draft.severity}
                      onChange={e => setDraft(d => ({ ...d, severity: Number(e.target.value) }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Date</label>
                    <input
                      type="date" className="form-control"
                      value={draft.date ? (parseDate(draft.date)?.toISOString().slice(0, 10) ?? "") : ""}
                      onChange={e => setDraft(d => ({ ...d, date: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Possible Trigger</label>
                    <input
                      type="text" className="form-control"
                      placeholder="e.g. stress, food, sleep"
                      value={draft.possibleTrigger ?? ""}
                      onChange={e => setDraft(d => ({ ...d, possibleTrigger: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="form-label">Notes</label>
                    <textarea
                      className="form-control" rows={3}
                      value={draft.notes ?? ""}
                      onChange={e => setDraft(d => ({ ...d, notes: e.target.value }))}
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={updating}
                  className="btn btn-primary w-100"
                >
                  {updating ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              /* ── Read mode ── */
              <>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                    <span style={{ fontSize: "0.75rem", color: "var(--clr-surface-a50)", textTransform: "uppercase" }}>
                      Severity
                    </span>
                    <span style={{ fontSize: "0.75rem", color: sev.color, fontWeight: 600 }}>
                      {symptom.severity}/10 — {sev.label}
                    </span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "var(--clr-surface-a20)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${symptom.severity * 10}%`,
                      backgroundColor: sev.color, borderRadius: "3px" }} />
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {(() => {
                    const d = parseDate(symptom.date);
                    return d ? field("📅 Date", d.toLocaleDateString("en-US", {
                      weekday: "long", year: "numeric", month: "long", day: "numeric",
                    })) : null;
                  })()}
                  {symptom.possibleTrigger && field("⚡ Possible Trigger", symptom.possibleTrigger)}
                  {symptom.notes && field("📝 Notes", symptom.notes)}
                  {symptom.createdAt && field("🕐 Logged At", new Date(Number(symptom.createdAt)).toLocaleString())}
                </div>

                <button
                  onClick={() => { onDelete(symptom._id); handleClose(); }}
                  className="btn w-100"
                  style={{ border: "1px solid var(--clr-danger-a0)", color: "var(--clr-danger-a10)" }}
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
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default SymptomCard;