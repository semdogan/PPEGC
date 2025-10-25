export default function Home() {
  return (
    <div className="card">
      <h1>PEGCC — Prisma (SQLite) Mockup</h1>
      <p className="note">
        Local demo with no external DB. Use month–year only; no names/places. Seed adds 3 sample cases.
      </p>
      <ul>
        <li><strong>Quick Case:</strong> submit LUAD / KRAS / p.G12C / Exceptional response</li>
        <li><strong>Feed:</strong> latest 20 cases with narrative</li>
      </ul>
    </div>
  );
}
