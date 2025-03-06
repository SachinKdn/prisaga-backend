interface IResponse {
    success: boolean;
    message?: string;
    data: object | null | any;
  }
export interface BaseSchema{
  _id: string;
  createdAt: string;
  updatedAt: string;
}
  export type ErrorResponse = IResponse & {
    status: number;
  };
  
  export const createResponse = (
    data: IResponse["data"],
    message?: string
  ): IResponse => {
    return { data, message, success: true };
  };