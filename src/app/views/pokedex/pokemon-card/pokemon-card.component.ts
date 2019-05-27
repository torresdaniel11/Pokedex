import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';
import { Pokemon } from 'src/app/models/pokemon';
import { PokemonListItem } from 'src/app/models/pokemon-list-item';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pokemon-card',
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.css']
})
export class PokemonCardComponent implements OnInit, OnDestroy {

  _pokemon: PokemonListItem;
  pokemonDetails: Pokemon;
  subs: any;
  fightOrDetail: string;

  constructor(private pokeService: PokedexService, private toastr: ToastrService) {
    this.subs = this.pokeService.fightOrDetail.subscribe(state => {
      this.fightOrDetail = state;
    })
  }

  /*
    onInit life cycle
  */
  ngOnInit() {
  }

  /*
    onDestroy life cycle
    cancel current subscriptions
  */
  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  /*
    setter method for component parameter pokemon
    post: ask the service for the detail of the current pokemon
  */
  @Input()
  set pokemon(pokemon: PokemonListItem) {
    this._pokemon = pokemon;
    this.fetchPokemon(pokemon.url);
  }

  /*
    ask the service for the details of the current pokemon
    @param url: string with the details of the current pokemon
    post: the component have the proper information to disply
  */
  fetchPokemon(url: string) {
    this.pokeService.getPokemonDetail(url).subscribe((res) => {
      this.pokemonDetails = res;
    });
  }

  /*
    set the current pokemon. if the current state is detail, then open the detail view
    else add the pokemon for fights
  */
  selectPokemon(): void {
    if (this.fightOrDetail === 'detail') {
      this.pokeService.setCurrentPokemon(this.pokemonDetails);
    } else {
      this.pokeService.savePokemonForFight(this.pokemonDetails);
      this.toastr.success('Added to the battle', this.pokemonDetails.name, {
        timeOut: 1500
      });
    }
  }

}
