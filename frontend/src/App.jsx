import { BrowserRouter as Router} from "react-router";
import { ScrollToTop } from "./components/common/ScrollToTop";
import PublicRoute from "./router/PublicRoute";
import ProtectedRoute from "./router/ProtectedRoute";

function App() {
  return (
    <Router>
      <ScrollToTop />
      <PublicRoute />
      <ProtectedRoute />
    </Router>
  );
}

export default App;
