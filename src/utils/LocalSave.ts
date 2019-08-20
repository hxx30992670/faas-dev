export default class LocalSave {
  public static saveString(key: string, val: string) {
    window.localStorage.setItem(key, val);
  }
  public static getString(key: string) {
    const val: any = window.localStorage.getItem(key);
    if (typeof val === 'undefined') {
      return '';
    } else {
      return val;
    }
  }
  public static saveJson(key: string, val: any) {
    if (typeof val === 'undefined') {
      return;
    }
    if (typeof val === 'string') {
      window.localStorage.setItem(key, val);
    } else {
      window.localStorage.setItem(key, JSON.stringify(val));
    }
  }
  public static getJson(key: string) {
    const val: any = window.localStorage.getItem(key);
    return JSON.parse(val);
  }
  public static saveSession(key: string, val: any) {
    if (typeof val === 'undefined') {
      return;
    }
    if (typeof val === 'string') {
      window.sessionStorage.setItem(key, val);
    } else {
      window.sessionStorage.setItem(key, JSON.stringify(val));
    }
  }
  public static getSession(key: string, object: boolean = false) {
    const val: any = window.sessionStorage.getItem(key);
    return object ? JSON.parse(val) : val;
  }
}