import "./App.css";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Error, Landing, ProtectedRoute, Register } from "./pages";
import {
  AddJobs,
  AllJobs,
  Profile,
  SharedLayout,
  Stats,
} from "./pages/dashboard";
import Authlink from "./pages/Authlink";

function App() {
  return (
    <Router>
      <Authlink>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <SharedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="alljobs" element={<AllJobs />} />
            <Route path="addjobs" element={<AddJobs />} />
            <Route index element={<Stats />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="register" element={<Register />} />
          <Route path="landing" element={<Landing />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Authlink>
    </Router>
  );
}

export default App;
