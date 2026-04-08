import { Route, Routes } from "react-router-dom";
import UserAuth from "./pages/userAuth";
import Dashboard from "./pages/dashboard";
import AddSymptom from "./pages/addSymptom";
import EditSymptom from "./pages/editSymptom";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<UserAuth />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-symptom"
          element={
            <ProtectedRoute>
              <AddSymptom />
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-symptom"
          element={
            <ProtectedRoute>
              <EditSymptom />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
