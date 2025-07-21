import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

export default function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of Educational Technology",
      excerpt: "Exploring how AI and digital platforms are transforming the way we learn and teach in the 21st century.",
      author: "Dr. Sarah Johnson",
      date: "December 15, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Career Guidance in the Digital Age",
      excerpt: "How modern career counseling is adapting to help students navigate an ever-changing job market.",
      author: "Prof. Michael Chen",
      date: "December 10, 2024",
      category: "Career",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "4 min read"
    },
    {
      id: 3,
      title: "Building Effective Learning Communities",
      excerpt: "The importance of collaborative learning environments and how to create them in educational institutions.",
      author: "Ms. Priya Sharma",
      date: "December 5, 2024",
      category: "Education",
      image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "The Role of Gamification in Learning",
      excerpt: "How game-based learning approaches are making education more engaging and effective for students.",
      author: "Dr. Sarah Johnson",
      date: "November 28, 2024",
      category: "Innovation",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "7 min read"
    },
    {
      id: 5,
      title: "Language Learning in Multicultural Societies",
      excerpt: "Addressing the challenges and opportunities of teaching English in diverse cultural contexts.",
      author: "Prof. Michael Chen",
      date: "November 20, 2024",
      category: "Language",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "5 min read"
    },
    {
      id: 6,
      title: "Mental Health Support in Educational Settings",
      excerpt: "The growing importance of providing comprehensive mental health resources for students and educators.",
      author: "Ms. Priya Sharma",
      date: "November 15, 2024",
      category: "Wellness",
      image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      readTime: "4 min read"
    }
  ];

  const categories = ["All", "Technology", "Career", "Education", "Innovation", "Language", "Wellness"];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 pt-28 bg-gradient-to-br from-scio-blue via-scio-blue-light to-scio-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-48 h-48 bg-white rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
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
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                variant={category === "All" ? "default" : "outline"}
                className={`rounded-full px-6 py-2 transition-all duration-300 ${
                  category === "All" 
                    ? "bg-scio-blue text-white hover:bg-scio-blue-dark" 
                    : "border-gray-300 text-gray-600 hover:border-scio-blue hover:text-scio-blue"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Card className="overflow-hidden shadow-xl border-0">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-64 lg:h-auto">
                  <Image
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
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
                      {blogPosts[0].category}
                    </span>
                    <span className="text-gray-500 text-sm">{blogPosts[0].readTime}</span>
                  </div>
                  <h2 className="font-heading heading-primary text-2xl md:text-3xl text-gray-800 mb-4">
                    {blogPosts[0].title}
                  </h2>
                  <p className="font-body text-gray-600 mb-6 leading-relaxed">
                    {blogPosts[0].excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-scio-blue rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {blogPosts[0].author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-heading text-sm font-semibold text-gray-800">{blogPosts[0].author}</p>
                        <p className="text-xs text-gray-500">{blogPosts[0].date}</p>
                      </div>
                    </div>
                    <Button className="bg-scio-orange hover:bg-scio-orange-dark text-white">
                      Read More
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="group overflow-hidden shadow-lg border-0 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                      {post.category}
                    </span>
                  </div>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-gray-500 text-sm">{post.date}</span>
                    <span className="text-gray-500 text-sm">{post.readTime}</span>
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
                          {post.author.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <span className="font-body text-sm text-gray-700">{post.author}</span>
                    </div>
                    <Link href={`/blog/${post.id}`}>
                      <Button variant="ghost" size="sm" className="text-scio-blue hover:text-scio-blue-dark">
                        <i className="fas fa-arrow-right text-sm"></i>
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" className="bg-scio-blue hover:bg-scio-blue-dark text-white px-8 py-4 rounded-xl font-heading font-semibold">
              Load More Posts
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Subscription */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-heading heading-primary text-3xl text-scio-blue mb-4">
            Stay Updated with Our Latest Insights
          </h2>
          <p className="font-body text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest articles, trends, and educational insights delivered directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-scio-blue focus:border-transparent"
            />
            <Button className="bg-scio-orange hover:bg-scio-orange-dark text-white px-6 py-3 rounded-lg font-heading font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
