import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import SpecializationCard from "components/SpecializationCard";
import {ChangeEvent, FormEvent, useEffect} from "react";
import * as React from "react";
import {useAppSelector} from "src/store/store.ts";
import {updateSpecializationName} from "src/store/slices/specializationsSlice.ts";
import {T_Specialization} from "modules/types.ts";
import {SpecializationMocks} from "modules/mocks.ts";
import {useDispatch} from "react-redux";

type Props = {
    specializations: T_Specialization[],
    setSpecializations: React.Dispatch<React.SetStateAction<T_Specialization[]>>
    isMock: boolean,
    setIsMock: React.Dispatch<React.SetStateAction<boolean>>
}

const SpecializationsListPage = ({specializations, setSpecializations, isMock, setIsMock}:Props) => {

    const dispatch = useDispatch()

    const {specialization_name} = useAppSelector((state) => state.specializations)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateSpecializationName(e.target.value))
    }

    const createMocks = () => {
        setIsMock(true)
        setSpecializations(SpecializationMocks.filter(specialization => specialization.name.toLowerCase().includes(specialization_name.toLowerCase())))
    }

    const handleSubmit = async (e:FormEvent) => {
        e.preventDefault()
        await fetchSpecializations()
    }

    const fetchSpecializations = async () => {
        try {
            const response = await fetch(`http://localhost:8000/api/specializations/?specialization_name=${specialization_name.toLowerCase()}`)
            const data = await response.json()
            setSpecializations(data.specializations)
            setIsMock(false)
        } catch {
            createMocks()
        }
    }

    useEffect(() => {
        fetchSpecializations()
    }, []);

    return (
        <Container>
            <Row className="mb-5">
                <Col md="6">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col xs="8">
                                <Input value={specialization_name} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row>
                {specializations?.map(specialization => (
                    <Col key={specialization.id} sm="12" md="6" lg="4">
                        <SpecializationCard specialization={specialization} isMock={isMock} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SpecializationsListPage