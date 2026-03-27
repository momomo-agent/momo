interface Thought {
  id: string;
  title: string;
  content: string;
  date: string;
}

export function Thoughts({ thoughts }: { thoughts: Thought[] }) {
  if (!thoughts || thoughts.length === 0) return null;

  return (
    <div className="space-y-6">
      {thoughts.map((thought) => (
        <article key={thought.id} className="bg-white/[0.02] border border-white/5 rounded-lg p-6 hover:bg-white/[0.03] transition-colors">
          <h3 className="text-lg font-semibold mb-2">{thought.title}</h3>
          <time className="text-sm text-white/40 mb-4 block">
            {new Date(thought.date).toLocaleDateString('zh-CN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </time>
          <div className="text-white/70 whitespace-pre-wrap leading-relaxed">
            {thought.content}
          </div>
        </article>
      ))}
    </div>
  );
}
