import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/auth/AuthProvider";
import { Navigation } from "@/layout/Navigation";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import UserProfilePage from "@/pages/UserProfile";

import Debug from "./pages/Debug";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:roomId" element={<Match />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/debug" element={<Debug />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
