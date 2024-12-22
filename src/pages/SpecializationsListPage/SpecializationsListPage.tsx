import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSpecializations, updateSpecializationName} from "store/slices/specializationsSlice.ts";
import SpecializationCard from "components/SpecializationCard/SpecializationCard.tsx";
import Bin from "components/Bin/Bin.tsx";

const SpecializationsListPage = () => {

    const dispatch = useAppDispatch()

    const {specializations, specialization_name} = useAppSelector((state) => state.specializations)

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {draft_applicant_id, specializations_count} = useAppSelector((state) => state.applicants)

    const hasDraft = draft_applicant_id != null

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateSpecializationName(e.target.value))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchSpecializations())
    }

    useEffect(() => {
        dispatch(fetchSpecializations())
    }, [])

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
                {is_authenticated && !is_superuser &&
                    <Col className="d-flex flex-row justify-content-end" md="6">
                        <Bin isActive={hasDraft} draft_applicant_id={draft_applicant_id} specializations_count={specializations_count} />
                    </Col>
                }
            </Row>
            <Row className="mt-5 d-flex">
                {specializations?.map(specialization => (
                    <Col key={specialization.id} className="mb-5 d-flex justify-content-center" sm="12" md="6" lg="4">
                        <SpecializationCard specialization={specialization} showAddBtn={is_authenticated} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default SpecializationsListPage