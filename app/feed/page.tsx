export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import prisma from '@/lib/prisma';

export default async function FeedPage() {
  const cases = await prisma.case.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
    include: {
      findings: true,
      outcomeTags: true,
      therapies: true,
      narrative: true,
    },
  });

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">PEGCC — Recent Cases</h1>
      {cases.length === 0 ? (
        <p>No cases yet. Submit your first at <a className="underline" href="/quick-case">Quick Case</a>.</p>
      ) : (
        <ul className="space-y-4">
          {cases.map(c => (
            <li key={c.id} className="rounded border p-4">
              <div className="font-medium">{c.title ?? `${c.tumorOncoTree} • ${c.findings[0]?.gene ?? '—'}`}</div>
              <div className="text-sm opacity-80">
                {new Date(c.createdAt).toLocaleString()}
              </div>
              <div className="mt-2 text-sm">
                {c.outcomeTags.map(t => <span key={t.id} className="mr-2 inline-block border rounded px-2 py-0.5 text-xs">{t.tag}</span>)}
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
