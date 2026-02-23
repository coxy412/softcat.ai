import { useState } from 'preact/hooks';

// Simple markdown to HTML converter (no dependencies)
function md(text: string): string {
  let html = text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold and italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // Blockquotes
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    // Horizontal rules
    .replace(/^---$/gm, '<hr/>')
    // Paragraphs (double newlines)
    .replace(/\n\n/g, '</p><p>')
    // Line breaks
    .replace(/\n/g, '<br/>');

  // Wrap loose list items
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  // Clean up nested ul tags
  html = html.replace(/<\/ul><ul>/g, '');

  return `<p>${html}</p>`;
}

const sampleMd = `# Hello from SOFT CAT

This is a **markdown preview** tool. Write on the left, see it rendered on the right.

## Features

- Live preview as you type
- SOFT CAT house styling applied
- No dependencies, runs in your browser

## Code example

\`\`\`python
def hello():
    print("Smart Outputs From Trained Conversational AI Technology")
\`\`\`

> This is a blockquote. Useful for highlighting key points.

Check out [softcat.ai](https://softcat.ai) for more tools.`;

export default function MarkdownPreview() {
  const [text, setText] = useState(sampleMd);
  const [copied, setCopied] = useState(false);

  const copyHtml = () => {
    navigator.clipboard.writeText(md(text));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div class="space-y-4">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4" style="min-height: 500px">
        {/* Editor */}
        <div class="flex flex-col">
          <div class="font-mono text-xs text-text-muted mb-2 flex items-center justify-between">
            <span>Markdown</span>
            <span>{text.length} chars</span>
          </div>
          <textarea
            value={text}
            onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
            class="flex-1 bg-surface border border-surface-light rounded-lg p-4 font-mono text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-green/50 resize-none"
            placeholder="Write markdown here..."
          />
        </div>

        {/* Preview */}
        <div class="flex flex-col">
          <div class="font-mono text-xs text-text-muted mb-2">Preview</div>
          <div
            class="flex-1 bg-surface border border-surface-light rounded-lg p-4 prose overflow-auto"
            dangerouslySetInnerHTML={{ __html: md(text) }}
          />
        </div>
      </div>

      <div class="flex gap-2">
        <button
          onClick={copyHtml}
          class={`px-4 py-2 rounded font-mono text-xs transition-all ${
            copied
              ? 'bg-neon-green/20 border border-neon-green text-neon-green'
              : 'bg-surface border border-surface-light text-text-muted hover:text-text-primary'
          }`}
        >
          {copied ? 'copied!' : 'copy HTML'}
        </button>
        <button
          onClick={() => {
            navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
          class="px-4 py-2 rounded font-mono text-xs bg-surface border border-surface-light text-text-muted hover:text-text-primary transition-all"
        >
          copy markdown
        </button>
      </div>
    </div>
  );
}
