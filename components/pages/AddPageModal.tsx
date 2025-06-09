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
import { PageSchema, Template } from '@/lib/contexts/pages-context';
import { icons } from '@/lib/icons';

interface AddPageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPageModal({ open, onOpenChange }: AddPageModalProps) {
  const { templates, addPage } = usePages();
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(PageSchema.omit({ id: true, order: true })),
    defaultValues: {
      name: '',
      icon: 'Layout',
      route: '',
      isVisible: true,
      isFavorite: false,
      isCustom: true,
      description: '',
    },
  });

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setValue('name', template.name);
    setValue('icon', template.icon);
    setValue('route', template.defaultRoute);
    setValue('description', template.description);
  };

  const handleFormSubmit = async (data: any) => {
    await addPage(data);
    reset();
    setSelectedTemplate(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Nova Página</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Escolha um Template</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map(template => (
                <div
                  key={template.name}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedTemplate?.name === template.name
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-primary/50'
                  }`}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{template.icon}</span>
                    <div>
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-gray-500">{template.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

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
                Criar Página
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
} 