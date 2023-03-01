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
// Error Dialog
import { ErrorDialogComponent } from '../../partials/error-dialog/error-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
// auth
import { AuthService } from 'src/app/services/auth.service';

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

  // auth
  isAuth! : boolean

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
    private snackBar: MatSnackBar,
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
    // auth
    this.verifSignIn()

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

  //assigner is auth a true si user est connecté
  verifSignIn() : void{
    this.authService.isAuth$.subscribe(
      (bool: boolean)=>{
        this.isAuth = bool
      }
    )
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
    this.benevole.affectations.forEach((affectation: Affectation) => {
      this.rowNumber--;
      this.benevolesDisplay.data.push(new BenevoleDisplay(this.benevole, affectation, this.rowNumber.toString()))
    });

  }

  /**
   * handel the click on the edit button
   * @param row
  */
  handleClickOnEdit(row: BenevoleDisplay) {
    row.isEdit = !row.isEdit
    // initialise the valid object
    this.valid[row.rowId] = {
      prenom : true,
      nom: true,
      email: true,
      zone: row.zone == "" ? false : true,
      debut_creneau: row.debut_creneau == "" ? false : true,
      fin_creneau: row.fin_creneau == "" ? false : true,
      date: row.date == "" ? false : true
    }
  }

  addRow() {
    // if the user is not connected, he can't add a row
    if(this.isAuth){
      this.rowNumber--;
      this.valid[this.rowNumber.toString()] = {
        prenom : true,
        nom: true,
        email: true,
        zone: false,
        debut_creneau: false,
        fin_creneau: false,
        date: false,
      }
      // create the same BenevoleDisplay object as the one in the table but with empty values for the affectation
      let benevoleDisplayRow = new BenevoleDisplay(this.benevole, new Affectation(new Zone("",""), new Creneau("", "", "")), this.rowNumber.toString());
      benevoleDisplayRow.isEdit = true;
      this.benevolesDisplay.data = [benevoleDisplayRow, ...this.benevolesDisplay.data];
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'You must be connected to add an affectation to a benevole',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  /**
   * editRow function called when the user click on the done button
   * @param row
   * it will call the function createBenevoleFromDisplay that will create a Benevole Object from the BenevoleDisplay Object
   * it will call the function updateAffectations() which will call the service to update the affectations of the benevole
   *
  */
  editRow(row: BenevoleDisplay){
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
      // check if the end time is after the start time
      const debutCreneau = new Date(row.date + " " + row.debut_creneau);
      const finCreneau = new Date(row.date + " " + row.fin_creneau);
      if (finCreneau.getTime() <= debutCreneau.getTime()) {
        this.snackBar.openFromComponent(ErrorDialogComponent, {
          data: 'End time must be after start time',
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      }else{
        // check that the benevole doesn't have two affectations at the same time
        // get only the affectations that are not the in the current row (the one that is being edited)
        const affectationsNotEditing = this.benevolesDisplay.data.filter((affectation: BenevoleDisplay) => {
          return affectation.rowId !== row.rowId;
        });
        let timeIntersect : boolean = false;
        let i = 0;
        while(!timeIntersect && i < affectationsNotEditing.length){
          const affectation : BenevoleDisplay = affectationsNotEditing[i];
          const debutCreneauAffectation = new Date(affectation.date + " " + affectation.debut_creneau);
          const finCreneauAffectation = new Date(affectation.date + " " + affectation.fin_creneau);
          timeIntersect = 
                          (debutCreneau.getTime() >= debutCreneauAffectation.getTime() &&
                            debutCreneau.getTime() < finCreneauAffectation.getTime()) ||
                          (finCreneau.getTime() > debutCreneauAffectation.getTime() &&
                            finCreneau.getTime() <= finCreneauAffectation.getTime()) ||
                          (debutCreneau.getTime() <= debutCreneauAffectation.getTime() &&
                            finCreneau.getTime() >= finCreneauAffectation.getTime());
          i++;
        }
        if (timeIntersect){
          this.snackBar.openFromComponent(ErrorDialogComponent, {
            data: 'You already have an affectation at this time',
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        }
        else{
          // if the benevole doesn't have two affectations at the same time, update the affectations
          let benevole = this.createBenevoleFromDisplay(row);
          this.updateAffectations(row,benevole.affectations)
        }
      }
    }
    // if the user is not connected, he can't edit a row
    else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
      data: 'You must be connected to edit an affectation of a benevole',
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
  }
}

  /**
  * Cancel the edit of a row
  * @param row
  *
 */
  cancelEdit(row: BenevoleDisplay) {
    // if the row is a new row, delete it
    if (Number(row._id) < 0) {
      this.benevolesDisplay.data = this.benevolesDisplay.data.filter((benevole: BenevoleDisplay) => benevole.rowId !== row.rowId);
    } else {
      // if the row is an existing row
      row.isEdit = false;
      this.benevolesDisplay.data = [...this.benevolesDisplay.data];
    }
    // delete the valid object of the row
    delete this.valid[row.rowId];
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
    // If all the guards are passed we create the affectations array and return the Benevole Object
    // remove the affectation that is being edited
    let affectations : Affectation[] = this.benevole.affectations.filter(a => a._id !== row.idAffectation);
    // add the new affectation
    const affectation = this.createAffectationFromBenevoleDisplay(row)
    affectations.push(affectation);
    // create the Benevole Object
    let benevole = new Benevole(row._id,row.prenom, row.nom, row.email, affectations);
    return benevole;
}

  /**
   * createAffectationFromBenevoleDisplay
   * @param row
   * @returns Affectation
  */
  createAffectationFromBenevoleDisplay(row: BenevoleDisplay): Affectation{
    const zone: Zone = this.zones.find((zone: Zone) => zone._id === row.idZone) || new Zone('', '');
    const creneau: Creneau = new Creneau(row.debut_creneau, row.fin_creneau, row.date);
    // update the zone in the display
    row.zone = zone.nom;
    return new Affectation(zone, creneau, row.idAffectation);
  }

  removeRow(row: BenevoleDisplay) {
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
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
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'You must be connected to add a row',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
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
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
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
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'You must be connected to add a row',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
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
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
      this.benevolesService.updateAffectations(row._id, affectations).then(()=>{
        // update the affectations array of the benevole
        this.benevole.affectations = affectations;
        // change the isEdit property to false to stop the edition mode
        row.isEdit = false
      })
      .catch((err)=>{
        console.log(err.message)
      })
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'You must be connected to add a row',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
  }

  /**
   * deleteAffectation
   * @param _id
   * will call the service to delete one affectation of the benevole
   * if the deletion is successful it will remove this benevoleDisplay (of this affectation) from the benevolesDisplay array
   * else it will display an error message
  */
  deleteAffectation(_id: string, affectation: Affectation) {
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
      this.benevolesService.deleteAffectation(_id, affectation).then(()=>{
          // remove the affectation that is being edited
          this.benevole.affectations = this.benevole.affectations.filter(a => a._id !== affectation._id);
          // remove the affectation from the display
          this.benevolesDisplay.data = this.benevolesDisplay.data.filter((u) => u.idAffectation !== affectation._id);
      })
      .catch((err)=>{
        console.log(err.message)
      })
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'You must be connected to add a row',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
    }
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
    this.zonesSub.unsubscribe()
  }


}
