import { Observable } from 'rxjs';

export const hpOnce = 
<T>(obs: Observable<T>, next: (value: T) => void, error: (err: any) => void, complete?: () => void)=>{
    const subs = obs.subscribe(
      (value)=>{
        console.log('hpOnce');
        next(value);
        subs.unsubscribe();
      }, 
      (err)=>{
        error(err)
        subs.unsubscribe();
      },
      complete)
}

/**
 hpOnce(this.imgService.saveDataset(this.startedDataset),
    (value)=>{},
    (err)=>{}
  )
 */