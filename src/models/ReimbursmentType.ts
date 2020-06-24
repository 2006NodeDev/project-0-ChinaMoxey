//Used to track what kid of reimbursement is being submiteted
//possibilities Lodfing, Travel, Food, or Other 
export class ReimbursementType{
    typeId:number //primary key
    type: string //not nul, unique
}