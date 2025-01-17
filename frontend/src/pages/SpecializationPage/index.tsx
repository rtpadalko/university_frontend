import * as React from 'react';
import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {T_Specialization} from "src/modules/types.ts";
import {Col, Container, Row} from "reactstrap";
import {SpecializationMocks} from "src/modules/mocks.ts";
import mockImage from "assets/mock.png";

type SpecializationPageProps = {
    selectedSpecialization: T_Specialization | null,
    setSelectedSpecialization: React.Dispatch<React.SetStateAction<T_Specialization | null>>,
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const SpecializationPage = ({selectedSpecialization, setSelectedSpecialization, isMock, setIsMock}: SpecializationPageProps) => {
    const { id } = useParams<{id: string}>();

    const fetchData = async () => {
        try {
            const response = await fetch(`/api/specializations/${id}`,{ signal: AbortSignal.timeout(1000) })
            const data = await response.json()
            setSelectedSpecialization(data)
        } catch {
            createMock()
        }
    }

    const createMock = () => {
        setIsMock(true)
        setSelectedSpecialization(SpecializationMocks.find(specialization => specialization?.id == parseInt(id as string)) as T_Specialization)
    }

    useEffect(() => {
        if (!isMock) {
            fetchData()
        } else {
            createMock()
        }

        return () => setSelectedSpecialization(null)
    }, []);

    if (!selectedSpecialization) {
        return (
            <div>

            </div>
        )
    }

    return (
        <Container>
            <Row>
                <Col md="6">
                    <img
                        alt=""
                        src={isMock ? mockImage as string : selectedSpecialization.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedSpecialization.name}</h1>
                    <p className="fs-5">Описание: {selectedSpecialization.description}</p>
                    <p className="fs-5">Количество мест на бюджет: {selectedSpecialization.budget_place}</p>
                    <p className="fs-5">Проходной бал на бюджет: {selectedSpecialization.budget_passing_score}</p>
                    <p className="fs-5">Количество мест на платное: {selectedSpecialization.paid_place}</p>
                    <p className="fs-5">Цена: {selectedSpecialization.price} руб.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default SpecializationPage