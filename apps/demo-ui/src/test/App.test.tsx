import { render, screen } from '@testing-library/react';
import App from '../App';

test('renders Welcome', () => {
	render(<App />);
	const linkElement = screen.getByText(/Welcome/i); // Update to match actual text
	expect(linkElement).toBeInTheDocument();
});
