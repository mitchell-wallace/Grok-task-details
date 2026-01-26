import { Hono } from 'hono';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const DOCS_DIR = path.join(process.cwd(), 'docs');
const DOC_NAME_PATTERN = /^[A-Za-z0-9_-]+$/;
const PLACEHOLDER = /\{\{var\}\}/g;

const app = new Hono();

const textHeaders = {
  'Content-Type': 'text/plain; charset=utf-8',
};

function timestampedResponse(content) {
  const timestamp = new Date().toISOString();
  return `UTC Timestamp: ${timestamp}\n\n${content}`;
}

function normalizeLineEndings(content) {
  return content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
}

async function loadDoc(docName) {
  const candidates = [`${docName}.md`, `${docName}.txt`];

  for (const filename of candidates) {
    const filePath = path.join(DOCS_DIR, filename);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      return data;
    } catch (error) {
      if (error?.code !== 'ENOENT') {
        throw error;
      }
    }
  }

  return null;
}

app.get('/', (c) => c.text(timestampedResponse('ok'), 200, textHeaders));

app.get('/:doc_name/:variable', async (c) => {
  const docName = c.req.param('doc_name');
  const rawVariable = c.req.param('variable');

  if (!DOC_NAME_PATTERN.test(docName)) {
    return c.text(timestampedResponse('Not Found'), 404, textHeaders);
  }

  const docContent = await loadDoc(docName);

  if (!docContent) {
    return c.text(timestampedResponse('Not Found'), 404, textHeaders);
  }

  const variable = decodeURIComponent(rawVariable);
  const normalized = normalizeLineEndings(docContent);
  const output = normalized.replace(PLACEHOLDER, variable);

  return c.text(timestampedResponse(output), 200, textHeaders);
});

export default app;
