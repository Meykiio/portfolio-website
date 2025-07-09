import { lazy } from 'react';

// Lazy load admin components for better code splitting
export const AdminDashboard = lazy(() => import('./admin/AdminDashboard'));
export const AdminSettings = lazy(() => import('./admin/AdminSettings'));
export const ProjectsManager = lazy(() => import('./admin/ProjectsManager'));
export const BlogsManager = lazy(() => import('./admin/BlogsManager'));
export const MessagesManager = lazy(() => import('./admin/MessagesManager'));
export const AiChatsManager = lazy(() => import('./admin/AiChatsManager'));

// Lazy load heavy components
export const MetaBalls = lazy(() => import('./MetaBalls'));
export const Silk = lazy(() => import('./Silk'));
export const AIAssistant = lazy(() => import('./AIAssistant'));

// Lazy load admin-specific components
export const RichTextEditor = lazy(() => import('./admin/RichTextEditor'));
export const SEOManager = lazy(() => import('./admin/SEOManager'));
export const ImageUploadManager = lazy(() => import('./admin/ImageUploadManager'));
export const ContentScheduler = lazy(() => import('./admin/ContentScheduler'));