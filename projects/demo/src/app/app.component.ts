import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { delay, Observable, startWith } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'mh-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title$: Observable<string>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  graphQLMode = false;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private titleService: Title,
    private router: Router,
  ) {
    this.title$ = router.events.pipe(
      startWith(titleService.getTitle()),
      delay(0),
      map(() => titleService.getTitle()),
    );
  }

}
