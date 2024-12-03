import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import SpecializationCard from "components/SpecializationCard";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSpecializations, updateSpecializationName} from "store/slices/specializationsSlice.ts";
import {Bin} from "../../components/Bin/Bin.tsx";

export const SpecializationsListPage = () => {

    const dispatch = useAppDispatch()

    const specializations = useAppSelector((state) => state.specializations.specializations)

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const {draft_applicant_id, specializations_count} = useAppSelector((state) => state.applicants)

    const hasDraft = draft_applicant_id != null

    const specialization_name = useAppSelector((state) => state.specializations.specialization_name)

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
            <Row>
                <Col md="8">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={specialization_name} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                {isAuthenticated &&
                    <Col className="d-flex flex-row justify-content-end">
                        <Bin isActive={hasDraft} draft_applicant_id={draft_applicant_id} specializations_count={specializations_count} />
                    </Col>
                }
            </Row>
            <Row className="mt-5 d-flex">
                {specializations?.map(specialization => (
                    <Col key={specialization.id} xs="4" className="mb-5 d-flex justify-content-center">
                        <SpecializationCard specialization={specialization} showAddBtn={isAuthenticated} showMM={false} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};