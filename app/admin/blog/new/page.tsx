import { Metadata } from "next"
import BlogPostForm from "@/components/admin/blog-post-form"

export const metadata: Metadata = {
  title: "New Blog Post",
  description: "Create a new blog post for ScioLabs."
}

export default function NewBlogPostPage() {
  return <BlogPostForm />
}
