import { Router } from 'express';
import pool from '../db.js';
import { emitWebhook } from '../webhooks.js';

const router = Router();

router.post('/api/templates', async (req, res) => {
  try {
    const { name, description, subject, category, templateJson, mergeFields, thumbnailUrl, workspaceId } = req.body;

    if (!name || !templateJson) {
      return res.status(400).json({ error: 'name and templateJson are required' });
    }

    const result = await pool.query(
      `INSERT INTO templates (name, description, subject, category, template_json, merge_fields, thumbnail_url, workspace_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [name, description || null, subject || null, category || null, JSON.stringify(templateJson), mergeFields || [], thumbnailUrl || null, workspaceId || null]
    );

    const row = result.rows[0];
    const template = formatRow(row);

    emitWebhook('template.created', {
      templateId: template.id,
      name: template.name,
      workspaceId: template.workspaceId || undefined,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(template);
  } catch (error: any) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template', details: error.message });
  }
});

router.get('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    res.json(formatRow(result.rows[0]));
  } catch (error: any) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to get template', details: error.message });
  }
});

router.get('/api/templates', async (req, res) => {
  try {
    const { workspaceId, category, limit = '20', offset = '0' } = req.query;
    const params: any[] = [];
    const conditions: string[] = [];

    if (workspaceId) {
      params.push(workspaceId);
      conditions.push(`workspace_id = $${params.length}`);
    }
    if (category) {
      params.push(category);
      conditions.push(`category = $${params.length}`);
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countResult = await pool.query(`SELECT COUNT(*) FROM templates ${where}`, params);
    const total = parseInt(countResult.rows[0].count, 10);

    const limitNum = Math.min(Math.max(parseInt(limit as string, 10) || 20, 1), 100);
    const offsetNum = Math.max(parseInt(offset as string, 10) || 0, 0);

    params.push(limitNum, offsetNum);
    const dataResult = await pool.query(
      `SELECT * FROM templates ${where} ORDER BY updated_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({
      templates: dataResult.rows.map(formatRow),
      total,
      limit: limitNum,
      offset: offsetNum,
    });
  } catch (error: any) {
    console.error('List templates error:', error);
    res.status(500).json({ error: 'Failed to list templates', details: error.message });
  }
});

router.put('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, subject, category, templateJson, mergeFields, thumbnailUrl, workspaceId } = req.body;

    const existing = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const fields: string[] = [];
    const values: any[] = [];
    let idx = 1;

    if (name !== undefined) { fields.push(`name = $${idx++}`); values.push(name); }
    if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
    if (subject !== undefined) { fields.push(`subject = $${idx++}`); values.push(subject); }
    if (category !== undefined) { fields.push(`category = $${idx++}`); values.push(category); }
    if (templateJson !== undefined) { fields.push(`template_json = $${idx++}`); values.push(JSON.stringify(templateJson)); }
    if (mergeFields !== undefined) { fields.push(`merge_fields = $${idx++}`); values.push(mergeFields); }
    if (thumbnailUrl !== undefined) { fields.push(`thumbnail_url = $${idx++}`); values.push(thumbnailUrl); }
    if (workspaceId !== undefined) { fields.push(`workspace_id = $${idx++}`); values.push(workspaceId); }

    if (fields.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const result = await pool.query(
      `UPDATE templates SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values
    );

    const template = formatRow(result.rows[0]);

    emitWebhook('template.updated', {
      templateId: template.id,
      name: template.name,
      workspaceId: template.workspaceId || undefined,
      timestamp: new Date().toISOString(),
    });

    res.json(template);
  } catch (error: any) {
    console.error('Update template error:', error);
    res.status(500).json({ error: 'Failed to update template', details: error.message });
  }
});

router.delete('/api/templates/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    await pool.query('DELETE FROM templates WHERE id = $1', [id]);

    emitWebhook('template.deleted', {
      templateId: id,
      name: existing.rows[0].name,
      workspaceId: existing.rows[0].workspace_id || undefined,
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete template error:', error);
    res.status(500).json({ error: 'Failed to delete template', details: error.message });
  }
});

router.post('/api/templates/:id/render', async (req, res) => {
  try {
    const { id } = req.params;
    const { variables = {} } = req.body;

    const result = await pool.query('SELECT * FROM templates WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Template not found' });
    }

    const row = result.rows[0];
    const templateJson = row.template_json;

    let html: string;
    try {
      const { renderTemplateToHtml } = await import('../renderHtml.js');
      html = await renderTemplateToHtml(templateJson, variables);
    } catch (renderErr: any) {
      console.error('Render error:', renderErr);
      return res.status(500).json({ error: 'Failed to render template', details: renderErr.message });
    }

    let subject = row.subject || '';
    if (subject && Object.keys(variables).length > 0) {
      subject = subject.replace(/\{\{(.*?)\}\}/g, (_: string, varName: string) =>
        variables[varName] !== undefined ? variables[varName] : `{{${varName}}}`
      );
    }

    emitWebhook('template.rendered', {
      templateId: id,
      name: row.name,
      workspaceId: row.workspace_id || undefined,
      timestamp: new Date().toISOString(),
    });

    res.json({ html, subject });
  } catch (error: any) {
    console.error('Render template error:', error);
    res.status(500).json({ error: 'Failed to render template', details: error.message });
  }
});

router.get('/api/blocks/schema', (_req, res) => {
  res.json({
    blocks: {
      EmailLayout: {
        description: 'Root layout block (required, exactly one per template)',
        properties: {
          backdropColor: { type: 'string', format: 'hex-color', description: 'Background behind the email' },
          borderColor: { type: 'string', format: 'hex-color', description: 'Border color around the canvas' },
          borderRadius: { type: 'number', description: 'Border radius in pixels' },
          canvasColor: { type: 'string', format: 'hex-color', description: 'Email body background color' },
          textColor: { type: 'string', format: 'hex-color', description: 'Default text color' },
          fontFamily: { type: 'FontFamily', description: 'Global font family' },
          childrenIds: { type: 'string[]', description: 'Ordered list of top-level block IDs' },
        },
      },
      Heading: {
        description: 'Heading text block (h1/h2/h3)',
        properties: {
          'props.text': { type: 'string', description: 'Heading text' },
          'props.level': { type: 'enum', values: ['h1', 'h2', 'h3'], default: 'h2' },
          'style.color': { type: 'string', format: 'hex-color' },
          'style.backgroundColor': { type: 'string', format: 'hex-color' },
          'style.fontFamily': { type: 'FontFamily' },
          'style.fontWeight': { type: 'enum', values: ['bold', 'normal'], default: 'bold' },
          'style.textAlign': { type: 'enum', values: ['left', 'center', 'right'] },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      Text: {
        description: 'Body text block',
        properties: {
          'props.text': { type: 'string', description: 'Text content' },
          'props.markdown': { type: 'boolean', description: 'Enable markdown rendering' },
          'style.color': { type: 'string', format: 'hex-color' },
          'style.backgroundColor': { type: 'string', format: 'hex-color' },
          'style.fontSize': { type: 'number' },
          'style.fontFamily': { type: 'FontFamily' },
          'style.fontWeight': { type: 'enum', values: ['bold', 'normal'] },
          'style.textAlign': { type: 'enum', values: ['left', 'center', 'right'] },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      Button: {
        description: 'Clickable button with link',
        properties: {
          'props.text': { type: 'string', description: 'Button label' },
          'props.url': { type: 'string', description: 'Button link URL' },
          'props.buttonBackgroundColor': { type: 'string', format: 'hex-color', default: '#999999' },
          'props.buttonTextColor': { type: 'string', format: 'hex-color', default: '#FFFFFF' },
          'props.buttonStyle': { type: 'enum', values: ['rectangle', 'rounded', 'pill'], default: 'rounded' },
          'props.size': { type: 'enum', values: ['x-small', 'small', 'medium', 'large'], default: 'medium' },
          'props.fullWidth': { type: 'boolean', default: false },
          'style.fontSize': { type: 'number', default: 16 },
          'style.fontFamily': { type: 'FontFamily' },
          'style.textAlign': { type: 'enum', values: ['left', 'center', 'right'] },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      Image: {
        description: 'Image block',
        properties: {
          'props.url': { type: 'string', description: 'Image source URL' },
          'props.alt': { type: 'string', description: 'Alt text' },
          'props.width': { type: 'number' },
          'props.height': { type: 'number' },
          'props.linkHref': { type: 'string', description: 'Clickable link URL' },
          'props.contentAlignment': { type: 'enum', values: ['top', 'middle', 'bottom'] },
          'style.padding': { type: 'PaddingObject' },
          'style.textAlign': { type: 'enum', values: ['left', 'center', 'right'] },
        },
      },
      Avatar: {
        description: 'Avatar/profile image block',
        properties: {
          'props.imageUrl': { type: 'string' },
          'props.alt': { type: 'string' },
          'props.size': { type: 'number', default: 64 },
          'props.shape': { type: 'enum', values: ['circle', 'square', 'rounded'], default: 'square' },
          'style.textAlign': { type: 'enum', values: ['left', 'center', 'right'] },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      Divider: {
        description: 'Horizontal line divider',
        properties: {
          'props.lineColor': { type: 'string', format: 'hex-color', default: '#333333' },
          'props.lineHeight': { type: 'number', default: 1 },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      Spacer: {
        description: 'Vertical space',
        properties: {
          'props.height': { type: 'number', default: 16 },
        },
      },
      Html: {
        description: 'Raw HTML block (sanitized with DOMPurify)',
        properties: {
          'props.contents': { type: 'string', description: 'Raw HTML content' },
          'style.color': { type: 'string', format: 'hex-color' },
          'style.backgroundColor': { type: 'string', format: 'hex-color' },
          'style.fontFamily': { type: 'FontFamily' },
          'style.fontSize': { type: 'number' },
          'style.textAlign': { type: 'enum', values: ['left', 'center', 'right'] },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      Container: {
        description: 'Groups child blocks together',
        properties: {
          'props.childrenIds': { type: 'string[]' },
          'style.backgroundColor': { type: 'string', format: 'hex-color' },
          'style.borderColor': { type: 'string', format: 'hex-color' },
          'style.borderRadius': { type: 'number' },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      ColumnsContainer: {
        description: 'Multi-column layout (2 or 3 columns)',
        properties: {
          'props.columnsCount': { type: 'enum', values: [2, 3], default: 2 },
          'props.columnsGap': { type: 'number', default: 0 },
          'props.contentAlignment': { type: 'enum', values: ['top', 'middle', 'bottom'], default: 'middle' },
          'props.fixedWidths': { type: 'number[]', description: 'Fixed column widths array' },
          'props.columns': { type: 'Array<{ childrenIds: string[] }>' },
          'style.backgroundColor': { type: 'string', format: 'hex-color' },
          'style.padding': { type: 'PaddingObject' },
        },
      },
      RichText: {
        description: 'Rich text editor block (Lexical-based)',
        properties: {
          'props.content': { type: 'object', description: 'Lexical editor state JSON' },
          'props.html': { type: 'string', description: 'Rendered HTML output' },
          'style.padding': { type: 'PaddingObject' },
          'style.backgroundColor': { type: 'string', format: 'hex-color' },
          'style.borderRadius': { type: 'number' },
        },
      },
    },
    fontFamilies: [
      'MODERN_SANS', 'BOOK_SANS', 'ORGANIC_SANS', 'GEOMETRIC_SANS',
      'HEAVY_SANS', 'ROUNDED_SANS', 'MODERN_SERIF', 'BOOK_SERIF', 'MONOSPACE',
    ],
    mergeSyntax: '{{variable_name}}',
    sharedTypes: {
      PaddingObject: { top: 'number', bottom: 'number', left: 'number', right: 'number' },
      FontFamily: 'One of the fontFamilies values listed above',
    },
  });
});

function formatRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    subject: row.subject,
    category: row.category,
    templateJson: row.template_json,
    mergeFields: row.merge_fields,
    thumbnailUrl: row.thumbnail_url,
    workspaceId: row.workspace_id,
    createdAt: row.created_at?.toISOString(),
    updatedAt: row.updated_at?.toISOString(),
  };
}

export default router;
