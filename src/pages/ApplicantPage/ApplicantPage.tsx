import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftApplicant,
    fetchApplicant,
    removeApplicant, sendDraftApplicant,
    triggerUpdateMM, updateApplicant
} from "store/slices/applicantsSlice.ts";
import {Button, Col, Form, Row} from "reactstrap";
import {E_ApplicantStatus, T_Specialization} from "modules/types.ts";
import SpecializationCard from "components/SpecializationCard/SpecializationCard.tsx";
import CustomInput from "components/CustomInput/CustomInput.tsx";

const ApplicantPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const {is_authenticated, is_superuser} = useAppSelector((state) => state.user)

    const applicant = useAppSelector((state) => state.applicants.applicant)

    const [name, setName] = useState<string>(applicant?.name)
    const [birthday_date, setBirthdayDate] = useState<string>(applicant?.birthday_date)

    const [rating, setRating] = useState<string>(applicant?.rating)

    useEffect(() => {
        if (!is_authenticated) {
            navigate("/403/")
        }
    }, [is_authenticated]);

    useEffect(() => {
        is_authenticated && dispatch(fetchApplicant(id))
        return () => dispatch(removeApplicant())
    }, []);

    useEffect(() => {
        setName(applicant?.name)
        setBirthdayDate(applicant?.birthday_date)
        setRating(applicant?.rating)
    }, [applicant]);

    const sendApplicant = async (e) => {
        e.preventDefault()

        await saveApplicant()

        await dispatch(sendDraftApplicant())

        navigate("/applicants")
    }

    const saveApplicant = async (e?) => {
        e?.preventDefault()

        const data = {
            name,
            birthday_date
        }

        await dispatch(updateApplicant(data))
        await dispatch(triggerUpdateMM())
        await dispatch(triggerUpdateMM())
    }

    const deleteApplicant = async () => {
        await dispatch(deleteDraftApplicant())
        navigate("/specializations")
    }

    if (!applicant) {
        return (
            <></>
        )
    }

    const isDraft = applicant.status == E_ApplicantStatus.Draft
    const isCompleted = applicant.status == E_ApplicantStatus.Completed

    return (
        <Form onSubmit={sendApplicant} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Абитуриент" : `Абитуриент №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="ФИО" placeholder="Введите ФИО" value={name} setValue={setName} disabled={!isDraft || is_superuser}/>
                <CustomInput label="Год рождения" placeholder="Введите год рождения" value={birthday_date} setValue={setBirthdayDate} disabled={!isDraft || is_superuser} type="number" />
                {isCompleted && <CustomInput label="Рейтинг для поступления" value={rating} disabled={true}/>}
            </Row>
            <Row>
                {applicant.specializations.length > 0 ? applicant.specializations.map((specialization:T_Specialization) => (
                    <Row key={specialization.id} className="d-flex justify-content-center mb-5">
                        <SpecializationCard specialization={specialization} showRemoveBtn={isDraft} editMM={isDraft}/>
                    </Row>
                )) :
                    <h3 className="text-center">Специальности не добавлены</h3>
                }
            </Row>
            {isDraft && !is_superuser &&
                <Row className="mt-5">
                    <Col className="d-flex gap-5 justify-content-center">
                        <Button color="success" className="fs-4" onClick={saveApplicant}>Сохранить</Button>
                        <Button color="primary" className="fs-4" type="submit">Отправить</Button>
                        <Button color="danger" className="fs-4" onClick={deleteApplicant}>Удалить</Button>
                    </Col>
                </Row>
            }
        </Form>
    );
};

export default ApplicantPage