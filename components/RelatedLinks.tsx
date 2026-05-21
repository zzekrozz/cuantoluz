import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface RelatedLink {
  title: string;
  description: string;
  url: string;
}

interface Props {
  title?: string;
  links: RelatedLink[];
}

export default function RelatedLinks({ title = 'Sigue leyendo', links }: Props) {
  return (
    <>
      <section className="related-links">
        <h2 className="related-title">{title}</h2>
        <div className="related-grid">
          {links.map(link => (
            <Link key={link.url} href={link.url} className="related-card">
              <div className="related-card-title">
                {link.title}
                <ArrowRight size={14} className="related-arrow" />
              </div>
              <div className="related-card-desc">{link.description}</div>
            </Link>
          ))}
        </div>
      </section>

      <style jsx>{`
        .related-links {
          margin: 48px 0 24px;
          padding-top: 32px;
          border-top: 1px solid var(--border);
        }

        .related-title {
          font-family: 'Syne', sans-serif;
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 18px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 12px;
        }

        :global(.related-card) {
          display: block;
          padding: 16px 18px;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        :global(.related-card:hover) {
          border-color: var(--accent);
          transform: translateY(-2px);
          text-decoration: none;
        }

        :global(.related-card-title) {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 15px;
          font-weight: 700;
          color: var(--text);
          margin-bottom: 6px;
          line-height: 1.3;
        }

        :global(.related-arrow) {
          color: var(--accent);
          flex-shrink: 0;
          transition: transform 0.2s;
        }

        :global(.related-card:hover .related-arrow) {
          transform: translateX(2px);
        }

        :global(.related-card-desc) {
          font-size: 13px;
          color: var(--text-soft);
          line-height: 1.5;
        }
      `}</style>
    </>
  );
}
