import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { ConfirmDialogComponent } from '../../partials/confirm-dialog/confirm-dialog.component';
import { Zone } from 'src/app/models/zone';
import { ZonesService } from 'src/app/services/zones.service';
import { NgModel } from '@angular/forms';
import { Benevole } from 'src/app/models/benevole';
import { BenevoleDisplay, BENEVOLE_DISPLAY_COLUMNS_SCHEMA } from 'src/app/models/benevole-display';
import { BenevolesService } from 'src/app/services/benevoles.service';
import { Affectation } from 'src/app/models/affectation';
import { Creneau } from 'src/app/models/creneau';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'festivalJeux-single-benevole-affectations',
  templateUrl: './single-benevole-affectations.component.html',
  styleUrls: ['./single-benevole-affectations.component.css']
})
export class SingleBenevoleAffectationsComponent implements OnInit {

  benevoleSub!: Subscription;
  benevole!: Benevole;
  benevolesDisplay: MatTableDataSource<BenevoleDisplay> = new MatTableDataSource<BenevoleDisplay>();

  displayedColumns: string[] = BENEVOLE_DISPLAY_COLUMNS_SCHEMA.map((column: any) => column.key);
  columnsSchema : any = BENEVOLE_DISPLAY_COLUMNS_SCHEMA;

  valid: any = {};

  // zones data
  zones: Zone[] = [];
  zonesSub!: Subscription;

  rowNumber: number = 0;

  benevoleId!: string;

  constructor(
    public dialog: MatDialog,
    private zonesService: ZonesService,
    private benevolesService: BenevolesService,
    private route: ActivatedRoute,
    private router :  Router,
  ) { }

  ngOnInit(): void {

    //Get benevole
    // récuperer l'id depuis la route
    this.route.params.subscribe({
      next: (params : Params)=>{
        const id = params['id'];
        this.benevoleId = id;
      },
      error: (err)=>{
        this.router.navigate(['/not-found'])
        console.log(err)
      },
      complete : ()=>{
        console.log("complete")
      }
    })

    this.initBenevoleSub()
    this.benevolesService.getBenevoleById(this.benevoleId)

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

  // init benevole subscription
  initBenevoleSub(){
    this.benevoleSub = this.benevolesService.benevole$.subscribe({
      next: (benevole: Benevole) => {
        this.benevole = benevole;
        // fill the benevoles display table from the benevole object
        this.fillBenevolesDisplay()
      },
      error: (err) => {
        console.log(err)
      },
      complete: () => {
        console.log("init benevole sub complete")
      }
    })
  }

  /**
   * fill the benevoles display table from the benevole object
   * create one or many BenevoleDisplay object from the benevole object
   * it depends on the number of affectations of the benevole
   * and push it in the benevolesDisplay array
   */
  fillBenevolesDisplay(){
    this.benevolesDisplay = new MatTableDataSource<BenevoleDisplay>();
    if(this.benevole.affectations.length == 0){
      this.benevolesDisplay.data.push(new BenevoleDisplay(this.benevole, this.benevole.affectations[0]))
    }else{
      this.benevole.affectations.forEach((affectation: Affectation) => {
        this.benevolesDisplay.data.push(new BenevoleDisplay(this.benevole, affectation))
      });
    }
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
    // create the same BenevoleDisplay object as the one in the table but with empty values for the affectation
    let benevoleDisplayRow = new BenevoleDisplay(this.benevole, new Affectation(new Zone("",""), new Creneau("", "", "")));
    benevoleDisplayRow.isEdit = true;
    this.benevolesDisplay.data = [benevoleDisplayRow, ...this.benevolesDisplay.data];
  }

  /**
   * editRow
   * @param row
   * it will call the function createBenevoleFromDisplay that will create a Benevole Object from the BenevoleDisplay Object
   * it will call the function updateAffectations() which will call the service to update the affectations of the benevole
   * 
   */
  editRow(row: BenevoleDisplay){
    let benevole = this.createBenevoleFromDisplay(row);
    this.updateAffectations(row,benevole.affectations)
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
    // delete the valid object of the row
    delete this.valid[row._id];
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
      let affectation = this.createAffectationFromBenevoleDisplay(benevoleDisplay)
      affectations.push(affectation);
    });
    let benevole = new Benevole(row._id,row.prenom, row.nom, row.email, affectations);
    return benevole;
  }

  /**
   * createAffectationFromBenevoleDisplay
   * @param row
   * @returns Affectation
  */
  createAffectationFromBenevoleDisplay(row: BenevoleDisplay): Affectation{
    // create a Zone object from the zone field of the benevoleDisplay
    let zone : Zone = new Zone("","");
    if (row.idZone !== "") {
      // given the idZone form the row, find the zone corresponding of the id from the zones array
      let tempZone : Zone | undefined = this.zones.find((zone: Zone) => zone._id === row.idZone)
      if (tempZone !== undefined) {
        zone = tempZone
      }
    }
    let creneau = new Creneau(row.debut_creneau, row.fin_creneau,row.date);
    let affectation = new Affectation(zone, creneau);
    return affectation;
  }

  removeRow(row: BenevoleDisplay) {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          // create an affectation object from the row
          let affectation = this.createAffectationFromBenevoleDisplay(row)
          this.deleteAffectation(row._id,affectation)
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
   * if the user confirm the deletion it will call the function deleteAffectation(_id, affectation) for each selected row
   * that will call the service to delete the affectation of the benevole
   * else it will do nothing
   */ 
  removeSelectedRows() {
    this.dialog
      .open(ConfirmDialogComponent)
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
          this.benevolesDisplay.data.forEach((row: BenevoleDisplay) => {
            if (row.isSelected) {
              // create an affectation object from the row
              let affectation = this.createAffectationFromBenevoleDisplay(row)
              this.deleteAffectation(row._id,affectation)
            }
          });
        }
      });
  }

  /**
   * updateAffectations
   * @param row
   * @param affectations
   * will call the service to update the affectations of the benevole
   * if the update is successful it will change the isEdit property to false to stop the edition mode
   * else it will display an error message
  */
  updateAffectations(row: BenevoleDisplay, affectations: Affectation[]) {
    this.benevolesService.updateAffectations(row._id, affectations).then(()=>{
      // change the isEdit property to false to stop the edition mode
      row.isEdit = false
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  /**
   * deleteAffectation
   * @param _id
   * will call the service to delete one affectation of the benevole
   * if the deletion is successful it will remove this benevoleDisplay (of this affectation) from the benevolesDisplay array
   * else it will display an error message
  */
  deleteAffectation(_id: string, affectation: Affectation) {
    this.benevolesService.deleteAffectation(_id, affectation).then(()=>{
        this.benevolesDisplay.data = this.benevolesDisplay.data.filter((u) => u._id !== _id);
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
    this.zonesSub.unsubscribe()
  }


}