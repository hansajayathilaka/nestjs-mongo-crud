import {
  CreateManyDto,
  CrudRequest,
  CrudService,
  GetManyDefaultResponse,
} from '@nestjsx/crud';
import { Model, Require_id } from 'mongoose';

class BaseService<T> extends CrudService<T> {
  constructor(readonly model: Model<T>) {
    super();
  }

  public async createMany(req: CrudRequest, dto: CreateManyDto): Promise<T[]> {
    const objs = await this.model.insertMany(dto.bulk);
    return this.serializeMany(objs);
  }

  public async createOne(req: CrudRequest, dto: T): Promise<T> {
    const obj = await this.model.create(dto);
    return this.serialize(obj);
  }

  public async deleteOne(req: CrudRequest): Promise<void | T> {
    const obj = await this.model.findOneAndDelete({
      _id: req.parsed.paramsFilter[0].value,
    });
    return this.serialize(obj);
  }

  async getMany(req: CrudRequest): Promise<GetManyDefaultResponse<T> | T[]> {
    const objs = await this.model.find().exec();
    return this.serializeMany(objs);
  }

  async getOne(req: CrudRequest): Promise<T> {
    const obj = await this.model
      .findOne({ _id: req.parsed.paramsFilter[0].value })
      .exec();
    return this.serialize(obj);
  }

  async recoverOne(req: CrudRequest): Promise<void | T> {
    const obj = await this.model.updateOne(
      {
        _id: req.parsed.paramsFilter[0].value,
      },
      {
        deletedAt: null,
      },
    );
    return this.serialize(obj);
  }

  async replaceOne(req: CrudRequest, dto: T): Promise<T> {
    const obj = await this.model
      .findOneAndReplace(
        { _id: req.parsed.paramsFilter[0].value },
        dto as Require_id<T>,
        {
          new: true,
        },
      )
      .exec();
    return this.serialize(obj);
  }

  async updateOne(req: CrudRequest, dto: T): Promise<T> {
    const obj = await this.model
      .findOneAndUpdate(
        { _id: req.parsed.paramsFilter[0].value },
        dto as Require_id<T>,
        {
          new: true,
        },
      )
      .exec();
    return this.serialize(obj);
  }

  protected serialize(obj: any) {
    return obj.toObject();
  }

  protected serializeMany(objs: any[]) {
    return objs.map((obj) => obj.toObject());
  }
}

export default BaseService;
