import { FC } from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
export const AppHeader: FC = () => {
	return (
		<Navbar
			bg="white"
			className="border border-primary border-top-0 rounded-bottom p-3"
		>
			<Nav.Link
				as={Link}
				to={process.env.PUBLIC_URL + '/'}
				className="d-flex align-items-center text-primary"
			>
				<img
					alt="logo"
					src={process.env.PUBLIC_URL + '/logo512.png'}
					width="80"
					className="me-2"
				/>
				DemoApp
			</Nav.Link>
			<Nav className="ms-auto">
				<Nav.Link
					as={Link}
					to={'https://stg-gatekeeper.universalnameservice.com/'}
					className="d-flex align-items-center text-primary"
				>
					<strong className="ms-1">UNS</strong>&nbsp;Gatekeeper
				</Nav.Link>
			</Nav>
		</Navbar>
	);
};
