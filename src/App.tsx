import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import "./styles.css"
import HomePage from "pages/HomePage/HomePage.tsx";
import LoginPage from "pages/LoginPage/LoginPage.tsx";
import RegisterPage from "pages/RegisterPage/RegisterPage.tsx";
import SpecializationsListPage from "pages/SpecializationsListPage/SpecializationsListPage.tsx";
import SpecializationPage from "pages/SpecializationPage/SpecializationPage.tsx";
import ApplicantsPage from "pages/ApplicantsPage/ApplicantsPage.tsx";
import ApplicantPage from "pages/ApplicantPage/ApplicantPage.tsx";
import ProfilePage from "pages/ProfilePage/ProfilePage.tsx";
import AccessDeniedPage from "pages/AccessDeniedPage/AccessDeniedPage.tsx";
import NotFoundPage from "pages/NotFoundPage/NotFoundPage.tsx";
import Header from "components/Header/Header.tsx";
import Breadcrumbs from "components/Breadcrumbs/Breadcrumbs.tsx";
import SpecializationsTablePage from "pages/SpecializationsTablePage/SpecializationsTablePage.tsx";
import SpecializationEditPage from "pages/SpecializationEditPage/SpecializationEditPage.tsx";
import SpecializationAddPage from "pages/SpecializationAddPage/SpecializationAddPage.tsx";
import FacultyAddPage from "pages/FacultyAddPage/FacultyAddPage.tsx";
import FacultiesListPage from "pages/FacultiesPage/FacultiesPage.tsx";
import FacultyPage from "pages/FacultyPage/FacultyPage.tsx";

function App() {
    return (
        <div>
            <Header />
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs />
                </Row>
                <Row>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/login/" element={<LoginPage />} />
                        <Route path="/register/" element={<RegisterPage />} />
                        <Route path="/specializations/" element={<SpecializationsListPage />} />
                        <Route path="/specializations-table/" element={<SpecializationsTablePage />} />
                        <Route path="/specializations/:id/" element={<SpecializationPage />} />
                        <Route path="/specializations/:id/edit" element={<SpecializationEditPage />} />
                        <Route path="/specializations/add" element={<SpecializationAddPage />} />
                        <Route path="/applicants/" element={<ApplicantsPage />} />
                        <Route path="/applicants/:id/" element={<ApplicantPage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                        <Route path="/403/" element={<AccessDeniedPage />} />
                        <Route path="/404/" element={<NotFoundPage />} />
                        <Route path="/faculties/" element={<FacultiesListPage />} />
                        <Route path="/faculties/:id/" element={<FacultyPage />} />
                        <Route path="/faculties/add/" element={<FacultyAddPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
