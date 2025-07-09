const { logger } = require('@librechat/data-schemas');
const { ObjectId } = require('mongoose').Types;

/**
 * Base CRUD service class that provides common CRUD operations
 * @abstract
 */
module.exports = class CRUDService {
  constructor(model) {
    this.model = model;
  }

  /**
   * Create a new record
   * @param {Object} data - The data to create
   * @returns {Promise<Object>} The created record
   */
  async create(data) {
    try {
      const record = await this.model.create(data);
      logger.info(`Created ${this.constructor.name}: ${record._id}`);
      return record;
    } catch (error) {
      logger.error(`Error creating ${this.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Read a record by ID
   * @param {string|ObjectId} id - The record ID
   * @returns {Promise<Object|null>} The found record or null
   */
  async read(id) {
    try {
      const record = await this.model.findById(id);
      if (!record) {
        logger.warn(`Record not found: ${id}`);
        return null;
      }
      logger.info(`Read ${this.constructor.name}: ${id}`);
      return record;
    } catch (error) {
      logger.error(`Error reading ${this.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Update a record by ID
   * @param {string|ObjectId} id - The record ID
   * @param {Object} data - The data to update
   * @returns {Promise<Object|null>} The updated record or null
   */
  async update(id, data) {
    try {
      const record = await this.model.findByIdAndUpdate(id, data, { new: true });
      if (!record) {
        logger.warn(`Record not found: ${id}`);
        return null;
      }
      logger.info(`Updated ${this.constructor.name}: ${id}`);
      return record;
    } catch (error) {
      logger.error(`Error updating ${this.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * Delete a record by ID
   * @param {string|ObjectId} id - The record ID
   * @returns {Promise<boolean>} True if deleted successfully
   */
  async delete(id) {
    try {
      const result = await this.model.findByIdAndDelete(id);
      if (!result) {
        logger.warn(`Record not found: ${id}`);
        return false;
      }
      logger.info(`Deleted ${this.constructor.name}: ${id}`);
      return true;
    } catch (error) {
      logger.error(`Error deleting ${this.constructor.name}:`, error);
      throw error;
    }
  }

  /**
   * List records with pagination
   * @param {Object} options - Query options
   * @param {number} options.limit - Number of records to return
   * @param {number} options.skip - Number of records to skip
   * @param {Object} options.filter - Filter conditions
   * @returns {Promise<{count: number, items: Array}>} Paginated results
   */
  async list({ limit = 10, skip = 0, filter = {} }) {
    try {
      const [items, count] = await Promise.all([
        this.model.find(filter).limit(limit).skip(skip),
        this.model.countDocuments(filter)
      ]);
      logger.info(`Listed ${items.length} ${this.constructor.name}s`);
      return { count, items };
    } catch (error) {
      logger.error(`Error listing ${this.constructor.name}s:`, error);
      throw error;
    }
  }

  /**
   * Validate a record ID
   * @param {string|ObjectId} id - The record ID
   * @returns {boolean} True if ID is valid
   */
  validateId(id) {
    return ObjectId.isValid(id);
  }
}
