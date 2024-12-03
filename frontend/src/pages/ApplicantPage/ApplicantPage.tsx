import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import {useAppDispatch, useAppSelector} from "store/store.ts";
import {
    deleteDraftApplicant,
    fetchApplicant,
    removeApplicant,
    sendDraftApplicant,
    triggerUpdateMM,
    updateApplicant
} from "store/slices/applicantsSlice.ts";
import SpecializationCard from "components/SpecializationCard";
import {Button, Col, Form, Row} from "reactstrap";
import {E_ApplicantStatus, T_Specialization} from "src/utils/types.ts";
import CustomInput from "components/CustomInput";

export const ApplicantPage = () => {
    const { id } = useParams<{id: string}>();

    const dispatch = useAppDispatch()

    const navigate = useNavigate()

    const isAuthenticated = useAppSelector((state) => state.user?.is_authenticated)

    const applicant = useAppSelector((state) => state.applicants.applicant)

    const [name, setName] = useState<string>(applicant?.name)
    const [birthday_date, setBirthdayDate] = useState<string>(applicant?.date)
    const [score, setScore] = useState<string>(applicant?.description)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/403/")
        }
    }, []);

    useEffect(() => {
        dispatch(fetchApplicant(id))
        return () => dispatch(removeApplicant())
    }, []);

    useEffect(() => {
        if (applicant) {
            setName(applicant.name)
            setBirthdayDate(applicant.birthday_date)
            setScore(applicant.score)
        }
    }, [applicant]);

    const sendApplicant = async (e) => {
        e.preventDefault()

        const data = {
            name: name,
            score: score,
            birthday_date: birthday_date
        }

        await dispatch(updateApplicant(data))
        await dispatch(sendDraftApplicant())

        navigate("/applicants")
    }

    const saveApplicant = async (e) => {
        e.preventDefault()

        const data = {
            name: name,
            score: score,
            birthday_date: birthday_date
        }

        await dispatch(updateApplicant(data))
        await dispatch(triggerUpdateMM())
    }

    const deleteApplicant = async () => {
        await dispatch(deleteDraftApplicant())
        navigate("/specializations")
    }

    if (!applicant) {
        return (
            <div>

            </div>
        )
    }

    const isDraft = applicant.status == E_ApplicantStatus.Draft
    const isCompleted = applicant.status == E_ApplicantStatus.Completed

    return (
        <Form onSubmit={sendApplicant} className="pb-5">
            <h2 className="mb-5">{isDraft ? "Абитуриент" : `Абитуриент №${id}` }</h2>
            <Row className="mb-5 fs-5 w-25">
                <CustomInput label="Название" placeholder="Введите название" value={name} setValue={setName} disabled={!isDraft}/>
                <CustomInput label="Год рождения" placeholder="Введите год рождения" value={birthday_date} setValue={setBirthdayDate} disabled={!isDraft}/>
                {isCompleted && <CustomInput label="Кол-во баллов ЕГЭ" value={score} setValue={setScore} disabled={true}/>}
            </Row>
            <Row>
                {applicant.specializations.length > 0 ? applicant.specializations.map((specialization:T_Specialization) => (
                    <Col md="4" key={specialization.id} className="d-flex justify-content-center mb-5">
                        <SpecializationCard specialization={specialization} showRemoveBtn={isDraft} showMM={true} editMM={isDraft} value={specialization.value}/>
                    </Col>
                )) :
                    <h3 className="text-center">Специальности еще не добавлены</h3>
                }
            </Row>
            {isDraft &&
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