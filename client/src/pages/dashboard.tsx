import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_SYMPTOMS, ADD_SYMPTOM, DELETE_SYMPTOM } from "../graphql/queries";
import StatsCard from "../components/StatsCard";
import SymptomCard from "../components/SymptomCard";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", severity: 5, notes: "" });

  const { data, loading } = useQuery(GET_SYMPTOMS);
  const [addSymptom] = useMutation(ADD_SYMPTOM, {
    refetchQueries: [{ query: GET_SYMPTOMS }],
  });
  const [deleteSymptom] = useMutation(DELETE_SYMPTOM, {
    refetchQueries: [{ query: GET_SYMPTOMS }],
  });

  const symptoms = data?.symptoms ?? [];
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
    setForm({ name: "", severity: 5, notes: "" });
    setShowModal(false);
  };

  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  return (
    <div>
      <header>
        <div>
          <div>
            <div>Symptom Tracker</div>
            <div>Welcome back!</div>
          </div>
        </div>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <div>
          <StatsCard title="Total Symptoms" value={symptoms.length} icon="⚡" />
          <StatsCard
            title="Average Severity"
            value={`${avgSeverity}/10`}
            icon="📈"
          />
          <StatsCard title="Last 30 Days" value={recentCount} icon="📅" />
        </div>

        <div>
          <div>
            <div>
              <h2>Your Symptoms</h2>
              <p>Track and manage your health symptoms</p>
            </div>
            <button onClick={() => setShowModal(true)}>+ Add Symptom</button>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : symptoms.length === 0 ? (
            <div>
              <h3>No symptoms tracked yet</h3>
              <p>Start tracking your symptoms to see insights</p>
              <button onClick={() => setShowModal(true)}>
                + Add Your First Symptom
              </button>
            </div>
          ) : (
            <div>
              {symptoms.map((s: any) => (
                <SymptomCard
                  key={s._id}
                  symptom={s}
                  onDelete={id => deleteSymptom({ variables: { id } })}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showModal && (
        <div>
          <div>
            <h2>Add Symptom</h2>
            <div>
              <div>
                <label>Symptom Name</label>
                <select
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
                    <option value="Shortness of Breath">Shortness of Breath</option>
                    <option value="Chest Pain">Chest Pain</option>
                    <option value="Abdominal Pain">Abdominal Pain</option>
                    <option value="Back Pain">Back Pain</option>
                  </select>
              </div>
              <div>
                <label>Severity: {form.severity}/10</label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={form.severity}
                  onChange={e =>
                    setForm({ ...form, severity: Number(e.target.value) })
                  }
                />
              </div>
              <div>
                <label>Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any additional details..."
                  rows={3}
                />
              </div>
              <div>
                <button onClick={() => setShowModal(false)}>Cancel</button>
                <button onClick={handleAdd}>Add Symptom</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
