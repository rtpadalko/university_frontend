import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchFaculties, updateQuery} from "store/slices/facultiesSlice.ts";
import {FacultyCard} from "components/FacultyCard/FacultyCard.tsx";

export const FacultiesListPage = () => {

    const dispatch = useAppDispatch()

    const faculties = useAppSelector((state) => state.faculties.faculties)

    const query = useAppSelector((state) => state.faculties.query)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateQuery(e.target.value))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(fetchFaculties())
    }

    useEffect(() => {
        dispatch(fetchFaculties())
    }, [])

    return (
        <Container>
            <Row>
                <Col md="8">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md="8">
                                <Input value={query} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>
            <Row className="mt-5 d-flex">
                {faculties?.map(faculty => (
                    <Col key={faculty.id} xs="4" className="mb-5 d-flex justify-content-center">
                        <FacultyCard faculty={faculty} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
};