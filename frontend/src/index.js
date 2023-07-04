import { StrictMode } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import App from './App';
import TopicsBrowse from './pages/TopicsBrowse/TopicsBrowse';
import GeographyQuiz from './pages/GeographyQuiz/GeographyQuiz';
import CppQuiz from './pages/CppQuiz/CppQuiz';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}> {/*Parent Route*/}
          <Route path="/" element={<TopicsBrowse />} />
          <Route path="/quiz/geography" element={<GeographyQuiz />} />
          <Route path="/quiz/math" element={<GeographyQuiz />} />
          <Route path="/quiz/cpp" element={<CppQuiz />} />
          {/* <Route path="/" element={<NoteBrowse />}/>
          <Route path="/note/:noteId" element={<Note />}/>
          <Route path="/note/new" element={<NoteCreate />}/>
          <Route path="*" element={<PageNotFound />}/> */}
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);