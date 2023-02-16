import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Jeu } from 'src/app/models/jeu';
import { JeuxService } from 'src/app/services/jeux.service';

@Component({
  selector: 'festivalJeux-jeux',
  templateUrl: './jeux.component.html',
  styleUrls: ['./jeux.component.css']
})
export class JeuxComponent implements OnInit, OnDestroy {

  jeuxSub!: Subscription;
  jeux!: Jeu[];

  displayedColumns: string[] = ['nom', 'type', 'zone'];

  constructor(private jeuxService: JeuxService,
    ) { }

  ngOnInit(): void {

  //Get jeux
  this.jeuxSub = this.jeuxService.jeux$.subscribe({
    next:(jeux : any)=>{
      this.jeux = jeux
    },
    error: (err)=>{
      console.log(err)
    },
    complete :()=>{
    }
  });

    this.jeuxService.getJeux()

  }

  ngOnDestroy(): void {
    this.jeuxSub.unsubscribe()

}

}
