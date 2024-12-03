import {Button, Card, CardBody, CardText, CardTitle, Col} from "reactstrap";
import {Link} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {addSpecializationToApplicant, fetchSpecializations} from "store/slices/specializationsSlice.ts";
import {T_Specialization} from "utils/types.ts";
import {removeSpecializationFromDraftApplicant, updateSpecializationValue} from "store/slices/applicantsSlice.ts";
import CustomInput from "components/CustomInput";
import {useEffect, useState} from "react";

type Props = {
    specialization: T_Specialization,
    showAddBtn?: boolean,
    showRemoveBtn?: boolean,
    showMM?: boolean,
    editMM?: boolean
}

export const SpecializationCard = ({specialization, showAddBtn = false, showRemoveBtn = false, showMM=false, editMM = false}:Props) => {

    const dispatch = useAppDispatch()

    const {save_mm} = useAppSelector(state => state.applicants)

    const [localValue, setLocalValue] = useState(specialization.priority)

    const handeAddToDraftApplicant = async () => {
        await dispatch(addSpecializationToApplicant(specialization.id))
        await dispatch(fetchSpecializations())
    }

    const handleRemoveFromDraftApplicant = async () => {
        await dispatch(removeSpecializationFromDraftApplicant(specialization.id))
    }

    useEffect(() => {
        dispatch(updateSpecializationValue({
            specialization_id: specialization.id,
            value: localValue
        }))
    }, [save_mm]);

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
                {showMM && <CustomInput label="Приоритет" type="number" value={localValue} setValue={setLocalValue} disabled={!editMM} />}
                <Col className="d-flex justify-content-between">
                    <Link to={`/specializations/${specialization.id}`}>
                        <Button color="primary" type="button">
                            Открыть
                        </Button>
                    </Link>
                    {showAddBtn &&
                        <Button color="secondary" onClick={handeAddToDraftApplicant}>
                            Добавить
                        </Button>
                    }
                    {showRemoveBtn &&
                        <Button color="danger" onClick={handleRemoveFromDraftApplicant}>
                            Удалить
                        </Button>
                    }
                </Col>
            </CardBody>
        </Card>
    );
};