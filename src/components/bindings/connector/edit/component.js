import React, { useState } from 'react';
import { Button, Input, Select } from '@inseefr/wilco';
import EditViewResults from './results';
import { JDBC } from 'utils/constants';

const DEFAULT_INIT = {
	name: undefined,
	dbtype: undefined,
	url: undefined,
	query: undefined,
	user: undefined,
	password: undefined,
};

const DB_OPTIONS = [{ value: 'postgre', label: 'PostgreSQL' }];

const EditBindings = ({
	bindings,
	setBindings,
	closePanel,
	init = DEFAULT_INIT,
	deletable,
	spark,
}) => {
	const [name, setName] = useState(init.name);
	const [nameError, setNameError] = useState(false);
	const [dbtype, setDBType] = useState(init.dbtype);
	const [url, setUrl] = useState(init.url);
	const [query, setQuery] = useState(init.query);
	const [user, setUser] = useState(init.user);
	const [password, setPassword] = useState(init.password);
	const [displayResults, setDisplayResults] = useState(false);

	const handleName = (e) => {
		const newName = e.target.value;
		setName(newName);
		if (nameError && !bindings[newName]) setNameError(false);
		if (newName !== init.name && bindings[newName]) setNameError(true);
		setDisplayResults(false);
	};

	const handleDBType = (d) => {
		setDBType(d);
		setDisplayResults(false);
	};

	const handleUrl = (d) => {
		setUrl(d.target.value);
		setDisplayResults(false);
	};

	const handleQuery = (d) => {
		setQuery(d.target.value);
		setDisplayResults(false);
	};

	const handleUser = (d) => {
		setUser(d.target.value);
		setDisplayResults(false);
	};

	const handlePassword = (d) => {
		setPassword(d.target.value);
		setDisplayResults(false);
	};

	const onView = () => {
		setDisplayResults(true);
	};

	const onSave = () => {
		setBindings((b) => {
			const { [init.name]: omit, ...others } = b;
			return {
				...others,
				[name]: { type: JDBC, user, password, url, dbtype, query },
			};
		});
		closePanel();
	};

	const onDelete = () => {
		setBindings((b) => {
			const { [init.name]: omit, ...others } = b;
			return others;
		});
		closePanel();
	};

	return (
		<>
			<div className="row">
				<div className="col-md-6">
					<Input
						label="Binding name"
						value={name}
						onChange={(e) => handleName(e)}
						col={12}
						helpMsg={nameError ? `Binding " ${name} " already defined` : ''}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<Select
						label="Database type"
						value={DB_OPTIONS.find(({ value }) => value === dbtype)}
						onChange={(e) => handleDBType(e)}
						options={DB_OPTIONS}
						col={12}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<Input
						label="Connection URL"
						value={url}
						onChange={(e) => handleUrl(e)}
						col={12}
						placeholder="postgresql://instance:5432/base"
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-12">
					<Input
						label="SQL Query"
						value={query}
						onChange={(e) => handleQuery(e)}
						col={12}
						placeholder="SELECT * FROM t LIMIT 100"
						helpMsg={
							spark
								? 'View results will be automatically limited to 1 000 rows'
								: ''
						}
					/>
				</div>
			</div>
			<div className="row">
				<div className="col-md-6">
					<Input
						label="User"
						value={user}
						onChange={(e) => handleUser(e)}
						col={12}
					/>
				</div>
				<div className="col-md-6">
					<Input
						label="Password"
						value={password}
						onChange={(e) => handlePassword(e)}
						col={12}
					/>
				</div>
			</div>
			<div className="row">
				<Button
					label="View"
					action={onView}
					disabled={
						name && url && query && user && password && !nameError
							? false
							: true
					}
					col={3}
				/>
			</div>
			{displayResults && (
				<EditViewResults
					dbtype={dbtype}
					url={url}
					query={query}
					user={user}
					password={password}
					onSave={onSave}
					closePanel={closePanel}
					deletable={deletable}
					onDelete={onDelete}
					spark={spark}
				/>
			)}
			{!displayResults && (
				<div className="row">
					<Button label="Cancel" action={closePanel} col={3} />
					{deletable && (
						<Button
							label="Delete"
							action={onDelete}
							col={3}
							classes={['wilco-btn-red']}
						/>
					)}
				</div>
			)}
		</>
	);
};

export default EditBindings;
