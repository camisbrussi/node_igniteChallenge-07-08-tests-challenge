import { Request, Response } from "express";
import { container } from "tsyringe";
import { GetTransferOperationUseCase } from "./GetTransferOperationUseCase";



class GetTransferOperationController {

 async handle(request: Request, response: Response): Promise<Response> {
  const sender_id = request.user.id;
  const { user_id } = request.params;
  const { amount, description } = request.body;

  const getTransferOperationUseCase = container.resolve(GetTransferOperationUseCase);

  const transfer = await getTransferOperationUseCase.execute({
   sender_id,
   user_id,
   amount,
   description
  })

  return response.json(transfer)
 }
}
export { GetTransferOperationController }
