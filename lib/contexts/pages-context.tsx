import React, { createContext, useContext, useState, useEffect } from 'react';
import { z } from 'zod';
import { useStorage } from '@/lib/hooks/useStorage';
import { LucideIcon } from 'lucide-react';

// Types
export const PageSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  icon: z.string(),
  route: z.string().regex(/^\/[a-z0-9-]+$/),
  isVisible: z.boolean(),
  isFavorite: z.boolean(),
  isCustom: z.boolean(),
  order: z.number(),
  description: z.string(),
  deletedAt: z.string().optional(),
});

export type Page = z.infer<typeof PageSchema>;

export const TemplateSchema = z.object({
  name: z.string(),
  icon: z.string(),
  defaultRoute: z.string(),
  description: z.string(),
});

export type Template = z.infer<typeof TemplateSchema>;

interface PagesContextType {
  pages: Page[];
  deletedPages: Page[];
  templates: Template[];
  loading: boolean;
  error: string | null;
  addPage: (page: Omit<Page, 'id' | 'order'>) => Promise<void>;
  updatePage: (id: string, updates: Partial<Page>) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  restorePage: (id: string) => Promise<void>;
  reorderPages: (pages: Page[]) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleVisibility: (id: string) => Promise<void>;
  duplicatePage: (id: string) => Promise<void>;
}

const defaultTemplates: Template[] = [
  {
    name: 'Página de Relatório',
    icon: 'BarChart3',
    defaultRoute: '/relatorio',
    description: 'Página com gráficos e tabelas para análise de dados',
  },
  {
    name: 'Página Financeira',
    icon: 'Wallet',
    defaultRoute: '/financeiro',
    description: 'Página para controle de finanças pessoais',
  },
  {
    name: 'Página de Metas',
    icon: 'Target',
    defaultRoute: '/metas',
    description: 'Página para acompanhamento de objetivos',
  },
  {
    name: 'Página Custom',
    icon: 'Layout',
    defaultRoute: '/custom',
    description: 'Página personalizável com componentes drag-and-drop',
  },
];

const PagesContext = createContext<PagesContextType | undefined>(undefined);

export function PagesProvider({ children }: { children: React.ReactNode }) {
  const [pages, setPages] = useState<Page[]>([]);
  const [deletedPages, setDeletedPages] = useState<Page[]>([]);
  const [templates] = useState<Template[]>(defaultTemplates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getItem, setItem } = useStorage();

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      const [pagesData, deletedData] = await Promise.all([
        getItem('pages'),
        getItem('deletedPages'),
      ]);

      if (pagesData) {
        setPages(JSON.parse(pagesData));
      }
      if (deletedData) {
        setDeletedPages(JSON.parse(deletedData));
      }
    } catch (err) {
      setError('Erro ao carregar páginas');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const savePages = async (newPages: Page[], newDeletedPages: Page[] = deletedPages) => {
    try {
      await Promise.all([
        setItem('pages', JSON.stringify(newPages)),
        setItem('deletedPages', JSON.stringify(newDeletedPages)),
      ]);
      setPages(newPages);
      setDeletedPages(newDeletedPages);
    } catch (err) {
      setError('Erro ao salvar páginas');
      console.error(err);
    }
  };

  const addPage = async (page: Omit<Page, 'id' | 'order'>) => {
    try {
      const newPage: Page = {
        ...page,
        id: crypto.randomUUID(),
        order: pages.length + 1,
      };
      await savePages([...pages, newPage]);
    } catch (err) {
      setError('Erro ao adicionar página');
      console.error(err);
    }
  };

  const updatePage = async (id: string, updates: Partial<Page>) => {
    try {
      const newPages = pages.map(p =>
        p.id === id ? { ...p, ...updates } : p
      );
      await savePages(newPages);
    } catch (err) {
      setError('Erro ao atualizar página');
      console.error(err);
    }
  };

  const deletePage = async (id: string) => {
    try {
      const pageToDelete = pages.find(p => p.id === id);
      if (!pageToDelete) return;

      const newPages = pages.filter(p => p.id !== id);
      const newDeletedPages = [
        ...deletedPages,
        { ...pageToDelete, deletedAt: new Date().toISOString() },
      ];
      await savePages(newPages, newDeletedPages);
    } catch (err) {
      setError('Erro ao deletar página');
      console.error(err);
    }
  };

  const restorePage = async (id: string) => {
    try {
      const pageToRestore = deletedPages.find(p => p.id === id);
      if (!pageToRestore) return;

      const newDeletedPages = deletedPages.filter(p => p.id !== id);
      const newPages = [...pages, { ...pageToRestore, deletedAt: undefined }];
      await savePages(newPages, newDeletedPages);
    } catch (err) {
      setError('Erro ao restaurar página');
      console.error(err);
    }
  };

  const reorderPages = async (newPages: Page[]) => {
    try {
      const reorderedPages = newPages.map((page, index) => ({
        ...page,
        order: index + 1,
      }));
      await savePages(reorderedPages);
    } catch (err) {
      setError('Erro ao reordenar páginas');
      console.error(err);
    }
  };

  const toggleFavorite = async (id: string) => {
    try {
      const page = pages.find(p => p.id === id);
      if (!page) return;

      await updatePage(id, { isFavorite: !page.isFavorite });
    } catch (err) {
      setError('Erro ao favoritar página');
      console.error(err);
    }
  };

  const toggleVisibility = async (id: string) => {
    try {
      const page = pages.find(p => p.id === id);
      if (!page) return;

      await updatePage(id, { isVisible: !page.isVisible });
    } catch (err) {
      setError('Erro ao alterar visibilidade da página');
      console.error(err);
    }
  };

  const duplicatePage = async (id: string) => {
    try {
      const pageToDuplicate = pages.find(p => p.id === id);
      if (!pageToDuplicate) return;

      const newPage: Page = {
        ...pageToDuplicate,
        id: crypto.randomUUID(),
        name: `${pageToDuplicate.name} (Cópia)`,
        route: `${pageToDuplicate.route}-copy`,
        order: pages.length + 1,
      };
      await savePages([...pages, newPage]);
    } catch (err) {
      setError('Erro ao duplicar página');
      console.error(err);
    }
  };

  return (
    <PagesContext.Provider
      value={{
        pages,
        deletedPages,
        templates,
        loading,
        error,
        addPage,
        updatePage,
        deletePage,
        restorePage,
        reorderPages,
        toggleFavorite,
        toggleVisibility,
        duplicatePage,
      }}
    >
      {children}
    </PagesContext.Provider>
  );
}

export function usePages() {
  const context = useContext(PagesContext);
  if (context === undefined) {
    throw new Error('usePages must be used within a PagesProvider');
  }
  return context;
} 