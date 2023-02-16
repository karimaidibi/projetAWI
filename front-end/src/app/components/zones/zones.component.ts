import { ZonesService } from './../../services/zones.service';
import { Zone } from './../../models/zone';
import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';

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

  constructor(private zonesService: ZonesService) { }

  ngOnInit(): void {
    //get zones and subscribe
    this.zonesSub = this.zonesService.zones$.subscribe({
      next:(zones : any)=>{
        this.loading = false
        this.zones = zones
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

  ngOnDestroy(): void {
    this.zonesSub.unsubscribe()
  }

}
