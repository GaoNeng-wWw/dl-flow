import { Label, Port, Property } from '@app/shared';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ autoCreate: true })
export class Material {
  @Prop({ type: () => Object })
  label: Label;
  @Prop({ type: () => String })
  id: string;
  @Prop({ type: () => String })
  desc: string;
  @Prop({ type: () => Boolean })
  nn: boolean;
  @Prop({ type: () => Array })
  properties: Property[];
  @Prop({ type: () => String })
  mode: string;
  @Prop({ type: () => Array })
  ports: Port[];
  @Prop({ type: () => String })
  shape: string;
  @Prop({ type: () => Boolean })
  onlyIn: boolean;
  @Prop({ type: () => Boolean })
  onlyOut: boolean;
}

export const MaterialSchema = SchemaFactory.createForClass(Material);
