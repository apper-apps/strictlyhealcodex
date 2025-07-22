import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import blogsService from "@/services/api/blogsService";

const BlogDetail = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadBlog();
  }, [blogId]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const blogData = await blogsService.getById(parseInt(blogId));
      setBlog(blogData);
    } catch (err) {
      setError("Failed to load blog. Please try again.");
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${blog?.title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(true);
      await blogsService.delete(parseInt(blogId));
      toast.success("Blog deleted successfully");
      navigate("/cms");
    } catch (err) {
      toast.error("Failed to delete blog");
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return <Loading type="page" />;
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error 
          message={error || "Blog not found"} 
          onRetry={loadBlog} 
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-surface to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
                  <ApperIcon name={blog.icon} className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <span className="inline-block bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm mb-2">
                    {blog.category}
                  </span>
                  {blog.featured && (
                    <span className="inline-block bg-accent/10 text-accent px-3 py-1 rounded-full text-sm ml-2 mb-2">
                      Featured
                    </span>
                  )}
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
                {blog.title}
              </h1>
              
              <p className="text-xl text-neutral-600 mb-6">
                {blog.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
                <div className="flex items-center gap-2">
                  <ApperIcon name="User" className="w-4 h-4" />
                  <span>{blog.author || "Anonymous"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Calendar" className="w-4 h-4" />
                  <span>{new Date(blog.publishDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <ApperIcon name="Clock" className="w-4 h-4" />
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                icon="ArrowLeft"
                onClick={() => navigate("/cms")}
              >
                Back to CMS
              </Button>
              <Link to={`/cms/edit/${blog.Id}`}>
                <Button variant="secondary" icon="Edit">
                  Edit
                </Button>
              </Link>
              <Button
                variant="outline"
                icon="Trash2"
                onClick={handleDelete}
                loading={deleteLoading}
                className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg prose-neutral max-w-none"
          >
            <div 
              dangerouslySetInnerHTML={{ __html: blog.content }}
              className="blog-content"
            />
          </motion.article>
          
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Metadata */}
          <div className="mt-8 p-6 bg-neutral-50 rounded-xl">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">Blog Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-neutral-700">Created:</span>
                <span className="ml-2 text-neutral-600">
                  {new Date(blog.createdAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Last Updated:</span>
                <span className="ml-2 text-neutral-600">
                  {new Date(blog.updatedAt).toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Blog ID:</span>
                <span className="ml-2 text-neutral-600">{blog.Id}</span>
              </div>
              <div>
                <span className="font-medium text-neutral-700">Status:</span>
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                  blog.featured 
                    ? "bg-accent/10 text-accent" 
                    : "bg-neutral-200 text-neutral-600"
                }`}>
                  {blog.featured ? "Featured" : "Standard"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogDetail;