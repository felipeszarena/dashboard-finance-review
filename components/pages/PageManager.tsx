import React from 'react';
import { usePages } from '@/lib/contexts/pages-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Star, Eye, EyeOff } from 'lucide-react';
import { PageEditor } from './PageEditor';
import { AddPageModal } from './AddPageModal';

interface PageManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageManager({ open, onOpenChange }: PageManagerProps) {
  const { pages, deletedPages, loading, error } = usePages();
  const [activeTab, setActiveTab] = React.useState('active');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [editingPage, setEditingPage] = React.useState<string | null>(null);

  const visiblePages = pages.filter(p => p.isVisible);
  const hiddenPages = pages.filter(p => !p.isVisible);

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <div className="text-red-500">Erro: {error}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Gerenciar Páginas</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="active">Ativas ({visiblePages.length})</TabsTrigger>
            <TabsTrigger value="hidden">Ocultas ({hiddenPages.length})</TabsTrigger>
            <TabsTrigger value="deleted">Lixeira ({deletedPages.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {visiblePages.map(page => (
              <PageItem
                key={page.id}
                page={page}
                onEdit={() => setEditingPage(page.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="hidden" className="space-y-4">
            {hiddenPages.map(page => (
              <PageItem
                key={page.id}
                page={page}
                onEdit={() => setEditingPage(page.id)}
              />
            ))}
          </TabsContent>

          <TabsContent value="deleted" className="space-y-4">
            {deletedPages.map(page => (
              <DeletedPageItem key={page.id} page={page} />
            ))}
          </TabsContent>
        </Tabs>

        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Adicionar Página
          </Button>
        </div>

        {editingPage && (
          <PageEditor
            pageId={editingPage}
            open={!!editingPage}
            onOpenChange={(open) => !open && setEditingPage(null)}
          />
        )}

        <AddPageModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
        />
      </DialogContent>
    </Dialog>
  );
}

interface PageItemProps {
  page: any;
  onEdit: () => void;
}

function PageItem({ page, onEdit }: PageItemProps) {
  const { toggleFavorite, toggleVisibility } = usePages();

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        <span className="text-lg">{page.icon}</span>
        <div>
          <h3 className="font-medium">{page.name}</h3>
          <p className="text-sm text-gray-500">{page.route}</p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleFavorite(page.id)}
        >
          <Star className={`w-4 h-4 ${page.isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => toggleVisibility(page.id)}
        >
          {page.isVisible ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={onEdit}
        >
          <Edit className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

interface DeletedPageItemProps {
  page: any;
}

function DeletedPageItem({ page }: DeletedPageItemProps) {
  const { restorePage } = usePages();

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-4">
        <span className="text-lg">{page.icon}</span>
        <div>
          <h3 className="font-medium">{page.name}</h3>
          <p className="text-sm text-gray-500">
            Deletado em {new Date(page.deletedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={() => restorePage(page.id)}
      >
        Restaurar
      </Button>
    </div>
  );
} 