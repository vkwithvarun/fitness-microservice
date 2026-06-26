import { Box, Button } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router";
import { setCredentials } from "./store/authSlice";
import { AuthContext } from "react-oauth2-code-pkce";
import ActivityList from "./components/ActivityList";
import ActivityForm from "./components/ActivityForm";
// IMPORTANT: import your real detail component - don't leave a placeholder lying around
import ActivityDetails from "./components/ActivityDetails";

const ActivitiesPage = () => {
  // `refresh` toggled every time a new activity is added.
  // Passed as `key` to ActivityList, which forces React to fully remount that
  // component (re-running its useEffect) instead of manually re-fetching.
  const [refresh, setRefresh] = useState(false);

  return (
    <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
      <ActivityForm onActivityAdded={() => setRefresh(prev => !prev)} />
      <ActivityList key={refresh} />
    </Box>
  );
};

function App() {
  const { token, tokenData, logIn } = useContext(AuthContext);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(setCredentials({ token, user: tokenData }));
    }
  }, [token, tokenData, dispatch]);

  return (
    <Router>
      {!token ? (
        <Button
          variant="contained"
          sx={{ bgcolor: '#dc004e' }}
          onClick={logIn}
        >
          LOGIN
        </Button>
      ) : (
        <Box component="section" sx={{ p: 2, border: '1px dashed grey' }}>
          <Routes>
            <Route path="/activities" element={<ActivitiesPage />} />
            {/* Use the real component here, not a dummy placeholder */}
            <Route path="/activities/:id" element={<ActivityDetails />} />
            <Route path="/" element={<Navigate to="/activities" replace />} />
          </Routes>
        </Box>
      )}
    </Router>
  );
}

export default App;