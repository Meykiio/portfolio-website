import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { Plus, Edit, Trash2, Eye, FileText, Search, Image } from 'lucide-react';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';
import SEOManager from './SEOManager';
import ImageUploadManager from './ImageUploadManager';
import ContentScheduler from './ContentScheduler';

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
  meta_description: string;
  og_image: string;
  tags: string[];
  status: 'draft' | 'published' | 'scheduled';
  scheduled_for: string;
}

export const BlogsManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [activeTab, setActiveTab] = useState('content');
  const queryClient = useQueryClient();

  const form = useForm<BlogFormData>({
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      published: false,
      meta_description: '',
      og_image: '',
      tags: [],
      status: 'draft',
      scheduled_for: '',
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
        .insert([{
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          image_url: data.image_url,
          published: data.published,
        }]);

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
          title: data.title,
          slug: data.slug,
          excerpt: data.excerpt,
          content: data.content,
          image_url: data.image_url,
          published: data.published,
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
      meta_description: blog.excerpt || '',
      og_image: blog.image_url || '',
      tags: [],
      status: blog.published ? 'published' : 'draft',
      scheduled_for: '',
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      deleteBlogMutation.mutate(id);
    }
  };

  const handleNewBlog = () => {
    setEditingBlog(null);
    form.reset();
    setActiveTab('content');
    setIsDialogOpen(true);
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
            <Button onClick={handleNewBlog} className="bg-electric-cyan text-dark hover:bg-electric-cyan/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Blog Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700">
            <DialogHeader>
              <DialogTitle>{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</DialogTitle>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4 bg-gray-900">
                <TabsTrigger value="content" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
                  <FileText className="w-4 h-4 mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="media" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
                  <Image className="w-4 h-4 mr-2" />
                  Media
                </TabsTrigger>
                <TabsTrigger value="seo" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
                  <Search className="w-4 h-4 mr-2" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="publish" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
                  <Eye className="w-4 h-4 mr-2" />
                  Publish
                </TabsTrigger>
              </TabsList>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <TabsContent value="content" className="space-y-4 mt-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="Enter blog post title..."
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
                      name="excerpt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-gray-300">Excerpt</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-700 border-gray-600 text-white"
                              placeholder="Brief description of the blog post..."
                            />
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
                          <FormLabel className="text-gray-300">Content</FormLabel>
                          <FormControl>
                            <RichTextEditor
                              value={field.value}
                              onChange={field.onChange}
                              placeholder="Write your blog post content here..."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="media" className="space-y-4 mt-6">
                    <FormField
                      control={form.control}
                      name="image_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <ImageUploadManager
                              value={field.value}
                              onChange={field.onChange}
                              label="Featured Image"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>

                  <TabsContent value="seo" className="space-y-4 mt-6">
                    <SEOManager
                      title={form.watch('title')}
                      onTitleChange={(title) => form.setValue('title', title)}
                      metaDescription={form.watch('meta_description')}
                      onMetaDescriptionChange={(desc) => form.setValue('meta_description', desc)}
                      slug={form.watch('slug')}
                      onSlugChange={(slug) => form.setValue('slug', slug)}
                      ogImage={form.watch('og_image')}
                      onOgImageChange={(image) => form.setValue('og_image', image)}
                      tags={form.watch('tags')}
                      onTagsChange={(tags) => form.setValue('tags', tags)}
                    />
                  </TabsContent>

                  <TabsContent value="publish" className="space-y-4 mt-6">
                    <ContentScheduler
                      status={form.watch('status')}
                      onStatusChange={(status) => {
                        form.setValue('status', status);
                        form.setValue('published', status === 'published');
                      }}
                      scheduledFor={form.watch('scheduled_for')}
                      onScheduledForChange={(date) => form.setValue('scheduled_for', date)}
                      onSave={() => form.handleSubmit(onSubmit)()}
                      onPublish={() => {
                        form.setValue('published', true);
                        form.setValue('status', 'published');
                        form.handleSubmit(onSubmit)();
                      }}
                      onPreview={() => {
                        // TODO: Implement preview functionality
                        toast.success('Preview functionality coming soon!');
                      }}
                    />
                  </TabsContent>

                  <div className="flex justify-end space-x-2 mt-6 pt-4 border-t border-gray-700">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setIsDialogOpen(false)}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-electric-cyan text-dark hover:bg-electric-cyan/90"
                    >
                      {editingBlog ? 'Update' : 'Create'} Blog Post
                    </Button>
                  </div>
                </form>
              </Form>
            </Tabs>
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