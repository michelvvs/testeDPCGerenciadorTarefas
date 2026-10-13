import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AUTHOR, PROJECT } from '../projectInfo';
import { Footer } from './Footer';

describe('Footer', () => {
  it('mostra os dados do projeto e do autor', () => {
    render(<Footer />);

    expect(screen.getByText(PROJECT.name)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(AUTHOR.name))).toBeInTheDocument();
    expect(screen.getByText(new RegExp(AUTHOR.role))).toBeInTheDocument();
  });

  it('aponta os links para repositório, API, GitHub e site', () => {
    render(<Footer />);

    const href = (name: string) => screen.getByRole('link', { name }).getAttribute('href');

    expect(href('Repositório')).toBe(PROJECT.repositoryUrl);
    expect(href('API')).toBe(PROJECT.apiDocsUrl);
    expect(href('GitHub')).toBe(AUTHOR.githubUrl);
    expect(href('Site')).toBe(AUTHOR.siteUrl);
  });

  it('abre links externos sem expor o opener', () => {
    render(<Footer />);

    for (const link of screen.getAllByRole('link')) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link.getAttribute('rel')).toContain('noopener');
    }
  });
});
