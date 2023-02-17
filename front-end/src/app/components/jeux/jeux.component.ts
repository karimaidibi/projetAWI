import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Jeu } from 'src/app/models/jeu';
import { JeuDisplay, COLUMNS_SCHEMA } from 'src/app/models/jeu-display';
import { JeuxService } from 'src/app/services/jeux.service';
import { ConfirmDialogComponent } from '../partials/confirm-dialog/confirm-dialog.component';
import { Zone } from 'src/app/models/zone';
import { TypeJeu } from 'src/app/models/type-jeu';


@Component({
  selector: 'festivalJeux-jeux',
  templateUrl: './jeux.component.html',
  styleUrls: ['./jeux.component.css']
})
export class JeuxComponent implements OnInit, OnDestroy {

  jeuxSub!: Subscription;
  jeux!: Jeu[];
  jeuxDisplay: MatTableDataSource<JeuDisplay> = new MatTableDataSource<JeuDisplay>();

  displayedColumns: string[] = COLUMNS_SCHEMA.map((column: any) => column.key);
  
  columnsSchema : any = COLUMNS_SCHEMA;


  constructor(private jeuxService: JeuxService, public dialog: MatDialog
    ) { }

  ngOnInit(): void {

  //Get jeux
  this.jeuxSub = this.jeuxService.jeux$.subscribe({
    next:(jeux : any)=>{
      this.jeux = jeux
      this.fillJeuxDisplay()
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
    this.jeuxDisplay.data = this.jeux.map((jeu: Jeu) => {
      return {
        _id: jeu._id,
        nom: jeu.nom,
        zone: (jeu.zone !== null)? jeu.zone.nom : "",
        idZone: (jeu.zone !== null)? jeu.zone._id : "",
        typeJeu: (jeu.typeJeu !== null)? jeu.typeJeu.type : "",
        idTypeJeu: (jeu.typeJeu !== null)? jeu.typeJeu._id : "",
        isEdit: false,
        isSelected: false
      }
    })
  }

  addRow() {
    const jeuDisplayRow : JeuDisplay = {
      _id: "",
      nom: "",
      zone: "",
      idZone: "",
      typeJeu: "",
      idTypeJeu: "",
      isEdit: true,
      isSelected: false
    }
    this.jeuxDisplay.data = [jeuDisplayRow, ...this.jeuxDisplay.data];
  }

  /**
   * editRow
   * @param row
   * first it will change class the function createJeuFromDisplay that will create a jeu Object with the jeuDisplay object
   * then it will call the service to update the jeu
   */
  editRow(row: JeuDisplay) {
    const jeu : Jeu = this.crateJeuFromDisplay(row)
    this.jeuxService.updateJeu(row._id, jeu).then(()=>{
      // change the isEdit property to false to stop the edition mode
      row.isEdit = false
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  /**
   * 
   * createJeuFromDisplay
   * will create a jeu Object with the jeuDisplay object
   * @param row
   */
  crateJeuFromDisplay(row: JeuDisplay) : Jeu{
    // create a Zone object from the zone field of the jeuDisplay
    const zone : Zone = (row.idZone !== "")? {_id: row.idZone, nom: row.zone} : new Zone()
    // create a TypeJeu object from the typeJeu field of the jeuDisplay
    const typeJeu : TypeJeu = (row.idTypeJeu !== "")? {_id: row.idTypeJeu, type: row.typeJeu} : new TypeJeu()
    const jeu : Jeu = {
      _id: row._id,
      nom: row.nom,
      zone: zone,
      typeJeu: typeJeu
    }
    return jeu
  }


  removeRow(_id: string) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.jeuxDisplay.data = this.jeuxDisplay.data.filter((u) => u._id !== _id);
        }
      });
  }

  isAllSelected() {
    return this.jeuxDisplay.data.every((item: any) => item.isSelected);
  }

  isAnySelected() {
    return this.jeuxDisplay.data.some((item: any) => item.isSelected);
  }

  selectAll(event : any) {
    this.jeuxDisplay.data = this.jeuxDisplay.data.map((item: any) => ({
      ...item,
      isSelected: event.checked,
    }));
  }

  removeSelectedRows() {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.jeuxDisplay.data = this.jeuxDisplay.data.filter((u: any) => !u.isSelected);
        }
      });
  }

  ngOnDestroy(): void {
    this.jeuxSub.unsubscribe()

  }

}
