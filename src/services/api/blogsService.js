import { toast } from 'react-toastify';

const blogsService = {
  async getAll() {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        "fields": [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "CreatedBy" } },
          { "field": { "Name": "ModifiedOn" } },
          { "field": { "Name": "ModifiedBy" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "content" } },
          { "field": { "Name": "category" } },
          { "field": { "Name": "readTime" } },
          { "field": { "Name": "icon" } },
          { "field": { "Name": "author" } },
          { "field": { "Name": "publishDate" } },
          { "field": { "Name": "featured" } },
          { "field": { "Name": "createdAt" } },
          { "field": { "Name": "updatedAt" } }
        ],
        "orderBy": [
          {
            "fieldName": "createdAt",
            "sorttype": "DESC"
          }
        ],
        "pagingInfo": {
          "limit": 50,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords('blog', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      if (!response.data || response.data.length === 0) {
        return [];
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching blogs:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error('Invalid blog ID');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          { "field": { "Name": "Name" } },
          { "field": { "Name": "Tags" } },
          { "field": { "Name": "Owner" } },
          { "field": { "Name": "CreatedOn" } },
          { "field": { "Name": "CreatedBy" } },
          { "field": { "Name": "ModifiedOn" } },
          { "field": { "Name": "ModifiedBy" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "description" } },
          { "field": { "Name": "content" } },
          { "field": { "Name": "category" } },
          { "field": { "Name": "readTime" } },
          { "field": { "Name": "icon" } },
          { "field": { "Name": "author" } },
          { "field": { "Name": "publishDate" } },
          { "field": { "Name": "featured" } },
          { "field": { "Name": "createdAt" } },
          { "field": { "Name": "updatedAt" } }
        ]
      };

      const response = await apperClient.getRecordById('blog', parsedId, params);

      if (!response || !response.data) {
        throw new Error('Blog not found');
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching blog with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(blogData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: blogData.Name || blogData.title,
        Tags: blogData.Tags,
        Owner: parseInt(blogData.Owner),
        title: blogData.title,
        description: blogData.description,
        content: blogData.content,
        category: blogData.category,
        readTime: blogData.readTime,
        icon: blogData.icon,
        author: blogData.author,
        publishDate: blogData.publishDate || new Date().toISOString().split('T')[0],
        featured: blogData.featured || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('blog', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create blog ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulRecords.length > 0) {
          return successfulRecords[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating blog:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error('Invalid blog ID');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableData = {
        Id: parsedId,
        Name: updateData.Name || updateData.title,
        Tags: updateData.Tags,
        Owner: parseInt(updateData.Owner),
        title: updateData.title,
        description: updateData.description,
        content: updateData.content,
        category: updateData.category,
        readTime: updateData.readTime,
        icon: updateData.icon,
        author: updateData.author,
        publishDate: updateData.publishDate,
        featured: updateData.featured,
        updatedAt: new Date().toISOString()
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('blog', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Blog update failed');
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update blog ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error('Blog update failed');
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error('Blog update failed');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating blog:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async delete(id) {
    try {
      const parsedId = parseInt(id);
      if (isNaN(parsedId)) {
        throw new Error('Invalid blog ID');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parsedId]
      };

      const response = await apperClient.deleteRecord('blog', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error('Blog deletion failed');
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete blog ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error('Blog deletion failed');
        }

        return successfulDeletions.length > 0;
      }

      throw new Error('Blog deletion failed');
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting blog:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default blogsService;