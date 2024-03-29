import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsString,
} from 'class-validator';
import { Enum, Label, Property as TProperty } from '@app/shared';
import { Layer as LayerSchema } from '../layer/layer.schema';

class Meta {
  @IsString()
  start: string;
  @IsString()
  end: string;
}

class Property implements TProperty {
  id: string;
  label: Label;
  type: string;
  default: string | number | null | boolean;
  enums: Enum[];
  data: any;
}

class Material {
  @IsObject()
  label: Label;
  @IsString()
  id: string;
  @IsString()
  desc: string;
  @IsBoolean()
  nn: boolean;
  @IsArray()
  properties: Property[];
  @IsString()
  mode: string;
}

export class Layer extends LayerSchema {
  @IsString()
  id: string;
  @IsObject()
  lable: Label;
  @IsString()
  code: string;
  @IsString()
  clazz: string;
  @IsArray()
  properties: Property[];
  @IsString()
  mode: string;
}

export class Cell {
  @IsString()
  id: string;
  @IsString()
  shape: string;
  @IsObject()
  position: {
    x: number;
    y: number;
  };
  @IsObject()
  size: {
    width: number;
    height: number;
  };
  @IsObject()
  attrs: object;
  @IsNumber()
  zIndex: number;
  @IsObject()
  data: Material | Layer;
  @IsObject()
  children?: string[];
}
export class Edge {
  @IsString()
  id: string;
  @IsString()
  shape: string;
  @IsObject()
  source: {
    cell: string;
    port: string;
  };
  @IsObject()
  target: {
    cell: string;
    port: string;
  };
  @IsObject()
  attr: object;
  @IsNumber()
  zIndex: number;
  @IsString()
  parent: string;
}

export class GenerateCodeDto {
  @IsObject()
  meta: Meta;
  @IsObject()
  payload: {
    cells: (Cell | Edge)[];
    edges: Edge[];
  };
}
