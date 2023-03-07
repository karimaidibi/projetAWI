import { ZonesService } from './../../services/zones.service';
import { Zone } from './../../models/zone';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'festivalJeux-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements OnInit {

  zonesSub!: Subscription
  zones!: Zone[]
  loading: boolean = true
  displayedColumns : String[] = ['nom'];

  dataSource : MatTableDataSource<Zone> = new MatTableDataSource<Zone>();

  @ViewChild(MatSort) sort!: MatSort;

  constructor(private zonesService: ZonesService) { }

  ngOnInit(): void {
    //get zones and subscribe
    this.zonesSub = this.zonesService.zones$.subscribe({
      next:(zones : any)=>{
        this.loading = false
        this.zones = zones
        this.dataSource.data = this.zones
      },
      error: (err)=>{
        this.loading = true
        console.log(err)
      },
      complete :()=>{
      }
    });

    this.zonesService.getZones()
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.zonesSub.unsubscribe()
  }

}
