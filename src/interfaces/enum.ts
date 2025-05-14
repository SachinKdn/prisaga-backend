// Enum for User Roles
export enum UserRole {
    USER = "User",
    VENDOR = "Vendor",
    ADMIN = "Admin",
    SUPERADMIN = "Superadmin"
}


export enum AreaOfExpertises {
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
export enum ExperienceLevel {
    ENTRY = "0",
    ASSOCIATE = "1",
    SR_ASSOCIATE = "4",
    MANAGER = "8",
    SR_MANAGER = "12",
    DIRECTOR = "15"
}
export enum JobType {
    FREELANCE = "Freelance",
    PART_TIME = "Part-time",
    FULL_TIME = "Full-time",
    INTERNSHIP = "Internship"
}

export enum SubscriptionType {
    PREMIUM = "Premium",
    LITE = "Lite",
    FREE = "Free"
  }
  
export enum JobStatus {
    ACTIVE = "Active",
    ON_HOLD = "On Hold",
    CLOSED = "Closed",
}

export enum JobApplicationStatus {
    PENDING = "Pending",
    UNDER_REVIEW = "Under Review",
    ACCEPTED = "Accepted",
    REJECTED = "Rejected",
}

export enum JobCategory {
    ALLOCATED = "Allocated",
    DEALLOCATED = "Deallocated",
    ENGAGED = "Engaged"
}
