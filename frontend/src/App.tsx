import {useState} from "react";
import Header from "components/Header";
import Breadcrumbs from "components/Breadcrumbs";
import SpecializationPage from "pages/SpecializationPage";
import SpecializationsListPage from "pages/SpecializationsListPage";
import {Route, Routes} from "react-router-dom";
import {T_Specialization} from "src/modules/types.ts";
import {Container, Row} from "reactstrap";
import HomePage from "pages/HomePage";
import "./styles.css"

function App() {

    const [specializations, setSpecializations] = useState<T_Specialization[]>([])

    const [selectedSpecialization, setSelectedSpecialization] = useState<T_Specialization | null>(null)

    const [isMock, setIsMock] = useState(false);

    const [specializationName, setSpecializationName] = useState<string>("")

    return (
        <div>
            <Header/>
            <Container className="pt-4">
                <Row className="mb-3">
                    <Breadcrumbs selectedSpecialization={selectedSpecialization} />
                </Row>
                <Row>
                    <Routes>
						<Route path="/" element={<HomePage />} />
                        <Route path="/specializations/" element={<SpecializationsListPage specializations={specializations} setSpecializations={setSpecializations} isMock={isMock} setIsMock={setIsMock} specializationName={specializationName} setSpecializationName={setSpecializationName}/>} />
                        <Route path="/specializations/:id" element={<SpecializationPage selectedSpecialization={selectedSpecialization} setSelectedSpecialization={setSelectedSpecialization} isMock={isMock} setIsMock={setIsMock}/>} />
                    </Routes>
                </Row>
            </Container>
        </div>
    )
}

export default App
