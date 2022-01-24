import { Subscription } from "rxjs";

export class SuscriptionsClass {
    subs: ISusciptions[]=[];
    

    

    
    public setData( key : string , subscription: Subscription) {
        this.subs.push({
            key: key,
            subscription: subscription
        });
    }

    
    public keyUnSubscribe(key: string) : void {
         for (let i = 0; i < this.subs.length; i++) {
             if (key == this.subs[i].key) {
                this.subs[i].subscription.unsubscribe();
             }
             
         }
    }

    public cleanAllSubs(){
        for (let i = 0; i < this.subs.length; i++) {
            this.subs[i].subscription.unsubscribe();
            
        }
    }
    
    
    
    


}

export interface ISusciptions {
    key: string ,
    subscription: Subscription;
    
}






