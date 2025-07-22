import { toast } from 'react-toastify';

const seoLandingPagesService = {
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
          { "field": { "Name": "slug" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "metaTitle" } },
          { "field": { "Name": "metaDescription" } },
          { "field": { "Name": "heroTitle" } },
          { "field": { "Name": "heroSubtitle" } },
          { "field": { "Name": "heroStats" } },
          { "field": { "Name": "benefits" } },
          { "field": { "Name": "challenges" } },
          { "field": { "Name": "solutions" } },
          { "field": { "Name": "relatedSpecialties" } },
          { "field": { "Name": "industryDetailSlug" } },
          { "field": { "Name": "caseStudyId" } }
        ],
        "pagingInfo": {
          "limit": 50,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords('seo_landing_page', params);

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
        console.error("Error fetching SEO landing pages:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
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
          { "field": { "Name": "slug" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "metaTitle" } },
          { "field": { "Name": "metaDescription" } },
          { "field": { "Name": "heroTitle" } },
          { "field": { "Name": "heroSubtitle" } },
          { "field": { "Name": "heroStats" } },
          { "field": { "Name": "benefits" } },
          { "field": { "Name": "challenges" } },
          { "field": { "Name": "solutions" } },
          { "field": { "Name": "relatedSpecialties" } },
          { "field": { "Name": "industryDetailSlug" } },
          { "field": { "Name": "caseStudyId" } }
        ]
      };

      const response = await apperClient.getRecordById('seo_landing_page', parseInt(id), params);

      if (!response || !response.data) {
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching SEO landing page with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async getBySlug(slug) {
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
          { "field": { "Name": "slug" } },
          { "field": { "Name": "title" } },
          { "field": { "Name": "metaTitle" } },
          { "field": { "Name": "metaDescription" } },
          { "field": { "Name": "heroTitle" } },
          { "field": { "Name": "heroSubtitle" } },
          { "field": { "Name": "heroStats" } },
          { "field": { "Name": "benefits" } },
          { "field": { "Name": "challenges" } },
          { "field": { "Name": "solutions" } },
          { "field": { "Name": "relatedSpecialties" } },
          { "field": { "Name": "industryDetailSlug" } },
          { "field": { "Name": "caseStudyId" } }
        ],
        "where": [
          {
            "FieldName": "slug",
            "Operator": "EqualTo",
            "Values": [slug]
          }
        ],
        "pagingInfo": {
          "limit": 1,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords('seo_landing_page', params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (!response.data || response.data.length === 0) {
        return null;
      }

      return response.data[0];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching SEO landing page with slug ${slug}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(item) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: item.Name,
        Tags: item.Tags,
        Owner: parseInt(item.Owner),
        slug: item.slug,
        title: item.title,
        metaTitle: item.metaTitle,
        metaDescription: item.metaDescription,
        heroTitle: item.heroTitle,
        heroSubtitle: item.heroSubtitle,
        heroStats: item.heroStats,
        benefits: item.benefits,
        challenges: item.challenges,
        solutions: item.solutions,
        relatedSpecialties: item.relatedSpecialties,
        industryDetailSlug: item.industryDetailSlug,
        caseStudyId: item.caseStudyId
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('seo_landing_page', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create SEO landing page ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

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
        console.error("Error creating SEO landing page:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updatedItem) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableData = {
        Id: parseInt(id),
        Name: updatedItem.Name,
        Tags: updatedItem.Tags,
        Owner: parseInt(updatedItem.Owner),
        slug: updatedItem.slug,
        title: updatedItem.title,
        metaTitle: updatedItem.metaTitle,
        metaDescription: updatedItem.metaDescription,
        heroTitle: updatedItem.heroTitle,
        heroSubtitle: updatedItem.heroSubtitle,
        heroStats: updatedItem.heroStats,
        benefits: updatedItem.benefits,
        challenges: updatedItem.challenges,
        solutions: updatedItem.solutions,
        relatedSpecialties: updatedItem.relatedSpecialties,
        industryDetailSlug: updatedItem.industryDetailSlug,
        caseStudyId: updatedItem.caseStudyId
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('seo_landing_page', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update SEO landing page ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating SEO landing page:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord('seo_landing_page', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete SEO landing page ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting SEO landing page:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  }
};

export default seoLandingPagesService;