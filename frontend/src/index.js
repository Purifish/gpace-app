import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import TopicsBrowse from "./pages/TopicsBrowse/TopicsBrowse";
import Quiz from "./quiz_components/Quiz/Quiz";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<TopicsBrowse />} />
          <Route path="/quiz/:topicName" element={<Quiz />} />
          {/* <Route
            path="/quiz/geography"
            element={<Quiz topicName="geography" />}
          />
          <Route path="/quiz/math" element={<Quiz topicName="math" />} />
          <Route path="/quiz/cpp" element={<Quiz topicName="cpp" />} /> */}
          {/*<Route path="*" element={<PageNotFound />}/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
