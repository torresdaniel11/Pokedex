import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Pokemon } from '../models/pokemon';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  offset: number;
  currentPokemon: Pokemon;
  pokemonChange: EventEmitter<Pokemon>;
  currentView: BehaviorSubject<string>;
  fightOrDetail: BehaviorSubject<string>;
  pokemonForFight: Pokemon;

  constructor(private http: HttpClient, private router: Router) {
    this.offset = -20;
    this.pokemonChange = new EventEmitter<any>();
    this.currentView = new BehaviorSubject('browse');
    this.fightOrDetail = new BehaviorSubject('detail')
  }

  /*
    request the pokeapi API a batch of 20 pokemons
    return: the Observable containing the reponse of the HTTP request
  */
  getPokemons(): Observable<any> {
    this.offset += 20;
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${this.offset}`);
  }

  /*
    restart the varible offset to -20
    post: variable offset = -20
  */
  restartOffset(): void {
    this.offset = -20;
  }

  /*
    request the pokeapi API the detail of a pokemon based on a url
    @param url: the url of the pokemon detail
    return: the Observable containing the reponse of the HTTP request
  */
  getPokemonDetail(url: string): Observable<any> {
    return this.http.get(url)
  }

  /*
    set a pokemon as the current pokemon to see the details
    @param pokemon: object with the information of the current pokemon
    post: the current pokemon has changed
  */
  setCurrentPokemon(pokemon: Pokemon): void {
    this.currentPokemon = pokemon;
    this.emitNewCurrentPokemon(pokemon);
    this.currentView.next('details')
  }

  /*
    get an instance of the pokemonChange observable
    return: the Observable of the PokemonChange Object
  */
  getCurrentPokemon(): Observable<any> {
    return this.pokemonChange;
  }

  /*
    emits an event with the information of the current pokemon
    @param pokemon: object with the information of the current pokemon
  */
  emitNewCurrentPokemon(pokemon: Pokemon) {
    return this.pokemonChange.emit(pokemon);
  }

  /*
    emit an event with the new current view
    @param view: string {detail} || {browse}
  */
  setCurrentView(view: string): void {
    this.currentView.next(view)
  }

  /*
    emits a new event with the informing if the user is choosing pokemons to fight
    @param fightOrDetail: string {fight} || {detail}
  */
  setFightOrDetail(fightOrDetail: string): void {
    if (fightOrDetail === 'detail') {
      this.pokemonForFight = null;
    }
    this.fightOrDetail.next(fightOrDetail);
  }

  /*
    save the first pokemon for fight
    @param pokemon: object containing information of the first pokemon for fight
  */
  savePokemonForFight(pokemon: Pokemon) {
    if (!!this.pokemonForFight) {
      this.router.navigate(['battle', this.pokemonForFight.id, 'vs', pokemon.id])
    } else {
      this.pokemonForFight = pokemon;
    }
  }

  /*
    return the first pokemon for the battle
    return: Pokemon the object of the first pokemon choosed for fight
  */
  getPokemonForFight(): Pokemon {
    return this.pokemonForFight;
  }
}

export const POKEDEX_SERVICE: Array<any> = [
  { provide: PokedexService, useClass: PokedexService }
]
