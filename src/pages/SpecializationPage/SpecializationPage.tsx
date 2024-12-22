import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSpecialization, removeSelectedSpecialization} from "store/slices/specializationsSlice.ts";

const SpecializationPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {specialization} = useAppSelector((state) => state.specializations)

    useEffect(() => {
        dispatch(fetchSpecialization(id))
        return () => dispatch(removeSelectedSpecialization())
    }, []);

    if (!specialization) {
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
                        src={specialization.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{specialization.name}</h1>
                    <p className="fs-5">Описание: {specialization.description}</p>
                    <p className="fs-5">Проходной балл на бюджет: {specialization.budget_passing_score}</p>
                    <p className="fs-5">Количество мест на бюджет: {specialization.budget_place}</p>
                    <p className="fs-5">Количество мест на платное: {specialization.paid_place}</p>
                    <p className="fs-5">Цена: {specialization.price} руб.</p>
                </Col>
            </Row>
        </Container>
    );
};

export default SpecializationPage