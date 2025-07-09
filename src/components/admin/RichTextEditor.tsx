import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Image, 
  Code, 
  Quote,
  Eye,
  Edit
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  placeholder = "Start writing...",
  className
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + 
                   before + selectedText + after + 
                   value.substring(end);
    
    onChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), tooltip: 'Italic' },
    { icon: Underline, action: () => insertMarkdown('<u>', '</u>'), tooltip: 'Underline' },
    { icon: Code, action: () => insertMarkdown('`', '`'), tooltip: 'Inline Code' },
    { icon: Quote, action: () => insertMarkdown('> '), tooltip: 'Quote' },
    { icon: List, action: () => insertMarkdown('- '), tooltip: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('1. '), tooltip: 'Numbered List' },
    { icon: Link, action: () => insertMarkdown('[', '](url)'), tooltip: 'Link' },
    { icon: Image, action: () => insertMarkdown('![alt text](', ')'), tooltip: 'Image' },
  ];

  const renderMarkdownPreview = (markdown: string) => {
    // Simple markdown to HTML conversion for preview
    let html = markdown
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded">$1</code>')
      .replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-electric-cyan pl-4 italic">$1</blockquote>')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/^1\. (.+)$/gm, '<li>$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-electric-cyan hover:underline">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />')
      .replace(/\n/g, '<br />');

    // Wrap consecutive <li> elements in <ul>
    html = html.replace(/(<li>.*?<\/li>(?:\s*<li>.*?<\/li>)*)/g, '<ul class="list-disc list-inside space-y-1">$1</ul>');

    return html;
  };

  return (
    <Card className={cn("bg-gray-900 border-gray-800", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white text-sm font-medium">Content Editor</CardTitle>
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'edit' | 'preview')}>
            <TabsList className="bg-gray-800 border-gray-700">
              <TabsTrigger value="edit" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </TabsTrigger>
              <TabsTrigger value="preview" className="data-[state=active]:bg-electric-cyan data-[state=active]:text-dark">
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {activeTab === 'edit' && (
          <>
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-gray-800 rounded border border-gray-700">
              {formatButtons.map((button, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={button.action}
                  className="h-8 w-8 p-0 hover:bg-gray-700 text-gray-300 hover:text-white"
                  title={button.tooltip}
                >
                  <button.icon className="w-4 h-4" />
                </Button>
              ))}
            </div>

            {/* Editor */}
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="min-h-[300px] bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:border-electric-cyan resize-none font-mono text-sm"
            />
          </>
        )}

        {activeTab === 'preview' && (
          <div className="min-h-[300px] p-4 bg-gray-800 border border-gray-700 rounded">
            {value ? (
              <div 
                className="prose prose-invert max-w-none text-white"
                dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(value) }}
              />
            ) : (
              <p className="text-gray-500 italic">Nothing to preview yet...</p>
            )}
          </div>
        )}

        {/* Helper Text */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>Supports Markdown: **bold**, *italic*, `code`, > quotes, - lists, [links](url), ![images](url)</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default RichTextEditor;