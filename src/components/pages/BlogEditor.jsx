import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import blogsService from "@/services/api/blogsService";

const BlogEditor = () => {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(blogId);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    category: "Guide",
    readTime: "",
    icon: "BookOpen",
    author: "",
    tags: "",
    featured: false
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const categories = ["Guide", "Best Practices", "Compliance", "Tool", "Research", "Tutorial"];
  const icons = [
    "BookOpen", "Calendar", "Shield", "Calculator", "TrendingUp", "Settings",
    "FileText", "Users", "Heart", "Star", "CheckCircle", "AlertCircle"
  ];

  useEffect(() => {
    if (isEditing) {
      loadBlog();
    }
  }, [blogId]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      setError("");
      const blog = await blogsService.getById(parseInt(blogId));
      setFormData({
        title: blog.title || "",
        description: blog.description || "",
        content: blog.content || "",
        category: blog.category || "Guide",
        readTime: blog.readTime || "",
        icon: blog.icon || "BookOpen",
        author: blog.author || "",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : (blog.tags || ""),
        featured: blog.featured || false
      });
    } catch (err) {
      setError("Failed to load blog. Please try again.");
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Description is required");
      return;
    }
    
    if (!formData.content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setSaving(true);
      
      const blogData = {
        ...formData,
        tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
        content: formData.content
      };

      if (isEditing) {
        await blogsService.update(parseInt(blogId), blogData);
        toast.success("Blog updated successfully");
      } else {
        await blogsService.create(blogData);
        toast.success("Blog created successfully");
      }
      
      navigate("/cms");
    } catch (err) {
      toast.error(isEditing ? "Failed to update blog" : "Failed to create blog");
    } finally {
      setSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      ['link', 'image'],
      [{ 'align': [] }],
      ['clean']
    ],
  };

  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent', 'link', 'image', 'align'
  ];

  if (loading) {
    return <Loading type="page" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Error message={error} onRetry={loadBlog} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-surface to-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2">
                {isEditing ? "Edit Blog" : "Create New Blog"}
              </h1>
              <p className="text-neutral-600">
                {isEditing ? "Update your blog content" : "Share your insights with the community"}
              </p>
            </div>
            <Button
              variant="outline"
              icon="ArrowLeft"
              onClick={() => navigate("/cms")}
            >
              Back to CMS
            </Button>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Title"
                    placeholder="Enter blog title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Input
                    label="Description"
                    placeholder="Brief description of the blog"
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <Input
                    label="Read Time"
                    placeholder="e.g., 5 min read"
                    value={formData.readTime}
                    onChange={(e) => handleInputChange("readTime", e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={formData.icon}
                    onChange={(e) => handleInputChange("icon", e.target.value)}
                    className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                  >
                    {icons.map(icon => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                  <div className="mt-2 flex items-center gap-2 text-sm text-neutral-600">
                    <span>Preview:</span>
                    <ApperIcon name={formData.icon} className="w-5 h-5 text-primary" />
                  </div>
                </div>
                
                <div>
                  <Input
                    label="Author"
                    placeholder="Author name"
                    value={formData.author}
                    onChange={(e) => handleInputChange("author", e.target.value)}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <Input
                    label="Tags"
                    placeholder="Comma-separated tags (e.g., AI, Technology, Healthcare)"
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    helper="Separate multiple tags with commas"
                  />
                </div>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => handleInputChange("featured", e.target.checked)}
                    className="w-5 h-5 text-primary focus:ring-primary/50 border-neutral-300 rounded"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-neutral-700">
                    Featured Blog
                  </label>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Content</h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-neutral-700">
                  Blog Content *
                </label>
                <div className="border border-neutral-300 rounded-lg overflow-hidden">
                  <ReactQuill
                    theme="snow"
                    value={formData.content}
                    onChange={(content) => handleInputChange("content", content)}
                    modules={quillModules}
                    formats={quillFormats}
                    placeholder="Write your blog content here..."
                    style={{ minHeight: '400px' }}
                  />
                </div>
                <p className="text-sm text-neutral-500">
                  Use the rich text editor to format your content. You can add headings, lists, links, and images.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/cms")}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={saving}
                icon={isEditing ? "Save" : "Plus"}
              >
                {saving 
                  ? (isEditing ? "Updating..." : "Creating...") 
                  : (isEditing ? "Update Blog" : "Create Blog")
                }
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default BlogEditor;