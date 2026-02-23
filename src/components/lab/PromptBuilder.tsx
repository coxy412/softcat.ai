import { useState } from 'preact/hooks';

const templates = [
  {
    name: 'Code Generation',
    system: 'You are an expert {{language}} developer. Write clean, well-commented code.',
    user: 'Write a {{language}} function that {{task}}.\n\nRequirements:\n- {{requirement_1}}\n- {{requirement_2}}',
    vars: { language: 'Python', task: '', requirement_1: '', requirement_2: '' },
  },
  {
    name: 'Code Review',
    system: 'You are a senior developer conducting a code review. Be constructive and specific.',
    user: 'Review the following {{language}} code. Focus on:\n- Bugs or edge cases\n- Performance issues\n- Readability\n\n```{{language}}\n{{code}}\n```',
    vars: { language: 'Python', code: '' },
  },
  {
    name: 'Explain Concept',
    system: 'You are a technical educator. Explain concepts clearly with practical examples. Target audience: {{audience}}.',
    user: 'Explain {{concept}} in {{depth}}.\n\nInclude a practical example.',
    vars: { concept: '', depth: 'moderate detail', audience: 'intermediate developers' },
  },
  {
    name: 'Text Analysis',
    system: 'You are an analytical assistant. Be thorough and structured in your analysis.',
    user: 'Analyse the following text:\n\n"{{text}}"\n\nFocus on: {{focus}}',
    vars: { text: '', focus: 'tone, key arguments, and potential biases' },
  },
  {
    name: 'Data Transformation',
    system: 'You are a data engineer. Write efficient, correct transformations.',
    user: 'Transform the following {{input_format}} data to {{output_format}}:\n\n```\n{{data}}\n```\n\nAdditional rules: {{rules}}',
    vars: { input_format: 'JSON', output_format: 'CSV', data: '', rules: 'none' },
  },
  {
    name: 'Custom',
    system: '',
    user: '',
    vars: {},
  },
];

function fillTemplate(template: string, vars: Record<string, string>) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] || `{{${key}}}`);
}

function estimateTokens(text: string) {
  return Math.ceil(text.length / 4);
}

export default function PromptBuilder() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [vars, setVars] = useState<Record<string, string>>({ ...templates[0].vars });
  const [systemPrompt, setSystemPrompt] = useState(templates[0].system);
  const [userPrompt, setUserPrompt] = useState(templates[0].user);
  const [copied, setCopied] = useState('');

  const selectTemplate = (idx: number) => {
    setSelectedIdx(idx);
    const t = templates[idx];
    setSystemPrompt(t.system);
    setUserPrompt(t.user);
    setVars({ ...t.vars });
  };

  const updateVar = (key: string, value: string) => {
    setVars((prev) => ({ ...prev, [key]: value }));
  };

  const filledSystem = fillTemplate(systemPrompt, vars);
  const filledUser = fillTemplate(userPrompt, vars);
  const totalTokens = estimateTokens(filledSystem + filledUser);

  const copyAs = (format: string) => {
    let text = '';
    if (format === 'text') {
      text = `[System]\n${filledSystem}\n\n[User]\n${filledUser}`;
    } else if (format === 'json') {
      text = JSON.stringify({
        messages: [
          { role: 'system', content: filledSystem },
          { role: 'user', content: filledUser },
        ],
      }, null, 2);
    } else if (format === 'curl') {
      text = `curl -X POST https://api.anthropic.com/v1/messages \\
  -H "Content-Type: application/json" \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -d '${JSON.stringify({
    model: "claude-sonnet-4-20250514",
    max_tokens: 1024,
    system: filledSystem,
    messages: [{ role: "user", content: filledUser }],
  })}'`;
    }
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => setCopied(''), 2000);
  };

  const varKeys = Object.keys(vars);

  return (
    <div class="space-y-6">
      {/* Template selector */}
      <div class="flex flex-wrap gap-2">
        {templates.map((t, i) => (
          <button
            onClick={() => selectTemplate(i)}
            class={`px-3 py-1.5 rounded font-mono text-xs transition-all ${
              i === selectedIdx
                ? 'bg-neon-green/10 border border-neon-green/50 text-neon-green'
                : 'bg-surface border border-surface-light text-text-muted hover:text-text-primary'
            }`}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Variables */}
      {varKeys.length > 0 && (
        <div class="bg-surface border border-surface-light rounded-lg p-4 space-y-3">
          <div class="font-mono text-xs text-text-muted uppercase tracking-wider">Variables</div>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {varKeys.map((key) => (
              <div>
                <label class="font-mono text-xs text-neon-purple block mb-1">{`{{${key}}}`}</label>
                <input
                  type="text"
                  value={vars[key]}
                  onInput={(e) => updateVar(key, (e.target as HTMLInputElement).value)}
                  placeholder={key.replace(/_/g, ' ')}
                  class="w-full bg-void border border-surface-light rounded px-3 py-1.5 font-mono text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-green/50"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System prompt */}
      <div>
        <label class="font-mono text-xs text-neon-green block mb-2">System prompt</label>
        <textarea
          value={systemPrompt}
          onInput={(e) => setSystemPrompt((e.target as HTMLTextAreaElement).value)}
          class="w-full h-24 bg-surface border border-surface-light rounded-lg p-3 font-mono text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-green/50 resize-y"
          placeholder="System instructions..."
        />
      </div>

      {/* User prompt */}
      <div>
        <label class="font-mono text-xs text-neon-cyan block mb-2">User prompt</label>
        <textarea
          value={userPrompt}
          onInput={(e) => setUserPrompt((e.target as HTMLTextAreaElement).value)}
          class="w-full h-40 bg-surface border border-surface-light rounded-lg p-3 font-mono text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-green/50 resize-y"
          placeholder="Your prompt..."
        />
      </div>

      {/* Preview */}
      <div class="bg-surface border border-surface-light rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="font-mono text-xs text-text-muted uppercase tracking-wider">Preview (filled)</div>
          <div class="font-mono text-xs text-text-muted">~{totalTokens} tokens</div>
        </div>
        {filledSystem && (
          <div class="mb-3">
            <div class="font-mono text-xs text-neon-green mb-1">system</div>
            <pre class="text-sm text-text-primary whitespace-pre-wrap font-mono bg-void rounded p-3 border border-surface-light">{filledSystem}</pre>
          </div>
        )}
        <div>
          <div class="font-mono text-xs text-neon-cyan mb-1">user</div>
          <pre class="text-sm text-text-primary whitespace-pre-wrap font-mono bg-void rounded p-3 border border-surface-light">{filledUser}</pre>
        </div>
      </div>

      {/* Export buttons */}
      <div class="flex flex-wrap gap-2">
        {['text', 'json', 'curl'].map((fmt) => (
          <button
            onClick={() => copyAs(fmt)}
            class={`px-4 py-2 rounded font-mono text-xs transition-all ${
              copied === fmt
                ? 'bg-neon-green/20 border border-neon-green text-neon-green'
                : 'bg-surface border border-surface-light text-text-muted hover:text-text-primary hover:border-neon-cyan/30'
            }`}
          >
            {copied === fmt ? 'copied!' : `copy as ${fmt}`}
          </button>
        ))}
      </div>
    </div>
  );
}
