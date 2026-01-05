import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminHome } from "../../features/auth/adminDashboard/adminDashboardSlice";

export const useDashboardViewModel = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.dashboard);

  // Local state to store API response
  const [home, setHome] = useState(null);

  // Load dashboard with optional filters
  const loadDashboard = (filters = {}) => {
    // Dispatch the async Redux thunk
    dispatch(fetchAdminHome(filters))
      .unwrap() // This returns a promise with the resolved value from the thunk
      .then((res) => {
        setHome(res); // Save API response locally
      })
      .catch((err) => {
        console.error("Failed to fetch dashboard:", err);
        setHome(null); // Optionally clear home on error
      });
  };

  // Optionally, load dashboard on mount
  useEffect(() => {
    loadDashboard();
  }, []);

  return {
    home,       // local state with API response
    loading,    // redux loading state
    error,      // redux error state
    loadDashboard, // function to reload with filters
  };
};
