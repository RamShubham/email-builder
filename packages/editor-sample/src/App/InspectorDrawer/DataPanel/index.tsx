import isEmpty from 'lodash/isEmpty';
  import React, { useEffect, useState } from 'react';

  import { TEditorConfiguration } from '../../../documents/editor/core';
  import {
    setVariables,
    updateVariables,
    useDocument,
    useVariables,
  } from '../../../documents/editor/EditorContext';
  import findVariable from '../../../utils/findVariable';
  import { Input } from '@/components/ui/input';
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

    const handleDefaultValueChange = (index: number, value: string, variable: string) => {
      setRows((prev) => {
        prev[index].defaultValue = value;
        return [...prev];
      });
      setVariables({ [variable]: value });
    };

    useEffect(() => {
      const updatedVariables = findVariable({ globalVariables, document });
      updateVariables(updatedVariables);
      const rowsData: RowObj[] = Object.entries(updatedVariables).map(([varKey, value]) => ({
        variable: varKey,
        defaultValue: String(value),
      }));
      setRows(() => rowsData);
    }, []);

    return (
      <BaseSidebarPanel title="Data">
        {isEmpty(rows) ? (
          <p className="text-sm text-gray-500">No data found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-1 text-xs font-medium text-gray-500">Variable</th>
                  <th className="text-left py-2 px-1 text-xs font-medium text-gray-500">Default Value</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-2 px-1 text-xs text-gray-700 font-mono">{row?.variable}</td>
                    <td className="py-2 px-1">
                      <Input
                        value={row?.defaultValue}
                        placeholder="Default Value"
                        onChange={(e) => handleDefaultValueChange(index, e.target.value, row.variable)}
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
  