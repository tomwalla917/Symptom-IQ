import React, { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { GET_SYMPTOM, UPDATE_SYMPTOM, GET_SYMPTOMS } from './queries';

const symptomOptions = [
    { label: "Headache", value: "1" },
    { label: "Fatigue",  value: "2" },
    { label: "Nausea",   value: "3" },
    { label: "Fever",    value: "4" },
    { label: "Cough",    value: "5" },
];

function EditSymptom() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selected, setSelected] = useState("");
    const [date,     setDate]     = useState<string>("");
    const [severity, setSeverity] = useState<number | "">("");
    const [duration, setDuration] = useState("");
    const [triggers, setTriggers] = useState("");
    const [notes,    setNotes]    = useState("");

    const { loading, error, data } = useQuery(GET_SYMPTOM, {
        variables: { id },
    });

    useEffect(() => {
        if (data?.symptom) {
            const s = data.symptom;
            setSelected(s.name);
            setDate(s.date);
            setSeverity(s.severity);
            setDuration(s.duration ?? "");
            setTriggers(s.triggers ?? "");
            setNotes(s.notes ?? "");
        }
    }, [data]);

    const [updateSymptom] = useMutation(UPDATE_SYMPTOM, {
        refetchQueries: [{ query: GET_SYMPTOMS }],  
    });

    // Defined all three handlers that the JSX references
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

    async function handleSubmit() {
        await updateSymptom({
            variables: {
                id,
                name: selected,
                date,
                severity: Number(severity),
                duration,
                triggers,
                notes,
            },
        });
        navigate('/');
    }

    if (loading) return <p>Loading symptom...</p>;
    if (error)   return <p>Error loading symptom.</p>;

    return (
        <div>
            <h1>Edit Symptom</h1>

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
                <button onClick={handleSubmit}>Save Changes</button>
                <button onClick={() => navigate(-1)}>Cancel</button>
            </div>
        </div>
    );
}

export default EditSymptom;