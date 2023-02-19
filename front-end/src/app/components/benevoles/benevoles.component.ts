import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { JeuxService } from 'src/app/services/jeux.service';
import { ConfirmDialogComponent } from '../partials/confirm-dialog/confirm-dialog.component';
import { Zone } from 'src/app/models/zone';
import { ZonesService } from 'src/app/services/zones.service';
import { NgModel } from '@angular/forms';
import { Benevole } from 'src/app/models/benevole';
import { BenevoleDisplay, BENEVOLE_COLUMNS_SCHEMA } from 'src/app/models/benevole-display';
import { BenevolesService } from 'src/app/services/benevoles.service';
import { Affectation } from 'src/app/models/affectation';
import { Creneau } from 'src/app/models/creneau';

@Component({
  selector: 'festivalJeux-benevoles',
  templateUrl: './benevoles.component.html',
  styleUrls: ['./benevoles.component.css']
})
export class BenevolesComponent implements OnInit {

  benevolesSub!: Subscription;
  benevoles!: Benevole[];
  benevolesDisplay: MatTableDataSource<BenevoleDisplay> = new MatTableDataSource<BenevoleDisplay>();

  displayedColumns: string[] = BENEVOLE_COLUMNS_SCHEMA.map((column: any) => column.key);
  columnsSchema : any = BENEVOLE_COLUMNS_SCHEMA;

  valid: any = {};

  // zones data
  zones: Zone[] = [];
  zonesSub!: Subscription;

  rowNumber: number = 0;

  constructor(
    public dialog: MatDialog,
    private zonesService: ZonesService,
    private benevolesService: BenevolesService
  ) { }

  ngOnInit(): void {

    //Get benevoles
    this.benevolesSub = this.benevolesService.benevoles$.subscribe({
      next:(benevoles : any)=>{
        this.benevoles = benevoles
        this.fillBenevolesDisplay()
      },
      error: (err)=>{
        console.log(err)
      },
      complete :()=>{
      }
    })
    this.benevolesService.getBenevoles()

    //Get zones
    this.zonesSub = this.zonesService.zones$.subscribe({
      next:(zones : any)=>{
        this.zones = zones
      },
      error: (err)=>{
        console.log(err)
      },
      complete :()=>{
      }
    })
    this.zonesService.getZones()
  }

  /**
   * fill the benevoles display table from the benevoles array
   * for each benevole, create one or many BenevoleDisplay object
   * it depends on the number of affectations of the benevole
   * and push it in the benevolesDisplay array
   */
  fillBenevolesDisplay(){
    this.benevolesDisplay = new MatTableDataSource<BenevoleDisplay>();
    this.benevoles.forEach((benevole: Benevole) => {
      if(benevole.affectations.length == 0){
        this.benevolesDisplay.data.push(new BenevoleDisplay(benevole, benevole.affectations[0]))
      }else{
        benevole.affectations.forEach((affectation: Affectation) => {
          this.benevolesDisplay.data.push(new BenevoleDisplay(benevole, affectation))
        });
      }
    });
  }

  addRow() {
    this.rowNumber--;
    this.valid[this.rowNumber] = {
      prenom : false,
      nom: false,
      email: false,
      zone: false,
      debut_creneau: false,
      fin_creneau: false,
      date: false,
    }
    let benevoleDisplayRow : BenevoleDisplay = {
      _id: this.rowNumber.toString(),
      prenom : "",
      nom: "",
      email: "",
      idZone: "",
      zone: "",
      debut_creneau: "",
      fin_creneau: "",
      date: "",
      isEdit: true,
      isSelected: false,
    }
    this.benevolesDisplay.data = [benevoleDisplayRow, ...this.benevolesDisplay.data];
  }

  /**
   * editRow
   * @param row
   * first it will initialize the valid object for the row
   * then it will call the function createBenevoleFromDisplay that will create a Benevole Object from the BenevoleDisplay Object
   * if the id of the jeu is < 0 it will call the function createBenevole() which will call the service to create the Benevole
   * else it will call the function updateBenevole() which will call the service to update the benevole
   * 
   */
  editRow(row: BenevoleDisplay){
    console.log(this.valid)
    let benevole = this.createBenevoleFromDisplay(row);
    if(Number(row._id) < 0){
      this.createBenevole(row,benevole)
    }else{
      this.updateBenevole(row,benevole)
    }
  }

  /**
 * Cancel the edit of a row
 * @param row 
 * 
 */
    cancelEdit(row: BenevoleDisplay) {
    if (Number(row._id) < 0) {
      this.benevolesDisplay.data = this.benevolesDisplay.data.filter((benevole: BenevoleDisplay) => benevole._id !== row._id);
    } else {
      this.fillBenevolesDisplay()
      row.isEdit = false;
    }
    this.valid[row._id] = {};
  }

  /**
   * createBenevoleFromDisplay
   * @param row
   * @returns Benevole
   * it will create a Benevole Object from the BenevoleDisplay Object
   * it should fill the affectations array of the Benevole Object with all the affectations of the BenevoleDisplay Object
   * 
  */
  createBenevoleFromDisplay(row: BenevoleDisplay): Benevole{
    let affectations: Affectation[] = [];
    this.benevolesDisplay.data.forEach((benevoleDisplay: BenevoleDisplay) => {
      if(benevoleDisplay._id == row._id){
      // create a Zone object from the zone field of the benevoleDisplay
      let zone : Zone = new Zone("","");
      if (row.idZone !== "") {
        // given the idZone form the row, find the zone corresponding of the id from the zones array
        let tempZone : Zone | undefined = this.zones.find((zone: Zone) => zone._id === row.idZone)
        if (tempZone !== undefined) {
          zone = tempZone
        }
      }
        let creneau = new Creneau(benevoleDisplay.debut_creneau, benevoleDisplay.fin_creneau,benevoleDisplay.date);
        let affectation = new Affectation(zone, creneau);
        affectations.push(affectation);
      }
    });
    let benevole = new Benevole(row._id,row.prenom, row.nom, row.email, affectations);
    return benevole;
  }

  removeRow(_id: string) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.deleteBenevole(_id)
        }
      });
  }

  isAllSelected() {
    return this.benevolesDisplay.data.every((item: any) => item.isSelected);
  }

  isAnySelected() {
    return this.benevolesDisplay.data.some((item: any) => item.isSelected);
  }

  selectAll(event : any) {
    this.benevolesDisplay.data = this.benevolesDisplay.data.map((item: any) => ({
      ...item,
      isSelected: event.checked,
    }));
  }

    /**
   * removeSelectedRows
   * will open a dialog to confirm the deletion
   * if the user confirm the deletion it will retrieve the ids of selected rows and call the function deleteBenevoles(benevolesIds)
   * that will call the service to delete the benevoles
   * else it will do nothing
   */ 
     removeSelectedRows() {
      this.dialog
        .open(ConfirmDialogComponent)
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            const benevolesIds = this.benevolesDisplay.data
              .filter((item: any) => item.isSelected)
              .map((item: any) => item._id);
            this.deleteBenevoles(benevolesIds)
          }
        });
    }

  /**
   * updateBenevole
   * @param row
   * @param benevole
   * will call the service to update the benevole
   * if the update is successful it will change the isEdit property to false to stop the edition mode
   * else it will display an error message
  */
  updateBenevole(row: BenevoleDisplay, benevole: Benevole) {
    this.benevolesService.updateBenevole(row._id, benevole).then(()=>{
      // change the isEdit property to false to stop the edition mode
      row.isEdit = false
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  /**
   * createBenevole
   * @param row
   * @param benevole
   * will call the service to create the benevole
   * if the creation is successful it will change the isEdit property to false to stop the edition mode
   * and it will change the _id property to the id of the created benevole
   * else it will display an error message
  */
   createBenevole(row: BenevoleDisplay, benevole: Benevole) {
    this.benevolesService.createBenevole(benevole).then(()=>{
      // change the isEdit property to false to stop the edition mode
      row.isEdit = false
      // change the _id property to the id of the created jeu

    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

    /**
   * deleteBenevoles
   * @param _id
   * will call the service to delete the benevoles
   * if the deletion is successful it will remove the benevole from the benevolesDisplay array
   * else it will display an error message
  */
     deleteBenevole(_id: string) {
      this.benevolesService.deleteBenevole(_id).then(()=>{
          this.benevolesDisplay.data = this.benevolesDisplay.data.filter((u) => u._id !== _id);
      })
      .catch((err)=>{
        console.log(err.message)
      })
    }

      /**
   * deleteBenevoles
   * @param benevolesIds
   * will call the service to delete many benevoles given an array of ids
   * if the deletion is successful it will remove the benevoles from the benevolesDisplay array
   * else it will display an error message
   */
  deleteBenevoles(benevolesIds : string[]) {
    this.benevolesService.deleteBenevoles(benevolesIds).then(()=>{
      this.benevolesDisplay.data = this.benevolesDisplay.data.filter((u: any) => !u.isSelected);
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  inputHandler(e: any, id: string, key: string, ngModel: NgModel) {
    if (!this.valid[id]) {
      this.valid[id] = {}
    }
    this.valid[id][key] = ngModel.control.valid
    console.log(this.valid)
  }

  disableSubmit(id: string) {
    if (this.valid[id]) {
      if(Object.values(this.valid[id]).every((item) => item === true)){
        return false
      }
    }
    return true
  }

  ngOnDestroy(): void {
    this.benevolesSub.unsubscribe()
    this.zonesSub.unsubscribe()
  }


}
