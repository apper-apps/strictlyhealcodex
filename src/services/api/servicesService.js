import { toast } from 'react-toastify';

const servicesService = {
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
          { "field": { "Name": "description" } },
          { "field": { "Name": "icon" } },
          { "field": { "Name": "features" } },
          { "field": { "Name": "benefits" } }
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

      const response = await apperClient.fetchRecords('service', params);

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
        console.error("Error fetching services:", error?.response?.data?.message);
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
          { "field": { "Name": "description" } },
          { "field": { "Name": "icon" } },
          { "field": { "Name": "features" } },
          { "field": { "Name": "benefits" } }
        ]
      };

      const response = await apperClient.getRecordById('service', parseInt(id), params);

      if (!response || !response.data) {
        throw new Error("Service not found");
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching service with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async create(serviceData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      // Only include Updateable fields
      const updateableData = {
        Name: serviceData.Name || serviceData.name,
        Tags: serviceData.Tags,
        Owner: parseInt(serviceData.Owner),
        description: serviceData.description,
        icon: serviceData.icon,
        features: serviceData.features,
        benefits: serviceData.benefits
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.createRecord('service', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create service ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);

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
        console.error("Error creating service:", error?.response?.data?.message);
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
        description: updateData.description,
        icon: updateData.icon,
        features: updateData.features,
        benefits: updateData.benefits
      };

      const params = {
        records: [updateableData]
      };

      const response = await apperClient.updateRecord('service', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Service update failed");
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update service ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);

          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
            if (record.message) toast.error(record.message);
          });
          throw new Error("Service update failed");
        }

        if (successfulUpdates.length > 0) {
          return successfulUpdates[0].data;
        }
      }

      throw new Error("Service update failed");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating service:", error?.response?.data?.message);
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

      const response = await apperClient.deleteRecord('service', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Service deletion failed");
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete service ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);

          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Service deletion failed");
        }

        return successfulDeletions.length > 0;
      }

      throw new Error("Service deletion failed");
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting service:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  }
};

export default servicesService;