import * as React from 'react';
import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {useAppSelector} from "store/store.ts";

export const Breadcrumbs = () => {

    const location = useLocation()

    const selectedSpecialization = useAppSelector((state) => state.specializations.selectedSpecialization)

    const selectedFaculty = useAppSelector((state) => state.faculties.selectedFaculty)

    const applicant = useAppSelector((state) => state.applicants.applicant)

    const crumbs = () => {

        if (location.pathname == '/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/">
                            Главная
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/specializations/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/specializations/">
                            Специальности
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (selectedSpecialization) {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/specializations/">
                            Специальности
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            {selectedSpecialization?.name}
                        </Link>
                    </BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/faculties/') {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/faculties/">
                            Факультеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (selectedFaculty) {
            return (
                <>
                    <BreadcrumbItem>
                        <Link to="/faculties/">
                            Факультеты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            {selectedFaculty?.name}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (applicant) {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to="/applicants/">
                            Абитуриенты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Абитуриент №{applicant?.id}
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/applicants/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Абитуриенты
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/login/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Вход
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }

        if (location.pathname == '/register/') {
            return (
                <>
                    <BreadcrumbItem active>
                        <Link to={location.pathname}>
                            Регистрация
                        </Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem></BreadcrumbItem>
                </>
            )
        }
    };

    return (
        <Breadcrumb className="fs-5">
            {crumbs()}
        </Breadcrumb>
    );
};