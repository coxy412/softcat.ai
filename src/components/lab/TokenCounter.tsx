import { useState } from 'preact/hooks';

function estimateTokens(text: string) {
  if (!text) return { chars: 0, words: 0, lines: 0, claude: 0, gpt4: 0, llama: 0 };

  const chars = text.length;
  const words = text.split(/\s+/).filter(Boolean).length;
  const lines = text.split('\n').length;

  // Rough estimates based on typical tokenizer ratios
  // English text averages ~4 chars per token for most models
  // Code tends to be ~3.5 chars per token
  const isCode = /[{}\[\]();=<>]/.test(text) && (text.match(/[{}\[\]();=<>]/g) || []).length > text.length * 0.02;
  const charsPerToken = isCode ? 3.5 : 4;

  const baseTokens = Math.ceil(chars / charsPerToken);

  return {
    chars,
    words,
    lines,
    claude: Math.ceil(baseTokens * 1.0),    // Claude tokenizer
    gpt4: Math.ceil(baseTokens * 0.95),      // GPT-4 (cl100k_base)
    llama: Math.ceil(baseTokens * 1.1),       // Llama (SentencePiece)
  };
}

export default function TokenCounter() {
  const [text, setText] = useState('');
  const stats = estimateTokens(text);

  return (
    <div class="space-y-6">
      <textarea
        value={text}
        onInput={(e) => setText((e.target as HTMLTextAreaElement).value)}
        placeholder="Paste or type text here..."
        class="w-full h-64 bg-surface border border-surface-light rounded-lg p-4 font-mono text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-green/50 resize-y"
      />

      <div class="grid grid-cols-3 gap-4">
        <div class="bg-surface border border-surface-light rounded-lg p-4 text-center">
          <div class="font-mono text-2xl font-bold text-text-bright">{stats.chars.toLocaleString()}</div>
          <div class="font-mono text-xs text-text-muted mt-1">characters</div>
        </div>
        <div class="bg-surface border border-surface-light rounded-lg p-4 text-center">
          <div class="font-mono text-2xl font-bold text-text-bright">{stats.words.toLocaleString()}</div>
          <div class="font-mono text-xs text-text-muted mt-1">words</div>
        </div>
        <div class="bg-surface border border-surface-light rounded-lg p-4 text-center">
          <div class="font-mono text-2xl font-bold text-text-bright">{stats.lines.toLocaleString()}</div>
          <div class="font-mono text-xs text-text-muted mt-1">lines</div>
        </div>
      </div>

      <div class="space-y-2">
        <div class="font-mono text-xs text-text-muted uppercase tracking-wider">Estimated tokens</div>
        <div class="grid grid-cols-3 gap-4">
          <div class="bg-surface border border-surface-light rounded-lg p-4 card-glow">
            <div class="font-mono text-xs text-neon-green mb-1">Claude</div>
            <div class="font-mono text-xl font-bold text-text-bright">{stats.claude.toLocaleString()}</div>
            <div class="font-mono text-xs text-text-muted mt-1">
              {stats.claude > 0 && `~$${((stats.claude / 1_000_000) * 3).toFixed(4)} input`}
            </div>
          </div>
          <div class="bg-surface border border-surface-light rounded-lg p-4 card-glow">
            <div class="font-mono text-xs text-neon-cyan mb-1">GPT-4o</div>
            <div class="font-mono text-xl font-bold text-text-bright">{stats.gpt4.toLocaleString()}</div>
            <div class="font-mono text-xs text-text-muted mt-1">
              {stats.gpt4 > 0 && `~$${((stats.gpt4 / 1_000_000) * 2.5).toFixed(4)} input`}
            </div>
          </div>
          <div class="bg-surface border border-surface-light rounded-lg p-4 card-glow">
            <div class="font-mono text-xs text-neon-purple mb-1">Llama 3</div>
            <div class="font-mono text-xl font-bold text-text-bright">{stats.llama.toLocaleString()}</div>
            <div class="font-mono text-xs text-text-muted mt-1">free (self-hosted)</div>
          </div>
        </div>
      </div>

      <p class="font-mono text-xs text-text-muted">
        Token counts are estimates based on character ratios. Actual counts vary by model tokenizer.
        Pricing based on standard API rates (Sonnet 3.5 / GPT-4o).
      </p>
    </div>
  );
}
