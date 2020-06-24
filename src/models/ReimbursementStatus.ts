//Used to track the status of reimbursements status
//possiblities Pending, Approved, Denied 
export class ReimbursementStatus{
    statusId:number //primary key
    status:string //not null, unique
}