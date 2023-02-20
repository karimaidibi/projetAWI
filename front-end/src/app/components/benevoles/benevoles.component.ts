import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../partials/confirm-dialog/confirm-dialog.component';
import { NgModel } from '@angular/forms';
import { Benevole} from 'src/app/models/benevole';
import { CrudBenevoleDisplay, BENEVOLE_COLUMNS_SCHEMA } from 'src/app/models/crud-benevole-display';
import { BenevolesService } from 'src/app/services/benevoles.service';
import { Zone } from 'src/app/models/zone';
import { Creneau } from 'src/app/models/creneau';
import { Affectation } from 'src/app/models/affectation';
@Component({
  selector: 'festivalJeux-benevoles',
  templateUrl: './benevoles.component.html',
  styleUrls: ['./benevoles.component.css']
})
export class BenevolesComponent implements OnInit {

  benevolesSub!: Subscription;
  benevoles!: Benevole[];
  benevolesDisplay: MatTableDataSource<CrudBenevoleDisplay> = new MatTableDataSource<CrudBenevoleDisplay>();

  displayedColumns: string[] = BENEVOLE_COLUMNS_SCHEMA.map((column: any) => column.key);
  columnsSchema : any = BENEVOLE_COLUMNS_SCHEMA;

  valid: any = {};

  rowNumber: number = 0;

  constructor(
    public dialog: MatDialog,
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
  }

  /**
   * fill the benevoles display table from the benevoles array
   * for each benevole, create a BenevoleDisplay object
   * and push it in the benevolesDisplay  mat table data source
   */
  fillBenevolesDisplay(){
    this.benevolesDisplay = new MatTableDataSource<CrudBenevoleDisplay>();
    this.benevoles.forEach((benevole: Benevole) => {
        this.benevolesDisplay.data.push(new CrudBenevoleDisplay(benevole))
    })
  }

  addRow() {
    this.rowNumber--;
    this.valid[this.rowNumber] = {
      prenom : false,
      nom: false,
      email: false,
    }
    let benevole = new Benevole(this.rowNumber.toString(),"","","",[]);
    let benevoleDisplayRow = new CrudBenevoleDisplay(benevole);
    benevoleDisplayRow.isEdit = true;
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
  editRow(row: CrudBenevoleDisplay){
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
  cancelEdit(row: CrudBenevoleDisplay) {
    if (Number(row._id) < 0) {
      this.benevolesDisplay.data = this.benevolesDisplay.data.filter((benevole: CrudBenevoleDisplay) => benevole._id !== row._id);
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
   * and give it it's array of affectations from the Benevole Object
  */
  createBenevoleFromDisplay(row: CrudBenevoleDisplay): Benevole{
    let zone = new Zone("","")
    let creneau = new Creneau("","","")
    let affectation = new Affectation(zone,creneau)
    let benevole = new Benevole(row._id,row.prenom,row.nom,row.email,[affectation]);
    this.benevoles.forEach((benevoleItem: Benevole) => {
      if(benevoleItem._id === benevole._id){
        benevole.affectations = benevoleItem.affectations
      }
    })
    return benevole
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
  updateBenevole(row: CrudBenevoleDisplay, benevole: Benevole) {
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
   createBenevole(row: CrudBenevoleDisplay, benevole: Benevole) {
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
  }


}
