
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Eye, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface Project {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  image_url: string | null;
  demo_url: string | null;
  github_url: string | null;
  technologies: string[] | null;
  featured: boolean | null;
  created_at: string;
  updated_at: string;
}

interface ProjectFormData {
  title: string;
  description: string;
  content: string;
  image_url: string;
  demo_url: string;
  github_url: string;
  technologies: string;
  featured: boolean;
}

export const ProjectsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<ProjectFormData>({
    defaultValues: {
      title: '',
      description: '',
      content: '',
      image_url: '',
      demo_url: '',
      github_url: '',
      technologies: '',
      featured: false,
    },
  });

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Project[];
    },
  });

  const createProjectMutation = useMutation({
    mutationFn: async (data: ProjectFormData) => {
      const { error } = await supabase
        .from('projects')
        .insert([{
          ...data,
          technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()) : null,
        }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project created successfully');
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create project');
      console.error('Create project error:', error);
    },
  });

  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: ProjectFormData }) => {
      const { error } = await supabase
        .from('projects')
        .update({
          ...data,
          technologies: data.technologies ? data.technologies.split(',').map(t => t.trim()) : null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project updated successfully');
      setIsDialogOpen(false);
      setEditingProject(null);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to update project');
      console.error('Update project error:', error);
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast.success('Project deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete project');
      console.error('Delete project error:', error);
    },
  });

  const onSubmit = (data: ProjectFormData) => {
    if (editingProject) {
      updateProjectMutation.mutate({ id: editingProject.id, data });
    } else {
      createProjectMutation.mutate(data);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    form.reset({
      title: project.title,
      description: project.description || '',
      content: project.content || '',
      image_url: project.image_url || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      technologies: project.technologies?.join(', ') || '',
      featured: project.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Projects ({projects?.length || 0})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingProject(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Project
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle>{editingProject ? 'Edit Project' : 'Create New Project'}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content (Markdown)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={6} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="demo_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Demo URL</FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-gray-700 border-gray-600" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="github_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="technologies"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Technologies (comma-separated)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="React, TypeScript, Node.js" className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Featured Project</FormLabel>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingProject ? 'Update' : 'Create'} Project
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-700">
              <TableHead>Title</TableHead>
              <TableHead>Technologies</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects?.map((project) => (
              <TableRow key={project.id} className="border-gray-700">
                <TableCell className="font-medium">{project.title}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies?.slice(0, 3).map((tech, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies && project.technologies.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.technologies.length - 3}
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {project.featured && (
                    <Badge className="bg-yellow-600">Featured</Badge>
                  )}
                </TableCell>
                <TableCell>{new Date(project.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {project.demo_url && (
                      <Button size="sm" variant="outline" asChild>
                        <a href={project.demo_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    <Button size="sm" variant="outline" onClick={() => handleEdit(project)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(project.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
