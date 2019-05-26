import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DialogModule } from 'primeng/dialog';
import { PokedexRoutingModule } from './pokedex-routing.module';
import { PokedexComponent } from './pokedex/pokedex.component';
import { POKEDEX_SERVICE } from '../../services/pokedex.service';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { PokemonCardComponent } from './pokemon-card/pokemon-card.component'

@NgModule({
  declarations: [
    PokedexComponent,
    PokemonDetailComponent,
    PokemonCardComponent
  ],
  imports: [
    CommonModule,
    PokedexRoutingModule,
    InfiniteScrollModule,
    DialogModule
  ],
  providers: [POKEDEX_SERVICE]
})
export class PokedexModule { }
