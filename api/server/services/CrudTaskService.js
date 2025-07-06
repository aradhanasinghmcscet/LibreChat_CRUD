const Task = require('~/models/CrudTask');

const CrudTaskService = {
  create: async (data) => {
    try {
      const task = new Task(data);
      return await task.save();
    } catch (error) {
      throw new Error(`Failed to create task: ${error.message}`);
    }
  },

  get: async (id) => {
    try {
      const task = await Task.findById(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      throw new Error(`Failed to get task: ${error.message}`);
    }
  },

  list: async ({ limit, page, filters }) => {
    try {
      const query = {};
      
      if (filters.title) {
        query.title = { $regex: filters.title, $options: 'i' };
      }
      if (filters.status) {
        query.status = filters.status;
      }
      if (filters.dueDate) {
        query.dueDate = { $gte: new Date(filters.dueDate) };
      }

      const total = await Task.countDocuments(query);
      const tasks = await Task.find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .sort({ createdAt: -1 });

      return {
        data: tasks,
        total,
        page,
        totalPages: Math.ceil(total / limit)
      };
    } catch (error) {
      throw new Error(`Failed to list tasks: ${error.message}`);
    }
  },

  update: async (id, data) => {
    try {
      const task = await Task.findByIdAndUpdate(id, data, { new: true });
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      throw new Error(`Failed to update task: ${error.message}`);
    }
  },

  delete: async (id) => {
    try {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        throw new Error('Task not found');
      }
      return task;
    } catch (error) {
      throw new Error(`Failed to delete task: ${error.message}`);
    }
  }
};

module.exports = CrudTaskService;
