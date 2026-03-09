import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';
import { Braces } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';

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
		const updatedVariables = findVariable({ globalVariables, document });
		if (!isEqual(globalVariables, updatedVariables)) {
			updateVariables(updatedVariables);
			const rowsData: RowObj[] = Object.entries(updatedVariables).map(
				([varKey, value]) => ({
					variable: varKey,
					defaultValue: String(value),
				})
			);
			setRows(() => rowsData);
		}
	}, [document, globalVariables]);

	return (
		<BaseSidebarPanel title="Data">
			{isEmpty(rows) ? (
				<div className="flex flex-col items-center gap-3 py-4 px-2 text-center">
					<div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
						<Braces className="h-5 w-5 text-violet-400" />
					</div>
					<div className="flex flex-col gap-1">
						<p className="text-sm font-medium text-gray-600">
							No variables yet
						</p>
						<p className="text-xs text-gray-400 leading-relaxed">
							Use the{' '}
							<span className="inline-flex items-center gap-0.5 px-1 py-0.5 bg-violet-50 text-violet-600 rounded text-[10px] font-medium">
								<Braces className="h-2.5 w-2.5" /> Variable
							</span>{' '}
							button on any text field to insert a variable, or
							type{' '}
							<code className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">
								{'{{variableName}}'}
							</code>{' '}
							directly in your content.
						</p>
					</div>
				</div>
			) : (
				<div className="overflow-x-auto">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="text-left py-2 px-1 text-xs font-medium text-gray-500">
									Variable
								</th>
								<th className="text-left py-2 px-1 text-xs font-medium text-gray-500">
									Default Value
								</th>
							</tr>
						</thead>
						<tbody>
							{rows.map((row, index) => (
								<tr
									key={index}
									className="border-b border-gray-100"
								>
									<td className="py-2 px-1 text-xs text-gray-700 font-mono">
										{row?.variable}
									</td>
									<td className="py-2 px-1">
										<Input
											value={row?.defaultValue}
											placeholder="Default Value"
											onChange={(e) =>
												handleDefaultValueChange(
													index,
													e.target.value,
													row.variable
												)
											}
											className="h-7 text-xs"
										/>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</BaseSidebarPanel>
	);
}

export default DataPanel;
