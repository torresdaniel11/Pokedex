import { Component, OnInit, OnDestroy } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';
import { Pokemon } from 'src/app/models/pokemon';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.scss']
})
export class PokemonDetailComponent implements OnInit, OnDestroy {

  pokemon: Pokemon;
  subscription: any;
  fightOrDetail: string;

  constructor(private pokeService: PokedexService, private toastr: ToastrService) { }

  /*
    onInit life cycle
    subscribe to the service to know with pokemon info disply
  */
  ngOnInit() {
    this.subscription = this.pokeService.getCurrentPokemon()
      .subscribe((pokemon: Pokemon) => {
        this.setPokemon(pokemon);
      })
    this.pokeService.fightOrDetail.subscribe(fightOrDetail => {
      this.fightOrDetail = fightOrDetail;
    })
  }

  /*
    onDestroy life cycle
    cancel the current requests
  */
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /*
    set the current pokemon for fight
    post: the current pokemon was added for a fight
  */
  addToFight(): void {
    this.pokeService.savePokemonForFight(this.pokemon);
    this.toastr.success('Added to the battle', this.pokemon.name, {
      timeOut: 1500
    });
  }

  /*
    set the current pokemon
    @param pokemon: the current pokemon to display
    post: the component have a new pokemon
  */
  setPokemon(pokemon: Pokemon) {
    this.pokemon = pokemon;
  }

  /*
    set the current view to browse
  */
  backToBrowse() {
    this.pokeService.setCurrentView('browse')
  }

}
