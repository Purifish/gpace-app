import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import TopicsBrowse from "./pages/TopicsBrowse/TopicsBrowse";
import Quiz from "./quiz_components/Quiz/Quiz";
import ResourcePage from "./resource_components/ResourcePage/ResourcePage";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<TopicsBrowse />} />
          <Route
            path="/resource/:courseCode/quizzes/quiz/:quizId"
            element={<Quiz />}
          />
          <Route
            path="/resource/:courseCode/:resourceType"
            element={<ResourcePage />}
          />
          {/*TODO: Add Page Not Found */}
          {/*<Route path="*" element={<PageNotFound />}/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
