import React from 'react';
import { usePages } from '@/lib/contexts/pages-context';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { PageSchema } from '@/lib/contexts/pages-context';
import { icons } from '@/lib/icons';

interface PageEditorProps {
  pageId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PageEditor({ pageId, open, onOpenChange }: PageEditorProps) {
  const { pages, updatePage } = usePages();
  const page = pages.find(p => p.id === pageId);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(PageSchema.omit({ id: true, order: true })),
    defaultValues: page || {
      name: '',
      icon: 'Layout',
      route: '',
      isVisible: true,
      isFavorite: false,
      isCustom: true,
      description: '',
    },
  });

  const handleFormSubmit = async (data: any) => {
    await updatePage(pageId, data);
    onOpenChange(false);
  };

  if (!page) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Página</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Nome da página"
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Ícone</Label>
            <Select
              value={watch('icon')}
              onValueChange={(value) => setValue('icon', value)}
              options={icons.map(icon => ({
                value: icon,
                label: icon,
              }))}
            />
            {errors.icon && (
              <p className="text-sm text-red-500">{errors.icon.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="route">Rota</Label>
            <Input
              id="route"
              {...register('route')}
              placeholder="/minha-pagina"
            />
            {errors.route && (
              <p className="text-sm text-red-500">{errors.route.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição da página"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 