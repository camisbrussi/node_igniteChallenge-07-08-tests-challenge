import { Statement } from "../../entities/Statement";

export type IGetTransferOperationDTO =
Pick<
  Statement,
  'sender_id' |
  'user_id' |
  'amount' |
  'description'
>
