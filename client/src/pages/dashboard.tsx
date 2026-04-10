import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_SYMPTOMS, ADD_SYMPTOM, DELETE_SYMPTOM } from "../graphql/queries";
import StatsCard from "../components/StatsCard";
import SymptomCard from "../components/SymptomCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "",
    severity: 5,
    possibleTrigger: "",
    notes: "",
    date: "",
  });

  const { data, loading } = useQuery(GET_SYMPTOMS);
  const [addSymptom] = useMutation(ADD_SYMPTOM, {
    refetchQueries: [{ query: GET_SYMPTOMS }],
  });
  const [deleteSymptom] = useMutation(DELETE_SYMPTOM, {
    refetchQueries: [{ query: GET_SYMPTOMS }],
  });

  const symptoms = data?.getSymptoms ?? [];
  const avgSeverity = symptoms.length
    ? (
        symptoms.reduce((sum: number, s: any) => sum + s.severity, 0) /
        symptoms.length
      ).toFixed(1)
    : 0;
  const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentCount = symptoms.filter(
    (s: any) => new Date(s.date).getTime() > thirtyDaysAgo,
  ).length;

  const handleAdd = async () => {
    if (!form.name.trim()) return;
    await addSymptom({ variables: form });
    setForm({
      name: "",
      severity: 5,
      possibleTrigger: "",
      notes: "",
      date: "",
    });
    setShowModal(false);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div className="min-vh-100 bg-dark">
      {/* Header */}
      <header className="navbar navbar-dark bg-primary px-4 shadow-sm">
        <div className="d-flex align-items-center gap-3">
          <div>
            <div className="navbar-brand mb-0 fw-bold">Symptom Tracker</div>
            <div className="text-white-50 small">Welcome back!</div>
          </div>
        </div>
        <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="container py-4">
        {/* Stats Row */}
        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <StatsCard
              title="Total Symptoms"
              value={symptoms.length}
              icon="⚡"
            />
          </div>
          <div className="col-12 col-md-4">
            <StatsCard
              title="Average Severity"
              value={`${avgSeverity}/10`}
              icon="📈"
            />
          </div>
          <div className="col-12 col-md-4">
            <StatsCard title="Last 30 Days" value={recentCount} icon="📅" />
          </div>
        </div>

        {/* Symptoms Panel */}
        <div className="card shadow-sm">
          <div className="card-header bg-white d-flex justify-content-between align-items-center py-3">
            <div>
              <h2 className="navbar-brand mb-0 fw-bold">Your Symptoms</h2>
              <p className="text-white-50 small">
                Track and manage your health symptoms
              </p>
            </div>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setShowModal(true)}
            >
              + Add Symptom
            </button>
          </div>

          <div className="card-body">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status" />
              </div>
            ) : symptoms.length === 0 ? (
              <div className="text-center py-5">
                <h2 className="text-white-50 fw-bold">
                  No symptoms tracked yet
                </h2>
                <p className="text-white-50 small">
                  Start tracking your symptoms to see insights
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  + Add Your First Symptom
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {symptoms.map((s: any) => (
                  <div className="col-12 col-md-6 col-lg-4" key={s._id}>
                    <SymptomCard
                      symptom={s}
                      onDelete={id => deleteSymptom({ variables: { id } })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title h5">Add New Symptom</h2>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>

              <div className="modal-body">
                {/* Symptom Name */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Symptom Name</label>
                  <select
                    className="form-select"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                  >
                    <option value="">Select a symptom</option>
                    <option value="Headache">Headache</option>
                    <option value="Fatigue">Fatigue</option>
                    <option value="Nausea">Nausea</option>
                    <option value="Dizziness">Dizziness</option>
                    <option value="Fever">Fever</option>
                    <option value="Cough">Cough</option>
                    <option value="Sore Throat">Sore Throat</option>
                    <option value="Shortness of Breath">
                      Shortness of Breath
                    </option>
                    <option value="Chest Pain">Chest Pain</option>
                    <option value="Abdominal Pain">Abdominal Pain</option>
                    <option value="Back Pain">Back Pain</option>
                  </select>
                </div>

                {/* Severity */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Severity:{" "}
                    <span className="text-primary">{form.severity}/10</span>
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min={1}
                    max={10}
                    value={form.severity}
                    onChange={e =>
                      setForm({ ...form, severity: Number(e.target.value) })
                    }
                  />
                  <div className="d-flex justify-content-between text-muted small">
                    <span>Mild (1)</span>
                    <span>Severe (10)</span>
                  </div>
                </div>

                {/* Date */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Date</label>
                  <input
                    type="date"
                    className="form-control"
                    value={form.date}
                    onChange={e => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                {/* Possible Triggers */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Possible Triggers
                  </label>
                  <textarea
                    className="form-control"
                    value={form.possibleTrigger}
                    onChange={e =>
                      setForm({ ...form, possibleTrigger: e.target.value })
                    }
                    placeholder="e.g. stress, lack of sleep, certain foods..."
                    rows={3}
                  />
                </div>

                {/* Notes */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Notes</label>
                  <textarea
                    className="form-control"
                    value={form.notes}
                    onChange={e => setForm({ ...form, notes: e.target.value })}
                    placeholder="Any additional details..."
                    rows={3}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleAdd}>
                  Add Symptom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
