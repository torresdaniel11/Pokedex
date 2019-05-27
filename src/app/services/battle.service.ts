import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NamedAPIResource } from '../models/named-apiresource';
import { Move } from '../models/move';
import { AttackInfo } from '../models/attack-info';


@Injectable({
  providedIn: 'root'
})
export class BattleService {

  constructor(private http: HttpClient) { }

  /*
    request a pokemon by an id to the pokeapi API
    @param id: the id of the pokemon
    return: the Observable containing the reponse of the HTTP request
  */
  getPokemonById(id: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
  }

  /*
    receive an array on move ids and return an array with the complete informatio for each move
    @param moveUrls: an array with 4 moves, in a NamedApiResource structure
    return: the Observable containing an array with the reponse of the 4 HTTP request
  */
  getMoves(moveUrls: NamedAPIResource[]): Observable<any> {
    let response1 = this.http.get(moveUrls[0].url);
    let response2 = this.http.get(moveUrls[1].url);
    let response3 = this.http.get(moveUrls[2].url);
    let response4 = this.http.get(moveUrls[3].url);
    return forkJoin([response1, response2, response3, response4]);
  }

  /*
    receive an array of posible moves and return an AttackInfo
    @param moves: an array with the 4 posible moves
    return: AttackInfo with the selected Move
  */
  opponentAttackTurn(moves: Move[]): AttackInfo {
    const sortedMoves = this.sortMovesByPriority(moves);
    const move = this.chooseMove(sortedMoves);
    return this.getAttackInfo(move)
  }

  /*
    receive a move and return a new AttackInfo
    @param move: the Move the user select to attack
    return: AttackInfo with the selected Move
  */
  myAttackTurn(move: Move): AttackInfo {
    return this.getAttackInfo(move)
  }

  /*
    creates a new AttackInfo object, with metadata about the next move
    @param move: the move to create the AttackInfo
    return: AttackInfo with the metadata of the selected move
  */
  getAttackInfo(move: Move): AttackInfo {
    const didHit = this.attackDidHit(move);
    let attackInfo = new AttackInfo();
    attackInfo.didHit = didHit;
    attackInfo.power = didHit ? move.power : 0;
    attackInfo.move = move;
    return attackInfo;
  }

  /*
    sort an array of moves based on the priority property
    @param moves: array of moves to sort
    return: an array of moves sorted by priority
  */
  sortMovesByPriority(moves: Move[]): Move[] {
    let sortedMoves = moves.sort((a, b) => {
      return b.priority - a.priority;
    })
    return sortedMoves;
  }

  /*
    receive an array of moves and randomly select one
    @param moves: an array of Moves
    return: a Move selected randomly
  */
  chooseMove(moves: Move[]): Move {
    const probability = this.getRandom1to100();
    if (probability < 25) {
      return moves[0];
    } else if (probability < 50) {
      return moves[1];
    } else if (probability < 75) {
      return moves[2];
    } else {
      return moves[3];
    }
  }

  /*
    receive a move and decide if the attack will hit based on the move accuracy
    @param move: a move to estimate if will hit or not
    return: true if the attack did hit, false if not
  */
  attackDidHit(move: Move): boolean {
    const probability = this.getRandom1to100();
    return move.accuracy >= probability;
  }

  /*
    return a random between 1 and 100
    return: an integer between 1 and 100
  */
  getRandom1to100(): number {
    return Math.floor(Math.random() * 101);
  }

}

export const BATTLE_SERVICE: Array<any> = [
  { provide: BattleService, useClass: BattleService }
]

