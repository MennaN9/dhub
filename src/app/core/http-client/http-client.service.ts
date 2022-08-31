/**
 * @author Mustafa Omran promustafaomran@hotmail.com
 *
 * Generic Http Client Service
 *
 * @class HttpClientService
 *
 * Abstract layer to communicate with backend APIs
 * It has all crud operations
 */
import { Observable } from 'rxjs';
import { App } from '../app';
import { Injectable, Inject, LOCALE_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 *
 * @constant httpOptions
 */
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }),
  withCredentials: false,
};


@Injectable({
  providedIn: 'root'
})

export class HttpClientService {
  lng: string;

  /**
   *
   * @param http HttpClient
   * @param locale LOCALE_ID
   */
  constructor(private http: HttpClient, @Inject(LOCALE_ID) locale: string) {
    this.lng = locale;
  }


  /**
   * full URl
   *
   *
   * @param resource
   */
  fullRequestURL(resource: string | number): string {
    return `${App.backEndUrl}/api/${resource}`;
  }

  /**
   * get method
   *
   *
   * @param resource
   * @param params
   */
  get<T>(resource?: string | number, params?: {}): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.get<T>(this.fullRequestURL(resource), httpOptions);
  }

  /**
  * get method
  *
  *
  * @param resource
  * @param params
  */
  getCustom<T>(url: string, options?: {}, params?: {}) {
    if (params) {
      url += this.getArgs(params);
    }
    return this.http.get<T>(this.fullRequestURL(url), options)
  }

  /**
   * post method
   *
   *
   * @param resource
   * @param params
   */
  postCustom<T>(url: string, body?: {}, options?: {}) {
    return this.http.post<T>(this.fullRequestURL(url), body, options)
  }

  postFormDataCustome<T>(url: string, body?: {}, options?: {}) {
    const formData = this.getFormData(body);
    return this.http.post<T>(this.fullRequestURL(url), formData, options)
  }


  /**
   * post method
   *
   *
   * @param body
   * @param resource
   * @param params
   */
  post<T>(body: any = {}, resource?: string | number, params?: {}): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }

    return this.http.post<T>(this.fullRequestURL(resource), body, httpOptions);
  }

  postFormData<T>(body: any, resource?: string | number, params?: {}): Observable<T> {
    const formData = this.getFormData(body);
    return this.http.post<T>(this.fullRequestURL(resource), formData);
  }

  buildFormData = (formData, data, parentKey) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
      Object.keys(data).forEach(key => {

        this.buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);


      });
    } else {
      const value = data == null ? '' : data;

      formData.append(parentKey, value);
    }
  }

  /**
   * put method
   *
   *
   * @param body
   * @param resource
   */
  put<T>(body: any = {}, resource?: string | number): Observable<T> {
    return this.http.put<T>(this.fullRequestURL(resource), body, httpOptions);
  }

  putFormData<T>(body: any = {}, resource?: string | number): Observable<T> {
    let formbody = this.getFormData(body);
    return this.http.put<T>(this.fullRequestURL(resource), formbody);
  }

  /**
   * delete method
   *
   *
   * @param params
   * @param resource
   */
  delete<T>(resource?: string | number, params?: {}): Observable<T> {
    if (params) {
      resource += this.getArgs(params);
    }
    return this.http.delete<T>(this.fullRequestURL(resource), httpOptions);
  }

  /**
   * convert get header params to query string
   *
   *
   * @param options
   */
  getArgs(options: any): string {
    if (!options) {
      return '';
    }
    var args = '?';
    Object.keys(options).forEach((key) => {
      args += this.optionToString(key, options[key]);
    });
    return args;
  }


  /**
   * convert options to string
   *
   *
   * @param key
   * @param value
   */
  optionToString(key: string, value: any): string {
    if (!value) {
      return '';
    }
    let result = '';
    if (value instanceof Array) {
      value.forEach((element, index) => {
        result += `${key}[${index}]=${element}&`;
      });
    } else if (value instanceof Object) {
      Object.keys(value).forEach((element) => {
        if (value instanceof Object) {
          result += this.serializeObject(value[element], `${key}[${element}]`);
        } else {
          result += `${key}[${element}]=${value[element]}&`;
        }
      });
    } else {
      result += `${key}=${value}&`;
    }
    return result;
  }


  getFormData(object, form?, namespace?) {

    const formData = form || new FormData();
    for (let property in object) {
      if (!object.hasOwnProperty(property)) {
        continue;
      }
      let formKey = namespace ? `${namespace}.${property}` : property;

      if (typeof object[property] === 'object' && !(object[property] instanceof File)) {

        if (object[property] instanceof Array) {
          object[property].forEach((row, index) => {
            formKey = namespace
              ? `${namespace}.${property}[${index}]`
              : `${property}[${index}]`;
            if (typeof row === 'object') {
              this.getFormData(row, formData, formKey);
            }
            else {
              formData.append(formKey, row);
            }
          });
        } else {
          formKey = namespace ? `${namespace}.${property}` : property;
          this.getFormData(object[property], formData, formKey);
        }
      } else {

        if (object[property] instanceof File) {
          formData.append(formKey, object[property], object[property].name);
        } else {
          formData.append(formKey, object[property]);
        }
      }
    }
    return formData;
  }


  /**
   * serializing
   *
   *
   * @param obj
   * @param parentSerialized
   */
  private serializeObject(obj: any, parentSerialized: string): string {
    var str = '';
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      if (value instanceof Object) {
        str += `${this.serializeObject(value, `${parentSerialized}[${key}]`)}`;
      } else {
        str += `${parentSerialized}[${key}]=${value}&`;
      }
    });
    return str;
  }

}
