import { DecimalJsLike } from "@prisma/client/runtime/library";
import { Decimal } from "decimal.js";

function toDecimal(value: string | number | Decimal | DecimalJsLike): Decimal {
  if (value instanceof Decimal) {
    return value;
  }
  return new Decimal(Number(value));
}

export default toDecimal;
