import { NotFound as NotFoundError } from 'http-errors';
import stripe from './index';

export class BaseModel {
	static from(object = {}) {
		return new this(object);
	}

	constructor(data) {
		this._updateData(data);
	}

	_updateData(data) {
	}

	async updateMetadata(metadata) {
		const data = await stripe[this.constructor.resource].update(this.id, {
			metadata: {
				...this.metadata,
				metadata,
			},
		});

		return this._updateData(data);
	}

	toJSON() {
		return this._data;
	}
}

export class BaseModelList {
	static Item = BaseModel;

	static from(objects = []) {
		return new this(objects.map(v => this.Item.from(v)));
	}

	constructor(items) {
		this._items = Array.from(items || []);
	}

	get length() {
		return this._items.length;
	}

	[Symbol.iterator]() {
		return this._items[Symbol.iterator]();
	}

	toJSON() {
		return this._items;
	}
}

export default {
	async findOne(Model, id) {
		let result;
		try {
			result = await stripe[Model.resource].retrieve(id);
		}
		catch (raw) {
			const error = new NotFoundError(`${Model.name} ${id} not found.`);
			error.raw = raw;
			throw error;
		}

		return Model.from(result);
	},

	async findOneByList(Model, params) {
		let result;
		try {
			result = await stripe[Model.resource].list({ limit: 1, ...params });
			result = result.data[0];
			if (!result) {
				throw new Error('ignore');
			}
		}
		catch (raw) {
			const error = new NotFoundError(`${Model.name} not found.`);
			error.raw = raw;
			throw error;
		}

		return Model.from(result);
	},

	async findAll(Model, params = {}) {
		let result;
		try {
			result = await stripe[Model.Item.resource].list(params);
			result = result.data;
		}
		catch (raw) {
			const error = new NotFoundError(`${Model.Item.name}s not found.`);
			error.raw = raw;
			throw error;
		}

		return Model.from(result);
	},
};
