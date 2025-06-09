import React from 'react';
import { usePages } from '@/lib/contexts/pages-context';
import { Button } from '@/components/ui/button';
import { Star, Edit, Eye, Copy, Trash2, GripVertical } from 'lucide-react';

interface ContextMenuProps {
  pageId: string;
  x: number;
  y: number;
  onClose: () => void;
  onEdit: () => void;
}

export function ContextMenu({ pageId, x, y, onClose, onEdit }: ContextMenuProps) {
  const { toggleFavorite, toggleVisibility, duplicatePage, deletePage } = usePages();

  const handleAction = async (action: () => Promise<void>) => {
    await action();
    onClose();
  };

  return (
    <div
      className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[200px]"
      style={{ left: x, top: y }}
    >
      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-2 text-sm"
        onClick={() => handleAction(() => toggleFavorite(pageId))}
      >
        <Star className="w-4 h-4 mr-2" />
        Favoritar
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-2 text-sm"
        onClick={() => {
          onEdit();
          onClose();
        }}
      >
        <Edit className="w-4 h-4 mr-2" />
        Editar página
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-2 text-sm"
        onClick={() => handleAction(() => toggleVisibility(pageId))}
      >
        <Eye className="w-4 h-4 mr-2" />
        Ocultar
      </Button>

      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-2 text-sm"
        onClick={() => handleAction(() => duplicatePage(pageId))}
      >
        <Copy className="w-4 h-4 mr-2" />
        Duplicar
      </Button>

      <div className="h-px bg-gray-200 my-1" />

      <Button
        variant="ghost"
        className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={() => {
          if (window.confirm('Tem certeza que deseja excluir esta página?')) {
            handleAction(() => deletePage(pageId));
          }
        }}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Apagar página
      </Button>
    </div>
  );
} 