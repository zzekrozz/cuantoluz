import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface Props {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: Props) {
  return (
    <>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={item.url} className="breadcrumb-item">
              {!isLast ? (
                <>
                  <Link href={item.url}>{item.name}</Link>
                  <ChevronRight size={12} className="breadcrumb-sep" />
                </>
              ) : (
                <span className="breadcrumb-current" aria-current="page">{item.name}</span>
              )}
            </span>
          );
        })}
      </nav>

      <style jsx>{`
        .breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 6px;
          padding: 16px 0;
          font-size: 13px;
          color: var(--text-soft);
        }

        .breadcrumb-item {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        :global(.breadcrumbs a) {
          color: var(--text-soft);
          text-decoration: none;
          transition: color 0.15s;
        }

        :global(.breadcrumbs a:hover) {
          color: var(--accent);
          text-decoration: none;
        }

        :global(.breadcrumb-sep) {
          color: var(--muted);
        }

        .breadcrumb-current {
          color: var(--text);
          font-weight: 500;
        }
      `}</style>
    </>
  );
}
