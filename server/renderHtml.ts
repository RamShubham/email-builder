import Module from 'module';

const originalResolveFilename = (Module as any)._resolveFilename;
(Module as any)._resolveFilename = function (request: string, ...args: any[]) {
  if (request.endsWith('.scss') || request.endsWith('.css') || request.endsWith('.module.scss') || request.endsWith('.module.css')) {
    return request;
  }
  return originalResolveFilename.call(this, request, ...args);
};

const originalLoad = (Module as any)._load;
(Module as any)._load = function (request: string, ...args: any[]) {
  if (request.endsWith('.scss') || request.endsWith('.css') || request.endsWith('.module.scss') || request.endsWith('.module.css')) {
    return new Proxy({}, { get: (_t, prop) => (typeof prop === 'string' ? prop : '') });
  }
  return originalLoad.call(this, request, ...args);
};

let _renderFn: any = null;

export async function renderTemplateToHtml(
  templateJson: any,
  variables?: Record<string, string>
): Promise<string> {
  const doc = variables && Object.keys(variables).length > 0
    ? applyVariables(templateJson, variables)
    : templateJson;

  if (!_renderFn) {
    const mod = await import('../packages/email-builder/src/renderers/renderToStaticMarkup.tsx' as any);
    _renderFn = mod.default;
  }

  return _renderFn(doc, { rootBlockId: 'root' });
}

function applyVariables(templateJson: any, variables: Record<string, string>): any {
  const jsonStr = JSON.stringify(templateJson);
  const replaced = jsonStr.replace(/\{\{(.*?)\}\}/g, (_, varName) =>
    variables[varName] !== undefined ? variables[varName] : `{{${varName}}}`
  );
  return JSON.parse(replaced);
}
