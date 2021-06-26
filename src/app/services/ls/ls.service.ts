import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LsService {
  setValue(key: string, value: any) {
    return localStorage.setItem(key, value);
  }
  getValue(key: string) {
    return localStorage.getItem(key);
  }
  deleteValue(key: string) {
    return localStorage.removeItem(key);
  }
  clearAll() {
    return localStorage.clear();
  }
}
