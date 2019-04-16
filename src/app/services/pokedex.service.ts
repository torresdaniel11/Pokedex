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

  getPokemons(): Observable<any> {
    this.offset += 20;
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${this.offset}`);
  }

  restartOffset(): void {
    this.offset = -20;
  }

  getPokemonDetail(url: string): Observable<any> {
    return this.http.get(url)
  }

  setCurrentPokemon(pokemon: Pokemon) {
    this.currentPokemon = pokemon;
    this.emitNewCurrentPokemon(pokemon);
    this.currentView.next('details')
  }

  getCurrentPokemon(): Observable<any> {
    return this.pokemonChange;
  }

  emitNewCurrentPokemon(pokemon: Pokemon) {
    return this.pokemonChange.emit(pokemon);
  }

  setCurrentView(view: string): void {
    this.currentView.next(view)
  }

  setFightOrDetail(fightOrDetail: string): void {
    if (fightOrDetail === 'detail') {
      this.pokemonForFight = null;
    }
    this.fightOrDetail.next(fightOrDetail);
  }

  savePokemonForFight(pokemon: Pokemon) {
    if (!!this.pokemonForFight) {
      this.router.navigate(['battle', this.pokemonForFight.id, 'vs', pokemon.id])
    } else {
      this.pokemonForFight = pokemon;
    }
  }

  getPokemonForFight(): Pokemon {
    return this.pokemonForFight;
  }
}

export const POKEDEX_SERVICE: Array<any> = [
  { provide: PokedexService, useClass: PokedexService }
]
