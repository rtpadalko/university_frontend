import {Container, Row} from "reactstrap";

const HomePage = () => {
	return (
		<Container>
			<Row>
				<h1 className="mb-3">Добро пожаловать на сайт приемной комиссии МГТУ!</h1>
				<p className="fs-5">Приемная комиссия — подразделение от образовательной организации, которое принимает документы от поступающих, проводит ДВИ и формирует списки на зачисление. У каждого колледжа или вуза есть председатель приемной комиссии, занимающийся контролем проведения приема.</p>
			</Row>
		</Container>
	)
}

export default HomePage