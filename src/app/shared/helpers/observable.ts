import { Observable } from 'rxjs';

export const once = 
<T>(obs: Observable<T>, next: (value: T) => void, error: (err: any) => void, complete?: () => void)=>{
    const subs = obs.subscribe(
      (value)=>{
        next(value);
        subs.unsubscribe();
      }, 
      (err)=>{
        error(err)
        subs.unsubscribe();
      },
      complete)
}