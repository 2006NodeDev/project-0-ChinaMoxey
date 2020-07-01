import { ReimbursementDTO } from "../dtos/reimbursement-dto";
import { Reimbursement } from "../models/Reimbursement";

export function ReimbursementDTOConvertor(redto:ReimbursementDTO): Reimbursement{
    return {
        reimbursementId: redto.reimbursementId,
        author: redto.author,
        amount: redto.amount,
        dateSubmitted: redto.dateSubmitted,
        dateResolved: redto.dateSubmitted,
        description: redto.description,
        resolver: redto.resolver,
        status: redto.status,
        type: redto.status
    }
 
}