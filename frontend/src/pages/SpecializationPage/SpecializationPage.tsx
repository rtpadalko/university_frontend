import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSpecialization, removeSelectedSpecialization} from "store/slices/specializationsSlice.ts";


export const SpecializationPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const selectedSpecialization = useAppSelector((state) => state.specializations.selectedSpecialization)

    useEffect(() => {
        dispatch(fetchSpecialization(id))
        return () => dispatch(removeSelectedSpecialization())
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
                        src={selectedSpecialization.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedSpecialization.name}</h1>
                    <p className="fs-5">Описание: {selectedSpecialization.description}</p>
                    <p className="fs-5">Количество мест на бюджет: {selectedSpecialization.budget_place}</p>
                    <p className="fs-5">Проходной балл на бюджет: {selectedSpecialization.budget_passing_score}</p>
                    <p className="fs-5">Количество мест на платное: {selectedSpecialization.paid_place}</p>
                    <p className="fs-5">Цена: {selectedSpecialization.price} руб.</p>
                </Col>
            </Row>
        </Container>
    );
};