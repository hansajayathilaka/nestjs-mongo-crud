import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import BaseService from '../utils/base.service';

import { Category } from './category.schema';

@Injectable()
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<Category>,
  ) {
    super(categoryModel);
  }
}
