import mockBlogs from '@/services/mockData/blogs.json';

// Simple in-memory storage for blogs
let blogs = [...mockBlogs];
let lastId = Math.max(...blogs.map(b => b.Id));

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const blogsService = {
  async getAll() {
    await delay(300);
    return [...blogs];
  },

  async getById(id) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid blog ID');
    }
    
    const blog = blogs.find(b => b.Id === parsedId);
    if (!blog) {
      throw new Error('Blog not found');
    }
    
    return { ...blog };
  },

  async create(blogData) {
    await delay(300);
    const newBlog = {
      ...blogData,
      Id: ++lastId,
      publishDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    blogs.push(newBlog);
    return { ...newBlog };
  },

  async update(id, updateData) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid blog ID');
    }
    
    const index = blogs.findIndex(b => b.Id === parsedId);
    if (index === -1) {
      throw new Error('Blog not found');
    }
    
    const updatedBlog = {
      ...blogs[index],
      ...updateData,
      Id: parsedId, // Prevent Id modification
      updatedAt: new Date().toISOString()
    };
    
    blogs[index] = updatedBlog;
    return { ...updatedBlog };
  },

  async delete(id) {
    await delay(300);
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) {
      throw new Error('Invalid blog ID');
    }
    
    const index = blogs.findIndex(b => b.Id === parsedId);
    if (index === -1) {
      throw new Error('Blog not found');
    }
    
    const deletedBlog = blogs[index];
    blogs.splice(index, 1);
    return { ...deletedBlog };
  }
};

export default blogsService;