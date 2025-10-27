'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  author: { name: string | null; email: string; image?: string | null };
  publishDate?: string;
  category?: { name: string };
  imageUrl?: string;
  readTime?: string;
  slug: string;
}

const POSTS_PER_PAGE = 6;

// Client Component for filtering and infinite loading
function BlogContent({ posts }: { posts: BlogPost[] }) {
  const categories = ["All", ...Array.from(new Set(posts.map(post => post.category?.name).filter(Boolean)))];
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(POSTS_PER_PAGE);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category?.name === selectedCategory);

  // Show featured post only when "All" is selected and there are posts
  const showFeatured = selectedCategory === "All" && filteredPosts.length > 0;

  // Posts for grid (skip featured if showing)
  const gridPosts = showFeatured ? filteredPosts.slice(1, visibleCount) : filteredPosts.slice(0, visibleCount);

  // Reset visibleCount when category changes
  useEffect(() => {
    setVisibleCount(POSTS_PER_PAGE);
  }, [selectedCategory]);

  // Infinite scroll logic
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          visibleCount < filteredPosts.length
        ) {
          setVisibleCount((prev) => Math.min(prev + POSTS_PER_PAGE, filteredPosts.length));
        }
      },
      { threshold: 1 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [visibleCount, filteredPosts.length]);

  // Only show loader if there are more posts to load from DB
  const hasMorePosts = visibleCount < filteredPosts.length;

  return (
    <>
      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-4 mb-12">
        {categories.map((category) => (
          <Button
            key={category || 'unknown'}
            variant={category === selectedCategory ? "default" : "outline"}
            className={`rounded-full px-6 py-2 transition-all duration-300 ${
              category === selectedCategory
                ? "bg-scio-blue text-white hover:bg-scio-blue-dark"
                : "border-gray-300 text-gray-600 hover:border-scio-blue hover:text-scio-blue"
            }`}
            onClick={() => setSelectedCategory(category ?? "All")}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Featured Post (only for "All" category) */}
      {showFeatured && (
        <div className="mb-16">
          <Card className="overflow-hidden shadow-xl border-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <Image
                  src={filteredPosts[0].imageUrl || ''}
                  alt={filteredPosts[0].title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-scio-orange text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                </div>
              </div>
              <CardContent className="p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <span className="bg-scio-blue/10 text-scio-blue px-3 py-1 rounded-full text-sm font-medium">
                    {filteredPosts[0].category?.name}
                  </span>
                  <span className="text-gray-500 text-sm">{filteredPosts[0].readTime || ''}</span>
                </div>
                <h2 className="font-heading heading-primary text-2xl md:text-3xl text-gray-800 mb-4">
                  {filteredPosts[0].title}
                </h2>
                <p className="font-body text-gray-600 mb-6 leading-relaxed">
                  {filteredPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-scio-blue rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {filteredPosts[0].author?.name?.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-heading text-sm font-semibold text-gray-800">{filteredPosts[0].author?.name}</p>
                      <p className="text-xs text-gray-500">{filteredPosts[0].publishDate ? new Date(filteredPosts[0].publishDate).toLocaleDateString() : ''}</p>
                    </div>
                  </div>
                  <Link href={`/blog/${filteredPosts[0].slug}`}>
                    <Button className="bg-scio-orange hover:bg-scio-orange-dark text-white">
                      Read More
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      )}

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {gridPosts.map((post) => (
          <Card key={post.id} className="group overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
            <div className="relative h-48 overflow-hidden">
              <Image
                src={post.imageUrl || ''}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                  {post.category?.name}
                </span>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-gray-500 text-sm">{post.publishDate ? new Date(post.publishDate).toLocaleDateString() : ''}</span>
                <span className="text-gray-500 text-sm">{post.readTime || ''}</span>
              </div>
              <h3 className="font-heading heading-secondary text-xl text-gray-800 mb-3 group-hover:text-scio-blue transition-colors">
                {post.title}
              </h3>
              <p className="font-body text-gray-600 text-sm mb-4 leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-scio-blue rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-xs">
                      {post.author?.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <span className="font-body text-sm text-gray-700">{post.author?.name}</span>
                </div>
                <Link href={`/blog/${post.slug}`}>
                  <Button variant="ghost" size="sm" className="text-scio-blue hover:text-scio-blue-dark">
                    <i className="fas fa-arrow-right text-sm"></i>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Infinite Loader */}
      {hasMorePosts && (
        <div ref={loaderRef} className="text-center mt-12">
          <span className="inline-block px-4 py-2 text-gray-500">
            Loading more posts...
          </span>
        </div>
      )}
    </>
  );
}

// Fetch posts in a non-async client component using useEffect
export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const baseUrl =
        typeof window === "undefined"
          ? process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
          : "";
      const res = await fetch(`${baseUrl}/api/blog`, { cache: 'no-store' });
      if (!res.ok) {
        setBlogPosts([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setBlogPosts(data.posts || []);
      setLoading(false);
    };
    fetchPosts();
  }, []);

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/60"></div>
       
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center text-white">
            <h1 className="font-heading heading-primary text-4xl md:text-5xl mb-6">
              ScioLabs <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Blog</span>
            </h1>
            <p className="font-body text-body text-lg md:text-xl text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Insights, trends, and expert perspectives on education, career development, and innovative learning solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Content */}
      <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          {loading ? (
            <div className="text-center py-12">
              <i className="fas fa-spinner fa-spin text-3xl text-scio-blue mb-4"></i>
              <p className="text-gray-600">Loading posts...</p>
            </div>
          ) : (
            <BlogContent posts={blogPosts} />
          )}
        </div>
      </section>
    </main>
  );
}
