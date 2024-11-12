import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {T_Specialization} from "src/modules/types.ts";
import SpecializationCard from "components/SpecializationCard";
import {SpecializationMocks} from "src/modules/mocks.ts";
import {FormEvent, useEffect} from "react";
import * as React from "react";

type SpecializationsListPageProps = {
    specializations: T_Specialization[],
    setSpecializations: React.Dispatch<React.SetStateAction<T_Specialization[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
    specializationName: string,
    setSpecializationName: React.Dispatch<React.SetStateAction<string>>
}

const SpecializationsListPage = ({specializations, setSpecializations, isMock, setIsMock, specializationName, setSpecializationName}:SpecializationsListPageProps) => {

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/specializations/?specialization_name=${specializationName.toLowerCase()}`,{ signal: AbortSignal.timeout(1000) })
            const data = await response.json()
            setSpecializations(data.specializations)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    const createMocks = () => {
        setIsMock(true)
        setSpecializations(SpecializationMocks.filter(specialization => specialization.name.toLowerCase().includes(specializationName.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        if (isMock) {
            createMocks()
        } else {
            await fetchData()
        }
    }

    useEffect(() => {
        fetchData()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={specializationName} onChange={(e) => setSpecializationName(e.target.value)} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {specializations?.map(specialization => (
                    <Col key={specialization.id} xs="4">
                        <SpecializationCard specialization={specialization} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SpecializationsListPage