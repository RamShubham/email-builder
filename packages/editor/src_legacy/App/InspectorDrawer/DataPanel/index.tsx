import isEmpty from 'lodash/isEmpty';
import { useEffect, useState } from 'react';

import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';

import { TEditorConfiguration } from '../../../documents/editor/core';
import {
	setVariables,
	updateVariables,
	useDocument,
	useVariables,
} from '../../../documents/editor/EditorContext';
import findVariable from '../../../utils/findVariable';
import BaseSidebarPanel from '../ConfigurationPanel/input-panels/helpers/BaseSidebarPanel';

type RowObj = {
	variable: string;
	defaultValue: string;
	blockId?: string;
};

function DataPanel() {
	const [rows, setRows] = useState<RowObj[]>([]);

	const globalVariables: Record<string, any> = useVariables();
	const document: TEditorConfiguration = useDocument();

	const handleDefaultValueChange = (
		index: number,
		value: string,
		variable: string
	) => {
		setRows((prev) => {
			prev[index].defaultValue = value;
			return [...prev];
		});

		setVariables({ [variable]: value });
	};

	useEffect(() => {
		const updatedVariables = findVariable({
			globalVariables,
			document,
		});

		updateVariables(updatedVariables);

		const rowsData: RowObj[] = Object.entries(updatedVariables).map(
			(ele) => {
				const [varKey, value] = ele;
				return { variable: varKey, defaultValue: String(value) };
			}
		);

		setRows(() => rowsData);
	}, []);

	return (
		<BaseSidebarPanel title="Data">
			{isEmpty(rows) ? (
				<Typography variant="body1" color="text.secondary">
					No data found
				</Typography>
			) : (
				<TableContainer>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Variable</TableCell>
								<TableCell>Default Value</TableCell>
							</TableRow>
						</TableHead>

						<TableBody>
							{rows.map((row, index) => (
								<TableRow key={index}>
									<TableCell>{row?.variable}</TableCell>

									<TableCell>
										<TextField
											value={row?.defaultValue}
											placeholder="Default Value"
											onChange={(e) =>
												handleDefaultValueChange(
													index,
													e.target.value,
													row.variable
												)
											}
											variant="outlined"
											size="small"
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
		</BaseSidebarPanel>
	);
}

export default DataPanel;
