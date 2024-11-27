import {Breadcrumb, BreadcrumbItem} from "reactstrap";
import {Link, useLocation} from "react-router-dom";
import {T_Specialization} from "modules/types.ts";

type Props = {
    selectedSpecialization: T_Specialization | null
}

const Breadcrumbs = ({selectedSpecialization}:Props) => {

    const location = useLocation()

    return (
        <Breadcrumb className="fs-5">
			{location.pathname == "/" &&
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
            {selectedSpecialization &&
                <BreadcrumbItem active>
                    <Link to={location.pathname}>
                        { selectedSpecialization.name }
                    </Link>
                </BreadcrumbItem>
            }
			<BreadcrumbItem />
        </Breadcrumb>
    );
};

export default Breadcrumbs