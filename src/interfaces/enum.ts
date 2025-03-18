// Enum for User Roles
export enum UserRole {
    USER = "USER",
    VENDOR = "VENDOR",
    ADMIN = "ADMIN",
    SUPERADMIN = "SUPERADMIN"
}


export enum Department {
    Account_Finance_Legal = "Account / Finance / Legal",
    Production_Manufacturing_Construction = "Production / Manufacturing / Construction",
    Quality_Risk_Management="Quality / Risk Management",
    HR_Payroll_Compliance="HR / Payroll / Compliance",
    IT_ITES="IT / ITES",
    Sales_Marketing_Business_Development="Sales / Marketing / Business Development",
    Procurement_Supply_Chain="Procurement / Supply Chain",
    Product_Management="Product Management",
    Project_Program_Management="Project / Program Management",
}
export enum JobLevel {
    ENTRY = "0-1 Yr. Fresher",
    ASSOCIATE = "1-4 Yr. Consultant / Associate",
    SR_ASSOCIATE = "4-8 Yr. Sr. Associate / AM / DM",
    MANAGER = "8-12 Yr. Manager",
    SR_MANAGER = "12-15 Yr. Sr. Manager / AVP",
    DIRECTOR = "15+ Yr. Director / VP"
}
export enum JobType {
    FREELANCE = "Freelance",
    PART_TIME = "Part-time",
    FULL_TIME = "Full-time",
    INTERNSHIP = "Internship"
}

export enum SubscriptionType {
    PREMIUM_PRO = "Premium Pro",
    PREMIUM = "Premium",
    FREE = "Free"
  }
  
export enum JobStatus {
    PENDING = "Pending",
    UNDER_REVIEW = "Under Review",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected",
}