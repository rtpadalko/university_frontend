import {Button, Card, CardBody, CardText, CardTitle, Col, Row} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {T_Specialization} from "modules/types.ts";
import {
    removeSpecializationFromDraftApplicant,
    updateSpecializationValue
} from "store/slices/applicantsSlice.ts";
import {useEffect, useState} from "react";
import CustomInput from "components/CustomInput/CustomInput.tsx";
import {addSpecializationToApplicant, fetchSpecializations} from "store/slices/specializationsSlice.ts";

type Props = {
    specialization: T_Specialization,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    editMM?: boolean
}

const SpecializationCard = ({specialization, showAddBtn=false, showRemoveBtn=false, editMM=false}:Props) => {

    const dispatch = useAppDispatch()

    const {is_superuser} = useAppSelector((state) => state.user)

    const {save_mm} = useAppSelector(state => state.applicants)

    const [local_priority, setLocal_priority] = useState(specialization.priority)

    const location = useLocation()

    const isApplicantPage = location.pathname.includes("applicants")

    const handeAddToDraftApplicant = async () => {
        await dispatch(addSpecializationToApplicant(specialization.id))
        await dispatch(fetchSpecializations())
    }

    const handleRemoveFromDraftApplicant = async () => {
        await dispatch(removeSpecializationFromDraftApplicant(specialization.id))
    }

    useEffect(() => {
        save_mm && updateValue()
    }, [save_mm]);

    const updateValue = async () => {
        dispatch(updateSpecializationValue({
            specialization_id: specialization.id,
            priority: local_priority
        }))
    }

    if (isApplicantPage) {
        return (
            <Card key={specialization.id}>
                <Row>
                    <Col>
                        <img
                            alt=""
                            src={specialization.image}
                            style={{"width": "100%"}}
                        />
                    </Col>
                    <Col md={8}>
                        <CardBody>
                            <CardTitle tag="h5">
                                {specialization.name}
                            </CardTitle>
                            <CardText>
                                Цена: {specialization.price} руб.
                            </CardText>
                            <CustomInput label="Приоритет" type="number" value={local_priority} setValue={setLocal_priority} disabled={!editMM || is_superuser} className={"w-25"}/>
                            <Col className="d-flex gap-5">
                                <Link to={`/specializations/${specialization.id}`}>
                                    <Button color="primary" type="button">
                                        Открыть
                                    </Button>
                                </Link>
                                {showRemoveBtn &&
                                    <Button color="danger" onClick={handleRemoveFromDraftApplicant}>
                                        Удалить
                                    </Button>
                                }
                            </Col>
                        </CardBody>
                    </Col>
                </Row>
            </Card>
        );
    }

    return (
        <Card key={specialization.id} style={{width: '18rem' }}>
            <img
                alt=""
                src={specialization.image}
                style={{"height": "200px"}}
            />
            <CardBody>
                <CardTitle tag="h5">
                    {specialization.name}
                </CardTitle>
                <CardText>
                    Цена: {specialization.price} руб.
                </CardText>
                <Col className="d-flex justify-content-between">
                    <Link to={`/specializations/${specialization.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {!is_superuser && showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftApplicant}>
                            Добавить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};

export default SpecializationCard