import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { AuthProvider } from "@/components/auth/AuthProvider";
import { Navigation } from "@/components/layouts/Navigation";
import Home from "@/pages/Home";
import Match from "@/pages/Match";
import Playground from "@/pages/Playground";
import UserProfilePage from "@/pages/UserProfile";
import { MultiplayerPage } from "@/pages/Multiplayer";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/match/:roomId" element={<Match />} />
          <Route path="/playground" element={<Playground />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/multiplayer" element={<MultiplayerPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
