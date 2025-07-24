import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  author: { name: string | null; email: string; image?: string | null };
  publishDate?: string;
  category?: { name: string };
  imageUrl?: string;
  tags?: string[];
  slug: string;
}

async function getPost(slug: string): Promise<BlogPost | null> {
  const baseUrl =
    typeof window === "undefined"
      ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      : "";
  const res = await fetch(`${baseUrl}/api/blog/${slug}`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.post || null;
}

export default async function BlogSinglePage({ 
  params 
}: { 
  params: Promise<{ slug: string }> 
}) {
  const { slug } = await params
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Parse tags if they're stored as JSON string
  let parsedTags: string[] = []
  try {
    if (typeof post.tags === 'string') {
      parsedTags = JSON.parse(post.tags)
    } else if (Array.isArray(post.tags)) {
      parsedTags = post.tags
    }
  } catch (error) {
    console.error('Error parsing tags:', error)
    parsedTags = []
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Dark Hero Section */}
      <section className="relative bg-gray-900 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-scio-blue rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-scio-orange rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          {/* Back Button */}
          <Link 
            href="/blog" 
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {post.category?.name && (
              <Badge className="bg-scio-blue hover:bg-scio-blue-dark text-white">
                {post.category.name}
              </Badge>
            )}
            <div className="flex items-center gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {post.publishDate ? new Date(post.publishDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : ''}
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author?.name}
              </div>
            </div>
          </div>

          {/* Title */}
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">
              {post.excerpt}
            </p>
          )}

          {/* Tags */}
          {parsedTags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {parsedTags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm border border-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="shadow-xl border-0">
            <CardContent className="p-0">
              {/* Featured Image */}
              {post.imageUrl && (
                <div className="relative h-96 md:h-[500px] overflow-hidden rounded-t-lg">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-8 md:p-12">
                <div 
                  className="prose prose-lg prose-gray max-w-none
                    prose-headings:font-heading prose-headings:text-gray-900
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-gray-700 prose-p:leading-relaxed
                    prose-a:text-scio-blue prose-a:no-underline hover:prose-a:underline
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:text-gray-700 prose-ol:text-gray-700
                    prose-li:text-gray-700 prose-li:leading-relaxed
                    prose-blockquote:border-l-scio-blue prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r
                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-scio-blue
                    prose-img:rounded-lg prose-img:shadow-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />

                {/* Author Info */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-scio-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">
                        {post.author?.name?.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-heading text-lg font-semibold text-gray-900">
                        {post.author?.name}
                      </h4>
                      <p className="text-gray-600">Author</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Related Posts Section */}
          <div className="mt-16">
            <h3 className="font-heading text-2xl font-bold text-gray-900 mb-8">
              Continue Reading
            </h3>
            <div className="text-center">
              <Link 
                href="/blog"
                className="inline-flex items-center gap-2 bg-scio-blue hover:bg-scio-blue-dark text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                View All Posts
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
