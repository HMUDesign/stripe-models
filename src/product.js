import ModelUtils, { BaseModel, BaseModelList } from './_base';
import SKUUtils from './sku';

export class Product extends BaseModel {
	static resource = 'products';

	_updateData({
		id,
		name,
		description,
		attributes,
		metadata,
	}) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.attributes = attributes;
		this.metadata = metadata;

		return this;
	}

	toJSON() {
		return {
			id: this.id,
			name: this.name,
			description: this.description,
			attributes: this.attributes,
		};
	}

	get skus() {
		return SKUUtils.findAll({ product: this.id });
	}
}

export class ProductList extends BaseModelList {
	static Item = Product;
}

export default {
	async findOne({ id }) {
		return ModelUtils.findOne(Product, id);
	},

	async findAll(params) {
		return ModelUtils.findAll(ProductList, params);
	},
};
