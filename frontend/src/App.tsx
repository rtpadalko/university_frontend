import Header from "components/Header";
import SpecializationsListPage from "pages/SpecializationsListPage";
import SpecializationPage from "pages/SpecializationPage";
import {Route, Routes} from "react-router-dom";
import {Container, Row} from "reactstrap";
import {Breadcrumbs} from "./components/Breadcrumbs/Breadcrumbs.tsx";
import LoginPage from "pages/LoginPage";
import RegisterPage from "pages/RegisterPage";
import ApplicantsPage from "pages/ApplicantsPage";
import ApplicantPage from "pages/ApplicantPage";
import HomePage from "pages/HomePage";
import ProfilePage from "pages/ProfilePage";
import "./styles.css"
import {useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {handleCheck} from "store/slices/userSlice.ts";
import NotFoundPage from "pages/NotFoundPage";
import {AccessDeniedPage} from "pages/AccessDeniedPage/AccessDeniedPage.tsx";
import {FacultyPage} from "pages/FacultyPage/FacultyPage.tsx";
import {FacultiesListPage} from "pages/FacultiesPage/FacultiesPage.tsx";

function App() {

    const dispatch = useAppDispatch()

    const {checked} = useAppSelector((state) => state.user)

    useEffect(() => {
        dispatch(handleCheck())
    }, []);

    if (!checked) {
        return <></>
    }

    return (
        <div>
            <Header/>
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
                        <Route path="/specializations/:id/" element={<SpecializationPage />} />
                        <Route path="/faculties/" element={<FacultiesListPage />} />
                        <Route path="/faculties/:id/" element={<FacultyPage />} />
                        <Route path="/applicants/" element={<ApplicantsPage />} />
                        <Route path="/applicants/:id/" element={<ApplicantPage />} />
                        <Route path="/profile/" element={<ProfilePage />} />
                        <Route path="/403/" element={<AccessDeniedPage />} />
                        <Route path="/404/" element={<NotFoundPage />} />
                        <Route path='*' element={<NotFoundPage />} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
