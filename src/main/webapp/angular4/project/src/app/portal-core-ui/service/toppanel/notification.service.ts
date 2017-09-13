import {Injectable} from '@angular/core';
import { Http,Response } from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class NotificationService {
    constructor(private http:Http) {

    }
    getNotifications() {
        return this.http.get('/getNotifications.do')
        .map(
            (response:Response) => {
                const data = response.json();
                return data;
            }
        )
        .catch(
            (error: Response) => {
                return Observable.throw(error);
            }
        )
    }
    
}