import React from 'react';

interface VariablePillProps {
  name: string;
}

export default function VariablePill({ name }: VariablePillProps) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '2px',
        padding: '1px 6px',
        margin: '0 1px',
        backgroundColor: '#ede9fe',
        color: '#6d28d9',
        borderRadius: '4px',
        fontSize: '0.85em',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
        fontWeight: 500,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        verticalAlign: 'baseline',
      }}
    >
      {name}
    </span>
  );
}

export function renderTextWithVariables(text: string): React.ReactNode {
  const parts = text.split(/(\{\{.*?\}\})/g);
  if (parts.length === 1) return text;

  return parts.map((part, i) => {
    const match = part.match(/^\{\{(.*?)\}\}$/);
    if (match) {
      return <VariablePill key={i} name={match[1]} />;
    }
    return part;
  });
}

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

const VARIABLE_TOKEN_REGEX = /\{\{([a-zA-Z0-9_]+)\}\}/g;

export function replaceVariablesWithPillHtml(text: string): string {
  return text.replace(VARIABLE_TOKEN_REGEX, (_, variableName: string) => {
    const safeName = escapeHtml(variableName);
    return `<span style="display:inline-flex;align-items:center;gap:2px;padding:1px 6px;margin:0 1px;background-color:#ede9fe;color:#6d28d9;border-radius:4px;font-size:0.85em;font-family:ui-monospace,SFMono-Regular,&quot;SF Mono&quot;,Menlo,monospace;font-weight:500;line-height:1.4;white-space:nowrap;vertical-align:baseline;">${safeName}</span>`;
  });
}
