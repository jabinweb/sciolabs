import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Calendar, User, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

async function getPost(slug: string, isPreview = false) {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          email: true
        }
      },
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!post) {
    return null
  }

  // If post is not published and not in preview mode, return null
  if (!post.isPublished && !isPreview) {
    return null
  }

  return post
}

interface PageProps {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

export default async function BlogPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { preview } = await searchParams
  const isPreview = preview === 'true'
  
  // Check if user is authenticated for preview mode
  if (isPreview) {
    const session = await auth()
    if (!session?.user) {
      notFound()
    }
  }

  const post = await getPost(slug, isPreview)

  if (!post) {
    notFound()
  }

  // Increment view count only if not in preview mode
  if (!isPreview) {
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { views: { increment: 1 } }
    })
  }

  // Parse tags
  let tags: string[] = []
  try {
    tags = typeof post.tags === 'string' ? JSON.parse(post.tags) : []
  } catch {
    tags = []
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Preview Banner */}
      {isPreview && (
        <div className="bg-yellow-500 text-black py-2 px-6 text-center font-medium">
          <i className="fas fa-eye mr-2"></i>
          Preview Mode - This post is not published yet
        </div>
      )}
      
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
          <h1 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          {/* {post.excerpt && (
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mb-8">
              {post.excerpt}
            </p>
          )} */}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" />
              {tags.map((tag, index) => (
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
                <div className="relative h-96 md:h-[400px] overflow-hidden rounded-t-lg">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover aspect-video"
                    priority
                  />
                </div>
              )}

              {/* Article Content */}
              <div className="p-8 md:p-12">
                <div 
                  className="prose prose-lg prose-gray max-w-none
                    prose-headings:font-heading prose-headings:text-gray-900 prose-headings:mb-6 prose-headings:mt-8 prose-headings:first:mt-0
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-base
                    prose-a:text-scio-blue prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                    prose-strong:text-gray-900 prose-strong:font-semibold
                    prose-ul:text-gray-700 prose-ul:mb-6 prose-ol:text-gray-700 prose-ol:mb-6
                    prose-li:text-gray-700 prose-li:leading-relaxed prose-li:mb-2
                    prose-blockquote:border-l-4 prose-blockquote:border-scio-blue prose-blockquote:bg-gray-50 prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r prose-blockquote:my-6 prose-blockquote:not-italic
                    prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-scio-blue prose-code:text-sm
                    prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 prose-pre:rounded-lg prose-pre:overflow-x-auto prose-pre:my-6
                    prose-img:rounded-lg prose-img:shadow-lg prose-img:my-8 prose-img:mx-auto
                    prose-hr:border-gray-300 prose-hr:my-8
                    prose-table:w-full prose-table:border-collapse prose-table:my-6
                    prose-th:border prose-th:border-gray-300 prose-th:bg-gray-50 prose-th:p-3 prose-th:text-left prose-th:font-semibold
                    prose-td:border prose-td:border-gray-300 prose-td:p-3
                    [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                    [&_p]:mb-6 [&_p:last-child]:mb-0
                    [&_h1]:mt-8 [&_h1]:mb-6 [&_h1:first-child]:mt-0
                    [&_h2]:mt-8 [&_h2]:mb-6 [&_h2:first-child]:mt-0  
                    [&_h3]:mt-6 [&_h3]:mb-4 [&_h3:first-child]:mt-0
                    [&_ul]:mb-6 [&_ol]:mb-6
                    [&_blockquote]:my-6"
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

// ...existing generateMetadata function...
