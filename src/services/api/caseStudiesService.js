import { toast } from 'react-toastify';

const caseStudiesService = {
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
          { "field": { "Name": "practiceType" } },
          { "field": { "Name": "practiceName" } },
          { "field": { "Name": "metrics" } },
          { "field": { "Name": "testimonial" } },
          { "field": { "Name": "imageUrl" } }
        ],
        "orderBy": [
          {
            "fieldName": "CreatedOn",
            "sorttype": "DESC"
          }
        ],
        "pagingInfo": {
          "limit": 50,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords('case_study', params);

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
        console.error("Error fetching case studies:", error?.response?.data?.message);
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
          { "field": { "Name": "practiceType" } },
          { "field": { "Name": "practiceName" } },
          { "field": { "Name": "metrics" } },
          { "field": { "Name": "testimonial" } },
          { "field": { "Name": "imageUrl" } }
        ]
      };

      const response = await apperClient.getRecordById('case_study', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Case study not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching case study with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(caseStudyData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: caseStudyData.Name || caseStudyData.practiceName,
        Tags: caseStudyData.Tags,
        Owner: parseInt(caseStudyData.Owner),
        practiceType: caseStudyData.practiceType,
        practiceName: caseStudyData.practiceName,
        metrics: caseStudyData.metrics,
        testimonial: caseStudyData.testimonial,
        imageUrl: caseStudyData.imageUrl
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('case_study', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create case study ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

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
        console.error("Error creating case study:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields plus Id
      const updateableData = {
        Id: parseInt(id),
        Name: updateData.Name || updateData.practiceName,
        Tags: updateData.Tags,
        Owner: parseInt(updateData.Owner),
        practiceType: updateData.practiceType,
        practiceName: updateData.practiceName,
        metrics: updateData.metrics,
        testimonial: updateData.testimonial,
        imageUrl: updateData.imageUrl
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('case_study', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Case study update failed");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update case study ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Case study update failed");
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error("Case study update failed");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating case study:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
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

      const response = await apperClient.deleteRecord('case_study', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Case study deletion failed");
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete case study ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Case study deletion failed");
        }

        return successfulDeletions.length > 0;
      }

      throw new Error("Case study deletion failed");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting case study:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default caseStudiesService;