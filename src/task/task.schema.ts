import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'tasks' })
export class Task extends Document {
  @Prop({ required: true, maxLength: 255 })
  title: string;

  @Prop({ required: true, maxLength: 255 })
  description: string;

  @Prop({ required: true })
  status: boolean;

  @Prop({ type: Date, required: false, default: null })
  completedAt: Date;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
