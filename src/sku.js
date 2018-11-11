import ModelUtils, { BaseModel, BaseModelList } from './_base';
import ProductUtils from './product';

export class SKU extends BaseModel {
	static resource = 'skus';

	_updateData({
		id,
		attributes,
		inventory,
		price,
		metadata,
		product,
	}) {
		this.id = id;
		this.attributes = attributes;
		this.inventory = inventory;
		this.price = price;
		this.metadata = metadata;
		this.product_id = product;

		return this;
	}

	toJSON() {
		return {
			id: this.id,
			attributes: this.attributes,
			inventory: this.inventory,
			price: this.price,
		};
	}

	get product() {
		return ProductUtils.findOne({ id: this.product_id });
	}
}

export class SKUList extends BaseModelList {
	static Item = SKU;
}

export default {
	async findOne({ id }) {
		return ModelUtils.findOne(SKU, id);
	},

	async findAll(params) {
		return ModelUtils.findAll(SKUList, params);
	},
};
