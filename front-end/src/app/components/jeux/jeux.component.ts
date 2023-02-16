import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Jeu } from 'src/app/models/jeu';
import { JeuDisplay, COLUMNS_SCHEMA } from 'src/app/models/jeu-display';
import { JeuxService } from 'src/app/services/jeux.service';



@Component({
  selector: 'festivalJeux-jeux',
  templateUrl: './jeux.component.html',
  styleUrls: ['./jeux.component.css']
})
export class JeuxComponent implements OnInit, OnDestroy {

  jeuxSub!: Subscription;
  jeux!: Jeu[];
  jeuxDisplay!: JeuDisplay[];

  displayedColumns: string[] = COLUMNS_SCHEMA.map((column: any) => column.key);
  
  columnsSchema : any = COLUMNS_SCHEMA;


  constructor(private jeuxService: JeuxService,
    ) { }

  ngOnInit(): void {

  //Get jeux
  this.jeuxSub = this.jeuxService.jeux$.subscribe({
    next:(jeux : any)=>{
      this.jeux = jeux
      this.fillJeuxDisplay()
      console.log(this.jeuxDisplay)
    },
    error: (err)=>{
      console.log(err)
    },
    complete :()=>{
    }
  });

    this.jeuxService.getJeux()

  }

  // fill the jeuxDisplay array with the jeux array
  fillJeuxDisplay(){
    this.jeuxDisplay = this.jeux.map((jeu: Jeu) => {
      return {
        _id: jeu._id,
        nom: jeu.nom,
        zone: (jeu.zone !== null)? jeu.zone.nom : "",
        idZone: (jeu.zone !== null)? jeu.zone._id : "",
        typeJeu: (jeu.typeJeu !== null)? jeu.typeJeu.type : "",
        idTypeJeu: (jeu.typeJeu !== null)? jeu.typeJeu._id : "",
      }
    })
  }

  ngOnDestroy(): void {
    this.jeuxSub.unsubscribe()

}

}
