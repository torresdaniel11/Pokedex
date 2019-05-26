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

  ngOnInit() {

  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  @Input()
  set pokemon(pokemon: PokemonListItem) {
    this._pokemon = pokemon;
    this.fetchPokemon(pokemon.url);
  }

  fetchPokemon(url: string) {
    this.pokeService.getPokemonDetail(url).subscribe((res) => {
      this.pokemonDetails = res;
    });
  }

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
