import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import BaseService from "../utils/base.service";

import { Category } from "./category.schema";

@Injectable()
export class CategoriesService extends BaseService<Category> {
  constructor(@InjectModel(Category.name) model: Model<Category>) {
    super(model);
  }
}
