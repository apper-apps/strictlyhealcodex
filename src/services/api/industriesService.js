import { toast } from 'react-toastify';

const industriesService = {
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
          { "field": { "Name": "challenges" } },
          { "field": { "Name": "solutions" } },
          { "field": { "Name": "caseStudyId" } }
        ],
        "orderBy": [
          {
            "fieldName": "Name",
            "sorttype": "ASC"
          }
        ],
        "pagingInfo": {
          "limit": 50,
          "offset": 0
        }
      };

      const response = await apperClient.fetchRecords('industry', params);

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
        console.error("Error fetching industries:", error?.response?.data?.message);
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
          { "field": { "Name": "challenges" } },
          { "field": { "Name": "solutions" } },
          { "field": { "Name": "caseStudyId" } }
        ]
      };

      const response = await apperClient.getRecordById('industry', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Industry not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching industry with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(industryData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: industryData.Name || industryData.name,
        Tags: industryData.Tags,
        Owner: parseInt(industryData.Owner),
        challenges: industryData.challenges,
        solutions: industryData.solutions,
        caseStudyId: industryData.caseStudyId
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('industry', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create industry ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

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
        console.error("Error creating industry:", error?.response?.data?.message);
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
        Name: updateData.Name || updateData.name,
        Tags: updateData.Tags,
        Owner: parseInt(updateData.Owner),
        challenges: updateData.challenges,
        solutions: updateData.solutions,
        caseStudyId: updateData.caseStudyId
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('industry', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Industry update failed");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update industry ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Industry update failed");
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error("Industry update failed");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating industry:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('industry', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Industry deletion failed");
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete industry ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Industry deletion failed");
        }

        return successfulDeletions.length > 0;
      }

      throw new Error("Industry deletion failed");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting industry:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default industriesService;