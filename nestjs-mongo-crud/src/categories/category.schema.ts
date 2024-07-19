import { HydratedDocument, ObjectId, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { ApiProperty } from "@nestjs/swagger";

@Schema({
  timestamps: {
    createdAt: false,
    updatedAt: true,
  },
  versionKey: false,
})
export class Category {
  @ApiProperty({})
  @Prop({ required: true, unique: true })
  id: number;

  @ApiProperty({})
  @Prop({})
  name: string;

  @ApiProperty({})
  @Prop({})
  description: string;

  @ApiProperty({ })
  @Prop({ type: Types.ObjectId })
  qrCode: ObjectId;

  @ApiProperty({})
  @Prop({})
  isDeleted: boolean;
}

export type CategoryDocument = HydratedDocument<Category>;

export const CategorySchema = SchemaFactory.createForClass(Category);
