import { SubscriptionType } from "../interfaces/enum";


export function createAgencyFilter(query: any): any {
    const  {subscriptionType, isCreatedByAdmin = true, search, timeRange} = query;
    const filter: any = {};
    
    if (subscriptionType && Object.values(SubscriptionType).includes(subscriptionType as SubscriptionType)) {
        filter.subscriptionType = subscriptionType;
    }
    
    if(search){
        const searchRegex = new RegExp(search as string, "i");
        filter.$or = [
            { agencyName: { $regex: searchRegex } },
            { phoneNumber: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
          ]
    }

    if(timeRange) {
        const now = new Date();
        switch(timeRange) {
            case '24h':
                filter.createdAt = { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) };
                break;
            case '7d':
                filter.createdAt = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) };
                break;
            case '1m':
                filter.createdAt = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) };
                break;
            case '3m':
                filter.createdAt = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) };
                break;
        }
    }
    
    return filter;
}