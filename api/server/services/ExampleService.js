const CRUDService = require('./CRUDService');
const { Example } = require('@librechat/data-schemas');

/**
 * Example service that implements CRUD operations
 */
module.exports = class ExampleService extends CRUDService {
  constructor() {
    super(Example);
  }

  /**
   * Create a new example with additional validation
   * @param {Object} data - The data to create
   * @returns {Promise<Object>} The created example
   */
  async create(data) {
    // Add custom validation
    if (!data.name) {
      throw new Error('Name is required');
    }

    return super.create(data);
  }

  /**
   * Get examples by name
   * @param {string} name - The name to search for
   * @returns {Promise<Array>} Matching examples
   */
  async findByName(name) {
    try {
      const examples = await this.model.find({ name: { $regex: name, $options: 'i' } });
      logger.info(`Found ${examples.length} examples with name: ${name}`);
      return examples;
    } catch (error) {
      logger.error(`Error finding examples by name:`, error);
      throw error;
    }
  }

  /**
   * Get examples by status
   * @param {string} status - The status to filter by
   * @returns {Promise<Array>} Matching examples
   */
  async findByStatus(status) {
    try {
      const examples = await this.model.find({ status });
      logger.info(`Found ${examples.length} examples with status: ${status}`);
      return examples;
    } catch (error) {
      logger.error(`Error finding examples by status:`, error);
      throw error;
    }
  }

  /**
   * Update example status
   * @param {string|ObjectId} id - The example ID
   * @param {string} status - The new status
   * @returns {Promise<Object|null>} The updated example or null
   */
  async updateStatus(id, status) {
    return this.update(id, { status });
  }

  /**
   * Delete multiple examples by status
   * @param {string} status - The status to filter by
   * @returns {Promise<number>} Number of deleted examples
   */
  async deleteByStatus(status) {
    try {
      const result = await this.model.deleteMany({ status });
      logger.info(`Deleted ${result.deletedCount} examples with status: ${status}`);
      return result.deletedCount;
    } catch (error) {
      logger.error(`Error deleting examples by status:`, error);
      throw error;
    }
  }
}
