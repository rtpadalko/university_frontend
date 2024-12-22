import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchFaculty, removeSelectedFaculty} from "store/slices/facultiesSlice.ts";

const FacultyPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const {faculty} = useAppSelector((state) => state.faculties)

    useEffect(() => {
        dispatch(fetchFaculty(id))
        return () => dispatch(removeSelectedFaculty())
    }, []);

    if (!faculty) {
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
                        src={faculty.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{faculty.name}</h1>
                    <p className="fs-5">Описание: {faculty.description}</p>
                </Col>
            </Row>
        </Container>
    );
};

export default FacultyPage