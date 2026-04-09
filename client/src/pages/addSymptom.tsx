import React, { useState, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AddSymptom() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState("");
  const [date, setDate] = useState<string>("");
  const [severity, setSeverity] = useState<number | "">("");
  const [duration, setDuration] = useState("");
  const [triggers, setTriggers] = useState("");
  const [notes, setNotes] = useState("");

  const symptomOptions = [
    { label: "Headache", value: "Headache" },
    { label: "Fatigue",  value: "Fatigue" },
    { label: "Nausea",   value: "Nausea" },
    { label: "Fever",    value: "Fever" },
    { label: "Cough",    value: "Cough" },
  ];

  function handleSymptomChange(e: ChangeEvent<HTMLSelectElement>) {
    setSelected(e.target.value);
  }

  function handleDateChange(e: ChangeEvent<HTMLInputElement>) {
    setDate(e.target.value);
  }

  function handleSeverityChange(e: ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    if (val >= 1 && val <= 10) setSeverity(val);
    else if (e.target.value === "") setSeverity("");
  }

  function submitForm() {
    // TODO: wire up to your GraphQL mutation
    console.log({ selected, date, severity, duration, triggers, notes });
  }

  return (
    <div>
      <h1>Add Symptom</h1>

      <div>
        <h2>Symptom Name</h2>
        <label htmlFor="symptomOptions">Choose an option: </label>
        <select id="symptomOptions" value={selected} onChange={handleSymptomChange}>
          <option value="">--Select--</option>
          {symptomOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p>Selected: {selected}</p>
      </div>

      <div>
        <h2>Date</h2>
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
        />
      </div>

      <div>
        <h2>Severity</h2>
        <p>Enter a number between 1 and 10</p>
        <input
          type="number"
          min={1}
          max={10}
          value={severity}
          onChange={handleSeverityChange}
          placeholder="1–10"
        />
      </div>

      <div>
        <h2>Duration</h2>
        <input
          type="text"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          placeholder="e.g. 2 hours"
        />
      </div>

      <div>
        <h2>Possible Triggers</h2>
        <input
          type="text"
          value={triggers}
          onChange={(e) => setTriggers(e.target.value)}
          placeholder="e.g. stress, caffeine"
        />
      </div>

      <div>
        <h2>Additional Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any additional details..."
          rows={4}
        />
      </div>

      <div>
        <button onClick={() => submitForm()}>Submit</button>
        <button onClick={() => navigate(-1)}>Cancel</button>
      </div>
    </div>
  );
}

export default AddSymptom;