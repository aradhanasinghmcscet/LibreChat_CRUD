const { expect } = require('chai');
const sinon = require('sinon');
const { Example } = require('@librechat/data-schemas');
const ExampleService = require('./ExampleService');

describe('ExampleService', () => {
  let exampleService;
  let mockModel;
  let mockLogger;

  beforeEach(() => {
    mockModel = {
      create: sinon.stub(),
      findById: sinon.stub(),
      findByIdAndUpdate: sinon.stub(),
      findByIdAndDelete: sinon.stub(),
      find: sinon.stub(),
      countDocuments: sinon.stub(),
      deleteMany: sinon.stub()
    };

    mockLogger = {
      info: sinon.stub(),
      error: sinon.stub(),
      warn: sinon.stub()
    };

    // Mock mongoose.Types.ObjectId
    sinon.stub(require('mongoose').Types, 'ObjectId').isValid.returns(true);

    // Mock logger
    sinon.stub(require('@librechat/data-schemas'), 'logger').value(mockLogger);

    exampleService = new ExampleService();
    exampleService.model = mockModel;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('create', () => {
    it('should create a new example', async () => {
      const data = { name: 'Test Example', status: 'active' };
      const mockExample = { _id: '123', ...data };
      mockModel.create.resolves(mockExample);

      const result = await exampleService.create(data);
      expect(result).to.deep.equal(mockExample);
      expect(mockModel.create.calledOnce).to.be.true;
    });

    it('should throw error if name is missing', async () => {
      const data = { status: 'active' };
      await expect(exampleService.create(data)).to.be.rejectedWith('Name is required');
    });
  });

  describe('read', () => {
    it('should read an example by ID', async () => {
      const id = '123';
      const mockExample = { _id: id, name: 'Test Example' };
      mockModel.findById.resolves(mockExample);

      const result = await exampleService.read(id);
      expect(result).to.deep.equal(mockExample);
      expect(mockModel.findById.calledOnce).to.be.true;
    });

    it('should return null if example not found', async () => {
      const id = '123';
      mockModel.findById.resolves(null);

      const result = await exampleService.read(id);
      expect(result).to.be.null;
    });
  });

  describe('update', () => {
    it('should update an example', async () => {
      const id = '123';
      const data = { status: 'inactive' };
      const mockExample = { _id: id, name: 'Test Example', ...data };
      mockModel.findByIdAndUpdate.resolves(mockExample);

      const result = await exampleService.update(id, data);
      expect(result).to.deep.equal(mockExample);
      expect(mockModel.findByIdAndUpdate.calledOnce).to.be.true;
    });

    it('should return null if example not found', async () => {
      const id = '123';
      const data = { status: 'inactive' };
      mockModel.findByIdAndUpdate.resolves(null);

      const result = await exampleService.update(id, data);
      expect(result).to.be.null;
    });
  });

  describe('delete', () => {
    it('should delete an example', async () => {
      const id = '123';
      mockModel.findByIdAndDelete.resolves({ _id: id });

      const result = await exampleService.delete(id);
      expect(result).to.be.true;
      expect(mockModel.findByIdAndDelete.calledOnce).to.be.true;
    });

    it('should return false if example not found', async () => {
      const id = '123';
      mockModel.findByIdAndDelete.resolves(null);

      const result = await exampleService.delete(id);
      expect(result).to.be.false;
    });
  });

  describe('list', () => {
    it('should list examples with pagination', async () => {
      const items = [
        { _id: '1', name: 'Example 1' },
        { _id: '2', name: 'Example 2' }
      ];
      const count = 2;
      mockModel.find.resolves(items);
      mockModel.countDocuments.resolves(count);

      const result = await exampleService.list({ limit: 10, skip: 0 });
      expect(result).to.deep.equal({ count, items });
    });
  });
});
