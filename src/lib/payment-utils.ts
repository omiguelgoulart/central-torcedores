import type { PaymentStatus } from "@/app/types/pagamentoItf";
import { PAYMENT_STATUS } from "@/lib/constants";

export function mapStatusToUiStatus(status: string): PaymentStatus {
    const s = status.toUpperCase();

    if (
        [
            PAYMENT_STATUS.CONFIRMED,
            PAYMENT_STATUS.RECEIVED,
            "RECEIVED_IN_CASH",
            PAYMENT_STATUS.APPROVED,
            PAYMENT_STATUS.PAID,
        ].includes(s)
    ) {
        return PAYMENT_STATUS.APPROVED;
    }

    if ([PAYMENT_STATUS.PENDING, "AWAITING", "IN_PROCESS"].includes(s)) {
        return PAYMENT_STATUS.PENDING;
    }

    if (["OVERDUE", PAYMENT_STATUS.EXPIRED].includes(s)) {
        return PAYMENT_STATUS.EXPIRED;
    }

    if (["CANCELLED", "REFUNDED", PAYMENT_STATUS.DECLINED].includes(s)) {
        return PAYMENT_STATUS.DECLINED;
    }

    return PAYMENT_STATUS.ERROR;
}
