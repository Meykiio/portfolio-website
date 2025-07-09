import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Search, Globe, Share2, Eye } from 'lucide-react';

interface SEOManagerProps {
  title: string;
  onTitleChange: (title: string) => void;
  metaDescription: string;
  onMetaDescriptionChange: (description: string) => void;
  slug: string;
  onSlugChange: (slug: string) => void;
  ogImage?: string;
  onOgImageChange: (image: string) => void;
  tags?: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

const SEOManager: React.FC<SEOManagerProps> = ({
  title,
  onTitleChange,
  metaDescription,
  onMetaDescriptionChange,
  slug,
  onSlugChange,
  ogImage = '',
  onOgImageChange,
  tags = [],
  onTagsChange,
  className
}) => {
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (newTitle: string) => {
    onTitleChange(newTitle);
    // Auto-generate slug if it's empty or matches the previous title's slug
    if (!slug || slug === generateSlug(title)) {
      onSlugChange(generateSlug(newTitle));
    }
  };

  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const input = e.currentTarget;
      const newTag = input.value.trim();
      
      if (newTag && !tags.includes(newTag)) {
        onTagsChange([...tags, newTag]);
        input.value = '';
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter(tag => tag !== tagToRemove));
  };

  const titleLength = title.length;
  const descriptionLength = metaDescription.length;
  const slugLength = slug.length;

  return (
    <Card className={`bg-gray-900 border-gray-800 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Search className="w-5 h-5" />
          SEO & Meta Tags
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="seo-title" className="text-gray-300 flex items-center justify-between">
            <span>SEO Title</span>
            <span className={`text-xs ${titleLength > 60 ? 'text-red-400' : titleLength > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
              {titleLength}/60
            </span>
          </Label>
          <Input
            id="seo-title"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter SEO-optimized title..."
            className="bg-gray-800 border-gray-700 text-white"
            maxLength={60}
          />
          <p className="text-xs text-gray-500">
            Optimal length: 50-60 characters. This appears in search results and browser tabs.
          </p>
        </div>

        {/* Slug */}
        <div className="space-y-2">
          <Label htmlFor="seo-slug" className="text-gray-300 flex items-center justify-between">
            <span>URL Slug</span>
            <span className={`text-xs ${slugLength > 50 ? 'text-yellow-400' : 'text-green-400'}`}>
              {slugLength} chars
            </span>
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">sifeddine.xyz/</span>
            <Input
              id="seo-slug"
              value={slug}
              onChange={(e) => onSlugChange(e.target.value)}
              placeholder="url-friendly-slug"
              className="bg-gray-800 border-gray-700 text-white"
            />
          </div>
          <p className="text-xs text-gray-500">
            Use lowercase letters, numbers, and hyphens only. Keep it short and descriptive.
          </p>
        </div>

        <Separator className="bg-gray-700" />

        {/* Meta Description */}
        <div className="space-y-2">
          <Label htmlFor="meta-description" className="text-gray-300 flex items-center justify-between">
            <span>Meta Description</span>
            <span className={`text-xs ${descriptionLength > 160 ? 'text-red-400' : descriptionLength > 140 ? 'text-yellow-400' : 'text-green-400'}`}>
              {descriptionLength}/160
            </span>
          </Label>
          <Textarea
            id="meta-description"
            value={metaDescription}
            onChange={(e) => onMetaDescriptionChange(e.target.value)}
            placeholder="Write a compelling description that will appear in search results..."
            className="bg-gray-800 border-gray-700 text-white resize-none"
            rows={3}
            maxLength={160}
          />
          <p className="text-xs text-gray-500">
            Optimal length: 140-160 characters. This appears in search results below the title.
          </p>
        </div>

        {/* Open Graph Image */}
        <div className="space-y-2">
          <Label htmlFor="og-image" className="text-gray-300 flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Social Media Image (Open Graph)
          </Label>
          <Input
            id="og-image"
            value={ogImage}
            onChange={(e) => onOgImageChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="bg-gray-800 border-gray-700 text-white"
          />
          <p className="text-xs text-gray-500">
            Recommended size: 1200x630px. This image appears when shared on social media.
          </p>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label className="text-gray-300">Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-electric-cyan/20 text-electric-cyan border-electric-cyan/30 cursor-pointer hover:bg-electric-cyan/30"
                onClick={() => removeTag(tag)}
              >
                {tag} ×
              </Badge>
            ))}
          </div>
          <Input
            placeholder="Type a tag and press Enter..."
            onKeyDown={handleTagInput}
            className="bg-gray-800 border-gray-700 text-white"
          />
          <p className="text-xs text-gray-500">
            Press Enter or comma to add tags. Click on tags to remove them.
          </p>
        </div>

        <Separator className="bg-gray-700" />

        {/* Preview */}
        <div className="space-y-3">
          <Label className="text-gray-300 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Search Result Preview
          </Label>
          <div className="p-4 bg-gray-800 rounded border border-gray-700">
            <div className="space-y-1">
              <div className="text-blue-400 text-sm hover:underline cursor-pointer">
                sifeddine.xyz/{slug || 'your-slug'}
              </div>
              <div className="text-blue-600 text-lg hover:underline cursor-pointer">
                {title || 'Your SEO Title Here'}
              </div>
              <div className="text-gray-400 text-sm">
                {metaDescription || 'Your meta description will appear here in search results...'}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SEOManager;