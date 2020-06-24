//used to represent a single reimbursement of a single employee
export class Reimbursement{
    reimbursementId: number //primary key
    author: number //foreign key -> User,not null
    amount: number //not null
    dateSubmitted: number //not null
    dateResolved: number //not null
    description: string //not null
    resolver:number //not null
    status: number //not null
    type:number //foreign key ->Reimbursement type
}