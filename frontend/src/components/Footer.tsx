import { AUTHOR, PROJECT } from '../projectInfo';

const LINK = 'font-medium text-base-content/70 transition-colors hover:text-brand-600 hover:underline';

export function Footer() {
  return (
    <footer className="border-t border-base-300 bg-base-100">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-1.5 px-5 py-3.5 text-xs text-base-content/60">
        <p>
          <span className="font-semibold text-base-content">{PROJECT.name}</span>
          <span aria-hidden="true"> · </span>
          {PROJECT.purpose}
        </p>

        <p>
          {AUTHOR.name}
          <span aria-hidden="true"> · </span>
          {AUTHOR.role}
        </p>

        <nav aria-label="Links do projeto" className="flex items-center gap-4">
          <a className={LINK} href={PROJECT.repositoryUrl} target="_blank" rel="noopener noreferrer">
            Repositório
          </a>
          <a className={LINK} href={PROJECT.apiDocsUrl} target="_blank" rel="noopener noreferrer">
            API
          </a>
          <a className={LINK} href={AUTHOR.githubUrl} target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a className={LINK} href={AUTHOR.siteUrl} target="_blank" rel="noopener noreferrer">
            Site
          </a>
        </nav>
      </div>
    </footer>
  );
}
