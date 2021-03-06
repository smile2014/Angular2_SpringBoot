import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, Request, RequestOptions, URLSearchParams,RequestMethod } from '@angular/http';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { LoginService } from './login.service';
import { AppConfig } from '../../app-config';


@Injectable()
export class ApiRequestService {


    private headers:Headers;
    private requestOptions:RequestOptions;

    constructor(
        //@Inject('api') private api, //refer fo api value in app.module.ts
        private appConfig:AppConfig,
        private http: Http,
        private loginService:LoginService
    ) {}

    /**
     * This is a Global place to define all the Request Headers that must be sent for every ajax call
     */
    getRequestOptions(requestMethod, url, urlParam?:URLSearchParams, body?:Object):RequestOptions {
        let headers = new Headers({'Content-Type': 'application/json'});
        this.loginService.appendAuthHeader(headers);
        let options = new RequestOptions({
            headers: headers,
            method : requestMethod,
            url    : this.appConfig.baseApiPath + url   //this.api + url,
        });
        if (urlParam){
            options = options.merge({ params: urlParam});
        }
        if (body){
            options = options.merge({body: JSON.stringify(body)});
        }
        return options;
    }

    get(url:string, urlParams?:URLSearchParams):Observable<any>{
        let requestOptions = this.getRequestOptions(RequestMethod.Get, url, urlParams);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    post(url:string, body:Object):Observable<any>{
        let requestOptions = this.getRequestOptions(RequestMethod.Post, url, undefined, body);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    put(url:string, body:Object):Observable<any>{
        let requestOptions = this.getRequestOptions(RequestMethod.Put, url, undefined, body);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

    delete(url:string):Observable<any>{
        let requestOptions = this.getRequestOptions(RequestMethod.Delete, url);
        return this.http.request(new Request(requestOptions))
            .map(resp => resp.json())
            .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
    }

}
