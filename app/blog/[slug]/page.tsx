import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { notFound } from 'next/navigation';

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

export default async function BlogSinglePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              {post.title}
            </h1>
            <p className="font-body text-lg text-gray-100 max-w-2xl mx-auto leading-relaxed mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="bg-scio-blue/10 text-scio-blue px-3 py-1 rounded-full text-sm font-medium">
                {post.category?.name}
              </span>
              <span className="text-gray-200 text-sm">
                {post.publishDate ? new Date(post.publishDate).toLocaleDateString() : ''}
              </span>
              <span className="text-gray-200 text-sm">
                {post.tags?.join(', ')}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <div className="w-10 h-10 bg-scio-blue rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {post.author?.name?.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-heading text-sm font-semibold text-white">{post.author?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Post Content */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <Card className="border-0 shadow-lg">
            <CardContent>
              {post.imageUrl && (
                <div className="mb-8">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    width={800}
                    height={400}
                    className="rounded-xl object-cover w-full h-auto"
                  />
                </div>
              )}
              <div className="prose prose-lg max-w-none font-body text-gray-800">
                <div dangerouslySetInnerHTML={{ __html: post.content }} />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
