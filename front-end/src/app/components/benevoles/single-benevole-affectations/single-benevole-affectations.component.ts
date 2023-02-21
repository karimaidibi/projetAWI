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
  userId! : any
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
        if(bool){
          // get user id
          this.userId = this.authService.userId
        }
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
    if(this.benevole.affectations.length == 0){
      this.benevolesDisplay.data.push(new BenevoleDisplay(this.benevole, this.benevole.affectations[0]))
    }else{
      this.benevole.affectations.forEach((affectation: Affectation) => {
        this.benevolesDisplay.data.push(new BenevoleDisplay(this.benevole, affectation))
      });
    }
  }

  addRow() {
    // if the user is not connected, he can't add a row
    if(this.isAuth){
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
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
      data: 'You must be connected to add a row',
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
    throw new Error('You must be connected to add a row');
  }

  }

  /**
   * editRow
   * @param row
   * it will call the function createBenevoleFromDisplay that will create a Benevole Object from the BenevoleDisplay Object
   * it will call the function updateAffectations() which will call the service to update the affectations of the benevole
   *
   */
  editRow(row: BenevoleDisplay){
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
      let benevole = this.createBenevoleFromDisplay(row);
      this.updateAffectations(row,benevole.affectations)
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
      data: 'You must be connected to edit a row',
      duration: 3000,
      panelClass: ['error-snackbar'],
    });
    throw new Error('You must be connected to edit a row');
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
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
      let affectations: Affectation[] = [];
      this.benevolesDisplay.data.forEach((benevoleDisplay: BenevoleDisplay) => {
        let affectation = this.createAffectationFromBenevoleDisplay(benevoleDisplay)
        affectations.push(affectation);
      });
      let benevole = new Benevole(row._id,row.prenom, row.nom, row.email, affectations);
      return benevole;
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'You must be connected to add a row',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw new Error('You must be connected to add a row');
    }
}

  /**
   * createAffectationFromBenevoleDisplay
   * @param row
   * @returns Affectation
  */
  createAffectationFromBenevoleDisplay(row: BenevoleDisplay): Affectation {
    // if the user is not connected, he can't edit a row
    if(this.isAuth){
    const debutCreneau = new Date(row.date + " " + row.debut_creneau);
    const finCreneau = new Date(row.date + " " + row.fin_creneau);

    // check if the end time is after the start time
    if (finCreneau.getTime() <= debutCreneau.getTime()) {
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'End time must be after start time',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw new Error('End time must be after start time');
    }

    // Check if for this benevole the interval debutCreneau / finCreneau does not intersect with another interval
    // complete de args for the some function to check if the interval is already taken

    /* const intersect = this.benevolesDisplay.data.some(function (benevoleDisplay: BenevoleDisplay) {
      if (benevoleDisplay._id !== row._id) {
        const debutCreneauBenevole = new Date(benevoleDisplay.date + " " + benevoleDisplay.debut_creneau);
        const finCreneauBenevole = new Date(benevoleDisplay.date + " " + benevoleDisplay.fin_creneau);
        return (
          (debutCreneau.getTime() >= debutCreneauBenevole.getTime() && debutCreneau.getTime() < finCreneauBenevole.getTime()) ||
          (finCreneau.getTime() > debutCreneauBenevole.getTime() && finCreneau.getTime() <= finCreneauBenevole.getTime())
        );
      }
    });
    if (intersect) {
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'The interval is already taken',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw new Error('The interval is already taken');
    } */


    const zone: Zone = this.zones.find((zone: Zone) => zone._id === row.idZone) || new Zone('', '');
    const creneau: Creneau = new Creneau(row.debut_creneau, row.fin_creneau, row.date);
    return new Affectation(zone, creneau);
    }else{
      this.snackBar.openFromComponent(ErrorDialogComponent, {
        data: 'You must be connected to add a row',
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      throw new Error('You must be connected to add a row');
    }

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
    if(!this.isAuth){
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
    if(!this.isAuth){
      this.benevolesService.updateAffectations(row._id, affectations).then(()=>{
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
    if(!this.isAuth){
      this.benevolesService.deleteAffectation(_id, affectation).then(()=>{
          this.benevolesDisplay.data = this.benevolesDisplay.data.filter((u) => u._id !== _id);
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
