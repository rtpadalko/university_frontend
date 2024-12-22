import {formatDate} from "src/utils/utils.ts";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {Button, Card, Col, Row} from "reactstrap";
import {acceptApplicant, fetchApplicants, rejectApplicant} from "store/slices/applicantsSlice.ts";
import {T_Applicant} from "modules/types.ts";

type Props = {
    applicants:T_Applicant[]
}

const STATUSES = {
    1: "Черновик",
    2: "В работе",
    3: "Завершен",
    4: "Отменён",
    5: "Удалён"
}

const ApplicantsTable = ({applicants}:Props) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    return (
        <div className="mb-5">
            <div className="mb-2" style={{fontWeight: "bold"}}>
                <Card style={{padding: "10px"}}>
                    <Row>
                        <Col md={1}>
                            №
                        </Col>
                        <Col md={1}>
                            Статус
                        </Col>
                        <Col md={1}>
                            Рейтинг
                        </Col>
                        <Col>
                            Дата создания
                        </Col>
                        <Col>
                            Дата формирования
                        </Col>
                        <Col>
                            Дата завершения
                        </Col>
                        {is_superuser &&
                            <>
                                <Col>
                                    Пользователь
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                                <Col>
                                    Действие
                                </Col>
                            </>
                        }
                    </Row>
                </Card>
            </div>
            <div className="d-flex flex-column gap-2">
                {applicants.map((applicant, index) => (
                    <ApplicantCard applicant={applicant} index={index} key={index}/>
                ))}
            </div>
        </div>
    )
};

const ApplicantCard = ({applicant, index}:{applicant:T_Applicant, index:number}) => {

    const {is_superuser} = useAppSelector((state) => state.user)

    const dispatch = useAppDispatch()

    const handleAcceptApplicant = async (applicant_id) => {
        await dispatch(acceptApplicant(applicant_id))
        await dispatch(fetchApplicants())
    }

    const handleRejectApplicant = async (applicant_id) => {
        await dispatch(rejectApplicant(applicant_id))
        await dispatch(fetchApplicants())
    }

    return (
        <Card style={{padding: "10px"}}>
            <Row>
                <Col md={1}>
                    {index + 1}
                </Col>
                <Col md={1}>
                    {STATUSES[applicant.status]}
                </Col>
                <Col md={1}>
                    {applicant.rating}
                </Col>
                <Col>
                    {formatDate(applicant.date_created)}
                </Col>
                <Col>
                    {formatDate(applicant.date_formation)}
                </Col>
                <Col>
                    {formatDate(applicant.date_complete)}
                </Col>
                {is_superuser &&
                    <>
                        <Col>
                            {applicant.owner}
                        </Col>
                        <Col>
                            {applicant.status == 2 && <Button color="primary" onClick={() => handleAcceptApplicant(applicant.id)}>Принять</Button>}
                        </Col>
                        <Col>
                            {applicant.status == 2 && <Button color="danger" onClick={() => handleRejectApplicant(applicant.id)}>Отклонить</Button>}
                        </Col>
                    </>
                }
            </Row>
        </Card>
    )
}

export default ApplicantsTable