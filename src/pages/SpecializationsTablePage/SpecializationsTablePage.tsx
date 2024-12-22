import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchSpecializations, updateSpecializationName} from "store/slices/specializationsSlice.ts";
import {Link, useNavigate} from "react-router-dom";
import SpecializationsTable from "components/SpecializationsTable/SpecializationsTable.tsx";

const SpecializationsTablePage = () => {

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const {specializations, specialization_name} = useAppSelector((state) => state.specializations)

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

    useEffect(() => {
        if (!is_superuser) {
            navigate("/403/")
        }
    }, [is_authenticated, is_superuser]);

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
                <Col className="d-flex flex-row justify-content-end" md="6">
                    <Link to="/specializations/add">
                        <Button color="primary">Новая специальность</Button>
                    </Link>
                </Col>
            </Row>
            <Row className="mt-5 d-flex">
                {specializations.length > 0 ? <SpecializationsTable specializations={specializations} fetchSpecializations={fetchSpecializations}/> : <h3 className="text-center mt-5">Специальности не найдены</h3>}
            </Row>
        </Container>
    );
};

export default SpecializationsTablePage