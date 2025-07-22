import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import blogsService from "@/services/api/blogsService";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [deleteLoading, setDeleteLoading] = useState(null);
  const navigate = useNavigate();

  const categories = ["All", "Guide", "Best Practices", "Compliance", "Tool", "Research", "Tutorial"];

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setError("");
      const blogsData = await blogsService.getAll();
      setBlogs(blogsData);
    } catch (err) {
      setError("Failed to load blogs. Please try again.");
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      setDeleteLoading(id);
      await blogsService.delete(id);
      setBlogs(prev => prev.filter(blog => blog.Id !== id));
      toast.success("Blog deleted successfully");
    } catch (err) {
      toast.error("Failed to delete blog");
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredBlogs = selectedCategory === "All" 
    ? blogs 
    : blogs.filter(blog => blog.category === selectedCategory);

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadBlogs} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-surface to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 mb-4">
                Blog <span className="gradient-text">Management</span>
              </h1>
              <p className="text-xl text-neutral-600">
                Create, edit, and manage your blog content
              </p>
            </div>
            <div className="flex gap-3">
              <Link to="/resources">
                <Button variant="outline" icon="Eye">
                  View Public
                </Button>
              </Link>
              <Link to="/cms/create">
                <Button variant="primary" icon="Plus">
                  Create Blog
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Categories */}
      <section className="py-8 border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Blogs Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-16">
              <ApperIcon name="FileText" className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-neutral-600 mb-2">No blogs found</h3>
              <p className="text-neutral-500 mb-6">
                {selectedCategory === "All" 
                  ? "Get started by creating your first blog post"
                  : `No blogs found in the "${selectedCategory}" category`
                }
              </p>
              {selectedCategory === "All" && (
                <Link to="/cms/create">
                  <Button variant="primary" icon="Plus">
                    Create Your First Blog
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, index) => (
                <motion.div
                  key={blog.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                        <ApperIcon name={blog.icon} className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                        {blog.category}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    
                    <p className="text-neutral-600 mb-4 leading-relaxed line-clamp-3">
                      {blog.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-neutral-500 flex items-center">
                        <ApperIcon name="Clock" className="w-4 h-4 mr-1" />
                        {blog.readTime}
                      </span>
                      <span className="text-sm text-neutral-500 flex items-center">
                        <ApperIcon name="Calendar" className="w-4 h-4 mr-1" />
                        {new Date(blog.publishDate).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
                      <div className="flex items-center gap-2">
                        <Link 
                          to={`/cms/blog/${blog.Id}`}
                          className="text-primary hover:text-secondary transition-colors"
                          title="View Blog"
                        >
                          <ApperIcon name="Eye" className="w-5 h-5" />
                        </Link>
                        <Link 
                          to={`/cms/edit/${blog.Id}`}
                          className="text-neutral-500 hover:text-primary transition-colors"
                          title="Edit Blog"
                        >
                          <ApperIcon name="Edit" className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(blog.Id, blog.title)}
                          disabled={deleteLoading === blog.Id}
                          className="text-neutral-500 hover:text-red-500 transition-colors disabled:opacity-50"
                          title="Delete Blog"
                        >
                          {deleteLoading === blog.Id ? (
                            <ApperIcon name="Loader2" className="w-5 h-5 animate-spin" />
                          ) : (
                            <ApperIcon name="Trash2" className="w-5 h-5" />
                          )}
                        </button>
                      </div>
                      {blog.featured && (
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default BlogList;