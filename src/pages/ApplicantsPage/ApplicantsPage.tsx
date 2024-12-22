import {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    fetchApplicants,
    updateFilters
} from "store/slices/applicantsSlice.ts";
import {Button, Col, Container, Form, Input, Row} from "reactstrap";
import {useNavigate} from "react-router-dom";
import CustomDropdown from "components/CustomDropdown/CustomDropdown.tsx";
import {T_ApplicantsFilters} from "modules/types.ts";
import ApplicantsTable from "components/ApplicantsTable/ApplicantsTable.tsx";

const ApplicantsPage = () => {

    const applicants = useAppSelector((state) => state.applicants.applicants)

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const filters = useAppSelector<T_ApplicantsFilters>((state) => state.applicants.filters)

    const navigate = useNavigate()

    const dispatch = useAppDispatch()

    const [status, setStatus] = useState(filters.status)

    const [dateFormationStart, setDateFormationStart] = useState(filters.date_formation_start)

    const [dateFormationEnd, setDateFormationEnd] = useState(filters.date_formation_end)

    const [owner, setOwner] = useState(filters.owner)

    const statusOptions = {
        0: "Любой",
        2: "В работе",
        3: "Завершен",
        4: "Отклонен"
    }

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/403/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        handleFetchApplicants()
    }, [filters]);

    useEffect(() => {
        const intervalId = setInterval(handleFetchApplicants, 2000)
        return () => clearInterval(intervalId)
    }, [filters]);

    const handleFetchApplicants = () => dispatch(fetchApplicants())

    const applyFilters = async (e) => {
        e.preventDefault()

        const filters:T_ApplicantsFilters = {
            status: status,
            date_formation_start: dateFormationStart,
            date_formation_end: dateFormationEnd,
            owner
        }

        await dispatch(updateFilters(filters))
    }

    return (
        <Container>
            <Form onSubmit={applyFilters}>
                <Row className="mb-4 d-flex align-items-center">
                    <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                        <label>От</label>
                        <Input type="date" value={dateFormationStart} onChange={(e) => setDateFormationStart(e.target.value)} required/>
                    </Col>
                    <Col md="2" className="d-flex flex-row gap-3 align-items-center">
                        <label>До</label>
                        <Input type="date" value={dateFormationEnd} onChange={(e) => setDateFormationEnd(e.target.value)} required/>
                    </Col>
                    <Col md="3">
                        <CustomDropdown label="Статус" selectedItem={status} setSelectedItem={setStatus} options={statusOptions} />
                    </Col>
                    {is_superuser &&
                        <Col md="3">
                            <Input type="text" placeholder="Имя пользователя" value={owner}
                                   onChange={(e) => setOwner(e.target.value)}/>
                        </Col>
                    }
                    <Col className="d-flex justify-content-end">
                        <Button color="primary" type="submit">Применить</Button>
                    </Col>
                </Row>
            </Form>
            {applicants.length ? <ApplicantsTable applicants={applicants} /> : <h3 className="text-center mt-5">Абитуриенты не найдены</h3>}
        </Container>
    )
};

export default ApplicantsPage