import { FC, useCallback, useEffect, useState } from 'react';
import { AppHeader } from '../appHeader';
import { Page } from '../page';
import classes from './mainPage.module.scss';
import { useUser } from '../userContext';
import { DataContainer } from '../data-container/dataContainer';
import { StarRating } from '../star';

interface Message {
	serviceUserId: string;
	name: string;
	text: string;
	createdAt: Date;
}
const loginOptions = [
	{
		name: 'Device fingerprint',
		rating: 1,
		type: 'none'
	},
	{
		name: 'UNS verifies user email',
		rating: 3,
		type: 'email_verified'
	},
	{
		name: 'Verified by WebAuthn',
		rating: 5,
		type: 'webauthn'
	},
	{
		name: 'Verified with UNS Authenticator',
		rating: 5,
		type: 'pki'
	}
];
export const MainPage: FC = () => {
	const { isLoggedIn, userData, logOut } = useUser();
	const [items, setItems] = useState<Message[]>([]);

	const [newTitle, setNewTitle] = useState<string>('');
	const [newText, setNewText] = useState<string>('');

	const [touchedTitle, setTouchedTitle] = useState(false);
	const [touchedText, setTouchedText] = useState(false);

	const handleClearInputs = useCallback(() => {
		setNewTitle('');
		setNewText('');
		setTouchedText(false);
		setTouchedTitle(false);
	}, []);

	const fetchItems = useCallback(async () => {
		if (isLoggedIn) {
			const response = await fetch('/api/getMessages', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ serviceUserId: userData })
			});

			if (!response.ok) {
				throw new Error('Network response was not ok');
			}

			const data = await response.json();
			const messages: Message[] = data.map(
				(item: { createdAt: string; [key: string]: any }) => ({
					...item,
					createdAt: new Date(item.createdAt)
				})
			);

			const sortedData = messages.sort((a: Message, b: Message) => {
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			});
			setItems(sortedData);
		}
	}, [setItems, isLoggedIn, userData]);

	useEffect(() => {
		fetchItems();
	}, [userData, fetchItems]);

	const handleTitleBlur = () => {
		setTouchedTitle(true);
	};

	const handleTextBlur = () => {
		setTouchedText(true);
	};
	const handleAddEntry = useCallback(async () => {
		if (newTitle && newText) {
			if (isLoggedIn && userData) {
				const response = await fetch('/api/addMessage', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						serviceUserId: userData,
						name: newTitle,
						text: newText
					})
				});

				if (!response.ok) {
					throw new Error('Network response was not ok');
				}
				handleClearInputs();
				fetchItems();
			}
		} else {
			if (!newTitle) setTouchedTitle(true);
			if (!newText) setTouchedText(true);
		}
	}, [newTitle, newText, isLoggedIn, userData, fetchItems, handleClearInputs]);

	const handleLogin = (attestationType: string) => {
		const currentUrl = new URL(window.location.href);
		const url = new URL('/uns-service-gateway/', window.location.origin);
		url.searchParams.append('attestationType', attestationType);
		url.searchParams.append('redirectUri', currentUrl.origin);
		window.location.href = url.href;
	};
	return (
		<>
			<Page header={<AppHeader />}>
				<div className="text-center">
					<h1> Welcome</h1>
					{isLoggedIn ? (
						<button
							className={classes['button-as-text']}
							onClick={() => {
								logOut();
							}}
						>
							Sign Out
						</button>
					) : (
						<button
							className={classes['button-as-text']}
							onClick={() => handleLogin('none')}
						>
							Sign In with UNS
						</button>
					)}
				</div>

				{isLoggedIn && (
					<div>
						<div className="p-4 shadow-sm">
							<h3 className="mb-3 mt-3">New Blog Post</h3>
							<div className="row mb-3">
								<p className="mb-1">Title</p>{' '}
								<div className="col-md-4">
									<input
										type="text"
										className={`form-control ${
											touchedTitle && !newTitle ? 'border-danger' : ''
										}`}
										value={newTitle}
										onChange={(e) => setNewTitle(e.target.value)}
										onBlur={handleTitleBlur}
										placeholder="Enter title"
									/>
								</div>
							</div>
							<p className="mb-1">Text</p>
							<div>
								<textarea
									className={`form-control ${
										touchedText && !newText ? 'border-danger' : ''
									}`}
									value={newText}
									onChange={(e) => setNewText(e.target.value)}
									placeholder="Enter text"
									onBlur={handleTextBlur}
									rows={5}
								/>
							</div>
							<button className="btn btn-primary mt-2" onClick={handleAddEntry}>
								Add new Post
							</button>
						</div>
						<div className={`${classes['container']} mt-4`}>
							{items.map((item) => (
								<DataContainer
									name={item.name}
									text={item.text}
									date={item.createdAt.toLocaleDateString('en-US', {
										hour: '2-digit',
										minute: '2-digit'
									})}
								/>
							))}
						</div>
					</div>
				)}
			</Page>
			{!isLoggedIn && (
				<Page>
					<div>
						<h5 className="text-center mb-3 mt-4">
							UNS Authentication with different types of proof:
						</h5>
						<table className={`table table-bordered text-left `}>
							<thead>
								<tr>
									<th scope="col">Name</th>
									<th scope="col">Security level</th>
									<th scope="col">Action</th>
								</tr>
							</thead>
							<tbody>
								{loginOptions.map((option) => (
									<tr key={option.type}>
										<td>{option.name}</td>
										<td>
											<StarRating rating={option.rating} />
										</td>
										<td>
											<button
												onClick={() => handleLogin(option.type)}
												className={`${classes['btn-try']}`}
											>
												Try
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Page>
			)}
		</>
	);
};
