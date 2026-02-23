import { useState } from 'preact/hooks';

interface ModelData {
  name: string;
  provider: string;
  family: string;
  released: string;
  contextK: number;
  inputPrice: number;
  outputPrice: number;
  openSource: boolean;
  reasoning: boolean;
  multimodal: boolean;
  coding: number;
  reasoning_score: number;
  speed: number;
  description: string;
}

const allModels: ModelData[] = [
  { name: 'Claude Opus 4', provider: 'Anthropic', family: 'Claude 4', released: '2025-05', contextK: 200, inputPrice: 15, outputPrice: 75, openSource: false, reasoning: true, multimodal: true, coding: 95, reasoning_score: 97, speed: 40, description: 'Most capable Claude model. Excels at complex reasoning, agentic tasks, and extended coding.' },
  { name: 'Claude Sonnet 4', provider: 'Anthropic', family: 'Claude 4', released: '2025-05', contextK: 200, inputPrice: 3, outputPrice: 15, openSource: false, reasoning: true, multimodal: true, coding: 90, reasoning_score: 92, speed: 70, description: 'Best balance of intelligence and speed. Strong at coding, analysis, and general tasks.' },
  { name: 'Claude Haiku 3.5', provider: 'Anthropic', family: 'Claude 3.5', released: '2024-10', contextK: 200, inputPrice: 0.8, outputPrice: 4, openSource: false, reasoning: false, multimodal: true, coding: 75, reasoning_score: 72, speed: 95, description: 'Fastest Claude model. Great for high-volume, latency-sensitive applications.' },
  { name: 'GPT-4o', provider: 'OpenAI', family: 'GPT-4', released: '2024-05', contextK: 128, inputPrice: 2.5, outputPrice: 10, openSource: false, reasoning: false, multimodal: true, coding: 85, reasoning_score: 85, speed: 75, description: 'Flagship multimodal model from OpenAI. Good all-rounder for text, vision, and audio.' },
  { name: 'GPT-4o Mini', provider: 'OpenAI', family: 'GPT-4', released: '2024-07', contextK: 128, inputPrice: 0.15, outputPrice: 0.6, openSource: false, reasoning: false, multimodal: true, coding: 70, reasoning_score: 68, speed: 90, description: 'Cost-effective GPT-4 class model. Surprisingly capable for its price point.' },
  { name: 'o1', provider: 'OpenAI', family: 'o-series', released: '2024-12', contextK: 200, inputPrice: 15, outputPrice: 60, openSource: false, reasoning: true, multimodal: false, coding: 88, reasoning_score: 95, speed: 20, description: 'Reasoning-focused model. Uses chain-of-thought internally for maths, science, and logic.' },
  { name: 'o3-mini', provider: 'OpenAI', family: 'o-series', released: '2025-01', contextK: 200, inputPrice: 1.1, outputPrice: 4.4, openSource: false, reasoning: true, multimodal: false, coding: 82, reasoning_score: 88, speed: 55, description: 'Smaller reasoning model. Good value for tasks that need structured thinking.' },
  { name: 'Gemini 2.0 Flash', provider: 'Google', family: 'Gemini 2', released: '2025-02', contextK: 1000, inputPrice: 0.1, outputPrice: 0.4, openSource: false, reasoning: false, multimodal: true, coding: 78, reasoning_score: 75, speed: 92, description: 'Massive 1M context window at rock-bottom pricing. Fast multimodal processing.' },
  { name: 'Gemini 2.0 Pro', provider: 'Google', family: 'Gemini 2', released: '2025-02', contextK: 1000, inputPrice: 1.25, outputPrice: 10, openSource: false, reasoning: false, multimodal: true, coding: 85, reasoning_score: 82, speed: 60, description: 'Google\'s strongest model. Excellent at coding, world knowledge, and long-context tasks.' },
  { name: 'Llama 3.1 405B', provider: 'Meta', family: 'Llama 3', released: '2024-07', contextK: 128, inputPrice: 0, outputPrice: 0, openSource: true, reasoning: false, multimodal: false, coding: 80, reasoning_score: 78, speed: 30, description: 'Largest open-source model. Competitive with proprietary models. Self-hostable.' },
  { name: 'Llama 3.1 70B', provider: 'Meta', family: 'Llama 3', released: '2024-07', contextK: 128, inputPrice: 0, outputPrice: 0, openSource: true, reasoning: false, multimodal: false, coding: 72, reasoning_score: 70, speed: 65, description: 'Strong open-source option that runs on consumer hardware with quantization.' },
  { name: 'DeepSeek R1', provider: 'DeepSeek', family: 'DeepSeek', released: '2025-01', contextK: 128, inputPrice: 0.55, outputPrice: 2.19, openSource: true, reasoning: true, multimodal: false, coding: 85, reasoning_score: 90, speed: 35, description: 'Open-source reasoning model. Competes with o1 at a fraction of the cost.' },
  { name: 'Mistral Large 2', provider: 'Mistral', family: 'Mistral', released: '2024-07', contextK: 128, inputPrice: 2, outputPrice: 6, openSource: false, reasoning: false, multimodal: false, coding: 80, reasoning_score: 78, speed: 60, description: 'Strong European model. Excellent multilingual capabilities and code generation.' },
  { name: 'Qwen 2.5 72B', provider: 'Alibaba', family: 'Qwen', released: '2024-09', contextK: 128, inputPrice: 0, outputPrice: 0, openSource: true, reasoning: false, multimodal: false, coding: 78, reasoning_score: 75, speed: 60, description: 'Top-tier Chinese open-source model. Strong at coding and multilingual tasks.' },
  { name: 'Kimi k1.5', provider: 'Moonshot AI', family: 'Kimi', released: '2025-01', contextK: 128, inputPrice: 0.4, outputPrice: 1.6, openSource: false, reasoning: true, multimodal: false, coding: 76, reasoning_score: 82, speed: 50, description: 'Long-context reasoning model from China. Competitive pricing and strong performance.' },
];

type ViewMode = 'cards' | 'timeline' | 'pricing';
type SortKey = 'name' | 'released' | 'inputPrice' | 'coding' | 'reasoning_score' | 'speed';

function CapabilityBar({ value, color }: { value: number; color: string }) {
  return (
    <div class="w-full bg-void rounded-full h-2">
      <div class={`h-2 rounded-full ${color}`} style={`width: ${value}%`} />
    </div>
  );
}

function ModelCard({ model }: { model: ModelData }) {
  const priceStr = model.inputPrice === 0 ? 'Free (self-host)' : `$${model.inputPrice} / $${model.outputPrice}`;
  return (
    <div class="bg-surface border border-surface-light rounded-lg p-4 card-glow space-y-3">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="font-mono text-sm font-bold text-text-bright">{model.name}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="font-mono text-xs text-text-muted">{model.provider}</span>
            {model.openSource && <span class="font-mono text-xs text-neon-green bg-neon-green/10 px-1.5 py-0.5 rounded">OSS</span>}
            {model.reasoning && <span class="font-mono text-xs text-neon-purple bg-neon-purple/10 px-1.5 py-0.5 rounded">reasoning</span>}
            {model.multimodal && <span class="font-mono text-xs text-neon-cyan bg-neon-cyan/10 px-1.5 py-0.5 rounded">multimodal</span>}
          </div>
        </div>
        <div class="text-right">
          <div class="font-mono text-xs text-neon-amber">{model.contextK}K ctx</div>
          <div class="font-mono text-xs text-text-muted">{model.released}</div>
        </div>
      </div>

      <p class="text-xs text-text-muted leading-relaxed">{model.description}</p>

      <div class="space-y-2">
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs text-text-muted w-16">coding</span>
          <CapabilityBar value={model.coding} color="bg-neon-green" />
          <span class="font-mono text-xs text-text-muted w-8">{model.coding}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs text-text-muted w-16">reason</span>
          <CapabilityBar value={model.reasoning_score} color="bg-neon-purple" />
          <span class="font-mono text-xs text-text-muted w-8">{model.reasoning_score}</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="font-mono text-xs text-text-muted w-16">speed</span>
          <CapabilityBar value={model.speed} color="bg-neon-cyan" />
          <span class="font-mono text-xs text-text-muted w-8">{model.speed}</span>
        </div>
      </div>

      <div class="font-mono text-xs text-text-muted pt-1 border-t border-surface-light">
        {priceStr} <span class="text-text-muted/50">per 1M tokens (in/out)</span>
      </div>
    </div>
  );
}

export default function ModelExplorer() {
  const [view, setView] = useState<ViewMode>('cards');
  const [search, setSearch] = useState('');
  const [providerFilter, setProviderFilter] = useState('all');
  const [capFilter, setCapFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [calcTokens, setCalcTokens] = useState(100000);

  const providers = [...new Set(allModels.map((m) => m.provider))].sort();

  const toggleCap = (cap: string) => {
    setCapFilter((prev) => (prev.includes(cap) ? prev.filter((c) => c !== cap) : [...prev, cap]));
  };

  const filtered = allModels
    .filter((m) => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) && !m.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (providerFilter !== 'all' && m.provider !== providerFilter) return false;
      if (capFilter.includes('open') && !m.openSource) return false;
      if (capFilter.includes('reasoning') && !m.reasoning) return false;
      if (capFilter.includes('multimodal') && !m.multimodal) return false;
      return true;
    })
    .sort((a, b) => {
      const dir = sortAsc ? 1 : -1;
      if (sortBy === 'name' || sortBy === 'released') return a[sortBy].localeCompare(b[sortBy]) * dir;
      return (a[sortBy] - b[sortBy]) * dir;
    });

  // Timeline grouping by quarter
  const timelineGroups: Record<string, ModelData[]> = {};
  for (const m of filtered) {
    const [year, month] = m.released.split('-');
    const q = `${year} Q${Math.ceil(parseInt(month) / 3)}`;
    if (!timelineGroups[q]) timelineGroups[q] = [];
    timelineGroups[q].push(m);
  }

  return (
    <div class="space-y-4">
      {/* Filters */}
      <div class="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          onInput={(e) => setSearch((e.target as HTMLInputElement).value)}
          placeholder="Search models..."
          class="bg-surface border border-surface-light rounded px-3 py-1.5 font-mono text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-neon-green/50 w-48"
        />
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter((e.target as HTMLSelectElement).value)}
          class="bg-surface border border-surface-light rounded px-3 py-1.5 font-mono text-sm text-text-primary focus:outline-none"
        >
          <option value="all">All providers</option>
          {providers.map((p) => (
            <option value={p}>{p}</option>
          ))}
        </select>

        {['open', 'reasoning', 'multimodal'].map((cap) => (
          <button
            onClick={() => toggleCap(cap)}
            class={`px-3 py-1.5 rounded font-mono text-xs transition-all border ${
              capFilter.includes(cap)
                ? 'bg-neon-green/20 border-neon-green text-neon-green'
                : 'bg-surface border-surface-light text-text-muted hover:text-text-primary'
            }`}
          >
            {cap === 'open' ? 'open source' : cap}
          </button>
        ))}

        <div class="flex items-center gap-2 ml-auto">
          <label class="font-mono text-xs text-text-muted">sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy((e.target as HTMLSelectElement).value as SortKey)}
            class="bg-surface border border-surface-light rounded px-2 py-1 font-mono text-xs text-text-primary focus:outline-none"
          >
            <option value="name">Name</option>
            <option value="released">Release date</option>
            <option value="inputPrice">Price (input)</option>
            <option value="coding">Coding score</option>
            <option value="reasoning_score">Reasoning score</option>
            <option value="speed">Speed</option>
          </select>
          <button
            onClick={() => setSortAsc(!sortAsc)}
            class="font-mono text-xs text-text-muted hover:text-text-primary px-1"
          >
            {sortAsc ? '↑' : '↓'}
          </button>
        </div>
      </div>

      {/* View tabs */}
      <div class="flex gap-1 bg-surface border border-surface-light rounded-lg p-1 w-fit">
        {(['cards', 'timeline', 'pricing'] as const).map((v) => (
          <button
            onClick={() => setView(v)}
            class={`px-3 py-1 rounded font-mono text-xs transition-all ${
              view === v ? 'bg-neon-green/20 text-neon-green' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Cards view */}
      {view === 'cards' && (
        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((m) => (
            <ModelCard model={m} />
          ))}
        </div>
      )}

      {/* Timeline view */}
      {view === 'timeline' && (
        <div class="space-y-6">
          {Object.entries(timelineGroups)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([quarter, models]) => (
              <div>
                <div class="flex items-center gap-3 mb-3">
                  <div class="font-mono text-sm font-bold text-neon-cyan">{quarter}</div>
                  <div class="flex-1 h-px bg-surface-light" />
                  <div class="font-mono text-xs text-text-muted">{models.length} model{models.length > 1 ? 's' : ''}</div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 ml-4 border-l-2 border-surface-light pl-4">
                  {models.map((m) => (
                    <div class="bg-surface border border-surface-light rounded-lg p-3 space-y-1">
                      <div class="flex items-center justify-between">
                        <span class="font-mono text-sm font-bold text-text-bright">{m.name}</span>
                        <span class="font-mono text-xs text-text-muted">{m.provider}</span>
                      </div>
                      <div class="flex gap-1 flex-wrap">
                        {m.openSource && <span class="font-mono text-xs text-neon-green">OSS</span>}
                        {m.reasoning && <span class="font-mono text-xs text-neon-purple">reasoning</span>}
                        {m.multimodal && <span class="font-mono text-xs text-neon-cyan">multimodal</span>}
                      </div>
                      <p class="text-xs text-text-muted">{m.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}

      {/* Pricing view */}
      {view === 'pricing' && (
        <div class="space-y-4">
          <div class="bg-surface border border-surface-light rounded-lg p-4">
            <div class="flex items-center gap-3 mb-3">
              <label class="font-mono text-xs text-text-muted">Calculate cost for:</label>
              <input
                type="number"
                value={calcTokens}
                onInput={(e) => setCalcTokens(parseInt((e.target as HTMLInputElement).value) || 0)}
                class="bg-void border border-surface-light rounded px-3 py-1 font-mono text-sm text-text-primary w-32 focus:outline-none focus:border-neon-green/50"
              />
              <span class="font-mono text-xs text-text-muted">tokens (input + output)</span>
            </div>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left">
              <thead>
                <tr class="border-b border-surface-light">
                  <th class="py-2 px-3 font-mono text-xs text-text-muted">Model</th>
                  <th class="py-2 px-3 font-mono text-xs text-text-muted">Input /1M</th>
                  <th class="py-2 px-3 font-mono text-xs text-text-muted">Output /1M</th>
                  <th class="py-2 px-3 font-mono text-xs text-text-muted">Est. cost</th>
                  <th class="py-2 px-3 font-mono text-xs text-text-muted">Relative</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .filter((m) => m.inputPrice > 0)
                  .sort((a, b) => a.inputPrice - b.inputPrice)
                  .map((m) => {
                    const cost = ((m.inputPrice + m.outputPrice) / 2 / 1_000_000) * calcTokens;
                    const cheapest = Math.min(...filtered.filter((x) => x.inputPrice > 0).map((x) => (x.inputPrice + x.outputPrice) / 2));
                    const avgPrice = (m.inputPrice + m.outputPrice) / 2;
                    const relWidth = Math.min(100, (avgPrice / 50) * 100);
                    return (
                      <tr class="border-b border-surface-light/30 hover:bg-surface-light/20 transition-colors">
                        <td class="py-2.5 px-3">
                          <span class="font-mono text-sm text-text-bright">{m.name}</span>
                          <span class="font-mono text-xs text-text-muted ml-2">{m.provider}</span>
                        </td>
                        <td class="py-2.5 px-3 font-mono text-sm text-text-primary">${m.inputPrice}</td>
                        <td class="py-2.5 px-3 font-mono text-sm text-text-primary">${m.outputPrice}</td>
                        <td class="py-2.5 px-3 font-mono text-sm text-neon-green">${cost.toFixed(4)}</td>
                        <td class="py-2.5 px-3 w-40">
                          <div class="w-full bg-void rounded-full h-2">
                            <div class="h-2 rounded-full bg-neon-amber" style={`width: ${relWidth}%`} />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                {filtered.filter((m) => m.inputPrice === 0).length > 0 && (
                  <tr class="border-b border-surface-light/30">
                    <td colSpan={5} class="py-2.5 px-3 font-mono text-xs text-text-muted">
                      + {filtered.filter((m) => m.inputPrice === 0).length} open-source model{filtered.filter((m) => m.inputPrice === 0).length > 1 ? 's' : ''} (free to self-host): {filtered.filter((m) => m.inputPrice === 0).map((m) => m.name).join(', ')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p class="font-mono text-xs text-text-muted">
        {filtered.length} of {allModels.length} models shown. Capability scores are approximate and based on public benchmarks. Prices per 1M tokens (USD).
      </p>
    </div>
  );
}
