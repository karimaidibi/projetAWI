import { Component, OnDestroy, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Jeu } from 'src/app/models/jeu';
import { JeuDisplay, COLUMNS_SCHEMA } from 'src/app/models/jeu-display';
import { JeuxService } from 'src/app/services/jeux.service';
import { ConfirmDialogComponent } from '../partials/confirm-dialog/confirm-dialog.component';
import { Zone } from 'src/app/models/zone';
import { TypeJeu } from 'src/app/models/type-jeu';
import { TypesJeuxService } from 'src/app/services/types-jeux.service';
import { ZonesService } from 'src/app/services/zones.service';
import { FormControl, NgModel } from '@angular/forms';
import { MatSort, Sort } from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';


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

  valid: any = {};

  // types jeux data
  typesJeux: TypeJeu[] = [];
  typesJeuxSub!: Subscription;

  // zones data
  zones: Zone[] = [];
  zonesSub!: Subscription;

  rowNumber: number = 0;

  @ViewChild(MatSort) sort!: MatSort;

  typesJeuxFilterForm = new FormControl('');
  zonesFilterForm = new FormControl('');

  //auth
  isAuth!: boolean

  /* Global filter
    - 0 pour le filterALL (barre de recherche),
    - 1 pour le filterTypeJeu ,
    - 2 pour le filterZone
  */
  globalFilter : any[] = ['','',''];

  constructor(private jeuxService: JeuxService,
    public dialog: MatDialog,
    private typesJeuxService: TypesJeuxService,
    private zonesService: ZonesService,
    private authService : AuthService,
    private snackBar: MatSnackBar,
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

    //Get types jeux
    this.typesJeuxSub = this.typesJeuxService.typesJeux$.subscribe({
      next:(typesJeux : any)=>{
        this.typesJeux = typesJeux
      },
      error: (err)=>{
        console.log(err)
      },
      complete :()=>{
      }
    });
    this.typesJeuxService.getTypesJeux()

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
    });
    this.zonesService.getZones()

    //verifier si l'utilisateur est authentifié
    this.VerifSignIn()

    // set the predicate filter 
    this.setFilterPredicate()
  }

  //assigner is auth a true si user est connecté
  VerifSignIn() : void{
    this.authService.isAuth$.subscribe(
      (bool: boolean)=>{
        this.isAuth = bool
      }
    )
  }

  ngAfterViewInit() {
    this.jeuxDisplay.sort = this.sort;
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
    if(this.isAuth){
      this.rowNumber--;
      this.valid[this.rowNumber] = {
        nom: false,
        typeJeu: false,
        zone: true
      }
      const jeuDisplayRow : JeuDisplay = {
        _id: this.rowNumber.toString(),
        nom: "",
        zone: "",
        idZone: "",
        typeJeu: "",
        idTypeJeu: "",
        isEdit: true,
        isSelected: false
      }
      this.jeuxDisplay.data = [jeuDisplayRow, ...this.jeuxDisplay.data];
    }else{
      alert("Vous n'êtes pas connecté")
    }
  }

  /**
   * editRow
   * @param row
   * first it will change class the function createJeuFromDisplay that will create a jeu Object with the jeuDisplay object
   * if the id of the jeu is 0 it will call the function createJeu() which will call the service to create the jeu
   * else it will call the function updateJeu() which will call the service to update the jeu
   *
   */
  editRow(row: JeuDisplay) {
    if(this.isAuth){
      const jeu : Jeu = this.createJeuFromDisplay(row)
      // tranform the _id of the row to a number
      if (Number(row._id) < 0) {
        this.createJeu(row,jeu)
      } else {
        this.updateJeu(row, jeu)
      }
    }else{
      alert("Vous n'êtes pas connecté")
    }
  }

  /**
   * Cancel the edit of a row
   * @param row
   *
   */
  cancelEdit(row: JeuDisplay) {
    if (Number(row._id) < 0) {
      this.jeuxDisplay.data = this.jeuxDisplay.data.filter((jeu: JeuDisplay) => jeu._id !== row._id);
    } else {
      row.isEdit = false;
      this.jeuxDisplay.data = [...this.jeuxDisplay.data];
    }
    // delete the valid object of the row
    delete this.valid[row._id]
  }

  /**
   *
   * createJeuFromDisplay
   * will create a jeu Object with the jeuDisplay object
   * @param row
   */
  createJeuFromDisplay(row: JeuDisplay) : Jeu{
    // create a TypeJeu object from the typeJeu field of the jeuDisplay
    let typeJeu : TypeJeu = {_id: "", type: ""}
    if (row.idTypeJeu !== "") {
      // given the idTypeJeu form the row, find the type corresponding of the id from the typesJeux array
      let tempTypeJeu : TypeJeu | undefined = this.typesJeux.find((typeJeu: TypeJeu) => typeJeu._id === row.idTypeJeu)
      if (tempTypeJeu !== undefined) {
        typeJeu = tempTypeJeu
        row.typeJeu = typeJeu.type
      }
    }

    // create a Zone object from the zone field of the jeuDisplay
    let zone : Zone = {_id: "", nom: ""}
    if (row.idZone !== "") {
      // given the idZone form the row, find the zone corresponding of the id from the zones array
      let tempZone : Zone | undefined = this.zones.find((zone: Zone) => zone._id === row.idZone)
      if (tempZone !== undefined) {
        zone = tempZone
        row.zone = zone.nom
      }
    }

    const jeu : Jeu = {
      _id: row._id,
      nom: row.nom,
      zone: zone,
      typeJeu: typeJeu
    }
    return jeu
  }

  removeRow(_id: string) {
    if(this.isAuth){
      this.dialog
        .open(ConfirmDialogComponent)
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            this.deleteJeu(_id)
          }
        });
    }else{
      alert("Vous n'êtes pas connecté")
    }
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

  /**
   * removeSelectedRows
   * will open a dialog to confirm the deletion
   * if the user confirm the deletion it will retrieve the ids of selected rows and call the function deleteJeux(jeuxIds)
   * that will call the service to delete the jeux
   * else it will do nothing
   */
  removeSelectedRows() {
    if(this.isAuth){
      this.dialog
        .open(ConfirmDialogComponent)
        .afterClosed()
        .subscribe((confirm) => {
          if (confirm) {
            const jeuxIds = this.jeuxDisplay.data
              .filter((item: any) => item.isSelected)
              .map((item: any) => item._id);
            this.deleteJeux(jeuxIds)
          }
        });
    }else{
      alert("Vous n'êtes pas connecté")
    }
  }

  /**
   * updateJeu
   * @param row
   * @param jeu
   * will call the service to update the jeu
   * if the update is successful it will change the isEdit property to false to stop the edition mode
   * else it will display an error message
  */
  updateJeu(row: JeuDisplay, jeu: Jeu) {
    this.jeuxService.updateJeu(row._id, jeu).then(()=>{
      // change the isEdit property to false to stop the edition mode
      row.isEdit = false
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  /**
   * createJeu
   * @param row
   * @param jeu
   * will call the service to create the jeu
   * if the creation is successful it will change the isEdit property to false to stop the edition mode
   * and it will change the _id property to the id of the created jeu
   * else it will display an error message
  */
  createJeu(row: JeuDisplay, jeu: Jeu) {
    this.jeuxService.createJeu(jeu).then(()=>{
      // change the isEdit property to false to stop the edition mode
      row.isEdit = false
      // change the _id property to the id of the created jeu
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  /**
   * deleteJeu
   * @param _id
   * will call the service to delete the jeu
   * if the deletion is successful it will remove the jeu from the jeuxDisplay array
   * else it will display an error message
  */
  deleteJeu(_id: string) {
    this.jeuxService.deleteJeu(_id).then(()=>{
        this.jeuxDisplay.data = this.jeuxDisplay.data.filter((u) => u._id !== _id);
    })
    .catch((err)=>{
      console.log(err.message)
    })
  }

  /**
   * deleteJeux
   * @param jeuxIds
   * will call the service to delete many jeux given an array of ids
   * if the deletion is successful it will remove the jeux from the jeuxDisplay array
   * else it will display an error message
   */
  deleteJeux(jeuxIds : string[]) {
    this.jeuxService.deleteJeux(jeuxIds).then(()=>{
      this.jeuxDisplay.data = this.jeuxDisplay.data.filter((u: any) => !u.isSelected);
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

  setFilterPredicate(){
    this.jeuxDisplay.filterPredicate = (data: JeuDisplay, filter: string) => {
      // Recuperer le filtre de type string et le transformer en tableau de string
      let globalFilterArray = filter.split('$$$');
      // recuperer le filtre all (de la case 0)
      const filterAll = globalFilterArray[0];
      // recuperer le filtre typeJeu (de la case 1)
      const filterTypeJeu = globalFilterArray[1];
      const selectedTypes = filterTypeJeu.split(',') as string[]; // cast to string[]
      // recuperer le filtre zone (de la case 2)
      const filterZone = globalFilterArray[2];
      const selectedZonesArray = filterZone.split(',') as string[]; // cast to string[]
      // definir la condition pour le filtre all
      let conditionAll = data.nom.toLowerCase().includes(filterAll) || data.zone.toLowerCase().includes(filterAll) || data.typeJeu.toLowerCase().includes(filterAll);
      // definir la condition pour le filtre typeJeu
      let conditionTypeJeu = selectedTypes.length === 0 || selectedTypes.some(type => data.typeJeu.includes(type));
      // definir la condition pour le filtre zone
      let conditionZone = selectedZonesArray.length === 0 || selectedZonesArray.some(zone => data.zone.includes(zone));
      return conditionAll && conditionTypeJeu && conditionZone;
    };
  }

  applyFilter(event: Event) {
    // recuperer le filtre
    const filterValue = (event.target as HTMLInputElement).value;
    // stocker le filtre all dans le tableau globalFilter
    this.globalFilter[0] = filterValue.trim().toLowerCase();
    // transformer le tableau globalFilter en string
    const filter = this.globalFilter.join('$$$');
    // affecter le filtre
    this.jeuxDisplay.filter = filter
  }


  onTypesJeuxFilterChanged() {
    // recuperer le filtre
    const selectedTypesJeux = this.typesJeuxFilterForm.value;
    // stocker le filtre all dans le tableau globalFilter
    if(selectedTypesJeux != null) {
      const selectedTypes = Array.from(selectedTypesJeux) as string[]; // cast to string[]
      this.globalFilter[1] = selectedTypes;
      // transformer le tableau globalFilter en string
      const filter = this.globalFilter.join('$$$');
      // affecter le filtre
      this.jeuxDisplay.filter = filter
    }
  }

  onZonesFilterChanged() {
    // recuperer le filtre
    const selectedZones = this.zonesFilterForm.value;
    // stocker le filtre all dans le tableau globalFilter
    if(selectedZones != null) {
      const selectedZonesArray = Array.from(selectedZones) as string[]; // cast to string[]
      this.globalFilter[2] = selectedZonesArray;
      // transformer le tableau globalFilter en string
      const filter = this.globalFilter.join('$$$');
      // affecter le filtre
      this.jeuxDisplay.filter = filter
    };
  }


  ngOnDestroy(): void {
    this.jeuxSub.unsubscribe()
    this.typesJeuxSub.unsubscribe()
    this.zonesSub.unsubscribe()
  }

}
