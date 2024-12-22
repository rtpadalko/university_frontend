import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {ChangeEvent, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchFaculties, updateFacultyName} from "store/slices/facultiesSlice.ts";
import {FacultyCard} from "components/FacultyCard/FacultyCard.tsx";
import {Link} from "react-router-dom";

const FacultiesListPage = () => {

    const dispatch = useAppDispatch()

    const {faculties, faculty_name} = useAppSelector((state) => state.faculties)

    const {is_superuser} = useAppSelector((state) => state.user)

    const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
        dispatch(updateFacultyName(e.target.value))
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
                                <Input value={faculty_name} onChange={handleChange} placeholder="Поиск..."></Input>
                            </Col>
                            <Col>
                                <Button color="primary" className="w-100 search-btn">Поиск</Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
                {is_superuser &&
                    <Col className="d-flex flex-row justify-content-end" md="4">
                        <Link to={"/faculties/add/"}>
                            <Button color="primary" className="search-btn">
                                Создать факультет
                            </Button>
                        </Link>
                    </Col>
                }
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

export default FacultiesListPage