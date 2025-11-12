import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/Home';
import { CourseDetailPage } from '@/pages/Course';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:courseId" element={<CourseDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}
