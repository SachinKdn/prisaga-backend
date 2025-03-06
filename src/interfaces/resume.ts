import { BaseSchema } from "../helper/response";

export interface IResume extends BaseSchema {
    fileName: string;
    fileUrl: string;
    publicId: string;
}
