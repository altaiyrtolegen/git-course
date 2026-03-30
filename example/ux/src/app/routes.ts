import { createBrowserRouter } from "react-router";
import { Landing } from "./pages/Landing";
import { Analysis } from "./pages/Analysis";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/analysis",
    Component: Analysis,
  },
]);
