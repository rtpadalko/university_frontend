import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Specialization} from "modules/types.ts";
import {isHomePage, isSpecializationPage} from "utils/utils.ts";

interface BreadcrumbsProps {
    selectedSpecialization: T_Specialization | null
}

const Breadcrumbs = ({ selectedSpecialization }: BreadcrumbsProps) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{isHomePage(location.pathname) &&
				<BreadcrumbItem>
					<Link to="/">
						Главная
					</Link>
				</BreadcrumbItem>
			}
			{location.pathname.includes("/specializations") &&
                <BreadcrumbItem active>
                    <Link to="/specializations">
						Специальности
                    </Link>
                </BreadcrumbItem>
			}
            {isSpecializationPage(location.pathname) &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedSpecialization?.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs