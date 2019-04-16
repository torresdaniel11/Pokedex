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

  ngOnInit() {
    this.subscription = this.pokeService.getCurrentPokemon()
      .subscribe((pokemon: Pokemon) => {
        this.setPokemon(pokemon);
      })
    this.pokeService.fightOrDetail.subscribe(fightOrDetail => {
      this.fightOrDetail = fightOrDetail;
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addToFight(): void {
    this.pokeService.savePokemonForFight(this.pokemon);
    this.toastr.success('Added to the battle', this.pokemon.name, {
      timeOut: 1500
    });
  }

  setPokemon(pokemon: Pokemon) {
    this.pokemon = pokemon;
  }

  backToBrowse() {
    this.pokeService.setCurrentView('browse')
  }

}
