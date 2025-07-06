
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published: boolean | null;
  created_at: string;
  updated_at: string;
}

interface BlogFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  image_url: string;
  published: boolean;
}

export const BlogsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const queryClient = useQueryClient();

  const form = useForm<BlogFormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      published: false,
    },
  });

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Blog[];
    },
  });

  const createBlogMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const { error } = await supabase
        .from('blogs')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog created successfully');
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to create blog');
      console.error('Create blog error:', error);
    },
  });

  const updateBlogMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: BlogFormData }) => {
      const { error } = await supabase
        .from('blogs')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog updated successfully');
      setIsDialogOpen(false);
      setEditingBlog(null);
      form.reset();
    },
    onError: (error) => {
      toast.error('Failed to update blog');
      console.error('Update blog error:', error);
    },
  });

  const deleteBlogMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      toast.success('Blog deleted successfully');
    },
    onError: (error) => {
      toast.error('Failed to delete blog');
      console.error('Delete blog error:', error);
    },
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const onSubmit = (data: BlogFormData) => {
    if (editingBlog) {
      updateBlogMutation.mutate({ id: editingBlog.id, data });
    } else {
      createBlogMutation.mutate(data);
    }
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    form.reset({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      image_url: blog.image_url || '',
      published: blog.published || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading blogs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Blog Posts ({blogs?.length || 0})</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingBlog(null); form.reset(); }}>
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
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
                        <Input 
                          {...field} 
                          className="bg-gray-700 border-gray-600"
                          onChange={(e) => {
                            field.onChange(e);
                            if (!editingBlog) {
                              form.setValue('slug', generateSlug(e.target.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
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
                        <Textarea {...field} rows={8} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="image_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Featured Image URL</FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-gray-700 border-gray-600" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="published"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormLabel>Published</FormLabel>
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
                    {editingBlog ? 'Update' : 'Create'} Blog Post
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
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {blogs?.map((blog) => (
              <TableRow key={blog.id} className="border-gray-700">
                <TableCell className="font-medium">{blog.title}</TableCell>
                <TableCell>
                  <Badge variant={blog.published ? "default" : "secondary"}>
                    {blog.published ? 'Published' : 'Draft'}
                  </Badge>
                </TableCell>
                <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(blog)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleDelete(blog.id)}>
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
