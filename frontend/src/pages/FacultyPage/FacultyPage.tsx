import {useParams} from "react-router-dom";
import {useEffect} from "react";
import {Col, Container, Row} from "reactstrap";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {fetchFaculty, removeSelectedFaculty} from "store/slices/facultiesSlice.ts";

export const FacultyPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const selectedFaculty = useAppSelector((state) => state.faculties.selectedFaculty)

    useEffect(() => {
        dispatch(fetchFaculty(id))
        return () => dispatch(removeSelectedFaculty())
    }, []);

    if (!selectedFaculty) {
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
                        src={selectedFaculty.image}
                        className="w-100"
                    />
                </Col>
                <Col md="6">
                    <h1 className="mb-3">{selectedFaculty.name}</h1>
                    <p className="fs-5">Описание: {selectedFaculty.description}</p>
                </Col>
            </Row>
        </Container>
    );
};