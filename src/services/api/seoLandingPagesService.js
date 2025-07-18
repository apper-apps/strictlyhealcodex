import seoLandingPagesData from '@/services/mockData/seoLandingPages.json';

let data = [...seoLandingPagesData];
let lastId = Math.max(...data.map(item => item.Id));

const seoLandingPagesService = {
  getAll: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...data]);
      }, 200);
    });
  },

  getById: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = data.find(item => item.Id === parseInt(id));
        resolve(item ? { ...item } : null);
      }, 200);
    });
  },

  getBySlug: (slug) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const item = data.find(item => item.slug === slug);
        resolve(item ? { ...item } : null);
      }, 200);
    });
  },

  create: (item) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newItem = {
          ...item,
          Id: ++lastId
        };
        data.push(newItem);
        resolve({ ...newItem });
      }, 200);
    });
  },

  update: (id, updatedItem) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = data.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          data[index] = { ...data[index], ...updatedItem, Id: parseInt(id) };
          resolve({ ...data[index] });
        } else {
          resolve(null);
        }
      }, 200);
    });
  },

  delete: (id) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = data.findIndex(item => item.Id === parseInt(id));
        if (index !== -1) {
          const deletedItem = data.splice(index, 1)[0];
          resolve({ ...deletedItem });
        } else {
          resolve(null);
        }
      }, 200);
    });
  }
};

export default seoLandingPagesService;