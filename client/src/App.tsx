import { Route, Routes } from "react-router-dom";
import UserAuth from "./pages/userAuth";
import Dashboard from "./pages/dashboard";
import AddSymptom from "./pages/addSymptom";
import EditSymptom from "./pages/editSymptom";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserAuth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-symptom" element={<AddSymptom />} />
        <Route path="/edit-symptom" element={<EditSymptom />} />
      </Routes>
    </div>
  );
}

export default App;
